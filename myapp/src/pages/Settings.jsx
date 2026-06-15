import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});


export default function Settings({ setView, onLogout }) {
  // --- Profile States ---
   const currentUser = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  const userId =
    currentUser?._id ||
    currentUser?.email ||
    currentUser?.username;

  const token = localStorage.getItem("token") || "";
const [membershipTier, setmembershipTier] = useState("");
// Profile Information
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [username, setUsername] = useState("");

// Security
const [currentPass, setCurrentPass] = useState("");
const [newPass, setNewPass] = useState("");

// Notifications
const [emailNotif, setEmailNotif] = useState(true);

// Card live input
const [inputCardHolder, setInputCardHolder] = useState("");
const [inputCardNum, setInputCardNum] = useState("");
const [inputCardExpiry, setInputCardExpiry] = useState("");

// Saved card (from DB)
const [savedCardHolder, setSavedCardHolder] = useState("Card Name");
const [savedCardNum, setSavedCardNum] = useState("5399 xxxx xxxx 2026");
const [savedCardExpiry, setSavedCardExpiry] = useState("12/28");

// Bank details
const [bankName, setBankName] = useState("");
const [accNum, setAccNum] = useState("");
const [accName, setAccName] = useState("");
const [currency, setCurrency] = useState("NGN");  



  // Core banks dictionary for options selection
  const banks = [
    { code: "gtb", name: "Guaranty Trust Bank (GTB)" },
    { code: "access", name: "Access Bank" },
    { code: "zenith", name: "Zenith Bank" },
    { code: "uba", name: "United Bank for Africa (UBA)" },
    { code: "FBN", name: "First Bank Of Nigeria" },
    { code: "Opay", name: "OPAY" },
    { code: "MP", name: "Moniepoint" }
  ];

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const user = res.data;
      setmembershipTier(user.membershipTier || "");

      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setUsername(user.username || "");
      setEmailNotif(user.emailNotifications ?? true);

      setSavedCardHolder(user?.card?.holder || "Card Name");
setSavedCardNum(user?.card?.number || "5399 xxxx xxxx 2026");
setSavedCardExpiry(user?.card?.expiry || "12/28");

setBankName(user?.bank?.name || "");
setAccNum(user?.bank?.accountNumber || "");
setAccName(user?.bank?.accountName || "");
setCurrency(user?.bank?.currency || "NGN");

    } catch (error) {
      console.log(error);
    }
  };

  if (token) fetchUser();
}, [token]);

