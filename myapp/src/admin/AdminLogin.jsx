import { useState } from "react";
import axios from "axios";

export default function AdminLogin({ setView }) {

  const [form, setForm] =
    useState({
      username: "",
      password: ""
    });

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const res =
          await axios.post(
            "http://localhost:5000/api/admin/login",
            form
          );

        localStorage.setItem(
          "adminToken",
          res.data.token
        );

        localStorage.setItem(
          "adminUser",
          JSON.stringify(
            res.data.admin
          )
        );

        setView(
          "adminDashboard"
        );

      } catch (error) {

  console.log(error);

  console.log(
    error.response?.data
  );

  alert(
    error.response?.data?.message ||
    "Login failed"
  );

}

       finally {

        setLoading(false);

      }

    };

const fonts = {
  heading: "'Space Grotesk', sans-serif",
  body: "'DM Sans', sans-serif",
};

const colors = {
  bg: "#0a0a1a",
  surface: "#141432",
  surfaceElevated: "#1e1e5a",
  accent: "#4f46e5",
  accentHover: "#4338ca",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  border: "rgba(148, 163, 184, 0.12)",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  purple: "#a855f7",
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#eab308",
  premium: "#8b5cf6",
  starter: "#64748b",
};



const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "18px",
};

const inputStyle = {
  padding: "14px 14px",
  borderRadius: radius.md,
  border: `1px solid ${colors.border}`,
  background: colors.surfaceElevated,
  color: colors.textPrimary,
  fontSize: "0.95rem",
  fontFamily: fonts.body,
  outline: "none",
  minWidth: "00px",
};

const btnBase = {
  padding: "14px 18px",
  borderRadius: radius.md,
  border: "none",
  fontFamily: fonts.body,
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background 0.2s ease, transform 0.1s ease",
  minWidth: "322px"
};

const btnPrimary = { ...btnBase, background: colors.accent, color: "#fff" };


  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: colors.bg
      }}
    >

      <form
        onSubmit={handleLogin}
        style={{
          width: "400px",
          background:
            "rgba(255,255,255,0.05)",
          padding: "40px",
          borderRadius: "20px",
          backdropFilter:
            "blur(12px)"
        }}
      >

        <h1
          style={{
            color: colors.accent,
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          Admin Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username:
                e.target.value
            })
          }
          style={{ ...inputStyle, minWidth: "322px", marginBottom: "15px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password:
                e.target.value
            })
          }
          style={{ ...inputStyle, minWidth: "322px", marginBottom: "20px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={btnPrimary}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

    </div>

  );

}