import API from "../api";
import { useEffect, useState } from "react";
import socket from "../socket";

export default function Tasks({ setView,onLogout }) {
const currentUser = JSON.parse(
  localStorage.getItem("currentUser") || "null"
);

const openSurvey = () => {
  if (!currentUser) return alert("User not found");
  
  if (surveysToday >= 2) {

  alert(
    "Daily survey limit reached"
  );

  return;

}

  const url = `https://offers.cpx-research.com/index.php?app_id=33265&ext_user_id=${currentUser._id}&username=${encodeURIComponent(currentUser.username)}&email=${encodeURIComponent(currentUser.email)}&subid1=${currentUser._id}`;

  window.open(url, "_blank");
};
const [walletData, setWalletData] =
  useState({});

const [stats, setStats] = useState({
  completed: 0,
  pending: 0
});

const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);

const unreadCount =
notifications.filter(
  n => !n.read
).length;

const [tasks, setTasks] = useState([]);

const [showAd, setShowAd] =
  useState(false);

const [countdown, setCountdown] =
  useState(15);

const today = new Date().toDateString();

const tierBenefits = {
  Starter: {
    reward: 40
  },

  Bronze: {
    reward: 80
  },

  Silver: {
    reward: 120
  },

  Gold: {
    reward: 160
  },

  Premium: {
    reward: 220
  }
};

const surveyRewards = {
  Starter: 50,
  Bronze: 100,
  Silver: 150,
  Gold: 200,
  Premium: 250
};

const currentSurveyReward =
  surveyRewards[
    walletData?.membershipTier || "Starter"
  ];

const surveysToday =
  tasks.filter(task => {

    const taskDate =
      new Date(task.createdAt);

    const today =
      new Date();

    return (
      task.type === "survey" &&
      taskDate.toDateString() ===
      today.toDateString()
    );

  }).length;

const currentTier =
  walletData?.membershipTier || "Starter";

const benefits =
  tierBenefits[currentTier];

const completedToday = tasks.filter(task =>
  task.status === "completed" &&
  new Date(task.createdAt).toDateString() === today
).length;


const watchAd = async () => {

  try {

    const todayAds =
      tasks.filter(task => {

        const taskDate =
          new Date(task.createdAt);

        const today = new Date();

tasks.filter(t =>
  new Date(t.createdAt).toDateString() === today.toDateString()
);

        return (

          task.type === "ads" &&

          task.status === "completed" &&

          taskDate.toDateString() ===
          today.toDateString()

        );

      });

    if (todayAds.length >= 3) {

      alert(
        "Daily ad limit reached"
      );

      return;

    }

    setShowAd(true);

    setCountdown(15);

  } catch (error) {

    console.log(error);

  }

};

const rewardAd = async () => {

  try {

    const res = await API.post(

      `/tasks/watch-ad`,

      {

        userId: currentUser._id

      }

    );

    alert(res.data.message);

    // REFRESH TASKS/STATS
    await fetchData();

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Reward failed"
    );

  } finally {

    setShowAd(false);

  }

};

const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));

      const res = await API.get(
        `/tasks/all?userId=${user._id}`
      );

      const allTasks = res.data;

      const completed = allTasks.filter(t => t.status === "completed");
      const pending = allTasks.filter(t => t.status === "pending");

      const earnings = completed.reduce((sum, t) => sum + t.reward, 0);
const token =
  localStorage.getItem("token");

const walletRes =
  await API.get(
    `/auth/me`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

setWalletData(
  walletRes.data
);
      setTasks(allTasks);
      setStats({
        completed: completed.length,
        pending: pending.length,
        earnings
      });
console.log(allTasks)
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

  fetchData();
  fetchNotifications();

}, []);

