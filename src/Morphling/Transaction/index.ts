import { Indexer } from "@ckb-lumos/ckb-indexer";
import { DefaultConfig, MAX_FEE, MainnetRPC, TestnetRPC } from "../Config";
import {
  Cell,
  CellDep,
  RawTransaction,
  TransactionSkeletonInterface,
} from "../types/transaction";
import { addressToLockScript } from "../Wallet/address";
import { Config, Script } from "../types/config";
import { BI, parseUnit } from "../base/number";
import { List, Map as ImmutableMap } from "immutable";
import { assembleWitnesses_joyID } from "../base/witness";

export const collecteCell = async (
  address: string,
  RPCUrl: string,
  amount: string,
  config?: Config,
  typeScript?: Script
) => {
  const prefix = address.slice(0, 3);
  const RPCURL = RPCUrl
    ? RPCUrl
    : prefix.toLocaleLowerCase() === "ckt"
    ? TestnetRPC
    : MainnetRPC;
  const indexer = new Indexer(RPCURL);
  const collectCells: Cell[] = [];
  let collector = indexer.collector({
    //@ts-ignore
    lock: addressToLockScript(address, DefaultConfig.TestnetConig),
    //@ts-ignore
    type: typeScript ? typeScript : "empty",
  });
  let collectedSum = BI.from(0);
  let amountInShannon = BI.from(parseFloat(amount) * 10 ** 8)
  for await (const cell of collector.collect()) {
      collectedSum = collectedSum.add(cell.cellOutput.capacity);
      collectCells.push(cell);
      if (BI.from(collectedSum).gte(amountInShannon)) break;
  }

  return collectCells;
};

export const getCellsDepByScript = (
  script: Script,
  options: {
    isMainnet: boolean;
    config: Config | undefined;
  }
) => {
  const config =
    options.config ||
    (!options.isMainnet
      ? DefaultConfig.TestnetConig
      : DefaultConfig.MainnetConfig);

  for (const key in config.SCRIPTS) {
    if (Object.prototype.hasOwnProperty.call(config.SCRIPTS, key)) {
      //@ts-ignore
      const scriptConfig: ScriptConfig = config.SCRIPTS[key];
      if (
        script.codeHash == scriptConfig.CODE_HASH &&
        script.hashType == scriptConfig.HASH_TYPE
      ) {
        const cellDep: CellDep = {
          outPoint: {
            txHash: scriptConfig.TX_HASH,
            index: scriptConfig.INDEX,
          },
          depType: scriptConfig.DEP_TYPE,
        };
        return cellDep;
      }
    }
  }
};

export const capacity_buildTxSkeletonWithOutWitness = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  options: {
    RPCUrl: string;
    config?: Config;
    fee?: string | number;
  }
) => {
  const env = fromAddress.slice(0, 3);
  const isMainnet = env === "ckt" ? false : true;

  const cells = await collecteCell(fromAddress, options.RPCUrl, amount, options.config);
  const inputs: Cell[] = [];
  const outputs: Cell[] = [];
  const inputSinces: { [key: number]: string } = {};

  let payAmount = BI.from(0);
  const fee = options.fee
    ? BI.from(parseUnit(options.fee.toString(), "ckb"))
    : MAX_FEE;
  const sendAmount = BI.from(parseUnit(amount.toString(), "ckb"));
  // TODO this cell min count
  const minCapacity = BI.from(parseUnit("62", "ckb"));

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];

    inputs.push(cell);
    payAmount = payAmount.add(cell.cellOutput.capacity);
    inputSinces[i] = "0x0";

    if (payAmount.gte(sendAmount.add(fee).add(minCapacity))) {
      break;
    }
  }

  if (payAmount.lt(sendAmount.add(fee).add(minCapacity))) {
    return;
  }

  outputs.push({
    data: "0x",
    cellOutput: {
      lock: addressToLockScript(toAddress, DefaultConfig.TestnetConig),
      capacity: sendAmount.toHexString(),
    },
  });

  const changeAmount = payAmount.sub(sendAmount).sub(fee).sub(minCapacity);
  console.log(
    "change amount",
    changeAmount.toString(),
    payAmount.toString(),
    sendAmount.toString()
  );

  if (changeAmount.gt(0)) {
    outputs.push({
      data: "0x",
      cellOutput: {
        lock: addressToLockScript(toAddress, DefaultConfig.TestnetConig),
        capacity: changeAmount.toHexString(),
      },
    });
  }

  const cellDeps: CellDep[] = [];
  const fromScript = addressToLockScript(toAddress, DefaultConfig.TestnetConig);
  const toScript = addressToLockScript(toAddress, DefaultConfig.TestnetConig);

  const fromCellDep = getCellsDepByScript(fromScript, {
    isMainnet,
    config: options.config,
  });
  if (fromCellDep) {
    const findItem = cellDeps.find(
      (v) =>
        v.depType == fromCellDep.depType &&
        v.outPoint.txHash == fromCellDep.outPoint.txHash &&
        v.outPoint.index == fromCellDep.outPoint.index
    );

    if (!findItem) {
      cellDeps.push(fromCellDep);
    }
  }

  const toCellDep = getCellsDepByScript(toScript, {
    isMainnet,
    config: options.config,
  });
  if (toCellDep) {
    const findItem = cellDeps.find(
      (v) =>
        v.depType == toCellDep.depType &&
        v.outPoint.txHash == toCellDep.outPoint.txHash &&
        v.outPoint.index == toCellDep.outPoint.index
    );

    if (!findItem) {
      cellDeps.push(toCellDep);
    }
  }

  const txSkeleton: TransactionSkeletonInterface = {
    cellProvider: null,
    inputs,
    outputs,
    inputSinces,
    cellDeps,
    witnesses: [],
    headerDeps: [],
    fixedEntries: [],
    signingEntries: [],
  };

  return txSkeleton;
};

