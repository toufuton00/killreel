import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let isLoading = false;

export async function initFFmpeg(
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg;
  if (isLoading) {
    await new Promise(r => setTimeout(r, 500));
    return initFFmpeg(onProgress);
  }

  isLoading = true;
  ffmpeg = new FFmpeg();

  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  isLoading = false;
  return ffmpeg;
}

export async function composeVideo(
  clips: { file: File; startSec: number; endSec: number }[],
  audioUrl: string,
  targetDuration: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const ff = await initFFmpeg(onProgress);

  // 1. 各クリップを読み込む
  for (let i = 0; i < clips.length; i++) {
    await ff.writeFile(`clip${i}.mp4`, await fetchFile(clips[i].file));
  }

  // 2. 音源を読み込む
  const audioRes = await fetch(audioUrl);
  const audioBlob = await audioRes.blob();
  await ff.writeFile('audio.mp3', await fetchFile(audioBlob));

  // 3. 各クリップをトリミング＆縦動画にリサイズ
  for (let i = 0; i < clips.length; i++) {
    const { startSec, endSec } = clips[i];
    await ff.exec([
      '-i', `clip${i}.mp4`,
      '-ss', String(startSec),
      '-to', String(endSec),
      '-vf', 'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
      '-c:v', 'libx264',
      '-preset', 'ultrafast',
      '-an',
      '-y',
      `trimmed${i}.mp4`
    ]);
  }

  // 4. クリップを結合
  const concatList = clips.map((_, i) => `file 'trimmed${i}.mp4'`).join('\n');
  await ff.writeFile('concat_list.txt', concatList);

  await ff.exec([
    '-f', 'concat',
    '-safe', '0',
    '-i', 'concat_list.txt',
    '-c', 'copy',
    '-y',
    'combined.mp4'
  ]);

  // 5. 音源と合成
  await ff.exec([
    '-i', 'combined.mp4',
    '-i', 'audio.mp3',
    '-t', String(targetDuration),
    '-map', '0:v',
    '-map', '1:a',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-shortest',
    '-y',
    'final.mp4'
  ]);

  // 6. 完成ファイルを返す
  const data = await ff.readFile('final.mp4');
const uint8 = new Uint8Array(data as unknown as ArrayBuffer);
return new Blob([uint8.buffer.slice(0) as ArrayBuffer], { type: 'video/mp4' });
}