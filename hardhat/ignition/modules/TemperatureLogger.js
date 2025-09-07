// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TemperatureLogger", (m) => {
  const lock = m.contract("TemperatureLogger");

  const tempLogger = m.contract("TemperatureLogger");
  console.log("Temperature Logger: ", tempLogger);

  return { lock };
});
