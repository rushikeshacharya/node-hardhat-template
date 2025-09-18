import {
  deployContract,
} from "../services/contractService.js";

const deploy = async (req, res) => {
  try {
    const address = await deployContract();
    res.json({
      msg: "✅ Contract Deployed Successfully",
      contractAddress: address,
    });
  } catch (err) {
    res.status(500).json({ error: "Contract deployment failed" });
  }
};

export { deploy };
