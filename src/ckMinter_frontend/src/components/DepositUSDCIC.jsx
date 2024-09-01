import React, { useState, useEffect } from "react";
import { useMetaMask } from "./Web3Context";
import USDCHElPER from "./../web3Abis/USDCHELPER.json";
const USDC_CONTRACT_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // You need to replace this with the actual address
const USDC_HELPER ="0x6abDA0438307733FC299e9C229FD3cc074bD8cC0"
import USDC from "./../web3Abis/USDC.json"

// Convert string to bytes32

const Deposit = ({ principalAs32 }) => {
  const { web3 } = useMetaMask();

  const stringToBytes32 = (value) => {
    return web3.utils.hexToBytes(value);
  };
  const DepositHandle = async () => {
    try {

      const contractUSDC = new web3.eth.Contract(
        USDC,
        USDC_CONTRACT_ADDRESS
      );

      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(USDCHElPER, USDC_HELPER);
      const amountCalled = await contractUSDC.methods.balanceOf(accounts[0]).call() // Convert 2 USDC to wei
      const amount = web3.utils.toWei(amountCalled, "ether"); // Convert 2 USDC to wei
      let principalToSend = stringToBytes32(principalAs32);
      console.log("principal 32", typeof principalAs32, amount);
      console.log("principal to send", typeof principalToSend);
      console.log("accounts",accounts)
      console.log("amount to send in wei",amountCalled)

        const tx = await contract.methods
          .deposit(USDC_CONTRACT_ADDRESS, amountCalled, principalToSend)
          .send({ from: accounts[0], gasLimit: 200000 });
        console.log("Transaction hash deposit:", tx.transactionHash);

    //   const gasEstimate = await contract.methods
    //     .deposit(USDC_CONTRACT_ADDRESS, 1000000000000000000, principalAs32)
    //     .estimateGas({ from: accounts[0] });

    //   console.log("gasEstimate", gasEstimate);

    //   const encode = await contract.methods
    //     .deposit(USDC_CONTRACT_ADDRESS, amount, principalAs32)
    //     .encodeABI();

    //   const tx = await web.eth.sendTransaction({
    //     from: accounts[0],
    //     to: USDC_HELPER,
    //     gas: gasEstimate,
    //     data: encode,
    //   });
    } catch (error) {
      console.error("Error approving USDC:", error);
      // Handle error
    }
  };
  return (
    <button className="deposit-button" onClick={DepositHandle}>
      Deposit USDC
    </button>
  );
};

export default Deposit;

//approved Tx might need in future.
("0x3dbf7db5fdffe8fc7a12cdad3bd5217610f68a263dbadb21189cbdf08dded66b");
