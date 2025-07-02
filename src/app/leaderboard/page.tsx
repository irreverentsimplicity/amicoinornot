'use client';

import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

interface Meme {
  id: string;
  name: string;
  imageUrl: string;
  votes: number;
}

export default function Leaderboard() {
  const [rankedMemes, setRankedMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/leaderboard');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRankedMemes(data.memes);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading leaderboard...</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">Error: {error}</div>;
  if (rankedMemes.length === 0) return <div className="flex min-h-screen items-center justify-center">No memes on the leaderboard yet.</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Meme Leaderboard
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <ConnectButton />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-2xl mt-8">
        {rankedMemes.map((meme, index) => (
          <div key={meme.id} className="flex items-center w-full p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <span className="text-xl font-bold mr-4">#{index + 1}</span>
            <Image src={meme.imageUrl} alt={meme.name} width={80} height={80} objectFit="cover" className="rounded-md" />
            <div className="ml-4 flex-grow">
              <p className="text-lg font-semibold">{meme.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Votes: {meme.votes}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {/* Future sections */}
      </div>
    </main>
  );
}
