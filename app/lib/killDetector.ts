'use client';
import { createWorker } from 'tesseract.js';

export interface KillMoment {
  timeSecond: number;
  confidence: number;
}

export async function detectKillMoments(
  file: File,
  onProgress?: (progress: number) => void
): Promise<KillMoment[]> {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const url = URL.createObjectURL(file);

  await new Promise<void>((resolve) => {
    video.onloadedmetadata = () => resolve();
    video.src = url;
    video.load();
  });

  const duration = video.duration;
  const interval = 1; // 1秒ごとにチェック
  const frames: { time: number; imageData: string }[] = [];

  // フレームを抽出
  for (let t = 0; t < duration; t += interval) {
    await new Promise<void>((resolve) => {
      video.currentTime = t;
      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        frames.push({ time: t, imageData: canvas.toDataURL('image/jpeg', 0.5) });
        resolve();
      };
    });
    if (onProgress) onProgress(Math.round((t / duration) * 50));
  }

  URL.revokeObjectURL(url);

  // Tesseractでテキスト解析
  const worker = await createWorker('eng');
  const killMoments: KillMoment[] = [];
  const killKeywords = ['KILL', 'KILLED', 'CHAMPION', 'KNOCKED', 'ELIMINATION'];

  for (let i = 0; i < frames.length; i++) {
    const { data } = await worker.recognize(frames[i].imageData);
    const text = data.text.toUpperCase();
    const found = killKeywords.some(k => text.includes(k));
    if (found) {
      killMoments.push({
        timeSecond: frames[i].time,
        confidence: data.confidence,
      });
    }
    if (onProgress) onProgress(50 + Math.round((i / frames.length) * 50));
  }

  await worker.terminate();
  return killMoments;
}