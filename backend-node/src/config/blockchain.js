import { ethers } from "ethers";
import "dotenv/config";
import * as contractJSON from "../../../hardhat/artifacts/contracts/TemperatureLogger.sol/TemperatureLogger.json" with { type: "json" };

const host = process.env.BLOCKCHAIN_HOST;
const accountPrivateKey = process.env.ACCOUNT_PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const contractABI = contractJSON.default.abi;
const contractBytecode = contractJSON.default.bytecode;

const provider = new ethers.JsonRpcProvider(host);
const wallet = new ethers.Wallet(accountPrivateKey, provider);

const storageFactory = new ethers.ContractFactory(
  contractABI,
  contractBytecode,
  wallet
);

const getContractInstance = () => {
  const userContractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );
  return userContractInstance.connect(wallet);
};

export { storageFactory, getContractInstance };
