import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { principalToBytes32 } from "../utils/principalTo32";
import { useAuth } from "./ICAuth";

// Create an instance of Web3
const web3 = new Web3();

// Convert the string to bytes32
function stringToBytes32(str) {
  return web3.utils.utf8ToHex(str);
}

function Bytes32Converter() {
  const [inputString, setInputString] = useState("");
  const [bytes32Result, setBytes32Result] = useState(null);
  const { principalText, isAuth } = useAuth();

  useEffect(() => {
    if (isAuth && !bytes32Result) {
      console.log("principal", principalText);
      const result = principalToBytes32(principalText);
      setBytes32Result(result);
    }
  }, [principalText, bytes32Result]);

  // const handleInputChange = (event) => {
  //     setInputString(event.target.value);
  // };

  const convertToBytes32 = () => {
    const result = principalToBytes32(inputString);
    setBytes32Result(result);
  };

  return (
    <div className="bytes32-converter">
      {bytes32Result && (
        <div>
          <p>Principal 32Bytes:</p>
          <code>{bytes32Result}</code>
        </div>
      )}
    </div>
  );
}

export default Bytes32Converter;
