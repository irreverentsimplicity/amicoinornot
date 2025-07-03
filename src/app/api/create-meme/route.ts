import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, symbol, imageUrl, creatorAddress, coinAddress } = body;

    // In a real application, you would upload the image to IPFS here
    // and get the IPFS hash to store in the database.
    // For now, we'll store the imageUrl directly.

    // NOTE: Make sure you have a `coin_address` column in your `memes` table.
    const { data, error } = await supabase
      .from('memes')
      .insert([
        { name, symbol, image_url: imageUrl, creator_address: creatorAddress, coin_address: coinAddress },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to create meme in DB' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Meme created successfully', meme: data[0] });
  } catch (error) {
    console.error('Error creating meme:', error);
    return NextResponse.json({ error: 'Failed to create meme' }, { status: 500 });
  }
}