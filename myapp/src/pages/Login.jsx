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
  

  return (
    <div className="wrapper2">
      {/* Background Ambient Blobs */}
      <div className="blobGreen1"></div>
      <div className="blobGold1"></div>

      <div className="container2">
        
        {/* CENTERED BRAND IDENTITY */}
        <div className="head1">
          <div className="head2">
            <img
              src="/Affilora main logo.jpeg"
              alt="Affilora"
              width={45}
              height={45}
            />
          </div>
          <div className="divAff">
            <span className="Aff">
              Affilora
            </span>
          </div>
        </div>

        {/* CENTERED HEADER */}
        <div className="divWel">
          <h2 className="Wel">
            Welcome back
          </h2>
          <p className="sigin">
            Sign in to continue earning.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          
          {/* EMAIL FIELD */}
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="email" className="label">Email</label>
            <div style={{ position: "relative" }}>
              <i className="fa-solid fa-envelope icon"></i>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                required
                className="input"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* PASSWORD FIELD */}
          <div style={{ marginBottom: "28px" }}>
            <label htmlFor="password" className="label">Password</label>
            <div style={{ position: "relative" }}>
              <i className="fa-solid fa-lock icon"></i>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                required
                className="input"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="showPassw"
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>

          {/* GOLD SUBMIT BUTTON */}
          <button 
            className="btnGoldg" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* CENTERED FOOTER ACCENT */}
        <div className="divNoAcct">
          <span>No account?</span>
          <button
            onClick={() => setView("register")}
            className="creOne"
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}