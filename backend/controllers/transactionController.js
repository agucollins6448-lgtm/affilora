const Transaction =
require("../models/Transaction");
const PDFDocument = require("pdfkit");
const path = require("path");

exports.getUserTransactions =
async (req, res) => {

  try {

    const transactions =
      await Transaction.find({

        user: req.params.userId

      }).sort({
        createdAt: -1
      });

    res.json(transactions);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

exports.exportTransactionsPDF = async (req, res) => {
  try {

    const transactions =
      await Transaction.find({
        user: req.user.id
      }).sort({
        createdAt: -1
      });

    const doc = new PDFDocument({
      margin: 0,
      size: "A4"
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Affilora-Transactions.pdf"
    );

    doc.pipe(res);

    const logoPath = path.join(
      __dirname,
      "../assets/Affilora main logo.jpeg"
    );

    const gold = "#F4C451";
    const dark = "#07111F";
    const card = "#111827";
    const white = "#F8FAFC";
    const gray = "#9CA3AF";

    // Background
    doc
      .rect(
        0,
        0,
        doc.page.width,
        doc.page.height
      )
      .fill(dark);

    // Header
    doc.image(
      logoPath,
      256,
      10,
      { width: 100 }
    );

    doc
      .fillColor(gold)
      .fontSize(26)
      .font("Helvetica-Bold")
      .text(
        "AFFILORA",
        0,
        105,
        {
          align: "center"
        }
      );

    doc
      .fillColor(white)
      .fontSize(12)
      .font("Helvetica")
      .text(
        "TRANSACTION STATEMENT",
        0,
        132,
        {
          align: "center"
        }
      );

    // Main Card
    doc
      .roundedRect(
        30,
        165,
        550,
        620,
        15
      )
      .fill(card);

    // Table Header
    doc
      .fillColor(gold)
      .font("Helvetica-Bold")
      .fontSize(12);

    doc.text("TYPE", 50, 190);
    doc.text("AMOUNT", 180, 190);
    doc.text("STATUS", 310, 190);
    doc.text("DATE", 430, 190);

    doc
      .moveTo(45, 210)
      .lineTo(560, 210)
      .strokeColor(gold)
      .stroke();

    let y = 225;

    transactions.forEach((t) => {

      if (y > 730) {
        doc.addPage();

        doc
          .rect(
            0,
            0,
            doc.page.width,
            doc.page.height
          )
          .fill(dark);

        y = 50;
      }

      doc
        .fillColor(white)
        .font("Helvetica")
        .fontSize(10);

      doc.text(
        t.type.toUpperCase(),
        50,
        y
      );

      doc.text(
        `NGN ${Number(
          t.amount
        ).toLocaleString()}`,
        180,
        y
      );

      doc.text(
        t.status,
        310,
        y
      );

      doc.text(
        new Date(
          t.createdAt
        ).toLocaleDateString(),
        430,
        y
      );

      y += 25;
    });

    doc
      .fillColor(gray)
      .fontSize(9)
      .text(
        "Generated securely by Affilora",
        0,
        800,
        {
          align: "center"
        }
      );

    doc.end();

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });

  }
};