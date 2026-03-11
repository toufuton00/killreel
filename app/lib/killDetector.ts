export interface KillMoment {
  timeSecond: number;
  confidence: number;
}

function analyzeFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): number {
  const centerX = Math.floor(width * 0.3);
  const centerY = Math.floor(height * 0.2);
  const scanWidth = Math.floor(width * 0.4);
  const scanHeight = Math.floor(height * 0.6);

  const imageData = ctx.getImageData(centerX, centerY, scanWidth, scanHeight);
  const pixels = imageData.data;

  let damagePixelCount = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const isWhite = r > 200 && g > 200 && b > 200;
    const isYellow = r > 200 && g > 180 && b < 80;
    const isRed = r > 200 && g < 80 && b < 80;

    if (isWhite || isYellow || isRed) {
      damagePixelCount++;
    }
  }

  const totalPixels = scanWidth * scanHeight;
  return damagePixelCount / totalPixels;
}

export async function detectKillMoments(
  file: File,
  onProgress?: (progress: number) => void
): Promise<KillMoment[]> {
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const url = URL.createObjectURL(file);

  await new Promise<void>((resolve) => {
    video.onloadedmetadata = () => resolve();
    video.muted = true;
    video.src = url;
  });

  const duration = video.duration;
  const interval = 0.5;
  const scores: { time: number; score: number }[] = [];

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  for (let t = 0; t < duration; t += interval) {
    await new Promise<void>((resolve) => {
      video.currentTime = t;
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0);
        const score = analyzeFrame(ctx, canvas.width, canvas.height);
        scores.push({ time: t, score });
        resolve();
      };
    });
    if (onProgress) onProgress(Math.round((t / duration) * 100));
  }

  URL.revokeObjectURL(url);

  console.log('all scores:', scores);

  const avg = scores.reduce((s, f) => s + f.score, 0) / scores.length;
  const std = Math.sqrt(
    scores.reduce((s, f) => s + Math.pow(f.score - avg, 2), 0) / scores.length
  );

  const threshold = avg + std * 1.5;
  const killMoments: KillMoment[] = [];
  let lastKillTime = -5;

  for (const frame of scores) {
    if (frame.score > threshold && frame.time - lastKillTime > 3) {
      killMoments.push({
        timeSecond: frame.time,
        confidence: frame.score,
      });
      lastKillTime = frame.time;
    }
  }

  return killMoments;
}