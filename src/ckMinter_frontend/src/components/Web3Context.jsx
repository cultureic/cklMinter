import React, { createContext, useContext, useEffect, useState } from "react";
import Web3 from 'web3';

const MetaMaskContext = createContext(null);

const defaultOptions = {
  // Add your default options here if needed
};

export const useMetaMask = (options = defaultOptions) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Request account access if needed
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error('User denied account access');
        }
      } else {
        console.error('MetaMask not detected');
      }
    };

    loadWeb3();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const logoutWeb3 = () => {
    setAccount(null);
  };

  return {
    web3,
    account,
    connectWallet,
    logoutWeb3
    // Add more functions or state as needed
  };
};

export const MetaMaskProvider = ({ children }) => {
  const metaMask = useMetaMask();
  return <MetaMaskContext.Provider value={metaMask}>{children}</MetaMaskContext.Provider>;
};

export const useMetaMaskContext = () => useContext(MetaMaskContext);
