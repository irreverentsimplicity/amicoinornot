import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('memes')
      .select(
        `
        id,
        name,
        image_url,
        votes(count)
      `
      )
      

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch ranked memes from DB' }, { status: 500 });
    }

    // Transform the data to include the vote count directly
    const rankedMemes = data.map((meme: any) => ({
      id: meme.id,
      name: meme.name,
      imageUrl: meme.image_url,
      votes: meme.votes[0]?.count || 0, // Access the count from the joined table
    }));

    // Sort again in case the Supabase order by count is not direct
    rankedMemes.sort((a: any, b: any) => b.votes - a.votes);

    return NextResponse.json({ memes: rankedMemes });
  } catch (error) {
    console.error('Error fetching ranked memes:', error);
    return NextResponse.json({ error: 'Failed to fetch ranked memes' }, { status: 500 });
  }
}