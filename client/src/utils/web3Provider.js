// Web3 provider initialization utility
export const initializeWeb3Providers = () => {
  // Prevent multiple injections
  if (typeof window !== 'undefined') {
    // Handle Ethereum provider
    if (window.ethereum) {
      try {
        Object.defineProperty(window, 'ethereum', {
          value: window.ethereum,
          writable: false,
          configurable: false
        });
      } catch (error) {
        console.warn('Failed to lock ethereum provider:', error);
      }
    }

    // Handle Solana provider
    if (window.solana) {
      try {
        Object.defineProperty(window, 'solana', {
          value: window.solana,
          writable: false,
          configurable: false
        });
      } catch (error) {
        console.warn('Failed to lock solana provider:', error);
      }
    }
  }
};

// Function to check if a specific provider is available
export const isProviderAvailable = (providerName) => {
  if (typeof window === 'undefined') return false;
  
  switch (providerName.toLowerCase()) {
    case 'ethereum':
      return !!window.ethereum;
    case 'solana':
      return !!window.solana;
    default:
      return false;
  }
};

// Function to get provider instance
export const getProvider = (providerName) => {
  if (typeof window === 'undefined') return null;
  
  switch (providerName.toLowerCase()) {
    case 'ethereum':
      return window.ethereum;
    case 'solana':
      return window.solana;
    default:
      return null;
  }
};