'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function CreateMeme() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const { address, isConnected } = useAccount();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !image) {
      setMessage('Please fill all fields and select an image.');
      return;
    }

    if (!isConnected || !address) {
      setMessage('Please connect your wallet to create a meme.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      try {
        const response = await fetch('/api/create-meme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, symbol, imageUrl: base64Image, creatorAddress: address }),
        });

        const data = await response.json();
        if (response.ok) {
          setMessage(`Meme created successfully: ${data.message}`);
          setName('');
          setSymbol('');
          setImage(null);
        } else {
          setMessage(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Failed to create meme:', error);
        setMessage('Failed to create meme. Please try again.');
      }
    };
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Create a new Coinable Meme
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <ConnectButton />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full max-w-md mt-8">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meme Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meme Symbol (e.g., DOGSK8)</label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Meme Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-400 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Meme Coin
          </button>
        </form>
        {message && <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">{message}</p>}
      </div>
    </main>
  );
}
