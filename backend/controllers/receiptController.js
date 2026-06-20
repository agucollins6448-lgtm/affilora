const Withdrawal =
require("../models/Withdrawal");

exports.generateWithdrawalReceipt =
async (req, res) => {

  try {

    const withdrawal =
      await Withdrawal.findById(
        req.params.id
      );

    if (!withdrawal) {

      return res.status(404).json({
        message:
          "Withdrawal not found"
      });

    }

    if (!withdrawal.receiptPath) {

      return res.status(404).json({
        message:
          "Receipt not generated yet"
      });

    }

if (
  withdrawal.receiptPath.startsWith("http")
) {
  return res.redirect(
    withdrawal.receiptPath
  );
}

return res.download(
  withdrawal.receiptPath
);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};