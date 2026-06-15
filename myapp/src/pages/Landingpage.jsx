import { useState, useEffect } from "react";

export default function LandingPage({ setView }) {
  // --- STATS ENGINE STATE ---
  const [membersCount, setMembersCount] = useState("48,200+");
  const [paidoutCount, setPaidoutCount] = useState("₦18.4M+");

  // --- TESTIMONIAL CAROUSEL STATE ---
  const testimonials = [
    {
      text: '"Affilora has changed how I earn online. Payouts are always on time."',
      name: "Chinedu A.",
      location: "Lagos",
      avatar: "C"
    },
    {
      text: '"The Gold plan paid for itself in two weeks. Premium support is real."',
      name: "Amaka O.",
      location: "Abuja",
      avatar: "A"
    },
    {
      text: '"Transparent earnings, real campaigns. Easily the best platform in Africa."',
      name: "Tunde B.",
      location: "Ibadan",
      avatar: "T"
    }
  ];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // --- RUN COUNTERS AND CAROUSEL EFFECT ---
  useEffect(() => {
    // 1. Members count calculation
    const baseMembers = 48200;
    const randomIncrease = Math.floor(Math.random() * 50);
    setMembersCount((baseMembers + randomIncrease).toLocaleString() + "+");

    // 2. Paid out calculation
    const basePaid = 18400000;
    const randomPaid = Math.floor(Math.random() * 500000);
    setPaidoutCount("₦" + ((basePaid + randomPaid) / 1000000).toFixed(1) + "M+");

    // 3. Testimonial carousel loop (every 3 seconds)
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // GLOBAL INLINE DESIGN TOKENS & SYSTEM STYLES
  const styles = {
    wrapper: {
      background: "#0f172a",
      color: "#ffffff",
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh",
      overflowX: "hidden",
      lineHeight: "1.5"
    },
    navbar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      zIndex: 1000,
      padding: "15px 20px"
    },
    navInner: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%"
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
      color: "inherit"
    },
    brandLogo: {
      width: "40px",
      height: "40px",
      background: "#facc15",
      borderRadius: "10px",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    brandName: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "22px",
      fontWeight: "800",
      color: "#ffffff",
      display: "block"
    },
    brandTag: {
      fontSize: "10px",
      color: "#94a3b8",
      display: "block"
    },
    navLinks: {
      display: "flex",
      gap: "24px"
    },
    navLink: {
      color: "#cbd5e1",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "500",
      transition: "0.2s"
    },
    navActions: {
      display: "flex",
      gap: "12px"
    },
    btn: {
      padding: "10px 20px",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      border: "none",
      transition: "0.3s ease"
    },
    btnGlass: {
      background: "rgba(255, 255, 255, 0.05)",
      color: "#ffffff",
      border: "1px solid rgba(255, 255, 255, 0.1)"
    },
    btnHero: {
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      color: "#ffffff"
    },
    btnGold: {
      background: "#facc15",
      color: "#000000"
    },
    hero: {
      position: "relative",
      padding: "160px 20px 100px 20px",
      background: "radial-gradient(circle at top right, rgba(24a, 204, 21, 0.05), transparent)",
      overflow: "hidden"
    },
    heroGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto",
      alignItems: "center"
    },
    chip: {
      display: "inline-block",
      background: "rgba(250, 204, 21, 0.1)",
      border: "1px solid rgba(250, 204, 21, 0.2)",
      color: "#facc15",
      padding: "6px 14px",
      borderRadius: "30px",
      fontSize: "13px",
      fontWeight: "500",
      marginBottom: "20px"
    },
    heroTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "56px",
      fontWeight: "900",
      lineHeight: "1.15",
      marginBottom: "20px"
    },
    textGold: {
      color: "#facc15"
    },
    textGreen: {
      color: "#22c55e"
    },
    heroSub: {
      color: "#94a3b8",
      fontSize: "18px",
      lineHeight: "1.7",
      marginBottom: "35px",
      maxWidth: "540px"
    },
    heroCta: {
      display: "flex",
      gap: "15px",
      marginBottom: "40px"
    },
    heroTrust: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      color: "#cbd5e1",
      fontSize: "14px"
    },
    heroVisual: {
      position: "relative",
      height: "360px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    glassCard: {
      background: "rgba(30, 41, 59, 0.7)",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      backdropFilter: "blur(16px)",
      borderRadius: "20px",
      padding: "24px"
    },
    floatCard: {
      position: "absolute",
      width: "180px",
      padding: "16px",
      borderRadius: "16px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
    },
    section: {
      padding: "80px 20px"
    },
    sectionHead: {
      textAlign: "center",
      marginBottom: "50px"
    },
    kicker: {
      color: "#facc15",
      fontSize: "12px",
      fontWeight: "700",
      letterSpacing: "2px",
      textTransform: "uppercase",
      marginBottom: "10px"
    },
    sectionTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "36px",
      fontWeight: "800",
      marginBottom: "15px"
    },
    grid4: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "24px",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    grid3: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    card: {
      borderRadius: "20px",
      padding: "30px",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      background: "rgba(30, 41, 59, 0.4)",
      transition: "0.3s"
    },
    iconBox: {
      width: "50px",
      height: "50px",
      background: "rgba(255,255,255,0.05)",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      marginBottom: "20px"
    },
    reward: {
      marginTop: "20px",
      paddingTop: "15px",
      borderTop: "1px solid rgba(255,255,255,0.05)"
    },
    plan: {
      borderRadius: "24px",
      padding: "35px",
      background: "rgba(30, 41, 59, 0.5)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      position: "relative"
    },
    planFeatured: {
      background: "linear-gradient(180deg, #1e293b, #0f172a)",
      border: "2px solid #facc15",
      boxShadow: "0 15px 35px rgba(250, 204, 21, 0.1)"
    },
    badge: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "#facc15",
      color: "#000000",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: "700"
    },
    price: {
      fontSize: "40px",
      fontWeight: "800",
      margin: "15px 0 5px 0"
    },
    planRows: {
      listStyle: "none",
      padding: 0,
      margin: "25px 0",
      borderTop: "1px solid rgba(255,255,255,0.05)"
    },
    planRowItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      fontSize: "14px"
    },
    perks: {
      listStyle: "none",
      padding: 0,
      margin: "0 0 30px 0",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      fontSize: "14px",
      color: "#cbd5e1"
    },
    ctaBox: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "50px",
      borderRadius: "24px",
      background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))",
      border: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "30px"
    },
    avatar: {
      width: "45px",
      height: "45px",
      borderRadius: "50%",
      background: "#16a34a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "16px"
    },
    faqContainer: {
      maxWidth: "750px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "15px"
    },
    footer: {
      background: "#0b0f19",
      padding: "80px 20px 30px 20px",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)"
    },
    footerGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "40px",
      maxWidth: "1200px",
      margin: "0 auto"
    },
    footerLinks: {
      listStyle: "none",
      padding: 0,
      margin: "15px 0 0 0",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    footerLinkItem: {
      color: "#94a3b8",
      fontSize: "14px",
      cursor: "pointer"
    }
  };

  return (
    <div style={styles.wrapper}>
      
      {/* NAVBAR */}
      <header style={styles.navbar}>
        <div style={styles.navInner}>
          <a href="#" style={styles.brand}>
            <div style={styles.brandLogo}>
              <img src="Affilora main logo.jpeg" alt="main logo" width="40px" height="40px" style={{ objectFit: "cover" }} />
            </div>
            <div>
              <span style={styles.brandName}>Affilora</span>
              <span style={styles.brandTag}>Growing Wealth Intelligently</span>
            </div>
          </a>
          <nav style={styles.navLinks}>
            <a href="#plans" style={styles.navLink}>Plans</a>
            <a href="#earnings" style={styles.navLink}>Earnings</a>
            <a href="#stats" style={styles.navLink}>Stats</a>
            <a href="#faq" style={styles.navLink}>FAQ</a>
            <a href="#support" style={styles.navLink}>Support</a>
          </nav>
          <div style={styles.navActions}>
            <button style={{ ...styles.btn, ...styles.btnGlass }} onClick={() => setView("login")}>Sign in</button>
            <button style={{ ...styles.btn, ...styles.btnHero }} onClick={() => setView("register")}>Get Started</button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroGrid}>
          <div>
            <div style={styles.chip}>✨ Nigeria's premium earning platform</div>
            <h1 style={styles.heroTitle}>Grow your wealth, <span style={styles.textGold}>intelligently.</span></h1>
            <p style={styles.heroSub}>
              Earn from sponsored ads, surveys, and tasks — verified, transparent, and built for Nigerian creators.
            </p>
            <div style={styles.heroCta}>
              <button style={{ ...styles.btn, ...styles.btnHero, padding: "16px 32px", fontSize: "16px" }} onClick={() => setView("login")}>Start Earning →</button>
              <button style={{ ...styles.btn, ...styles.btnGlass, padding: "16px 32px", fontSize: "16px" }}onClick={() => setView("login")}>View Plans</button>
            </div>
            <div style={styles.heroTrust}>
              <span>✓ Manual payment verification</span>
              <span>✓ ₦1500 referral bonus</span>
              <span>✓ Daily earnings</span>
            </div>
          </div>
          
          <div style={styles.heroVisual}>
            <div style={{ ...styles.glassCard, width: "280px", height: "240px", opacity: 0.15, borderStyle: "dashed", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#94a3b8" }}>Placeholder Image</span>
            </div>
            <div style={{ ...styles.glassCard, ...styles.floatCard, left: "20px", bottom: "20px", ...styles.floatCard }}>
              <div style={{ color: "#94a3b8", fontSize: "12px" }}>Today's Earnings</div>
              <div style={{ color: "#22c55e", fontSize: "24px", fontWeight: "800", marginTop: "5px" }}>₦12,450</div>
            </div>
            <div style={{ ...styles.glassCard, ...styles.floatCard, right: "20px", top: "20px", ...styles.floatCard }}>
              <div style={{ color: "#94a3b8", fontSize: "12px" }}>Active Members</div>
              <div style={{ color: "#facc15", fontSize: "24px", fontWeight: "800", marginTop: "5px" }}>48,200+</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section id="stats" style={{ ...styles.section, background: "rgba(30, 41, 59, 0.2)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ ...styles.glassCard, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "30px", textAlign: "center" }}>
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#facc15", margin: "0 0 5px 0" }}>{membersCount}</h2>
              <div style={{ color: "#94a3b8", fontSize: "14px" }}>Active Members</div>
            </div>
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#facc15", margin: "0 0 5px 0" }}>{paidoutCount}</h2>
              <div style={{ color: "#94a3b8", fontSize: "14px" }}>Naira Paid Out</div>
            </div>
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#facc15", margin: "0 0 5px 0" }}>99%</h2>
              <div style={{ color: "#94a3b8", fontSize: "14px" }}>Payout Reliability</div>
            </div>
            <div>
              <h2 style={{ fontSize: "36px", fontWeight: "800", color: "#facc15", margin: "0 0 5px 0" }}>24/7</h2>
              <div style={{ color: "#94a3b8", fontSize: "14px" }}>Member Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* EARNINGS SECTION */}
      <section id="earnings" style={styles.section}>
        <div style={styles.sectionHead}>
          <div style={styles.kicker}>Earning Opportunities</div>
          <h2 style={styles.sectionTitle}>Multiple ways to <span style={styles.textGreen}>earn daily</span></h2>
          <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "0 auto" }}>All earnings come from legitimate sponsored activities — no income guarantees, just real opportunities.</p>
        </div>
        
        <div style={styles.grid4}>
          <div style={styles.card}>
            <div style={styles.iconBox}>📣</div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Sponsored Ads</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>Engage with brand campaigns and earn per verified interaction.</p>
            <div style={styles.reward}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Reward Range</span>
              <div style={{ color: "#facc15", fontWeight: "700", fontSize: "16px", marginTop: "2px" }}>₦40 – ₦220</div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.iconBox}>📋</div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Daily Surveys & Tasks</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>Share opinions on products and services from top brands.</p>
            <div style={styles.reward}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Reward Range</span>
              <div style={{ color: "#facc15", fontWeight: "700", fontSize: "16px", marginTop: "2px" }}>₦50 – ₦250</div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.iconBox}>⭐</div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Product Reviews</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>Write honest reviews for verified merchant products.</p>
            <div style={styles.reward}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Reward Range</span>
              <div style={{ color: "#facc15", fontWeight: "700", fontSize: "16px", marginTop: "2px" }}>₦80 – ₦200</div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.iconBox}>📊</div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Market Research</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>Participate in research panels for global research firms.</p>
            <div style={styles.reward}>
              <span style={{ color: "#94a3b8", fontSize: "12px" }}>Reward Range</span>
              <div style={{ color: "#facc15", fontWeight: "700", fontSize: "16px", marginTop: "2px" }}>₦50 – ₦150</div>
            </div>
          </div>
        </div>
      </section>

      

      {/* REFERRAL CTA SECTION */}
      <section style={styles.section}>
        <div style={styles.ctaBox}>
          <div>
            <div style={styles.kicker}>Referral Program</div>
            <h2 style={{ ...styles.sectionTitle, margin: "0 0 10px 0" }}>Earn <span style={styles.textGold}>₦1,500</span> for every referral</h2>
            <p style={{ color: "#94a3b8", margin: 0 }}>Invite friends and earn instantly when they activate any membership tier.</p>
          </div>
          <button style={{ ...styles.btn, ...styles.btnGold, padding: "16px 32px", fontSize: "16px" }} onClick={() => setView("register")}>Get Your Referral Link</button>
        </div>
      </section>

      {/* TESTIMONIALS SYSTEM */}
      <section style={{ ...styles.section, background: "rgba(30, 41, 59, 0.2)" }}>
        <div style={styles.sectionHead}>
          <div style={styles.kicker}>Testimonials</div>
          <h2 style={styles.sectionTitle}>Trusted by <span style={styles.textGreen}>thousands</span></h2>
        </div>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {/* Dynamic Carousel Slide Rendering */}
          <div style={{ ...styles.card, background: "rgba(30, 41, 59, 0.7)", textAlign: "center", padding: "40px 30px" }}>
            <p style={{ fontSize: "18px", fontStyle: "italic", lineHeight: "1.7", marginBottom: "25px", minHeight: "60px" }}>
              {testimonials[currentTestimonial].text}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "15px" }}>
              <div style={styles.avatar}>{testimonials[currentTestimonial].avatar}</div>
              <div style={{ textAlign: "left" }}>
                <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>{testimonials[currentTestimonial].name}</h4>
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>{testimonials[currentTestimonial].location}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section id="faq" style={styles.section}>
        <div style={styles.sectionHead}>
          <div style={styles.kicker}>FAQ</div>
          <h2 style={styles.sectionTitle}>Questions, <span style={styles.textGold}>answered</span></h2>
        </div>
        <div style={styles.faqContainer}>
          <details open style={{ background: "rgba(30, 41, 59, 0.4)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
            <summary style={{ fontWeight: "600", fontSize: "16px", outline: "none" }}>How does activation work?</summary>
            <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "14px", lineHeight: "1.6", marginHeight: 0 }}>Pay the one-time fee for your chosen tier. Our team manually verifies the payment within 24 hours.</p>
          </details>
          <details style={{ background: "rgba(30, 41, 59, 0.4)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
            <summary style={{ fontWeight: "600", fontSize: "16px", outline: "none" }}>How are earnings calculated?</summary>
            <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "14px", lineHeight: "1.6", marginHeight: 0 }}>Earnings are based on completed tasks, surveys, reviews and research participation. Rates vary by campaign.</p>
          </details>
          <details style={{ background: "rgba(30, 41, 59, 0.4)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
            <summary style={{ fontWeight: "600", fontSize: "16px", outline: "none" }}>Are payouts daily?</summary>
            <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "14px", lineHeight: "1.6", marginHeight: 0 }}>Yes — verified earnings are paid daily to your registered bank account.</p>
          </details>
          <details style={{ background: "rgba(30, 41, 59, 0.4)", padding: "16px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
            <summary style={{ fontWeight: "600", fontSize: "16px", outline: "none" }}>How does the referral bonus work?</summary>
            <p style={{ color: "#94a3b8", marginTop: "12px", fontSize: "14px", lineHeight: "1.6", marginHeight: 0 }}>You earn ₦800 instantly when your referral activates any membership tier.</p>
          </details>
        </div>
      </section>

      {/* SUPPORT GRID SECTION */}
      <section id="support" style={{ ...styles.section, background: "rgba(30, 41, 59, 0.1)" }}>
        <div style={styles.sectionHead}>
          <div style={styles.kicker}>Support</div>
          <h2 style={styles.sectionTitle}>We're here <span style={styles.textGreen}>24/7</span></h2>
        </div>
        <div style={styles.grid3}>
          <div style={{ ...styles.card, textAlign: "center" }}>
            <div style={{ ...styles.iconBox, margin: "0 auto 20px auto" }}>💬</div>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Live Chat</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>Average response under 2 minutes.</p>
          </div>
          <div style={{ ...styles.card, textAlign: "center" }}>
            <div style={{ ...styles.iconBox, margin: "0 auto 20px auto" }}>✉️</div>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Email</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>affilorasupport@gmail.com</p>
          </div>
          <div style={{ ...styles.card, textAlign: "center" }}>
            <div style={{ ...styles.iconBox, margin: "0 auto 20px auto" }}>📞</div>
            <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Telegram</h3>
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>@affilora55</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerGrid}>
          <div>
            <div style={styles.brand}>
              <div style={{ ...styles.brandLogo, background: "#facc15", color: "#000", fontWeight: "900", fontSize: "18px" }}>A</div>
              <div>
                <span style={styles.brandName}>Affilora</span>
                <span style={styles.brandTag}>Growing Wealth Intelligently</span>
              </div>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "12px", lineHeight: "1.6", marginTop: "20px" }}>
              Earnings come from legitimate sponsored campaigns, surveys, reviews and research tasks. No misleading income guarantees.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 10px 0" }}>Platform</h4>
            <ul style={styles.footerLinks}>
              <li style={styles.footerLinkItem}>Plans</li>
              <li style={styles.footerLinkItem}>Earnings</li>
              <li style={styles.footerLinkItem}>Referrals</li>
              <li style={styles.footerLinkItem}>Dashboard</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 10px 0" }}>Company</h4>
            <ul style={styles.footerLinks}>
              <li style={styles.footerLinkItem}>About</li>
              <li style={styles.footerLinkItem}>Careers</li>
              <li style={styles.footerLinkItem}>Press</li>
              <li style={styles.footerLinkItem}>Contact</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 10px 0" }}>Legal</h4>
            <ul style={styles.footerLinks}>
              <li style={styles.footerLinkItem}>Terms & Conditions</li>
              <li style={styles.footerLinkItem}>Privacy Policy</li>
              <li style={styles.footerLinkItem}>Earnings Disclosure</li>
              <li style={styles.footerLinkItem}>Anti-spam Policy</li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: "1200px", margin: "40px auto 0 auto", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "#94a3b8", fontSize: "12px", textAlign: "center" }}>
          © 2026 Affilora. All rights reserved.
        </div>
      </footer>

    </div>
  );
}