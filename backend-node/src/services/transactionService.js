import Transaction from "../models/Transaction.js";

export const saveTransactionDetails = async (data) => {
  try {
    const tx = new Transaction(data);
    await tx.save();
    console.log("Transaction saved to MongoDB:", tx.txHash);
    return tx;
  } catch (err) {
    console.error("Error saving transaction:", err);
    throw err;
  }
};
