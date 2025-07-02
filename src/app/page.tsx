'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useAccount } from 'wagmi';

interface Meme {
  id: string;
  name: string;
  imageUrl: string;
}

export default function Home() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const fetchMemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/get-memes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMemes(data.memes);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const handleVote = async (votedMemeId: string) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to vote.');
      return;
    }

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voterWalletAddress: address,
          votedForMemeId: votedMemeId, // This is now the meme ID from Supabase
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // After voting, fetch new memes to continue the flow
      fetchMemes();
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading memes...</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">Error: {error}</div>;
  if (memes.length === 0) return <div className="flex min-h-screen items-center justify-center">No memes available. Please create some!</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          amicoinornot
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <ConnectButton />
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''_] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''_] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px]">
        {/* Meme Voting Section */}
        <div className="flex space-x-8">
          {memes.map((meme) => (
            <div
              key={meme.id}
              className="w-96 h-96 bg-gray-700 flex flex-col items-center justify-center text-white text-2xl cursor-pointer hover:opacity-80 transition-opacity duration-200"
              onClick={() => handleVote(meme.id)}
            >
                            {meme.imageUrl && <Image src={meme.imageUrl} alt={meme.name} width={300} height={300} objectFit="contain" />}
              <p className="mt-2">{meme.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {/* Future sections like Leaderboard, Create Meme */}
      </div>
    </main>
  );
}
