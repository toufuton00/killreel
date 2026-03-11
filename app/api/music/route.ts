import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.FREESOUND_API_KEY;
console.log('apiKey:', apiKey?.slice(0, 10));

  const res = await fetch(
    `https://freesound.org/apiv2/search/text/?query=trap+beat+music&filter=duration:[30+TO+120]&fields=id,name,duration,previews,bpm&token=${apiKey}&page_size=10`
  );

  const data = await res.json();
console.log('Freesound response:', JSON.stringify(data).slice(0, 200));

const tracks = data.results.map((hit: any) => ({
    id: hit.id,
    title: hit.name,
    duration: Math.round(hit.duration),
    audioUrl: hit.previews?.['preview-hq-mp3'] || hit.previews?.['preview-lq-mp3'],
    bpm: hit.bpm || 120,
  }));

  return NextResponse.json({ tracks });
}