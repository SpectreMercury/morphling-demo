"use client"

import { connect } from "@joyid/ckb";
import { useState } from "react";
import { capacity_buildTxSkeletonWithOutWitness, capacity_createRawTransactionForJoyID } from "@/Morphling/Transaction";
import { MainnetRPC, TestnetRPC } from "@/Morphling/Config";

export default function Home() {

  const [walletInfo, setWalletInfo] = useState<string | undefined>();
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  
  const connectJoyId = async() => {
    let JoyIDWalletConnection = await connect();
    setWalletInfo(JoyIDWalletConnection.address);
  }

  const createRawTransaction = async() => {
    let RawTx = await capacity_createRawTransactionForJoyID(
      walletInfo!!,
      toAddress,
      amount,
      {
        RPCUrl: walletInfo?.slice(0,3) === 'ckt' ? TestnetRPC : MainnetRPC
      }
    )  
    const Txx = capacity_buildTxSkeletonWithOutWitness(walletInfo!!,
      toAddress,
      amount,
      {
        RPCUrl: walletInfo?.slice(0,3) === 'ckt' ? TestnetRPC : MainnetRPC
      })
  }
  




  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="" onClick={connectJoyId}>
        connect
      </div>
      <div>
        <div>Address:</div>
        <input
          id="toAddress" 
          value={toAddress} 
          onChange={(e) => {
            setToAddress(e.target.value)
          }}
        />
      </div>
      <div>
        <div>Amount:</div>
        <input
          id="amount" 
          value={amount} 
          onChange={(e) => {
            setAmount(e.target.value)
          }}
        />
      </div>
      <div>
        {walletInfo}
      </div>
      <div onClick={createRawTransaction}>
        Create Transaction
      </div>
    </main>
  );
}