export const createRawTransaction = (
  txSkeleton: TransactionSkeletonInterface
) => {
  const rawTx: RawTransaction = {
    version: "0x0",
    cellDeps: [],
    headerDeps: [],
    inputs: [],
    outputs: [],
    outputsData: [],
    witnesses: [],
  };

  // cellDeps
  for (let i = 0; i < txSkeleton.cellDeps.length; i++) {
    const cellDep = txSkeleton.cellDeps[i];
    if (cellDep) rawTx.cellDeps.push(cellDep);
  }
  // headerDeps
  for (let i = 0; i < txSkeleton.headerDeps.length; i++) {
    const header = txSkeleton.headerDeps[i];
    if (header) rawTx.headerDeps.push(header);
  }
  // inputs
  for (let i = 0; i < txSkeleton.inputs.length; i++) {
    const input = txSkeleton.inputs[i];
    const inputSince = txSkeleton.inputSinces[i];
    if (input && input.outPoint && inputSince) {
      rawTx.inputs.push({
        previousOutput: {
          txHash: input.outPoint.txHash,
          index: input.outPoint.index,
        },
        since: inputSince,
      });
    }
  }
  // outputs and outputsData
  for (let i = 0; i < txSkeleton.outputs.length; i++) {
    const output = txSkeleton.outputs[i];
    if (output) {
      rawTx.outputs.push(output.cellOutput);
      rawTx.outputsData.push(output.data);
    }
  }
  // witness
  for (let i = 0; i < txSkeleton.witnesses.length; i++) {
    const witnessItem = txSkeleton.witnesses[i];
    if (witnessItem) {
      rawTx.witnesses.push(witnessItem);
    }
  }

  return rawTx;
};

/*
import { signRawTransaction } from "@joyid/ckb";

const signedTx = await signRawTransaction(rawTx, seller, { witnessIndex });

rpc.sendTransaction(signedTx, 'passthrough');
*/
export const capacity_createRawTransactionForJoyID = async (
  fromAddress: string,
  toAddress: string,
  amount: string,
  options: {
    RPCUrl: string;
    config?: Config;
    fee?: string | number;
  }
) => {
  const txSkeleton = await capacity_buildTxSkeletonWithOutWitness(
    fromAddress,
    toAddress,
    amount,
    options
  );

  if (txSkeleton) {
    const result = assembleWitnesses_joyID(
      txSkeleton,
      addressToLockScript(fromAddress, DefaultConfig.TestnetConig)
    );
    console.log(txSkeleton, result);

    if (result) {
      const witnessIdx = result.witnessIdx;
      const rawTx = createRawTransaction(txSkeleton);

      return { rawTx, witnessIdx };
    }
  }
};
