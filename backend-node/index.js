import express from "express";
import { ethers } from "ethers";
import "dotenv/config";

import * as contractJSON from "../hardhat/artifacts/contracts/SimpleStorage.sol/SimpleStorage.json" assert { type: "json" };
// import * as userJSON from "../contract/User.js";

let contractABI = contractJSON.default.abi;
let contractBytecode = contractJSON.default.bytecode;
const host = process.env.BLOCKCHAIN_HOST;
const accountPrivateKey = process.env.ACCOUNT_PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(host);
const wallet = new ethers.Wallet(accountPrivateKey, provider);

const storageFactory = new ethers.ContractFactory(
  contractABI,
  contractBytecode,
  wallet
);

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  console.log("getContractInstance", getContractInstance());
  res.send("Hello Express...");
});

app.post("/deploy", async (req, res) => {
  try {
    const address = await deploy();

    res
      .json({ msg: "Contract Deployed Successfully", ContractAddress: address })
      .send();
  } catch (error) {
    console.log("Error while deployment", error);
  }
});

app.post("/store", async (req, res) => {
  try {
    const contractInstance = getContractInstance();

    let tx = await contractInstance.store(9);
    const re = await tx.wait();
    // console.log("re", re);

    res
      .json({ msg: "Store function called Successfully", txId: re.hash })
      .send();
  } catch (error) {
    console.log("Error while store()", error);
  }
});

app.get("/retrieve", async (req, res) => {
  try {
    const contractInstance = getContractInstance();
    const result = await contractInstance.retrieve();
    res
      .json({ msg: "Retrive function called Successfully", result: result.toString() })
      .send();
  } catch (error) {
    console.log("Error while retrive()", error);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const deploy = async () => {
  try {
    const storageContract = await storageFactory.deploy();
    // The contract is NOT deployed yet; we must wait until it is mined
    await storageContract.waitForDeployment();

    let contractAddress = await storageContract.getAddress();
    process.env["CONTRACT_ADDRESS"] = contractAddress;
    return contractAddress;
  } catch (error) {
    console.log("Error ", error);
  }
};

const getContractInstance = () => {
  //   return new ethers.Contract(contractAddress, contractABI, wallet);

  const provider = new ethers.JsonRpcProvider(host);
  let userContractInstance = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );
  const wallet = new ethers.Wallet(accountPrivateKey, provider);
  const contractWithSigner = userContractInstance.connect(wallet);
  return contractWithSigner;
};
