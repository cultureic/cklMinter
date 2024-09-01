import { useState, useEffect } from "react";
import Bytes32Converter from "./components/Byte32Principal";
import { useMetaMask } from "./components/Web3Context";
import { useAuth } from "./components/ICAuth";
import ApproveUSDC from "./components/ApproveUSDC";
import DepsitUSDCIC from "./components/DepositUSDCIC";
import {
  toDefaultSub,
  defaultIcrcTransferArgs,
  defaultDepositIcpSwap,
  reverseFormatIcrcBalance,
  formatIcrcBalance,
} from "./utils";
import { Principal } from "@dfinity/principal";

function App() {
  const { connectWallet, logoutWeb3, account } = useMetaMask();
  const {
    principalText,
    isAuth,
    login,
    logout,
    principal32,
    tokenBactor,
    principal,
  } = useAuth();
  const [usdcApproved, setApproved] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState("0.0");
  const [withDrawlAddress, setWithdraawlAddress] = useState();

  useEffect(() => {
    console.log("account", account);
    if (tokenBactor) {
      getUsdcBalance();
    }
  }, [account, tokenBactor, principal]);

  const loginMetamask = () => {
    console.log("in login");
    connectWallet();
  };

  const getUsdcBalance = async () => {
    let balance = await tokenBactor.icrc1_balance_of(toDefaultSub(principal));
    console.log("balance", balance);
    setUsdcBalance(Number(balance));
  };

  const withdrawB = async () => {
    if (tokenBactor && withDrawlAddress != "") {
      let balance = await tokenBactor.icrc1_balance_of(toDefaultSub(principal));
      let fee = await tokenBactor.icrc1_fee();
      let transferBalance = Number(balance) - Number(fee);
      let response = await tokenBactor.icrc1_transfer(
        defaultIcrcTransferArgs(
          Principal.fromText(withDrawlAddress),
          transferBalance
        )
      );
      console.log("response", response);
      let result;
      if (response.Ok) {
        result = response.Ok;
      } else {
        result = response.Err;
      }
      console.log("transfer balance", transferBalance);
      console.log("result", response.Err);
    }
  };

  return (
    <main className="gradient-bg">
      <h1>ckUSDC :{usdcBalance}</h1>{" "}
      <div>
        <input
          className="address-input"
          type="text"
          value={withDrawlAddress}
          onChange={(e) => setWithdraawlAddress(e.target.value)}
          placeholder="Enter withdrawal pid"
        />
      </div>
      <button onClick={withdrawB}>withdraw usdc</button>
      {!account && <button onClick={loginMetamask}>connect Metamask</button>}
      {account && <button onClick={logoutWeb3}>Logout Metamask</button>}
      {account && <div>ETH ADDRESS: {account}</div>}
      {!isAuth ? (
        <button onClick={login}> Connect IC</button>
      ) : (
        <button>log out IC</button>
      )}
      {isAuth && <div>IC PRINCIPAL: {principalText}</div>}
      <Bytes32Converter />
      {account && !usdcApproved && <ApproveUSDC setApproved={setApproved} />}
      {usdcApproved && <DepsitUSDCIC principalAs32={principal32} />}
    </main>
  );
}

export default App;
