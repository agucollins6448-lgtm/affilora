import { useState, useEffect } from "react";
import axios from "axios";
import API from "../api";
import socket from "../socket";
export default function Support({ setView, onLogout }) {
  // FAQ Accordion State
  const [user, setUser] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  // Form State
  const [formData, setFormData] = useState({
    message: ""
  });

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

const unreadCount =
notifications.filter(
  n => !n.read
).length;

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const token =
      localStorage.getItem("token");

    const res =
      await axios.post(

        "http://localhost:5000/api/support/create",

        {
          message:
            formData.message
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }

      );

    alert(
      res.data.message
    );

    setFormData({
      message: ""
    });

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Failed to submit ticket"
    );

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
const fetchUser = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:5000/api/auth/me",
      {
        headers: {
          Authorization:
            `Bearer ${token}`
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

  fetchNotifications();

}, []);

useEffect(() => {

  socket.on(
    "userUpdated",
    fetchUser
  );

  socket.on(
    "notificationUpdated",
    fetchNotifications
  );

  socket.on(
    "ticketUpdated",
    fetchNotifications
  );

  return () => {

    socket.off(
      "userUpdated",
      fetchUser
    );

    socket.off(
      "notificationUpdated",
      fetchNotifications
    );

    socket.off(
      "ticketUpdated",
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
      marginBottom: "30px"
    },
    pageHeader: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: "36px",
      fontWeight: 800,
      margin: "0 0 5px 0"
    },
    supportHero: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "35px",
      borderRadius: "24px",
      marginBottom: "30px",
      border: "1px solid var(--border)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px"
    },
    heroLeftH2: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "32px",
      margin: "0 0 12px 0"
    },
    heroLeftP: {
      color: "var(--muted)",
      marginBottom: "20px",
      maxWidth: "500px",
      lineHeight: "1.7",
      margin: "0 0 20px 0"
    },
    contactBtn: {
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      border: "none",
      padding: "15px 28px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "15px",
      transition: "0.3s"
    },
    supportIcon: {
      fontSize: "120px",
      background: "var(--gradient-gold)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      opacity: 0.8
    },
    cards: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "30px"
    },
    card: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "25px",
      borderRadius: "20px",
      border: "1px solid var(--border)",
      transition: "0.3s"
    },
    cardI: {
      fontSize: "28px",
      color: "var(--gold-fg)",
      background: "var(--gradient-gold)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      marginBottom: "20px",
      display: "inline-block"
    },
    cardH3: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "22px",
      marginBottom: "10px",
      margin: "0 0 10px 0"
    },
    cardP: {
      color: "var(--muted)",
      lineHeight: "1.7",
      margin: 0
    },
    faq: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "30px",
      borderRadius: "24px",
      border: "1px solid var(--border)"
    },
    faqH2: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "30px",
      marginBottom: "25px",
      margin: "0 0 25px 0"
    },
    faqItem: {
      background: "rgba(17, 24, 39, 0.4)",
      padding: "20px",
      borderRadius: "16px",
      marginBottom: "15px",
      cursor: "pointer",
      transition: "0.3s"
    },
    faqQuestion: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    faqAnswer: {
      color: "var(--muted)",
      marginTop: "15px",
      lineHeight: "1.7",
      fontSize: "15px"
    },
    supportForm: {
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      padding: "30px",
      borderRadius: "24px",
      marginTop: "30px",
      border: "1px solid var(--border)"
    },
    formGroup: {
      marginBottom: "20px"
    },
    label: {
      display: "block",
      marginBottom: "10px",
      color: "var(--fg)"
    },
    input: {
      width: "100%",
      padding: "16px",
      border: "1px solid var(--border)",
      outline: "none",
      borderRadius: "14px",
      background: "rgba(17, 24, 39, 0.6)",
      color: "white",
      fontSize: "15px",
      fontFamily: "inherit"
    },
    sendBtn: {
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      border: "none",
      padding: "15px 30px",
      borderRadius: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s"
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

          <button style={{ ...styles.menuLink, ...styles.activeMenuLink }}>
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

      {/* MAIN CONTAINER */}
      <div className="main" style={styles.mainContent}>
        
        {/* TOPBAR */}
        <div className="topbar" style={styles.topbar}>
          <div>
            <h1 style={styles.pageHeader}>Support Center</h1>
            <p style={{ color: "var(--muted)", margin: 0 }}>We are here to help you anytime.</p>
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
    user?.profileImage ||
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
await fetchUser();

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

        {/* SUPPORT HERO */}
        <div className="support-hero" style={styles.supportHero}>
          <div className="support-left">
            <h2 style={styles.heroLeftH2}>Need Help?</h2>
            <p style={styles.heroLeftP}>
              Our support team is available 24/7 to help you with withdrawals,
              referrals, account issues, and membership questions.
            </p>
            <a href="#ticketForm" style={{ textDecoration: "none" }}>
              <button 
                className="contact-btn" 
                style={styles.contactBtn}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
              >
                Contact Support
              </button>
            </a>
          </div>
          <div className="support-icon" style={styles.supportIcon}>
            <i className="fa-solid fa-headset"></i>
          </div>
        </div>

        {/* CONTACT CARDS */}
        <div className="cards" style={styles.cards}>
          <div className="card" style={styles.card}>
            <i className="fa-solid fa-envelope" style={styles.cardI}></i>
            <h3 style={styles.cardH3}>Email Support</h3>
            <p style={styles.cardP}>affilorasupport1@gmail.com</p>
            <br />
            <a href="mailto:affilorasupport1@gmail.com" style={{ textDecoration: "none" }}>
              <button style={{ ...styles.contactBtn, padding: "10px 20px", fontSize: "14px" }}>Send Email</button>
            </a>
          </div>

          <div className="card" style={styles.card}>
            <i className="fa-brands fa-telegram" style={styles.cardI}></i>
            <h3 style={styles.cardH3}>Telegram</h3>
            <p style={styles.cardP}>Reach out to our official Telegram support team.</p>
            <br />
            <a href="https://t.me/affilora20" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <button style={{ ...styles.contactBtn, padding: "10px 20px", fontSize: "14px" }}>Send Message</button>
            </a>
          </div>

          <div className="card" style={styles.card}>
            <i className="fa-solid fa-clock" style={styles.cardI}></i>
            <h3 style={styles.cardH3}>Working Hours</h3>
            <p style={{ ...styles.cardP, tyranny: "1.7" }}>
              Monday - Sunday <br />
              24/7 Support Available
            </p>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="faq" style={styles.faq}>
          <h2 style={styles.faqH2}>Frequently Asked Questions</h2>

          <div className="faq-item" style={styles.faqItem} onClick={() => toggleFaq(0)}>
            <div style={styles.faqQuestion}>
              <h4 style={{ margin: 0, fontSize: "18px" }}>How do I withdraw my earnings?</h4>
              <i className={`fa-solid ${openFaq === 0 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
            </div>
            {openFaq === 0 && (
              <div style={styles.faqAnswer}>
                Go to the wallet section and click the withdraw button.
                Enter your bank details and submit your request.
              </div>
            )}
          </div>

          <div className="faq-item" style={styles.faqItem} onClick={() => toggleFaq(1)}>
            <div style={styles.faqQuestion}>
              <h4 style={{ margin: 0, fontSize: "18px" }}>How does the referral system work?</h4>
              <i className={`fa-solid ${openFaq === 1 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
            </div>
            {openFaq === 1 && (
              <div style={styles.faqAnswer}>
                Share your referral link with friends and earn rewards
                whenever someone joins using your link.
              </div>
            )}
          </div>

          <div className="faq-item" style={styles.faqItem} onClick={() => toggleFaq(2)}>
            <div style={styles.faqQuestion}>
              <h4 style={{ margin: 0, fontSize: "18px" }}>How can I upgrade my membership?</h4>
              <i className={`fa-solid ${openFaq === 2 ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
            </div>
            {openFaq === 2 && (
              <div style={styles.faqAnswer}>
                Visit the membership page and select your preferred tier.
              </div>
            )}
          </div>
        </div>

        {/* SUPPORT MESSAGE FORM */}
        <div id="ticketForm" style={styles.supportForm}>
          <h2 style={styles.faqH2}>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            

            

            <div style={styles.formGroup}>
              <label style={styles.label}>Your Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Type your message here..." 
                style={{ ...styles.input, height: "150px", resize: "none" }}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              style={styles.sendBtn}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
            >
              Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}