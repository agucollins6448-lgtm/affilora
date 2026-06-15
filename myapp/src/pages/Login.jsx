import { useState } from "react";
import API from "../api"; // Double-check if your path is "../api" or "./api"

export default function Login({ setView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "currentUser",
        JSON.stringify(res.data.user)
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert("Login successful");
      console.log(res.data);

      // Dynamically switch the view to dashboard instead of location.href
      setView("dashboard");
    } catch (error) {
      console.log(error.response?.data);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // REPLICATED EXACT STYLES FROM REGISTER
  const styles = {
    wrapper: {
      minHeight: "100vh",
      width: "100%",
      background: "var(--gradient-hero)",
      backgroundAttachment: "fixed",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      fontFamily: "'Inter', system-ui, sans-serif",
      color: "var(--fg)",
      position: "relative",
      overflow: "hidden"
    },
    blobGreen: {
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(80px)",
      width: "400px",
      height: "400px",
      background: "rgba(16, 185, 129, 0.25)",
      top: "80px",
      left: "-120px",
      pointerEvents: "none",
      zIndex: 1
    },
    blobGold: {
      position: "absolute",
      borderRadius: "50%",
      filter: "blur(80px)",
      width: "400px",
      height: "400px",
      background: "rgba(245, 196, 81, 0.22)",
      bottom: "160px",
      right: "-120px",
      pointerEvents: "none",
      zIndex: 1
    },
    container: {
      width: "100%",
      maxWidth: "520px",
      background: "var(--gradient-card)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "48px 40px",
      boxShadow: "var(--shadow-elevated)",
      position: "relative",
      zIndex: 10
    },
    input: {
      width: "100%",
      padding: "16px 18px 16px 52px",
      backgroundColor: "rgba(11, 18, 32, 0.5)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      color: "var(--fg)",
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      fontFamily: "'Inter', sans-serif"
    },
    icon: {
      position: "absolute",
      left: "18px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--muted)",
      fontSize: "16px",
      zIndex: 2
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "var(--muted)",
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.02em"
    },
    btnGold: {
      width: "100%",
      padding: "15px 24px",
      border: "none",
      borderRadius: "12px",
      background: "var(--gradient-gold)",
      color: "var(--gold-fg)",
      boxShadow: "var(--shadow-glow-gold)",
      fontSize: "1rem",
      fontWeight: 700,
      cursor: "pointer",
      marginTop: "16px",
      transition: "transform .2s ease, box-shadow .2s ease",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Background Ambient Blobs */}
      <div style={styles.blobGreen}></div>
      <div style={styles.blobGold}></div>

      <div style={styles.container}>
        
        {/* CENTERED BRAND IDENTITY */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "32px"
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src="/Affilora main logo.jpeg"
              alt="Affilora"
              width={45}
              height={45}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "28px", fontWeight: "800" }}>
              Affilora
            </span>
          </div>
        </div>

        {/* CENTERED HEADER */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", marginBottom: "36px" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
            Welcome back
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Sign in to continue earning.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          
          {/* EMAIL FIELD */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <div style={{ position: "relative" }}>
              <i className="fa-solid fa-envelope" style={styles.icon}></i>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                required
                style={styles.input}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div style={{ marginBottom: "28px" }}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={{ position: "relative" }}>
              <i className="fa-solid fa-lock" style={styles.icon}></i>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                required
                style={styles.input}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "18px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "var(--muted)"
                }}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>

          {/* GOLD SUBMIT BUTTON */}
          <button 
            style={styles.btnGold} 
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* CENTERED FOOTER ACCENT */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "30px", fontSize: "0.95rem", color: "var(--fg)" }}>
          <span>No account?</span>
          <button
            onClick={() => setView("register")}
            style={{
              background: "none",
              border: "none",
              color: "gold",
              marginLeft: "8px",
              cursor: "pointer",
              fontWeight: "600",
              padding: 0,
              font: "inherit",
            }}
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}