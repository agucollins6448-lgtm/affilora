import axios from "axios";
import { useEffect, useState } from "react";
import socket from "../socket";

export default function Membership({ setView, onLogout }) {

const [user, setUser] = useState(null);


  const activeTier = user?.membershipTier;

  const tierRank = {
  Starter: 0,
  Bronze: 1,
  Silver: 2,
  Gold: 3,
  Premium: 4
};

const currentRank =
  tierRank[activeTier] || 0;

  const showBronze = currentRank <= 1;
  const showSilver = currentRank <= 2;
  const showGold = currentRank <= 3;
  const showPremium = true;

  const activatePlan = async (plan) => {

  try {

    const token =
      localStorage.getItem("token");

    const res = await axios.post(

      "http://localhost:5000/api/membership-requests/create",

      { plan },

      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }

    );

    alert(res.data.message);

    if (
      plan === "Bronze" ||
      plan === "Silver"
    ) {

      window.open(
        "https://t.me/affilora55",
        "_blank"
      );

    } else {

      window.open(
        "https://t.me/affilora20",
        "_blank"
      );

    }

  } catch (err) {

    alert(
      err.response?.data?.message ||
      "Failed to submit request"
    );

  }

};

  const fetchUser = async () => {
    const token =
      localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

useEffect(() => {
  fetchUser();
}, []);

useEffect(() => {

  socket.on(
    "membershipUpdated",
    (userId) => {

      if (userId === user?._id) {
        fetchUser();
      }

    }
  );

    socket.on(
    "userUpdated",
    fetchUser
  );

      socket.on(
    "notificationUpdated",
    fetchUser
  );


  return () => {

    socket.off(
      "membershipUpdated"
    );

      socket.off(
    "userUpdated",
    fetchUser
  );

      socket.off(
    "notificationUpdated",
    fetchUser
  );

  };

}, [user]);

  // PREMIUM INLINE THEME STYLES
  const styles = {
    wrapper: {
      minHeight: "100vh",
      width: "100%",
      background: "#0f172a",
      color: "white",
      fontFamily: "'Poppins', sans-serif",
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
      color: "#94a3b8",
      fontSize: "12px",
      letterSpacing: "2px",
      margin: "2px 0 0 0"
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
      color: "black",
      fontWeight: "600"
    },
    mainContent: {
      marginLeft: "260px",
      width: "calc(100% - 260px)",
      padding: "40px 20px",
      minHeight: "100vh"
    },
    header: {
      textAlign: "center",
      marginBottom: "50px"
    },
    headerH1: {
      fontSize: "48px",
      marginBottom: "12px",
      fontWeight: 700
    },
    headerSpan: {
      color: "var(--gradient-gold)"
    },
    headerP: {
      color: "#94a3b8",
      fontSize: "16px",
      maxWidth: "700px",
      margin: "auto",
      lineHeight: "1.7"
    },
    plans: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "30px",
      maxWidth: "1200px",
      margin: "auto"
    },
    planCard: {
      background: "#1e293b",
      borderRadius: "28px",
      padding: "35px",
      position: "relative",
      transition: "0.3s",
      border: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
      flex: "1 1 350px",
      maxWidth: "500px"
    },
    planCardprem: {
      background: "#1e293b",
      borderRadius: "28px",
      padding: "35px",
      position: "relative",
      transition: "0.3s",
      border: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
      gridColumn: "1 / -1",
      width: "100%"
    },
    popular: {
      border: "2px solid #facc15"
    },
    popularTag: {
      position: "absolute",
      top: "18px",
      right: "-40px",
      background: "var(--gradient-gold)",
      color: "black",
      padding: "8px 50px",
      fontSize: "13px",
      fontWeight: "700",
      transform: "rotate(45deg)"
    },
    planIcon: {
      width: "75px",
      height: "75px",
      borderRadius: "20px",
      background: "#0f172a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--gradient-gold)",
      fontSize: "32px",
      marginBottom: "25px"
    },
    planName: {
      fontSize: "30px",
      fontWeight: "700",
      marginBottom: "10px",
      margin: "0 0 10px 0"
    },
    planPrice: {
      fontSize: "50px",
      fontWeight: "800",
      marginBottom: "10px",
      color: "var(--gradient-gold)"
    },
    planDesc: {
      color: "#94a3b8",
      lineHeight: "1.7",
      marginBottom: "30px"
    },
    features: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 35px 0"
    },
    featureLi: {
      marginBottom: "18px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      color: "#e2e8f0"
    },
    featureI: {
      color: "#22c55e"
    },
    planBtn: {
      width: "100%",
      background: "var(--gradient-gold)",
      color: "black",
      border: "none",
      padding: "18px",
      borderRadius: "18px",
      fontSize: "16px",
      fontWeight: "700",
      cursor: "pointer",
      transition: "0.3s"
    },
    gold: {
      background: "linear-gradient(180deg, #1e293b, #111827)"
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

  // Hover animations handled inline dynamically
  const cardHoverIn = (e) => {
    e.currentTarget.style.transform = "translateY(-8px)";
    e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.35)";
  };

  const cardHoverOut = (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div style={styles.wrapper}>
      
      {/* SIDEBAR */}
      <div className="sidebar" style={styles.sidebar}>
        <div className="logo" style={styles.logo}>
          <div className="logo-box" style={styles.logoBox}>
            <img src="Affilora main logo.jpeg" alt="main logo" style={styles.logoImg} />
          </div>
          <div>
            <h2 style={{...styles.logoTextH2}}>Affilora</h2>
            <p style={styles.logoTextP}>DASHBOARD</p>
            <p style={styles.logoTextP}>
            
          {
            user?.membershipTier === "Bronze" &&
            <span><i
              className="fa-solid fa-medal"
              style={{ color: "#cd7f32" }}
            />
            <div style={styles.Bronze}>                
                {user?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            user?.membershipTier === "Silver" &&
            <span><i
              className="fa-solid fa-award"
              style={{ color: "#c0c0c0" }}
            />
            <div style={styles.Silver}>                
                {user?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            user?.membershipTier === "Gold" &&
            <span><i
              className="fa-solid fa-star"
              style={{ color: "#ffd700" }}
            />
            <div style={styles.Gold}>                
                {user?.membershipTier.toUpperCase()}                
              </div></span>
          }

          {
            user?.membershipTier === "Premium" &&
            <span><i
              className="fa-solid fa-trophy"
              style={{ color: "#8b5cf6" }}
            />
            <div style={styles.Premium}>                
                {user?.membershipTier.toUpperCase()}                
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

          <button style={{ ...styles.menuLink, ...styles.activeMenuLink }}>
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

      {/* MAIN CONTAINER */}
      <div className="main" style={styles.mainContent}>
        
        {/* HEADER */}
        <div className="header" style={styles.header}>
          <h1 style={styles.headerH1}>
            Choose Your <span style={styles.headerSpan}>Membership</span>
          </h1>
          <p style={styles.headerP}>
            Upgrade your Affilora account and unlock higher earning opportunities, rewards and benefits.
          </p>
        </div>

        {/* PLANS STATICS */}
        <div className="plans" style={styles.plans}>


          
          {/* BRONZE */}
          {showBronze && (
          <div className="" style={{
    ...styles.planCard,
    ...(activeTier === "Bronze" && {
      border: "2px solid #cd7f32",
      boxShadow: "0 0 25px rgba(205,127,50,0.35)"
    })
  }} onMouseEnter={cardHoverIn} onMouseLeave={cardHoverOut}>
            <div className="plan-icon" style={styles.planIcon}>
              <i className="fa-solid fa-medal"></i>
            </div>
            <h2 className="plan-name" style={styles.planName}>Bronze</h2>
            <div className="plan-price" style={styles.planPrice}>₦25,000</div>
            <p className="plan-desc" style={styles.planDesc}>
              Perfect for beginners who want to start earning through referrals and tasks.
            </p>
            <ul className="features" style={styles.features}>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Daily tasks</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Basic support access</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Basic rewards</li>
            </ul>
            {activeTier === "Bronze" ? (
  <>
    <div
      style={{
        color: "#22c55e",
        fontWeight: "700",
        marginBottom: "10px"
      }}
    >
      ✅ Active Plan
    </div>

    <div
      style={{
        color: "#94a3b8",
        marginBottom: "15px"
      }}
    >
      Activated:
      {" "}
      {new Date(
        user.membershipActivatedAt
      ).toLocaleDateString()}
    </div>
  </>
) : (
  <button
    className="plan-btn"
    style={styles.planBtn}
    onClick={() => activatePlan("Bronze")
}
  >
    Activate Plan
  </button>
)}
          </div>
          )}
   
          {/* SILVER */}
          {showSilver && (
          <div className="popular" style={{ ...styles.planCard, ...styles.popular, ...(activeTier === "Silver" && {
  border: "2px solid #c0c0c0",
  boxShadow: "0 0 25px rgba(192,192,192,0.35)"
})}} onMouseEnter={cardHoverIn} onMouseLeave={cardHoverOut}>
            <div className="popular-tag" style={styles.popularTag}>POPULAR</div>
            <div className="plan-icon" style={styles.planIcon}>
              <i className="fa-solid fa-award"></i>
            </div>
            <h2 className="plan-name" style={styles.planName}>Silver</h2>
            <div className="plan-price" style={styles.planPrice}>₦50,000</div>
            <p className="plan-desc" style={styles.planDesc}>
              Get better rewards, bigger commissions and access to premium earning tasks.
            </p>
            <ul className="features" style={styles.features}>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> All Bronze benefits</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Higher task earnings</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Faster support</li>
            </ul>
            {activeTier === "Silver" ? (
  <>
    <div
      style={{
        color: "#22c55e",
        fontWeight: "700",
        marginBottom: "10px"
      }}
    >
      ✅ Active Plan
    </div>

    <div
      style={{
        color: "#94a3b8",
        marginBottom: "15px"
      }}
    >
      Activated:
      {" "}
      {new Date(
        user.membershipActivatedAt
      ).toLocaleDateString()}
    </div>
  </>
) : (
  <button
    style={styles.planBtn}
    onClick={() => activatePlan("Silver")
}
  >
    {currentRank > 0
      ? "Upgrade to Silver"
      : "Activate Plan"}
  </button>
)}
          </div>
          )}

          {/* GOLD */}
          {showGold && (
          <div className="" style={{ ...styles.planCard, ...styles.gold, ...(activeTier === "Gold" && {
  border: "2px solid #ffd700",
  boxShadow: "0 0 25px rgba(255,215,0,0.35)"
})}} onMouseEnter={cardHoverIn} onMouseLeave={cardHoverOut}>
            <div className="plan-icon" style={styles.planIcon}>
              <i className="fa-solid fa-star"></i>
            </div>
            <h2 className="plan-name" style={styles.planName}>Gold</h2>
            <div className="plan-price" style={styles.planPrice}>₦75,000</div>
            <p className="plan-desc" style={styles.planDesc}>
              Unlock high-value ad campaigns and surveys with enhanced earning opportunities.
            </p>
            <ul className="features" style={styles.features}>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> All Silver benefits</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Priority support</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Exclusive bonuses</li>
            </ul>
            {activeTier === "Gold" ? (
  <>
    <div
      style={{
        color: "#22c55e",
        fontWeight: "700",
        marginBottom: "10px"
      }}
    >
      ✅ Active Plan
    </div>

    <div
      style={{
        color: "#94a3b8",
        marginBottom: "15px"
      }}
    >
      Activated:
      {" "}
      {new Date(
        user.membershipActivatedAt
      ).toLocaleDateString()}
    </div>
  </>
) : (
  <button
    style={styles.planBtn}
    onClick={() => activatePlan("Gold")
}
  >
    {currentRank > 0
      ? "Upgrade to Gold"
      : "Activate Plan"}
  </button>
)}
          </div>
          )}

          {/* PREMIUM */}
          {showPremium && (
          <div className="" style={{...styles.planCardprem, ...(activeTier === "Premium" && {
  border: "2px solid #8b5cf6",
  boxShadow: "0 0 25px rgba(139,92,246,0.35)"
})}} onMouseEnter={cardHoverIn} onMouseLeave={cardHoverOut}>
            <div className="plan-icon" style={styles.planIcon}>
              <i className="fa-solid fa-trophy"></i>
            </div>
            <h2 className="plan-name" style={styles.planName}>Premium</h2>
            <div className="plan-price" style={styles.planPrice}>₦100,000</div>
            <p className="plan-desc" style={styles.planDesc}>
              Unlock maximum earning potential, VIP support and exclusive opportunities.
            </p>
            <ul className="features" style={styles.features}>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> All Bronze, Silver and Gold benefits</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Premium task earnings</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> VIP Priority support</li>
              <li style={styles.featureLi}><i className="fa-solid fa-check" style={styles.featureI}></i> Premium bonuses</li>
            </ul>
            {activeTier === "Premium" ? (
  <>
    <div
      style={{
        color: "#22c55e",
        fontWeight: "700",
        marginBottom: "10px"
      }}
    >
      ✅ Active Plan
    </div>

    <div
      style={{
        color: "#94a3b8",
        marginBottom: "15px"
      }}
    >
      Activated:
      {" "}
      {new Date(
        user.membershipActivatedAt
      ).toLocaleDateString()}
    </div>
  </>
) : (
  <button
    style={styles.planBtn}
    onClick={() => activatePlan("Premium")
}
  >
    {currentRank > 0
      ? "Upgrade to Premium"
      : "Activate Plan"}
  </button>
)}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}