useEffect(() => {

  socket.on(
    "userUpdated",
    fetchData
  );

  socket.on(
    "notificationUpdated",
    fetchNotifications
  );

  return () => {

    socket.off(
      "userUpdated",
      fetchData
    );

    socket.off(
      "notificationUpdated",
      fetchNotifications
    );

  };

}, []);

  useEffect(() => {

  if (!showAd) return;

  if (countdown <= 0) {

    rewardAd();

    return;

  }

  const timer = setTimeout(() => {

    setCountdown(prev => prev - 1);

  }, 1000);

  return () => clearTimeout(timer);

}, [countdown, showAd]);



  // SYSTEM-WIDE INLINE STYLES MATCHING THE PREMIUM BRAND
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
    taskHero: {
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
      marginBottom: "12px",
      margin: 0
    },
    heroBtn: {
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      border: "none",
      padding: "15px 32px",
      borderRadius: "12px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
      boxShadow: "var(--shadow-glow-gold)",
      transition: "0.3s ease",
      fontFamily: "'Inter', sans-serif"
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
    statIcon: {
      fontSize: "26px",
      color: "var(--gold)",
      marginBottom: "15px"
    },
    statTitle: {
      color: "var(--muted)",
      fontSize: "15px",
      fontWeight: 500,
      margin: "0 0 8px 0"
    },
    statValue: {
      fontSize: "2rem",
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
    taskGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "24px",
      marginBottom: "36px"
    },
    taskCard: {
      background: "rgba(17, 24, 39, 0.45)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "28px",
      borderRadius: "24px",
      border: "1px solid var(--border)",
      transition: "transform 0.3s ease",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    taskIconWrapper: {
      width: "55px",
      height: "55px",
      background: "rgba(11, 18, 32, 0.6)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--gold)",
      fontSize: "22px",
      marginBottom: "20px"
    },
    taskTitleText: {
      fontSize: "1.25rem",
      fontWeight: 700,
      margin: "0 0 10px 0"
    },
    taskDescription: {
      color: "var(--muted)",
      fontSize: "14px",
      lineHeight: 1.6,
      margin: "0 0 20px 0"
    },
    badgeRow: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      marginBottom: "16px"
    },
    badge: {
      background: "rgba(34, 197, 94, 0.15)",
      color: "var(--green-2)",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em"
    },
    durationTag: {
      color: "var(--muted)",
      fontSize: "12px"
    },
    payoutText: {
      color: "var(--green-2)",
      fontSize: "1.35rem",
      fontWeight: 700,
      marginBottom: "20px"
    },
    startBtn: {
      width: "100%",
      background: "var(--gradient-card)",
      color: "var(--fg)",
      border: "1px solid var(--border)",
      padding: "14px",
      borderRadius: "12px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s ease"
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

          <button style={{ ...styles.menuLink, ...styles.activeMenuLink }}>
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

      {/* MAIN VIEW CONTROLLER */}
      <div className="main" style={styles.mainContent}>
        
        {/* TOPBAR PROFILE METADATA */}
        <div className="topbar" style={styles.topbar}>
          <div>
            <h1 style={styles.pageHeader}>Daily Tasks</h1>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem" }}>Complete tasks daily and earn premium rewards.</p>
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

        {/* HERO CALL TO ACTION BANNER */}
        <div className="task-hero" style={styles.taskHero}>
          <div className="task-left" style={{ maxWidth: "60%" }}>
            <h2 style={styles.heroTitle}>Daily Earning Tasks</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, marginBottom: "24px", fontSize: "0.95rem" }}>
              Complete simple tasks like watching ads, surveys, social engagement, and high-tier sponsor reviews to directly scale up your weekly revenue streams.
            </p>
            <a href="#ads" style={{ textDecoration: "none" }}>
            <button className="task-btn" style={styles.heroBtn}>
              Start Earning Fast
            </button>
            </a>
          </div>
          <div className="hero-icon">
            <i className="fa-solid fa-coins" style={styles.heroIcon}></i>
          </div>
        </div>

        {/* REVENUE STATUS SCORE CARDS */}
        <div className="stats" style={styles.statsGrid}>
          <div className="stat-card" style={styles.statCard}>
            <i className="fa-solid fa-check" style={styles.statIcon}></i>
            <h3 style={styles.statTitle}>Completed Tasks</h3>
            <h1 style={styles.statValue}>{stats.completed}</h1>
            <p style={styles.trendGreen}>+{completedToday} completed today</p>
          </div>

          <div className="stat-card" style={styles.statCard}>
  <i className="fa-solid fa-money-bill-wave" style={styles.statIcon}></i>

  <h3 style={styles.statTitle}>Earnings Overview</h3>

  <h1 style={styles.statValue}>  ₦{walletData.monthlyTaskRevenue || 0}</h1>

  <p style={styles.trendGreen}>This Month</p>

  <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--muted)" }}>
Today: ₦{walletData.todayTaskRevenue || 0}
<br />
This Week: ₦{walletData.weeklyTaskRevenue || 0}
  </div>
