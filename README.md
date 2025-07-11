# AmICoinOrNot for Zora Coinathon

**AmICoinOrNot** is a decentralized application (dApp) that allows users to create and manage "meme coins" on a layer 2 EVM-compatible chain, using Zora Coin SDK. In the proposed dApp, users can mint new tokens, associate them with an image, and participate in a voting or leaderboard system. 

The UX mimics the popular AmIHotOrNot layout in which 2 images are side by side, and users can vote which one will remain, or be the "winner". Then another image is added to the UI and the process restarts. Images are stored off-chain in a supabase database, for speed and efficiency. Voting is also stored off-chain, in the same database.

Once per day, the votes are calculated, and a smart contract (not included in the repo, not enough time to finish) will distribute rewards to the voters of the meme with the highest number of votes.

The primary goal is to explore and demonstrate possibilities of the Zora Coin framework, not to create a functional dApp (again, not enough time for it).

## How to Run

First, ensure you have pnpm installed:

```bash
npm install -g pnpm
```

Then, install the project dependencies:

```bash
pnpm install
```

Next, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


