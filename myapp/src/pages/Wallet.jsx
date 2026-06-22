import API from "../api";
import {useEffect,useState } from "react";
import socket from "../socket";

export default function Wallet({ setView, onLogout }) {

  const [walletData, setWalletData] = useState({
  walletBalance: 0,
  totalEarned: 0,
  totalWithdrawals: 0,
  referralEarnings: 0,
  taskRevenue: 0,
  transactions: []
});

const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);

const unreadCount =
notifications.filter(
  n => !n.read
).length;

const downloadReceipt = (id) => {
  const token = localStorage.getItem("token");

  window.open(
    `http://localhost:5000/api/withdrawals/receipt/${id}?token=${token}`,
    "_blank"
  );
};

const withdrawalRules = {

  Starter: {
    minBalance: 5000,
    maxPerWithdrawal: 1500
  },

  Bronze: {
    minBalance: 7500,
    maxPerWithdrawal: 4500
  },

  Silver: {
    minBalance: 10000,
    maxPerWithdrawal: 5500
  },

  Gold: {
    minBalance: 12500,
    maxPerWithdrawal: 6500
  },

  Premium: {
    minBalance: 15000,
    maxPerWithdrawal: 10000
  }

};

const currentRule =
  withdrawalRules[
    walletData.membershipTier || "Starter"
  ];

  const today = new Date();

const dayOfMonth =
  today.getDate();
  
const withdrawalsOpen =
  (dayOfMonth >= 8 &&
   dayOfMonth <= 14) ||

  (dayOfMonth >= 22);

const eligibleToWithdraw =
  walletData.walletBalance >=
  (currentRule?.minBalance || 0);



  const isFirstWithdrawal =
  walletData.totalWithdrawals === 0;

let minWithdrawal;
let maxWithdrawal;
let minWithdrawalAmount;

if (isFirstWithdrawal) {

  minWithdrawal = 15000;
  minWithdrawalAmount = 1500;
  maxWithdrawal = 15000;

} else {

  switch (walletData.membershipTier) {

    case "Bronze":
      minWithdrawal = 7500;
      minWithdrawalAmount = 1500;
      maxWithdrawal = 4500;
      break;

    case "Silver":
      minWithdrawal = 10000;
      minWithdrawalAmount = 1500;
      maxWithdrawal = 5500;
      break;

    case "Gold":
      minWithdrawal = 12500;
      minWithdrawalAmount = 1500;
      maxWithdrawal = 6500;
      break;

    case "Premium":
      minWithdrawal = 15000;
      minWithdrawalAmount = 1500;
      maxWithdrawal = 10000;
      break;

    default:
      minWithdrawal = 5000;
      minWithdrawalAmount = 1500;
      maxWithdrawal = 1500;
  }

}

    const fetchNotifications =
  async () => {
  
    try {
  
      const token =
        localStorage.getItem("token");
  
      const res = await API.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  
      setNotifications(
        res.data
      );
  
    } catch (error) {
  
      console.log(error);
  
    }
  
  };

const fetchWallet = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const res =
      await API.get(
        "/auth/me",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    setWalletData(res.data);

  } catch (err) {

    console.log(err);

  }

};

useEffect(() => {

  fetchWallet();
  fetchNotifications();

}, []);