</div>

          <div className="stat-card" style={styles.statCard}>
            <i className="fa-solid fa-clock" style={styles.statIcon}></i>
            <h3 style={styles.statTitle}>Pending Actions</h3>
            <h1 style={styles.statValue}>{stats.pending}</h1>
            <p style={{ ...styles.trendGreen, color: "var(--gold)" }}>Available immediately</p>
          </div>
        </div>


        {/* LOGICAL ACTIVITY RUNTIME MONITOR */}

        <div style={styles.taskGrid}>

  <div style={styles.taskCard} id="ads">

    <div>

      <div style={styles.taskIconWrapper}>
        <i className="fa-solid fa-video"></i>
      </div>

      <h2 style={styles.taskTitleText}>
        Watch Sponsored Ads
      </h2>

      <div style={styles.badgeRow}>
        <span style={styles.badge}>
          ADS
        </span>

        <span style={styles.durationTag}>
          15 seconds
        </span>
      </div>

      <p style={styles.taskDescription}>
        Watch a short sponsored ad and
        earn instant rewards directly
        into your wallet.
      </p>

    </div>

    <div>

      <div style={styles.payoutText}>
        Earn ₦{benefits.reward}
      </div>

      <button
        style={{
          ...styles.startBtn,
          opacity: showAd ? 0.7 : 1
        }}
        onClick={watchAd}
      >
        Watch Ad
      </button>

    </div>

  </div>

</div>
<div style={styles.taskGrid}>

  {/* SURVEY TASK CARD */}
  <div style={styles.taskCard}>

    <div>
      <div style={styles.taskIconWrapper}>
        <i className="fa-solid fa-poll"></i>
      </div>

      <h2 style={styles.taskTitleText}>
        Complete Surveys
      </h2>

      <div style={styles.badgeRow}>
        <span style={styles.badge}>SURVEY</span>
        <span style={styles.durationTag}>10–20 mins</span>
      </div>

      <p style={styles.taskDescription}>
        Answer short partner surveys and earn instant rewards after completion.
      </p>
    </div>

    <div>
      <div style={styles.payoutText}>
        Earn ₦{currentSurveyReward}
      </div>

      <button
        style={styles.startBtn}
        onClick={openSurvey}
      >
        Start Survey
      </button>
    </div>

  </div>

</div>

      {/* DYNAMIC RECENT ACTIVITY */}
      
<div className="activity" style={styles.activitySection}>
  <h2 style={styles.activityTitle}>
    Recent Task Activity
  </h2>

  {!walletData.recentActivity?.length ? (

    <p style={{ color: "var(--muted)" }}>
      No recent activity yet.
    </p>

  ) : (

    walletData.recentActivity
      .filter(
        activity =>
          activity.text.includes("Task") ||
          activity.text.includes("Ad") ||
          activity.text.includes("Survey")
      )
      .slice(0, 5)
      .map((activity, index) => (

        <div
          key={index}
          style={styles.activityItem}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px"
            }}
          >

            <div
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "12px",
                background:
                  "rgba(11,18,32,.6)",
                border:
                  "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--gold)"
              }}
            >
              <i className="fa-solid fa-list-check"></i>
            </div>

            <div>

  <h4
    style={{
      fontSize: "15px",
      fontWeight: 600,
      margin: "0 0 4px 0"
    }}
  >
    {activity.text}
  </h4>

  <p
    style={{
      color: "var(--muted)",
      fontSize: "13px",
      margin: 0
    }}
  >
    {new Date(activity.createdAt).toLocaleString("en-GB", {
    timeZone: "Africa/Lagos"
  })}
  </p>

</div>

          </div>

          <div
            style={{
              color:
                activity.type === "negative"
                  ? "#ef4444"
                  : "var(--green-2)",
              fontWeight: 600
            }}
          >
            {activity.type === "negative"
              ? "-"
              : "+"}
            ₦{activity.amount}
          </div>

        </div>

      ))

  )}
</div>
</div>
      {showAd && (

  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}
  >

    <div
      style={{
        width: "500px",
        background: "#111827",
        padding: "20px",
        borderRadius: "20px",
        textAlign: "center"
      }}
    >

      <h2>Watch Ad</h2>

      <p>
        Reward unlocks in {countdown}s
      </p>

      <iframe
        width="100%"
        height="300"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
        title="Ad"
        allow="autoplay"
      />

      <button
        disabled={countdown > 0}
        onClick={() => setShowAd(false)}
      >
        Close
      </button>

    </div>


  </div>

)}
    </div>
  );
}