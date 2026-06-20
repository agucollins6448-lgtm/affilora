import { useState, useEffect } from "react";
import API from "../api";
import socket from "../socket";
export default function Referrals({ setView, onLogout }) {

const [userStats, setUserStats] =useState({
  referralsThisWeek: 0
})


const referralCode =
  userStats?.referralCode;

  const referralLink =
  `${window.location.origin}/signup?ref=${referralCode}`;
  const [copyStatus, setCopyStatus] = useState("Copy Link");
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);


const unreadCount =
notifications.filter(
  n => !n.read
).length;

  // Handles modern Clipboard Web API implementation safely
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopyStatus("Copied! ✓");
      setTimeout(() => setCopyStatus("Copy Link"), 2500);
    } catch {
      setCopyStatus("Failed to copy");
    }
  };

  const fetchUserStats = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) return;

    setUserStats(data);

  } catch (err) {

    console.log(err);

  }

};
  
const fetchReferrals = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/auth/my-referrals",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      
      if (!res.ok) {
        console.log(data.message);
        return;
      }

      setReferrals(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

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

useEffect(() => {

  fetchUserStats();
  fetchReferrals();
  fetchNotifications();

}, []);

useEffect(() => {

  socket.on(
    "userUpdated",
    fetchUserStats
  );

  socket.on(
    "referralUpdated",
    fetchReferrals
  );

  socket.on(
    "notificationUpdated",
    fetchNotifications
  );

  return () => {

    socket.off(
      "userUpdated",
      fetchUserStats
    );

    socket.off(
      "referralUpdated",
      fetchReferrals
    );

    socket.off(
      "notificationUpdated",
      fetchNotifications
    );

  };

}, []);


const totalReferrals =
  referrals.length;

const activeReferrals =
  referrals.filter(
    (user) => user.membershipActive
  ).length;

const totalEarnings =
  userStats?.referralEarnings || 0;

const engagementRate =
  totalReferrals === 0
    ? 0
    : Math.round(
        (activeReferrals /
          totalReferrals) *
          100
      );

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
    referralHeroCard: {
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
      gap: "24px",
      boxShadow: "0 10px 35px rgba(0,0,0,0.2)"
    },
    heroTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "2.2rem",
      fontWeight: 800,
      margin: "0 0 8px 0"
    },
    linkInputBox: {
      background: "rgba(11, 18, 32, 0.7)",
      border: "1px solid var(--border)",
      padding: "10px 10px 10px 20px",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "15px",
      maxWidth: "520px",
      marginTop: "20px"
    },
    linkInput: {
      background: "none",
      border: "none",
      outline: "none",
      color: "var(--fg)",
      fontSize: "15px",
      width: "100%",
      fontFamily: "'Inter', sans-serif",
    },
    copyBtn: {
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      border: "none",
      padding: "12px 24px",
      borderRadius: "10px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.2s ease",
      whiteSpace: "nowrap"
    },
    heroIcon: {
      fontSize: "90px",
      background: "var(--gradient-gold)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      opacity: 0.85
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
    statTitle: {
      color: "var(--muted)",
      fontSize: "15px",
      fontWeight: 500,
      margin: "0 0 10px 0"
    },
    statValue: {
      fontSize: "2.4rem",
      fontWeight: 800,
      margin: "0 0 6px 0",
      fontFamily: "'Playfair Display', serif"
    },
    trendGreen: {
      color: "var(--green-2)",
      fontWeight: 500,
      fontSize: "14px",
      margin: 0
    },
    tableCard: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "32px",
      borderRadius: "24px",
      border: "1px solid var(--border)",
      overflowX: "auto",
      marginBottom: "36px"
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
      minWidth: "600px"
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
    statusActive: {
      color: "var(--green-2)",
      fontWeight: 600
    },
    statusInactive: {
      color: "#ef4444",
      fontWeight: 600
    },
    bonusCard: {
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      padding: "40px",
      borderRadius: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "24px",
      boxShadow: "var(--shadow-glow-gold)"
    },
    bonusTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "2.2rem",
      fontWeight: 900,
      margin: "0 0 8px 0"
    },
    inviteBtn: {
      background: "#000000",
      color: "#ffffff",
      border: "none",
      padding: "16px 32px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "700",
      fontSize: "15px",
      transition: "0.3s ease"
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
            userStats?.membershipTier === "Bronze" &&
            <span><i
              className="fa-solid fa-medal"
              style={{ color: "#cd7f32" }}
            />
            <div style={styles.Bronze}>                
                {userStats?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            userStats?.membershipTier === "Silver" &&
            <span><i
              className="fa-solid fa-award"
              style={{ color: "#c0c0c0" }}
            />
            <div style={styles.Silver}>                
                {userStats?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            userStats?.membershipTier === "Gold" &&
            <span><i
              className="fa-solid fa-star"
              style={{ color: "#ffd700" }}
            />
            <div style={styles.Gold}>                
                {userStats?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            userStats?.membershipTier === "Premium" &&
            <span><i
              className="fa-solid fa-trophy"
              style={{ color: "#8b5cf6" }}
            />
            <div style={styles.Premium}>                
                {userStats?.membershipTier.toUpperCase()}                
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

          <button style={{ ...styles.menuLink, ...styles.activeMenuLink }}>
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

      {/* MAIN LAYOUT */}
      <div className="main" style={styles.mainContent}>
        
        {/* TOPBAR */}
        <div className="topbar" style={styles.topbar}>
          <div>
            <h1 style={styles.pageHeader}>Referrals</h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>Invite friends and scale your automatic residual commissions.</p>
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
    userStats?.profileImage ||
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

await fetchUserStats();

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

        {/* HERO COPY UTILITY */}
        <div className="referral-card" style={styles.referralHeroCard}>
          <div className="referral-left" style={{ flex: 1, minWidth: "280px" }}>
            <h2 style={styles.heroTitle}>Your Referral Link</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: 0 }}>Share your elite link with networkers and claim secure payouts instantly.</p>
            
            <div style={styles.linkInputBox}>
              <i className="fa-solid fa-link" style={{marginRight: "-48px"}}></i>
              <input 
                type="text" 
                value={referralLink} 
                readOnly 
                style={styles.linkInput}
              />
              <button 
                style={styles.copyBtn}
                onClick={handleCopy}
              >
                {copyStatus}
              </button>
            </div>
          </div>
          <div className="referral-icon">
            <i className="fa-solid fa-users" style={styles.heroIcon}></i>
          </div>
        </div>

        {/* METRICS STREAKS */}
        <div style={styles.statsGrid}>
          <div className="stat-card" style={styles.statCard}>
            <h3 style={styles.statTitle}>Total Referrals</h3>
            <h1 style={styles.statValue}>{totalReferrals}</h1>
            <p style={styles.trendGreen}>+{userStats?.referralsThisWeek} registered this week</p>
          </div>

          <div className="stat-card" style={styles.statCard}>
            <h3 style={styles.statTitle}>Active Referrals</h3>
            <h1 style={styles.statValue}>{activeReferrals}</h1>
            <p style={styles.trendGreen}>{engagementRate}% engagement index</p>
          </div>

          <div className="stat-card" style={styles.statCard}>
            <h3 style={styles.statTitle}>Total Earnings</h3>
            <h1 style={styles.statValue}>₦{totalEarnings.toLocaleString()}</h1>
            <p style={styles.trendGreen}>Total commissions</p>
          </div>
        </div>

        {/* RECENT REFERRAL DATA NETWORK */}
        <div className="table-card" style={styles.tableCard}>
          <h2 style={styles.tableTitle}>Recent Team Enrollments</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Date Joined</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Earned Reward</th>
              </tr>
            </thead>
            <tbody>

  {loading ? (

    <tr>
      <td
        colSpan="4"
        style={styles.td}
      >
        Loading...
      </td>
    </tr>

  ) : referrals.length === 0 ? (

    <tr>
      <td
        colSpan="4"
        style={styles.td}
      >
        No referrals yet
      </td>
    </tr>

  ) : (

    referrals.map((user) => (

      <tr key={user._id}>

        <td style={styles.td}>
          {user.fullName}
        </td>

        <td style={styles.td}>
          {new Date(
            user.createdAt
          ).toLocaleDateString()}
        </td>

        <td
          style={{
            ...styles.td,
            ...(user.membershipActive
              ? styles.statusActive
              : styles.statusInactive)
          }}
        >
          {user.membershipActive
            ? "Active"
            : "Inactive"}
        </td>

        <td
          style={{
            ...styles.td,
            fontWeight: 600,
            color: "var(--green-2)"
          }}
        >
          +₦{(1500).toLocaleString()}
        </td>

      </tr>

    ))

  )}

</tbody>
          </table>
        </div>

        {/* INVITATION PROMO BANNER */}
        <div className="bonus-card" style={styles.bonusCard}>
          <div>
            <h2 style={styles.bonusTitle}>Earn ₦1,500 Per Referral</h2>
            <p style={{ margin: 0, fontSize: "1rem" }}>Expand your operations line, invite dynamic friends, and clear high rewards daily.</p>
          </div>
          <button 
            style={styles.inviteBtn}
            onClick={async () => {

  if (navigator.share) {

    try {

      await navigator.share({
        title: "Join Affilora",
        text: "Join Affilora using my referral link",
        url: referralLink
      });

    } catch (error) {

      console.log(error);

    }

  } else {

    handleCopy();
    alert("Referral link copied");

  }

}}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
          >
            Invite Friends Fast
          </button>
        </div>

      </div>
    </div>
  );
}