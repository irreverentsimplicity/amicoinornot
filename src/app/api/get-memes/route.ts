import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { data: memes, error } = await supabase
      .from('memes')
      .select('id, name, image_url, votes:votes(count)');

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch memes from DB' }, { status: 500 });
    }

    if (!memes || memes.length < 2) {
      return NextResponse.json({ memes: [] });
    }

    // Get two random unique memes
    const randomIndex1 = Math.floor(Math.random() * memes.length);
    let randomIndex2 = Math.floor(Math.random() * memes.length);

    while (randomIndex1 === randomIndex2) {
      randomIndex2 = Math.floor(Math.random() * memes.length);
    }

    const meme1 = memes[randomIndex1];
    const meme2 = memes[randomIndex2];

    const formattedMemes = [meme1, meme2].map((meme) => ({
      id: meme.id,
      name: meme.name,
      imageUrl: meme.image_url,
      votes: meme.votes[0]?.count || 0,
    }));

    return NextResponse.json({ memes: formattedMemes });
  } catch (error) {
    console.error('Error fetching memes:', error);
    return NextResponse.json({ error: 'Failed to fetch memes' }, { status: 500 });
  }
}
