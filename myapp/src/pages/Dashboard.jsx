import API from "../api";
import { useEffect, useState } from "react";
import socket from "../socket";


export default function Dashboard({ setView, onLogout }) {
  // Use state to fetch real data from localStorage
 const [userData, setUserData] = useState({
  fullName: "Member",
  totalEarned: 0,
  walletBalance: 0,
  tasksCompleted: 0,
  referralsCount: 0,
  profileImage: ""
});

const [notifications, setNotifications] = useState([]);

const [showNotifications, setShowNotifications] = useState(false);


const currentUser = JSON.parse(
  localStorage.getItem("currentUser") || "null"
);

const unreadCount =
notifications.filter(
  n => !n.read
).length;

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
  "/auth/me",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
      setUserData(res.data);
    } catch (err) {
      console.log(err);
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

  fetchUser();
  fetchNotifications();

}, []);

useEffect(() => {

  socket.on(
    "userUpdated",
    fetchUser
  );

  socket.on(
    "withdrawalUpdated",
    fetchUser
  );

  socket.on(
    "membershipUpdated",
    fetchUser
  );

  socket.on(
    "notificationUpdated",
    fetchNotifications
  );

  return () => {

    socket.off(
      "userUpdated",
      fetchUser
    );

    socket.off(
      "withdrawalUpdated",
      fetchUser
    );

    socket.off(
      "membershipUpdated",
      fetchUser
    );

    socket.off(
      "notificationUpdated",
      fetchNotifications
    );

  };

}, []);

  // Load persistent user data when component mounts
 useEffect(() => {

  const currentUser = JSON.parse(
  localStorage.getItem("currentUser") || "null"
);

  if (currentUser) {

    try {

      const parsedUser = currentUser;

      setUserData(prev => ({

        ...prev,

        fullName:
          parsedUser.fullName || "Member",

        profileImage:
          parsedUser.profileImage || ""

      }));

    } catch (err) {

      console.log(
        "Error loading user"
      );

    }

  }

}, []);
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
    welcomeHeader: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "2rem",
      fontWeight: 800,
      lineHeight: 1.1,
      margin: "0 0 5px 0"
    },
    inviteBtn: {
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      padding: "14px 24px",
      border: "none",
      borderRadius: "12px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "36px",
      boxShadow: "var(--shadow-glow-gold)",
      transition: "transform .2s ease, box-shadow .2s ease",
      fontFamily: "'Inter', sans-serif",
      display: "inline-flex",
      alignItems: "center",
      gap: "8px"
    },
    cardsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "24px",
      marginBottom: "36px"
    },
    card: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "28px",
      borderRadius: "var(--radius)",
      border: "1px solid var(--border)",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      transition: "transform .4s ease, box-shadow .4s ease"
    },
    cardTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px"
    },
    cardTitle: {
      color: "var(--muted)",
      fontSize: "15px",
      fontWeight: 500,
      margin: 0
    },
    cardIcon: {
      fontSize: "22px",
      color: "var(--gold)"
    },
    cardValue: {
      fontSize: "2rem",
      fontWeight: 800,
      margin: "10px 0",
      fontFamily: "'Playfair Display', serif"
    },
    cardTrend: {
      color: "var(--green-2)",
      fontSize: "14px",
      fontWeight: 500,
      margin: 0
    },
    chartSection: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderRadius: "20px",
      padding: "28px",
      marginBottom: "36px",
      border: "1px solid var(--border)"
    },
    chartHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px"
    },
    chartTitle: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "1.5rem",
      fontWeight: 700,
      margin: 0
    },
    chartGrowth: {
      color: "var(--green-2)",
      fontWeight: 600,
      margin: 0
    },
    chartContainer: {
      display: "flex",
      alignItems: "flex-end",
      gap: "16px",
      height: "250px",
      paddingTop: "20px"
    },
    bar: {
      flex: 1,
      background: "var(--gradient-gold)",
      borderRadius: "10px 10px 0 0",
      position: "relative",
      boxShadow: "0 4px 15px rgba(245,196,81,0.15)"
    },
    barLabel: {
      position: "absolute",
      bottom: "-30px",
      left: "50%",
      transform: "translateX(-50%)",
      color: "var(--muted)",
      fontSize: "13px"
    },
    activitySection: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "28px",
      borderRadius: "20px",
      border: "1px solid var(--border)"
    },
    activityTitle: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "1.5rem",
      fontWeight: 700,
      marginBottom: "24px",
      margin: 0
    },
    activityItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 0",
      borderBottom: "1px solid var(--border)"
    },
    activityLeft: {
      display: "flex",
      alignItems: "center",
      gap: "16px"
    },
    activityIcon: {
      width: "45px",
      height: "45px",
      borderRadius: "12px",
      background: "rgba(11, 18, 32, 0.6)",
      border: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--gold)"
    },
    activityHeadline: {
      fontSize: "15px",
      fontWeight: 600,
      margin: "0 0 4px 0"
    },
    activityTime: {
      color: "var(--muted)",
      fontSize: "13px",
      margin: 0
    },
    amountPositive: {
      color: "var(--green-2)",
      fontWeight: 600,
      fontSize: "1.05rem"
    },
    amountNegative: {
      color: "#f87171",
      fontWeight: 600,
      fontSize: "1.05rem"
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
            userData?.membershipTier === "Bronze" &&
            <span><i
              className="fa-solid fa-medal"
              style={{ color: "#cd7f32" }}
            />
            <div style={styles.Bronze}>                
                {userData?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            userData?.membershipTier === "Silver" &&
            <span><i
              className="fa-solid fa-award"
              style={{ color: "#c0c0c0" }}
            />
            <div style={styles.Silver}>                
                {userData?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            userData?.membershipTier === "Gold" &&
            <span><i
              className="fa-solid fa-star"
              style={{ color: "#ffd700" }}
            />
            <div style={styles.Gold}>                
                {userData?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            userData?.membershipTier === "Premium" &&
            <span><i
              className="fa-solid fa-trophy"
              style={{ color: "#8b5cf6" }}
            />
            <div style={styles.Premium}>                
                {userData?.membershipTier.toUpperCase()}                
              </div></span>
          }</p>
          </div>
        </div>

        <div className="menu" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button style={{ ...styles.menuLink, ...styles.activeMenuLink }}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Overview</span>
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
          <div className="welcome">
            <h1 style={styles.welcomeHeader}>
              Welcome, <span className="text-gold" style={{ background: "var(--gradient-gold)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{userData?.fullName ? userData.fullName.split(" ")[0] : "Member"}</span>
            </h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>Track your earnings and referrals easily.</p>
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
    localStorage.getItem(
  `profileImage_${currentUser?._id}`
)
      ? `http://localhost:5000/uploads/${localStorage.getItem(
  `profileImage_${currentUser?._id}`
)}`
      : "https://i.pravatar.cc/100"
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

          localStorage.setItem(
  `profileImage_${currentUser?._id}`,
  data.image
);

          window.location.reload();

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

        {/* PROMOTIONAL EARNING CALL TO ACTION */}
        <button className="invite-btn" style={styles.inviteBtn} onClick={() => setView("referrals")}>
          <i className="fa-solid fa-user-plus"></i> Invite & Earn ₦1500
        </button>

        {/* METRICS DASHBOARD CARDS */}
        <div className="cards" style={styles.cardsGrid}>
          <div className="card" style={styles.card}>
            <div style={styles.cardTop}>
              <h3 style={styles.cardTitle}>Total Earned</h3>
              <i className="fa-solid fa-money-bill-trend-up" style={styles.cardIcon}></i>
            </div>
            <h1 style={styles.cardValue}>₦{userData.totalEarned || 0}</h1>
            <p style={styles.cardTrend}>+₦{userData.todayEarnings || 0} today</p>
          </div>
          <div className="card" style={styles.card}>
            <div style={styles.cardTop}>
              <h3 style={styles.cardTitle}>Wallet Balance</h3>
              <i className="fa-solid fa-wallet" style={styles.cardIcon}></i>
            </div>
            <h1 style={styles.cardValue}>₦{userData.walletBalance || 0}</h1>
            <p style={{ ...styles.cardTrend, color: "var(--muted)" }}>Funds Available</p>
          </div>
          <div className="card" style={styles.card}>
            <div style={styles.cardTop}>
              <h3 style={styles.cardTitle}>Tasks Completed</h3>
              <i className="fa-solid fa-list-check" style={styles.cardIcon}></i>
            </div>
            <h1 style={styles.cardValue}>{userData.tasksCompleted || 0}</h1>
            <p style={styles.cardTrend}>+{userData.tasksToday || 0} completed today</p>
          </div>
          <div className="card" style={styles.card}>
            <div style={styles.cardTop}>
              <h3 style={styles.cardTitle}>Referrals</h3>
              <i className="fa-solid fa-user-group" style={styles.cardIcon}></i>
            </div>
            <h1 style={styles.cardValue}>{userData.referralsCount || 0}</h1>
            <p style={styles.cardTrend}>+{userData.referralsThisWeek || 0} this week</p>
          </div>
        </div>

        {/* ANALYTICS CHART BLOCK */}
<div
  className="chart-section"
  style={styles.chartSection}
>
  <div style={styles.chartHeader}>
    <h2 style={styles.chartTitle}>
      Earnings (Last 7 Days)
    </h2>

    <p style={styles.chartGrowth}>
      Live Earnings
    </p>
  </div>

  <div style={styles.chartContainer}>

    {userData.earningsHistory?.map(
      (item, index) => (

        <div
          key={index}
          style={{
            ...styles.bar,
            height: `${Math.max(item.amount / 10, 40)}px`
          }}
        >

          <span style={styles.barLabel}>
            {item.date?.slice(5)}
          </span>

        </div>

      )
    )}

  </div>
</div>

        {/* LEDGER / TRANSACTION ACTIVITY */}
        <div className="activity" style={styles.activitySection}>
          <h2 style={styles.activityTitle}>Recent Activity</h2>

         {userData.recentActivity?.map(
  (item, index) => (

    <div
      key={index}
      style={styles.activityItem}
    >

      <div style={styles.activityLeft}>

        <div style={styles.activityIcon}>
          <i className="fa-solid fa-clock"></i>
        </div>

        <div>
          <h4 style={styles.activityHeadline}>
            {item.text}
          </h4>

          <p style={styles.activityTime}>
  {new Date(item.createdAt).toLocaleString()}
</p>
        </div>

      </div>

      <div
        style={
          item.type === "positive"
            ? styles.amountPositive
            : styles.amountNegative
        }
      >
        {item.type === "positive"
          ? "+"
          : "-"}
        ₦{item.amount}
      </div>

    </div>

  )
)}
</div>
        </div>
      </div>
    
  );
}