// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Storage", (m) => {
  const lock = m.contract("Storage");

  const simpleStorage = m.contract("Storage");
  console.log("Simple Storage: ", simpleStorage);

  return { lock };
});
