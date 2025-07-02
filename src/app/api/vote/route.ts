import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { voterWalletAddress, votedForMemeId } = body;

    const { data, error } = await supabase
      .from('votes')
      .insert([
        { voter_wallet_address: voterWalletAddress, meme_id: votedForMemeId },
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to record vote in DB' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Vote recorded successfully', vote: data[0] });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}