useEffect(() => {

  socket.on(
    "userUpdated",
    fetchWallet
  );

    socket.on(
    "withdrawalUpdated",
    fetchWallet
  );

  socket.on(
    "notificationUpdated",
    fetchNotifications
  );

  return () => {

    socket.off(
      "userUpdated",
      fetchWallet
    );

    socket.off(
      "withdrawalUpdated",
      fetchWallet
    );

    socket.off(
      "notificationUpdated",
      fetchNotifications
    );

  };

}, []);

  // PREMIUM INLINE THEME STYLES
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
      minHeight: "100vh"
    },
    topbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "36px"
    },
    pageHeader: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "2rem",
      fontWeight: 800,
      lineHeight: 1.1,
      margin: "0 0 5px 0"
    },
    balanceCard: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "40px",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      marginBottom: "36px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "24px",
      boxShadow: "0 10px 35px rgba(0,0,0,0.2)"
    },
    balanceTitle: {
      color: "var(--muted)",
      marginBottom: "10px",
      fontSize: "1.1rem",
      fontWeight: 500
    },
    balanceValue: {
      fontSize: "3.2rem",
      fontWeight: 900,
      margin: "0 0 8px 0",
      fontFamily: "'Playfair Display', serif"
    },
    withdrawBtn: {
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      border: "none",
      padding: "16px 36px",
      borderRadius: "14px",
      fontWeight: "700",
      fontSize: "16px",
      cursor: "pointer",
      transition: "0.2s ease",
      boxShadow: "var(--shadow-glow-gold)"
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "24px",
      marginBottom: "36px"
    },
    statCard: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "28px",
      borderRadius: "20px",
      border: "1px solid var(--border)"
    },
    statIcon: {
      fontSize: "24px",
      background: "var(--gradient-gold)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      marginBottom: "15px",
      display: "block"
    },
    statTitle: {
      color: "var(--muted)",
      fontSize: "15px",
      fontWeight: 500,
      margin: "0 0 10px 0"
    },
    statValue: {
      fontSize: "2.2rem",
      fontWeight: 800,
      margin: "0",
      fontFamily: "'Playfair Display', serif"
    },
    tableCard: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "32px",
      borderRadius: "24px",
      border: "1px solid var(--border)",
      overflowX: "auto"
    },
    tableTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "1.5rem",
      fontWeight: 700,
      marginBottom: "24px",
      margin: 0
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "700px"
    },
    th: {
      textAlign: "left",
      padding: "16px",
      color: "var(--muted)",
      fontWeight: 500,
      fontSize: "14px",
      borderBottom: "1px solid rgba(255,255,255,0.08)"
    },
    td: {
      padding: "18px 16px",
      fontSize: "15px",
      borderBottom: "1px solid var(--border)"
    },
    greenText: {
      color: "var(--green-2)",
      fontWeight: 600
    },
    redText: {
      color: "#ef4444",
      fontWeight: 600
    },
    admText: {
      color: "var(--muted)",
      fontWeight: 600
    },
    statusBadge: {
      background: "rgba(34, 197, 94, 0.12)",
      color: "var(--green-2)",
      padding: "6px 14px",
      borderRadius: "30px",
      fontSize: "13px",
      fontWeight: "600",
      display: "inline-block"
    },
    logoImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
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
    },
    withdrawalInfoCard: {
    background: "var(--gradient-card)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    padding: "28px",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    marginBottom: "30px"
    }
  };

  return (
    <div style={styles.wrapper}>
      
      {/* SIDEBAR */}
      <div className="sidebar" style={styles.sidebar}>
        <div className="logo" style={styles.logo}>
          <div className="logo-box" style={styles.logoBox}>
            <img src="Affilora main logo.jpeg" alt="Main logo" style={styles.logoImg} />
          </div>
          <div className="logo-text">
            <h2 style={styles.logoTextH2}>Affilora</h2>
            <p style={styles.logoTextP}>DASHBOARD</p>
            <p style={styles.logoTextP}>
            
          {
            walletData?.membershipTier === "Bronze" &&
            <span><i
              className="fa-solid fa-medal"
              style={{ color: "#cd7f32" }}
            />
            <div style={styles.Bronze}>                
                {walletData?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            walletData?.membershipTier === "Silver" &&
            <span><i
              className="fa-solid fa-award"
              style={{ color: "#c0c0c0" }}
            />
            <div style={styles.Silver}>                
                {walletData?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            walletData?.membershipTier === "Gold" &&
            <span><i
              className="fa-solid fa-star"
              style={{ color: "#ffd700" }}
            />
            <div style={styles.Gold}>                
                {walletData?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            walletData?.membershipTier === "Premium" &&
            <span><i
              className="fa-solid fa-trophy"
              style={{ color: "#8b5cf6" }}
            />
            <div style={styles.Premium}>                
                {walletData?.membershipTier.toUpperCase()}                
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

          <button style={{ ...styles.menuLink, ...styles.activeMenuLink }}>
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

          <button style={{ ...styles.menuLink}} onClick={() => setView("settings")}>
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </button>

          <button style={{ ...styles.menuLink, marginTop: "20px", color: "#f87171" }} onClick={onLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT REGION */}
      <div className="main" style={styles.mainContent}>
        
        {/* TOPBAR */}
        <div className="topbar" style={styles.topbar}>
          <div>
            <h1 style={styles.pageHeader}>Wallet Operations</h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>Manage your liquid balance and automated commission statements.</p>
          </div>

          <div
  className="profile"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "20px"
  }}
>
  <div
style={{
  position: "relative",
  cursor: "pointer"
}}

>

  <i
    className="fa-solid fa-bell"
    style={{
      fontSize: "20px",
      color: "var(--muted)"
    }}
onClick={ async () => {
  setShowNotifications(prev => !prev);


await API.put(
"/notifications/read",
{},
{
headers:{
Authorization:
`Bearer ${
localStorage.getItem(
"token"
)}`
}
}
);

fetchNotifications();

}}
  />

  {unreadCount > 0 && (

    <span
      style={{
        position: "absolute",
        top: "-8px",
        right: "-8px",
        background: "red",
        color: "white",
        borderRadius: "50%",
        width: "18px",
        height: "18px",
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {unreadCount}
    </span>

  )}

</div>


{showNotifications && (

<div
style={{
position: "absolute",
top: "60px",
right: "0",
width: "320px",
background: "#111827",
borderRadius: "12px",
padding: "15px",
zIndex: 999,
maxHeight: "400px",
overflowY: "auto",
boxShadow:
"0 5px 20px rgba(0,0,0,0.4)",


}}
>
<h3>
Notifications

<button
style={{
    background: "none",
    border: "none",
    color: "white",
    fontSize: "18px",
    cursor: "pointer",
    float: "right"
}}
onClick={() =>
  setShowNotifications(false)
}
>
✕
</button>

</h3>








{notifications.length === 0 ? (

<p>
No notifications
</p>

) : (

notifications.map((n) => (

<div
key={n._id}
style={{
padding: "10px",
marginBottom: "10px",
borderBottom:
"1px solid rgba(255,255,255,.1)"
}}
>

<h4>
{n.title}
</h4>

<p>
{n.message}
</p>

<small>
{new Date(
n.createdAt
).toLocaleString()}
</small>

</div>

))

)}
</div>

)}

  {/* PROFILE IMAGE AREA */}
  <div
    style={{
      position: "relative",
      width: "45px",
      height: "45px"
    }}
  >
<img
  src={
    walletData?.profileImage ||
    "https://i.pravatar.cc/100"
  }
  alt="Avatar"
      style={{
        width: "45px",
        height: "45px",
        borderRadius: "50%",
        border: "2px solid var(--border)",
        objectFit: "cover"
      }}
    />

    {/* HIDDEN FILE INPUT */}
    <input
      type="file"
      id="profileUpload"
      accept="image/*"
      style={{
        display: "none"
      }}
      onChange={async (e) => {

        try {

          const file =
            e.target.files[0];

          if (!file) return;

          const formData =
            new FormData();

          formData.append(
            "image",
            file
          );

          const token =
            localStorage.getItem(
              "token"
            );

          const res =
            await fetch(

              "http://localhost:5000/api/auth/upload-profile",

              {

                method: "PUT",

                headers: {

                  Authorization:
                    `Bearer ${token}`

                },

                body: formData

              }

            );

          const data =
            await res.json();

          if (!res.ok) {

            alert(
              data.message
            );

            return;

          }
await fetchWallet();

        } catch (error) {

          console.log(error);

          alert(
            "Upload failed"
          );

        }

      }}
    />

    {/* CAMERA BUTTON */}
    <label
      htmlFor="profileUpload"
      style={{
        position: "absolute",
        bottom: "-4px",
        right: "-4px",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: "var(--gradient-gold)",
        color: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "10px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.3)"
      }}
    >
      <i className="fa-solid fa-camera"></i>
    </label>
  </div>
</div>
        </div>

        {/* BALANCE DISPLAY CARD */}
        <div className="balance-card" style={styles.balanceCard}>
          <div className="balance-left">
            <h3 style={styles.balanceTitle}>Available Liquidity</h3>
            <h1 style={styles.balanceValue}>₦{walletData.walletBalance?.toLocaleString()}</h1>
            <p
  style={{
    color:
      withdrawalsOpen &&
      eligibleToWithdraw
        ? "var(--green-2)"
        : "#ef4444",
    fontWeight: 600,
    margin: 0,
    fontSize: "14px"
  }}
>
✓ Minimum wallet balance: ₦{minWithdrawal.toLocaleString()}
<br />
✓ Minimum withdrawal amount: ₦{minWithdrawalAmount.toLocaleString()}
<br />
✓ Maximum per withdrawal: ₦{maxWithdrawal.toLocaleString()}
</p>
          </div>

          <div className="wallet-buttons">
            <button
  disabled={!withdrawalsOpen}
  className="btn withdraw"
  style={{
    ...styles.withdrawBtn,
    opacity:
      withdrawalsOpen ? 1 : 0.5,
    cursor:
      withdrawalsOpen
        ? "pointer"
        : "not-allowed"
  }}
  onMouseEnter={(e) => {
    if (withdrawalsOpen) {
      e.currentTarget.style.transform =
        "translateY(-2px)";
    }
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "none";
  }}
  onClick={async () => {

      if(!eligibleToWithdraw){
    alert("Requirements not met");
    return;
  } 

      if (walletData.alreadyWithdrawnThisPeriod) {

    alert(
      "You can only make one withdrawal during the withdrawal week."
    );

    return;
  }


    const amount = prompt(
      "Enter amount to withdraw"
    );

    if (!amount) return;

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/withdrawals/request",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`
          },
          body: JSON.stringify({
            amount
          })
        }
      );

      const data =
        await res.json();

      alert(
        data.message +
        (
          data.slipNumber
            ? `\nSlip Number: ${data.slipNumber}`
            : ""
        )
      );

    } catch {

      alert(
        "Withdrawal failed"
      );

    }

  }}
>
  {
    withdrawalsOpen
      ? "Withdraw Funds"
      : "Withdrawals Closed"
  }
</button>
          </div>
        </div>


  
        {/* ANALYTICS CARD MATRIX STREAKS */}
        <div style={styles.statsGrid}>
          <div className="stat-card" style={styles.statCard}>
            <i className="fa-solid fa-money-bill-wave" style={styles.statIcon}></i>
            <h3 style={styles.statTitle}>Total Earnings</h3>
            <h1 style={styles.statValue}>₦{walletData.totalEarned?.toLocaleString()}</h1>
          </div>

          <div className="stat-card" style={styles.statCard}>
            <i className="fa-solid fa-arrow-down" style={styles.statIcon}></i>
            <h3 style={styles.statTitle}>Total Withdrawals</h3>
            <h1 style={styles.statValue}>₦{walletData.totalWithdrawals?.toLocaleString()}</h1>
          </div>

          <div className="stat-card" style={styles.statCard}>
            <i className="fa-solid fa-user-plus" style={styles.statIcon}></i>
            <h3 style={styles.statTitle}>Referral Bonus</h3>
            <h1 style={styles.statValue}>₦{walletData.referralEarnings?.toLocaleString()}</h1>
          </div>

          <div className="stat-card" style={styles.statCard}>
            <i className="fa-solid fa-chart-column" style={styles.statIcon}></i>
            <h3 style={styles.statTitle}>Task Revenue</h3>
            <h1 style={styles.statValue}>₦{walletData.taskRevenue?.toLocaleString()}</h1>
          </div>
        </div>

        {/* HISTORICAL TRANSCRIPTS TABLE */}
        <div className="table-card" style={styles.tableCard}>
          <h2 style={styles.tableTitle}>Recent Ledger Transactions</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {walletData.transactions?.map(
  (tx, index) => (

    <tr key={index}>

      <td style={styles.td}>
        {tx.type}
      </td>

      <td style={styles.td}>
        {tx.description}
      </td>

      <td
        style={{
          ...styles.td,
          ...(tx.type === "withdrawal" 
            ? styles.redText
            : tx.type === "admin"
            ? styles.admText
            : styles.greenText)
        }}
      >
        {tx.type === "withdrawal" 
          ? "-"
          : tx.type === "admin"
          ? ""
          : "+"}
        ₦{tx.amount}
      </td>

      <td style={styles.td}>
        {new Date(
          tx.createdAt
        ).toLocaleDateString()}
      </td>

      <td style={styles.td}>
        <span
  style={{
    ...styles.statusBadge,
    background:
      tx.status === "pending"
        ? "rgba(251,191,36,.15)"
        : tx.status === "rejected"
        ? "rgba(239,68,68,.15)"
        : "rgba(34,197,94,.15)",

    color:
      tx.status === "pending"
        ? "#fbbf24"
        : tx.status === "rejected"
        ? "#ef4444"
        : "var(--green-2)"
  }}
>
  {tx.status}
</span>
      </td>

<td style={styles.td}>

  {tx.type === "withdrawal" &&
  tx.status === "success" &&
    tx.withdrawalId && (

    <button
    style={styles.withdrawBtn}
      onClick={() =>
        downloadReceipt(
          tx.withdrawalId
        )
      }
    >
      Receipt
    </button>

   )}

</td>
    </tr>

  )
)}
            </tbody>
          </table>
          
        </div>
<button
    disabled={!withdrawalsOpen}
    style={{...styles.withdrawBtn,marginTop: "15px", float: "right", opacity: withdrawalsOpen ? 1 : 0.5, cursor: withdrawalsOpen ? "pointer" : "not-allowed"}}
  onClick={async () => {

    const token =
      localStorage.getItem("token");

    const res =
      await API.get(
        "http://localhost:5000/api/transactions/export",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          },
          responseType: "blob"
        }
      );

    const url =
      window.URL.createObjectURL(
        new Blob([res.data])
      );

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "Affilora-Transactions.pdf"
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  }}
    onMouseEnter={(e) => {
    if (withdrawalsOpen) {
      e.currentTarget.style.transform =
        "translateY(-2px)";
    }
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform =
      "none";
  }}
>
  Download PDF Statement
</button>
      </div>
    </div>
  );
}