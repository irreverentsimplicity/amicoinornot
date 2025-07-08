'use client';

import { useState } from 'react';

// Mock the wagmi hooks for debugging
const mockUseAccount = () => ({
  address: '0x1234567890123456789012345678901234567890',
  isConnected: true
});

const mockUseChainId = () => 7777777; // Zora mainnet chain ID

const mockUseSwitchChain = () => ({
  switchChain: async ({ chainId }) => {
    console.log('Switching to chain:', chainId);
    // Mock successful switch
    return Promise.resolve();
  }
});

// Define Zora chain configurations
const zora = {
  id: 7777777,
  name: 'Zora',
  network: 'zora',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://rpc.zora.energy'] },
  },
  blockExplorers: {
    default: { name: 'Zora Explorer', url: 'https://explorer.zora.energy' },
  },
};

const zoraSepolia = {
  id: 999999999,
  name: 'Zora Sepolia',
  network: 'zora-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://sepolia.rpc.zora.energy'] },
  },
  blockExplorers: {
    default: { name: 'Zora Sepolia Explorer', url: 'https://sepolia.explorer.zora.energy' },
  },
};

// Define supported chains for Zora Coins
const SUPPORTED_CHAINS = [
  zora, // Mainnet
  zoraSepolia // Testnet
];

// Mock ConnectButton component
const ConnectButton = () => (
  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
    Connected: 0x1234...7890
  </button>
);

export default function CreateMeme() {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Use mock hooks for testing
  const { address, isConnected } = mockUseAccount();
  const chainId = mockUseChainId();
  const { switchChain } = mockUseSwitchChain();

  // Check if current chain is supported
  const isChainSupported = SUPPORTED_CHAINS.some(chain => chain.id === chainId);
  const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);

  // Function to switch network
  const handleSwitchNetwork = async (targetChain) => {
    if (!switchChain) {
      setMessage('Network switching not supported by this wallet');
      return;
    }

    setMessage(`Switching to ${targetChain.name}...`);
    
    try {
      await switchChain({ chainId: targetChain.id });
      setMessage(`Successfully switched to ${targetChain.name}`);
    } catch (error) {
      console.error('Failed to switch network:', error);
      setMessage(`Failed to switch network: ${error.message || 'Unknown error'}`);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !symbol || !image) {
      setMessage('Please fill all fields and select an image.');
      return;
    }

    if (!isConnected || !address) {
      setMessage('Please connect your wallet to create a meme.');
      return;
    }

    if (!isChainSupported) {
      setMessage('Please switch to a supported network first.');
      return;
    }

    setIsCreating(true);
    setMessage('Processing... please wait.');

    // Simulate the creation process
    try {
      // Mock the coin creation process
      setMessage('Creating coin on blockchain...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockCoinAddress = '0x' + Math.random().toString(16).substr(2, 40);
      
      setMessage('Saving to database...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setMessage(`Meme and Coin created successfully! Coin Address: ${mockCoinAddress}`);
      setName('');
      setSymbol('');
      setImage(null);
      const fileInput = document.getElementById('image');
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Failed to create meme:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setMessage(`Failed to create meme: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Debug info
  console.log('Debug info:', {
    isConnected,
    chainId,
    isChainSupported,
    currentChain: currentChain?.name,
    address,
    supportedChainIds: SUPPORTED_CHAINS.map(c => c.id)
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Create a Coinable Meme
          </h1>
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {currentChain && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                {currentChain.name}
              </span>
            )}
            {!isConnected && (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                Not Connected
              </span>
            )}
            {isConnected && !isChainSupported && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                Wrong Network
              </span>
            )}
          </div>
        </div>

        {/* Connect Button */}
        <div className="flex justify-center mb-8">
          <ConnectButton />
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {/* Debug info */}
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
              <h3 className="font-semibold mb-2">Debug Info:</h3>
              <div className="space-y-1 text-xs">
                <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
                <p><strong>Chain ID:</strong> {chainId}</p>
                <p><strong>Supported:</strong> {isChainSupported ? 'Yes' : 'No'}</p>
                <p><strong>Current Chain:</strong> {currentChain?.name || 'Unknown'}</p>
                <p><strong>Address:</strong> {address}</p>
                <p><strong>Supported Chain IDs:</strong> {SUPPORTED_CHAINS.map(c => c.id).join(', ')}</p>
              </div>
            </div>

            {/* Show connection prompt if not connected */}
            {!isConnected && (
              <div className="text-center space-y-4">
                <h2 className="text-xl font-bold">Connect Your Wallet</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please connect your wallet to create meme coins on Zora
                </p>
                <ConnectButton />
              </div>
            )}

            {/* Show network switch if connected but wrong network */}
            {isConnected && !isChainSupported && (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-2">Switch Network Required</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Zora Coins are only supported on Zora networks. Please switch to one of the supported networks:
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleSwitchNetwork(zora)}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Switch to Zora Mainnet
                  </button>
                  <button
                    onClick={() => handleSwitchNetwork(zoraSepolia)}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Switch to Zora Sepolia (Testnet)
                  </button>
                </div>
                
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Network Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium text-purple-600">Zora Mainnet:</h4>
                      <div className="text-xs bg-white dark:bg-gray-700 p-2 rounded mt-1">
                        <p><strong>Chain ID:</strong> {zora.id} (0x{zora.id.toString(16)})</p>
                        <p><strong>RPC:</strong> {zora.rpcUrls.default.http[0]}</p>
                        <p><strong>Explorer:</strong> {zora.blockExplorers?.default.url}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-indigo-600">Zora Sepolia:</h4>
                      <div className="text-xs bg-white dark:bg-gray-700 p-2 rounded mt-1">
                        <p><strong>Chain ID:</strong> {zoraSepolia.id} (0x{zoraSepolia.id.toString(16)})</p>
                        <p><strong>RPC:</strong> {zoraSepolia.rpcUrls.default.http[0]}</p>
                        <p><strong>Explorer:</strong> {zoraSepolia.blockExplorers?.default.url}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Show create meme form if connected and on correct network */}
            {isConnected && isChainSupported && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-center">Create Your Meme Coin</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meme Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      disabled={isCreating}
                      placeholder="Enter meme name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meme Symbol (e.g., DOGSK8)
                    </label>
                    <input
                      type="text"
                      id="symbol"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                      disabled={isCreating}
                      placeholder="MEME"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meme Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                      required
                      disabled={isCreating}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create Meme Coin'}
                  </button>
                </div>
                
                {/* Preview selected image */}
                {image && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Preview:</h3>
                    <div className="flex justify-center">
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Meme preview" 
                        className="max-w-32 max-h-32 rounded-lg object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {message && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm text-center">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}