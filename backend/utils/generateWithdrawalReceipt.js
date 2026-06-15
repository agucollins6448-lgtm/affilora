const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateWithdrawalReceipt = (
  withdrawal,
  receiptPath
) => {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      margin: 0,
      size: "A4"
    });

    const stream =
      fs.createWriteStream(receiptPath);

    doc.pipe(stream);


// FULL DARK BACKGROUND FIRST
const { width, height } = doc.page;

doc.rect(0, 0, width, height).fill("#07111F");

// now continue UI
    const logoPath = path.join(
  __dirname,
  "../assets/Affilora main logo.jpeg"
);

    // ==========================
    // COLORS
    // ==========================

    const gold = "#F4C451";
    const dark = "#07111F";
    const card = "#111827";
    const card2 = "#0B1220";
    const white = "#F8FAFC";
    const green = "#22C55E";
    const gray = "#9CA3AF";

    // ==========================
    // FULL BACKGROUND
    // ==========================

// ==========================
// HEADER
// ==========================

doc
  .rect(0, 0, 612, 140)
  .fill(dark);

// Logo
doc.image(
  logoPath,
  256,
  8,
  {
    width: 100,
    align: "center"
  }
);

// Company Name
doc
  .fillColor(gold)
  .font("Helvetica-Bold")
  .fontSize(26)
  .text(
    "AFFILORA",
    0,
    102,
    {
      align: "center"
    }
  );

// Receipt Title
doc
  .fillColor(white)
  .font("Helvetica")
  .fontSize(12)
  .text(
    "WITHDRAWAL RECEIPT",
    0,
    128,
    {
      align: "center"
    }
  );

// Move cursor below header
doc.y = 170;

    // ==========================
    // MAIN CARD
    // ==========================

    doc
      .roundedRect(
  35,
  150,
  525,
  625,
  20
)
      .fill(card);

    // ==========================
    // SLIP CARD
    // ==========================

    doc
      .roundedRect(
  70,
  180,
  455,
  70,
  12
)
      .fill(card2);

    doc
      .fillColor(gold)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(
        "WITHDRAWAL SLIP NUMBER",
        0,
        200,
        {
          align: "center"
        }
      );

    doc
      .fontSize(18)
      .text(
        withdrawal.slipNumber ||
        `AFF-${withdrawal._id
          .toString()
          .slice(-6)
          .toUpperCase()}`,
        0,
        220,
        {
          align: "center"
        }
      );

    // ==========================
    // STATUS BADGE
    // ==========================

    doc
      .roundedRect(
        430,
270,
90,
28,
14
      )
      .fill(green);

    doc
      .fillColor("white")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(
        withdrawal.status.toUpperCase(),
        452,
        279
      );

    // ==========================
    // RECEIPT DETAILS
    // ==========================

    doc
      .fillColor(white)
      .font("Helvetica")
      .fontSize(12);

    doc.text(
      `Date: ${new Date(
        withdrawal.createdAt
      ).toLocaleDateString()}`,
      70,
      290
    );

    // ==========================
    // MEMBER INFORMATION
    // ==========================

    doc
      .fillColor(gold)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        "MEMBER INFORMATION",
        70,
        350
      );

    doc
      .fillColor(white)
      .font("Helvetica")
      .fontSize(12);

    doc.text(
      `Full Name: ${withdrawal.user.fullName}`,
      70,
      380
    );

    doc.text(
      `Email Address: ${withdrawal.user.email}`,
      70,
      405
    );

    // ==========================
    // AMOUNT CARD
    // ==========================

    doc
      .roundedRect(
        110,
460,
370,
90,
15
      )
      .fill(card2);

    doc
      .fillColor(gray)
      .fontSize(12)
      .text(
        "WITHDRAWAL AMOUNT",
        0,
        480,
        {
          align: "center"
        }
      );

    doc
      .fillColor(green)
      .font("Helvetica-Bold")
      .fontSize(30)
      .text(
        `NGN ${withdrawal.amount.toLocaleString()}`,
        0,
        505,
        {
          align: "center"
        }
      );

    // ==========================
    // BANK DETAILS
    // ==========================

    doc
      .fillColor(gold)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        "BANK DETAILS",
        70,
        590
      );

    doc
      .fillColor(white)
      .font("Helvetica")
      .fontSize(12);

const formatBankName = (name) => {

  if (!name) return "N/A";

  const banks = {
    gtbank: "GTBank",
    gtb: "GTBank",
    Gtb: "GTBank",
    uba: "UBA",
    Uba: "UBA",
    fcmb: "FCMB",
    Opay: "OPay",
    opay: "Opay",
    kuda: "Kuda Bank",
    MP: "Moniepoint",
    Mp: "Moniepoint",
    mp: "Moniepoint",
    access: "Access Bank",
    zenith: "Zenith Bank",
    fidelity: "Fidelity Bank",
    firstbank: "First Bank",
    fbn: "First Bank",
    Fbn: "First Bank",
    FBN: "First Bank",
    keystone: "Keystone Bank",
    stanbic: "Stanbic IBTC",
    providus: "Providus Bank",
    parallex: "Parallex Bank",
    titan: "Titan Trust Bank"
  };

  const key =
    name
      .toLowerCase()
      .replace(/\s+/g, "");

  return (
    banks[key] ||
    name
      .split(" ")
      .map(
        word =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ")
  );

};

doc.text(
  `Bank Name: ${formatBankName(
    withdrawal.bankName
  )}`,
  70,
  620
);

    doc.text(
      `Account Name: ${withdrawal.accountName}`,
      70,
      645
    );

    doc.text(
      `Account Number: ****${withdrawal.accountNumber.slice(-4)}`,
      70,
      670
    );

    // ==========================
    // TRANSACTION DETAILS
    // ==========================

    doc
      .fillColor(gold)
      .font("Helvetica-Bold")
      .fontSize(16)
      .text(
        "TRANSACTION DETAILS",
        70,
        720
      );

    doc
      .fillColor(white)
      .font("Helvetica")
      .fontSize(11)
      .text(
        `Transaction ID: ${withdrawal._id}`,
        70,
        750
      );

    // ==========================
    // FOOTER
    // ==========================

   doc
  .fillColor(gray)
  .fontSize(9)
  .text(
    "Generated securely by Affilora",
    0,
    785,
    {
      align: "center"
    }
  );

doc
  .fillColor(gold)
  .fontSize(9)
  .text(
    "Empowering Digital Earners",
    0,
    800,
    {
      align: "center"
    }
  );
    // ALL YOUR PDF DESIGN CODE HERE

    doc.end();

    stream.on(
      "finish",
      resolve
    );

    stream.on(
      "error",
      reject
    );

  });

};

module.exports =
  generateWithdrawalReceipt;