"use client";

import { connect, signRawTransaction } from "@joyid/ckb";
import { useState } from "react";
import {
  capacity_buildTxSkeletonWithOutWitness,
  capacity_createRawTransactionForJoyID,
} from "@/Morphling/Transaction";
import { MainnetRPC, TestnetRPC } from "@/Morphling/Config";
import { bech32, bech32m } from "bech32";
import { BECH32_LIMIT } from "@/Morphling/types/bytes";
import { Indexer } from "@ckb-lumos/ckb-indexer";
import { RPC } from "@ckb-lumos/lumos";

export default function Home() {
  const [walletInfo, setWalletInfo] = useState<string | undefined>();
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const connectJoyId = async () => {
    let JoyIDWalletConnection = await connect();
    setWalletInfo(JoyIDWalletConnection.address);
  };

  const createRawTransaction = async () => {
    let RawTx = await capacity_createRawTransactionForJoyID(
      walletInfo!!,
      toAddress,
      amount,
      {
        RPCUrl: walletInfo?.slice(0, 3) === "ckt" ? TestnetRPC : MainnetRPC,
      }
    );
    const Txx = capacity_buildTxSkeletonWithOutWitness(
      walletInfo!!,
      toAddress,
      amount,
      {
        RPCUrl: walletInfo?.slice(0, 3) === "ckt" ? TestnetRPC : MainnetRPC,
      }
    );

    if (RawTx) {
      const rpc = new RPC("https://testnet.ckbapp.dev/");
      //@ts-ignore
      const signedTx = await signRawTransaction(RawTx.rawTx, walletInfo, {
        witnessIndex: RawTx.witnessIdx,
      });

      rpc
        .sendTransaction(signedTx)
        .then((txHash) => {
          console.log("success txHash", txHash);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

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
            setToAddress(e.target.value);
          }}
        />
      </div>
      <div>
        <div>Amount:</div>
        <input
          id="amount"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </div>
      <div>{walletInfo}</div>
      <div onClick={createRawTransaction}>Create Transaction</div>
    </main>
  );
}