useEffect(() => {

  if (!userId) return;

  socket.emit("join", userId);

  return () => {
    socket.off();
  };

}, [userId]);

  // Live Format Handlers
  const handleCardNumChange = (e) => {
    let clearValue = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let matches = clearValue.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || "";
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setInputCardNum(parts.join(" "));
    } else {
      setInputCardNum(clearValue);
    }
  };

  const handleExpiryChange = (e) => {
    let clearValue = e.target.value.replace(/[^0-9]/g, "");
    if (clearValue.length >= 2) {
      setInputCardExpiry(clearValue.substring(0, 2) + "/" + clearValue.substring(2, 4));
    } else {
      setInputCardExpiry(clearValue);
    }
  };

  const handleExpiryKeyDown = (e) => {
    if (e.key === "Backspace" && inputCardExpiry.length === 3) {
      setInputCardExpiry(inputCardExpiry.substring(0, 2));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!bankName || !accNum || !accName) {
    alert("Please complete all bank payment information fields before saving.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    // PASSWORD CHANGE
    if (currentPass && newPass) {
      await API.put(
        "/auth/change-password",
        {
          currentPassword: currentPass,
          newPassword: newPass
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    }
const cleanedNumber = inputCardNum.replace(/\s/g, "");

const maskedCardNumber =
  cleanedNumber.length >= 8
    ? cleanedNumber.slice(0, 4) +
      " **** **** " +
      cleanedNumber.slice(-4)
    : savedCardNum;
    // ✅ FIXED UPDATE SETTINGS REQUEST
    const res = await API.put(
      "/auth/update-settings",
      {
        fullName,
        email,
        phone,
        username,

        emailNotif,

        cardHolder: inputCardHolder || savedCardHolder,
        cardNumber: maskedCardNumber || savedCardNum,
        cardExpiry: inputCardExpiry || savedCardExpiry,

        bankName,
        accountNumber: accNum,
        accountName: accName,
        currency
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // OPTIONAL: update UI immediately after save
    const user = res.data.user || res.data;

    setSavedCardHolder(user?.card?.holder || "Card Name");
    setSavedCardNum(user?.card?.number || "5399 xxxx xxxx 2026");
    setSavedCardExpiry(user?.card?.expiry || "12/28");

    setBankName(user?.bank?.name || "");
    setAccNum(user?.bank?.accountNumber || "");
    setAccName(user?.bank?.accountName || "");
    setCurrency(user?.bank?.currency || "NGN");

    setInputCardHolder("");
    setInputCardNum("");
    setInputCardExpiry("");

    setCurrentPass("");
    setNewPass("");

    setEmailNotif("");

    alert("Settings saved successfully");

    socket.emit(
  "updateUser",
  user
);

  } catch (error) {
    console.log(error);
    alert(error.response.data.message || "Something went wrong");
  }
};

const maskCardNumber = (num) => {
  if (!num) return "5399 xxxx xxxx 2026";

  const cleaned = num.replace(/\s/g, "");

  if (cleaned.length < 8) return num;

  return (
    cleaned.slice(0, 4) +
    " **** **** " +
    cleaned.slice(-4)
  );
};

    useEffect(() => {

  socket.on("userUpdated", (updatedUser) => {

    setmembershipTier(
      updatedUser.membershipTier || ""
    );

    setFullName(
      updatedUser.fullName || ""
    );

    setEmail(
      updatedUser.email || ""
    );

    setPhone(
      updatedUser.phone || ""
    );

    setUsername(
      updatedUser.username || ""
    );

    setEmailNotif(
      updatedUser.emailNotifications ?? true
    );

    setSavedCardHolder(
      updatedUser?.card?.holder || "Card Name"
    );

    setSavedCardNum(
      updatedUser?.card?.number ||
      "5399 xxxx xxxx 2026"
    );

    setSavedCardExpiry(
      updatedUser?.card?.expiry ||
      "12/28"
    );

    setBankName(
      updatedUser?.bank?.name || ""
    );

    setAccNum(
      updatedUser?.bank?.accountNumber || ""
    );

    setAccName(
      updatedUser?.bank?.accountName || ""
    );

    setCurrency(
      updatedUser?.bank?.currency || "NGN"
    );

  });

  return () => {
    socket.off("userUpdated");
  };

}, []);

    

  // PREMIUM INLINE THEME STYLES (Identical with your unified theme system)
  const styles = {
    wrapper: {
      minHeight: "100vh",
      width: "100%",
      background: "var(--gradient-hero)",
      backgroundAttachment: "fixed",
      color: "var(--fg)",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex"
    },
    sidebar: {
      width: "260px",
      height: "100vh",
      background: "rgba(17, 24, 39, 0.95)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "25px",
      position: "fixed",
      left: 0,
      top: 0,
      borderRight: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      zIndex: 100
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "40px"
    },
    logoBox: {
      width: "50px",
      height: "50px",
      background: "var(--gradient-gold)",
      borderRadius: "14px",
      overflow: "hidden"
    },
    logoImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    logoTextH2: {
      fontFamily: "'Playfair Display', serif",
      fontWeight: 800,
      fontSize: "24px",
      background: "var(--gradient-gold)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      margin: 0
    },
    logoTextP: {
      color: "var(--muted)",
      fontSize: "12px",
      letterSpacing: "2px",
      margin: "2px 0 0 0",
      textTransform: "uppercase"
    },
    menuLink: {
      textDecoration: "none",
      color: "var(--muted)",
      padding: "14px",
      borderRadius: "12px",
      transition: "0.3s ease",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "15px",
      background: "none",
      border: "none",
      width: "100%",
      textAlign: "left",
      cursor: "pointer"
    },
    activeMenuLink: {
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      fontWeight: "600",
      boxShadow: "var(--shadow-glow-gold)"
    },
    mainContent: {
  marginLeft: "260px",
  width: "calc(100% - 260px)",
  padding: "40px",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",   // centers horizontally
  alignItems: "flex-start"    // keeps it top-aligned (better UX)
},
    settingsContainer: {
      width: "100%",
      maxWidth: "900px",
      backgroundColor: "#f5f5f7",
      borderRadius: "16px",
      padding: "40px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      marginBottom: "40px",
      color: "#333333"
    },
    pageTitle: {
      fontSize: "28px",
      fontWeight: "700",
      color: "#1e1e24",
      margin: "0 0 6px 0"
    },
    pageSubtitle: {
      fontSize: "14px",
      color: "#66666d",
      margin: "0 0 32px 0"
    },
    settingsSection: {
      marginBottom: "36px",
      borderBottom: "1px solid #e0e0e6",
      paddingBottom: "32px"
    },
    sectionHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "24px",
      position: "relative"
    },
    sectionAccent: {
      width: "4px",
      height: "20px",
      backgroundColor: "#e5b813",
      borderRadius: "2px",
      marginRight: "12px"
    },
    sectionHeaderH3: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1e1e24",
      margin: 0
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "20px"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    formGroupFullWidth: {
      gridColumn: "span 2",
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#44444a"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "1px solid #d0d0d6",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      fontSize: "14px",
      color: "#1e1e24",
      outline: "none"
    },
    toggleRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
    },
    toggleLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#333338"
    },
    switch: {
      position: "relative",
      display: "inline-block",
      width: "44px",
      height: "24px"
    },
    slider: {
      position: "absolute",
      cursor: "pointer",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#ccc",
      transition: ".3s",
      borderRadius: "24px"
    },
    creditCard: {
      width: "340px",
      height: "200px",
      background: "linear-gradient(135deg, #43603d 0%, #293d25 100%)",
      borderRadius: "14px",
      padding: "24px",
      color: "#ffffff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
      position: "relative"
    },
    btnSave: {
      backgroundColor: "#556b50",
      color: "#ffffff",
      border: "none",
      padding: "14px 32px",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      width: "100%",
      maxWidth: "240px"
    },
    Bronze: {
      color: "#cd7f32",
      fontSize: "12px",
      fontWeight: "700",
      marginTop: "5px",
      marginLeft: "2px",
      display: "inline-flex"
    },
    Silver: {
      color: "#c0c0c0",
      fontSize: "12px",
      fontWeight: "700",
      marginTop: "5px",
      marginLeft: "2px",
      display: "inline-flex"
    },
    Gold: {
      color: "#ffd700",
      fontSize: "12px",
      fontWeight: "700",
      marginTop: "5px",
      marginLeft: "2px",
      display: "inline-flex"
    },
    Premium: {
      color: "#8b5cf6",
      fontSize: "12px",
      fontWeight: "700",
      marginTop: "5px",
      marginLeft: "2px",
      display: "inline-flex"
    }
  };

  return (
    <div style={styles.wrapper}>
      
      {/* Sidebar Layout Section */}
      <div className="sidebar" style={styles.sidebar}>
        <div className="logo" style={styles.logo}>
          <div className="logo-box" style={styles.logoBox}>
            <img src="/Affilora main logo.jpeg" alt="Main logo" style={styles.logoImg} />
          </div>
          <div className="logo-text">
            <h2 style={styles.logoTextH2}>Affilora</h2>
            <p style={styles.logoTextP}>DASHBOARD</p>
            <p style={styles.logoTextP}>
            
          {
            membershipTier === "Bronze" &&
            <span><i
              className="fa-solid fa-medal"
              style={{ color: "#cd7f32" }}
            />
            <div style={styles.Bronze}>                
                {membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            membershipTier === "Silver" &&
            <span><i
              className="fa-solid fa-award"
              style={{ color: "#c0c0c0" }}
            />
            <div style={styles.Silver}>                
                {membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            membershipTier === "Gold" &&
            <span><i
              className="fa-solid fa-star"
              style={{ color: "#ffd700" }}
            />
            <div style={styles.Gold}>                
                {membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            membershipTier === "Premium" &&
            <span><i
              className="fa-solid fa-trophy"
              style={{ color: "#8b5cf6" }}
            />
            <div style={styles.Premium}>                
                {membershipTier.toUpperCase()}                
              </div></span>
          }</p>
          </div>
        </div>

        <div className="menu" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button style={styles.menuLink} onClick={() => setView("dashboard")}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </button>

          <button style={styles.menuLink} onClick={() => setView("tasks")}>
            <i className="fa-solid fa-list-check"></i>
            <span>Tasks</span>
          </button>

          <button style={styles.menuLink} onClick={() => setView("referrals")}>
            <i className="fa-solid fa-user-group"></i>
            <span>Referrals</span>
          </button>

          <button style={styles.menuLink} onClick={() => setView("wallet")}>
            <i className="fa-solid fa-wallet"></i>
            <span>Wallet</span>
          </button>

          <button style={styles.menuLink} onClick={() => setView("support")}>
            <i className="fa-solid fa-headset"></i>
            <span>Support</span>
          </button>

          <button style={styles.menuLink} onClick={() => setView("membership")}>
            <i className="fa-solid fa-crown"></i>
            <span>Membership</span>
          </button>

          <button style={{ ...styles.menuLink, ...styles.activeMenuLink }}>
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </button>
        

        <button style={{ ...styles.menuLink, marginTop: "20px", color: "#f87171" }} onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
          </div>
      </div>

      {/* Main Settings Page Panel */}
      <div className="main" style={styles.mainContent}>
        <div style={styles.settingsContainer}>
          <h1 style={styles.pageTitle}>Settings</h1>
          <p style={styles.pageSubtitle}>Manage your Affilora account settings and preferences.</p>

          <form id="settingsForm" onSubmit={handleSubmit}>
            
            {/* PROFILE DETAILS */}
            <div style={styles.settingsSection}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionAccent}></div>
                <h3 style={styles.sectionHeaderH3}>Profile Information</h3>
              </div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label htmlFor="full-name" style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    id="full-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={styles.input}
                    placeholder="Full Name"
                    required                    
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    placeholder="Email"
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="phone" style={styles.label}>Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={styles.input}
                    placeholder="+234 801 234 5678"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="username" style={styles.label}>Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    placeholder="user"
                    required
                  />
                </div>
              </div>
            </div>

            {/* SECURITY/PASSWORDS */}
            <div style={styles.settingsSection}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionAccent}></div>
                <h3 style={styles.sectionHeaderH3}>Security</h3>
              </div>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label htmlFor="current-pass" style={styles.label}>Current Password</label>
                  <input
                    type="password"
                    id="current-pass"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    style={styles.input}
                    placeholder="Enter current password"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="new-pass" style={styles.label}>New Password</label>
                  <input
                    type="password"
                    id="new-pass"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    style={styles.input}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
            </div>

            {/* NOTIFICATION PREFERENCES */}
            <div style={styles.settingsSection}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionAccent}></div>
                <h3 style={styles.sectionHeaderH3}>Notifications</h3>
              </div>
              <div style={styles.toggleRow}>
                <span style={styles.toggleLabel}>Email Notifications</span>
                <label style={styles.switch}>
                  <input
                    type="checkbox"
                    id="emailNotif"
                    checked={emailNotif}
                    onChange={(e) => setEmailNotif(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{ ...styles.slider, backgroundColor: emailNotif ? "#111111" : "#ccc" }}>
                    <span style={{ position: "absolute", height: "18px", width: "18px", left: "3px", bottom: "3px", backgroundColor: "white", transition: ".3s", borderRadius: "50%", transform: emailNotif ? "translateX(20px)" : "none" }}></span>
                  </span>
                </label>
              </div>
            </div>

            {/* PAYMENT DETAILS AND VISUAL CREDIT CARD PREVIEW */}
            <div style={styles.settingsSection}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionAccent}></div>
                <h3 style={styles.sectionHeaderH3}>Create Your Card / Payment Information</h3>
              </div>

              {/* LIVE SYNCED CREDIT CARD PREVIEW */}
              {}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
                <div style={styles.creditCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 700, fontSize: "20px", letterSpacing: "0.5px" }}>Affilora</span>
                    <div style={{ width: "38px", height: "28px", background: "linear-gradient(135deg, #ecc844 0%, #c69f1b 100%)", borderRadius: "6px" }}><img src="/Affilora main logo.jpeg" alt="Main logo" style={styles.logoImg} /></div>
                  </div>
                  <div style={{ fontSize: "20px", letterSpacing: "2px", marginTop: "10px", fontWeight: 500 }}>
                    {maskCardNumber(inputCardNum || savedCardNum)}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <div style={{ fontSize: "8px", textTransform: "uppercase", color: "#a3bda0", marginBottom: "2px", letterSpacing: "0.5px" }}>Card Holder</div>
                      <div style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        {inputCardHolder || savedCardHolder}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "8px", textTransform: "uppercase", color: "#a3bda0", marginBottom: "2px", letterSpacing: "0.5px" }}>Expires</div>
                      <div style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.5px" }}>
                        {inputCardExpiry || savedCardExpiry}
                      </div>
                      <div style={{ fontStyle: "italic", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>VISA</div>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label htmlFor="card-holder" style={styles.label}>Card Holder Name</label>
                  <input
                    type="text"
                    id="card-holder"
                    value={inputCardHolder}
                    onChange={(e) => setInputCardHolder(e.target.value)}
                    style={styles.input}
                    placeholder="Affilora User"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="card-num" style={styles.label}>Card Number</label>
                  <input
                    type="text"
                    id="card-num"
                    value={inputCardNum}
                    onChange={handleCardNumChange}
                    style={styles.input}
                    placeholder="5399 xxxx xxxx 2026"
                    maxLength={19}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="card-expiry" style={styles.label}>Expiry Date (MM/YY)</label>
                  <input
                    type="text"
                    id="card-expiry"
                    value={inputCardExpiry}
                    onChange={handleExpiryChange}
                    onKeyDown={handleExpiryKeyDown}
                    style={styles.input}
                    placeholder="12/28"
                    maxLength={5}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="bank-name" style={styles.label}>Bank Name</label>
                  <select
                    id="bank-name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    style={styles.input}
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="acc-num" style={styles.label}>Account Number</label>
                  <input
                    type="text"
                    id="acc-num"
                    value={accNum}
                    onChange={(e) => setAccNum(e.target.value)}
                    style={styles.input}
                    placeholder="0123456789"
                    maxLength={10}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label htmlFor="acc-name" style={styles.label}>Account Name</label>
                  <input
                    type="text"
                    id="acc-name"
                    value={accName}
                    onChange={(e) => setAccName(e.target.value)}
                    style={styles.input}
                    placeholder="Name on Account"
                  />
                </div>
                <div style={styles.formGroupFullWidth}>
                  <label htmlFor="currency" style={styles.label}>Preferred Currency</label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    style={styles.input}
                  >
                    <option value="NGN">NGN (Nigerian Naira)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button 
                type="submit" 
                style={styles.btnSave}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#41533d"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#556b50"}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}