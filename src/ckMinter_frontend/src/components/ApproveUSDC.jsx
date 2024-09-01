import React, { useState, useEffect } from "react";
import { useMetaMask } from "./Web3Context";
import USDC from "./../web3Abis/USDC.json";

const USDC_CONTRACT_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"; // You need to replace this with the actual address
const USDC_HELPER = "0x6abDA0438307733FC299e9C229FD3cc074bD8cC0";

const ApproveButton = ({ setApproved }) => {
  const { web3 } = useMetaMask();
  const [allowance, setAllowance] = useState(null);

  useEffect(() => {
    if (web3) {
      fetchAllowance();
    }
  }, [web3]); // Fetch allowance only once when the component mounts

  const fetchAllowance = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(USDC, USDC_CONTRACT_ADDRESS);
      const allowance = await contract.methods
        .allowance(accounts[0], USDC_HELPER)
        .call();
      setAllowance(parseInt(allowance));
    } catch (error) {
      console.error("Error fetching allowance:", error);
    }
  };

  const approveUSDC = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(USDC, USDC_CONTRACT_ADDRESS);

      if (allowance > 0) {
        setApproved(true); // Set as approved if already allowed
        return;
      }

      const amount = await contract.methods.balanceOf(accounts[0]).call();
      const tx2 = await contract.methods
        .approve(USDC_HELPER, amount)
        .send({ from: accounts[0] });
      console.log("Transaction hash:", tx2);
      setApproved(true); // Set as approved after approval
    } catch (error) {
      console.error("Error approving USDC:", error);
    }
  };

  return (
    <div>
      {allowance === null ? (
        <p>Loading allowance...</p>
      ) : (
        <button onClick={approveUSDC}>
          {allowance > 0 ? "Already Approved" : "Approve USDC"}
        </button>
      )}
    </div>
  );
};

export default ApproveButton;
