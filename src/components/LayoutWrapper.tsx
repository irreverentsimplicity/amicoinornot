'use client';

import ClientProviders from "./ClientProviders";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <nav className="p-4 bg-gray-800 text-white flex justify-between">
        <a href="/" className="text-lg font-bold">AmiCoinOrNot</a>
        <div>
          <a href="/create-meme" className="text-lg font-bold mr-4">Create Meme</a>
          <a href="/leaderboard" className="text-lg font-bold">Leaderboard</a>
        </div>
      </nav>
      {children}
    </ClientProviders>
  );
}
