import { ethers } from "ethers";
import "dotenv/config";
import * as contractJSON from "../../../hardhat/artifacts/contracts/TemperatureLogger.sol/TemperatureLogger.json" with { type: "json" };

const RPC = process.env.BLOCKCHAIN_HOST;
const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ""; // set after deploy

const provider = new ethers.JsonRpcProvider(RPC);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contractABI = contractJSON.default.abi;
const contractBytecode = contractJSON.default.bytecode;

const contractFactory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);

const getContractInstance = (address = CONTRACT_ADDRESS) => {
  if (!address) throw new Error("CONTRACT_ADDRESS not set");
  const contract = new ethers.Contract(address, contractABI, provider);
  return contract.connect(wallet);
};

export { provider, wallet, contractFactory, getContractInstance };
