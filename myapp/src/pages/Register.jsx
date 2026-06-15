import { useState,} from "react";
import API from "../api";

const params =
  new URLSearchParams(window.location.search);

const referral =
  params.get("ref") || "";

export default function Register({ setView }) {

  const [form, setForm] =
    useState({

      fullName: "",

      username: "",

      email: "",

      phone: "",

      password: "",

      referredBy: referral

    });

  const [activationCode,
    setActivationCode] =
    useState("");

  const [vendorUrl,
    setVendorUrl] =
    useState("");

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  // HANDLE INPUTS

  const handleChange =
    (key, value) => {

      setForm({

        ...form,

        [key]: value

      });

    };

  // REGISTER USER

  const handleRegister =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const response =
          await API.post(

            "/auth/register",

            {

              ...form,

              activationCode,

            }

          );

        // SAVE USER

        localStorage.setItem(

          "user",

          JSON.stringify(
            response.data
          )

        );

        alert(
          "Registration successful"
        );

        setView("login");

      } catch (error) {

        console.log(error);

        alert(

          error.response?.data?.message ||

          error.message ||

          "Registration failed"

        );

      } finally {

        setLoading(false);

      }

    };

  // OPEN VENDOR

  const openVendor =
    () => {

      if (!vendorUrl) {

        alert(
          "Please select a vendor"
        );

        return;

      }

      window.open(
        vendorUrl,
        "_blank"
      );

    };

  // STYLES

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
      fontFamily: "'Inter', sans-serif"
    },
    btnGlass: {
      width: "100%",
      padding: "14px 24px",
      backgroundColor: "rgba(255,255,255,.06)",
      color: "var(--fg)",
      border: "1px solid var(--border)",
      backdropFilter: "blur(10px)",
      borderRadius: "12px",
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "12px",
      transition: "transform .2s ease, filter .2s ease",
      fontFamily: "'Inter', sans-serif"
    }
  };

  return (

    <div style={styles.wrapper}>

      <div style={styles.blobGreen}></div>

      <div style={styles.blobGold}></div>

      <div style={styles.container}>

        {/* BRAND */}

        <div
          style={{
            display: "flex",
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
              overflow: "hidden"
            }}
          >

            <img
              src="/Affilora main logo.jpeg"
              alt="Affilora"
              width={45}
              height={45}
            />

          </div>

          <div>

            <span
              style={{
                fontSize: "28px",
                fontWeight: "800"
              }}
            >

              Affilora

            </span>

          </div>

        </div>

        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "36px"
          }}
        >

          <h2>
            Create Account
          </h2>

          <p>
            Join Affilora today
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleRegister}
        >

          {/* FULL NAME */}

          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <label style={styles.label}>
              Full Name
            </label>

            <div
              style={{
                position: "relative"
              }}
            >

              <i
                className="fa-solid fa-user"
                style={styles.icon}
              ></i>

              <input
                type="text"
                placeholder="Full name"
                value={form.fullName}
                onChange={(e) =>
                  handleChange(
                    "fullName",
                    e.target.value
                  )
                }
                required
                style={styles.input}
              />

            </div>

          </div>

          {/* USERNAME */}

          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <label style={styles.label}>
              Username
            </label>

            <div
              style={{
                position: "relative"
              }}
            >

              <i
                className="fa-solid fa-at"
                style={styles.icon}
              ></i>

              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                  handleChange(
                    "username",
                    e.target.value
                  )
                }
                required
                style={styles.input}
              />

            </div>

          </div>

          {/* EMAIL */}

          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <label style={styles.label}>
              Email
            </label>

            <div
              style={{
                position: "relative"
              }}
            >

              <i
                className="fa-solid fa-envelope"
                style={styles.icon}
              ></i>

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  handleChange(
                    "email",
                    e.target.value
                  )
                }
                required
                style={styles.input}
              />

            </div>

          </div>

          {/* PHONE */}

          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <label style={styles.label}>
              Phone Number
            </label>

            <div
              style={{
                position: "relative"
              }}
            >

              <i
                className="fa-solid fa-phone"
                style={styles.icon}
              ></i>

              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) =>
                  handleChange(
                    "phone",
                    e.target.value
                  )
                }
                maxLength={11}
                required
                style={styles.input}
              />

            </div>

          </div>

          {/* PASSWORD */}

          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <label style={styles.label}>
              Password
            </label>

            <div
              style={{
                position: "relative"
              }}
            >

              <i
                className="fa-solid fa-lock"
                style={styles.icon}
              ></i>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  handleChange(
                    "password",
                    e.target.value
                  )
                }
                required
                style={styles.input}
              />

              <span
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                style={{
                  position: "absolute",
                  right: "18px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  cursor: "pointer"
                }}
              >

                <i
                  className={`fa-solid ${
                    showPassword
                      ? "fa-eye-slash"
                      : "fa-eye"
                  }`}
                ></i>

              </span>

            </div>

          </div>

          {/* REFERRAL */}

          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <label style={styles.label}>
              Referral Code
            </label>

            <div
              style={{
                position: "relative"
              }}
            >

              <i
                className="fa-solid fa-user-plus"
                style={styles.icon}
              ></i>

              <input
                type="text"
                placeholder="Referral code"
                value={form.referredBy}
                readOnly
                style={styles.input}
              />

            </div>

          </div>

          {/* ACTIVATION */}

          <div
            style={{
              marginBottom: "20px"
            }}
          >

            <label style={styles.label}>
              Activation Code
            </label>

            <div
              style={{
                position: "relative"
              }}
            >

              <i
                className="fa-solid fa-key"
                style={styles.icon}
              ></i>

              <input
                type="text"
                placeholder="Activation code"
                value={activationCode}
                onChange={(e) =>
                  setActivationCode(
                    e.target.value
                  )
                }
                required
                style={styles.input}
              />

            </div>

          </div>

          {/* TERMS */}

          <div
            style={{
              marginBottom: "24px"
            }}
          >

            <input
              type="checkbox"
              required
            />

            <span
              style={{
                marginLeft: "10px"
              }}
            >

              I agree to terms

            </span>

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            style={styles.btnGold}
            disabled={loading}
          >

            {

              loading
                ? "Creating..."
                : "Create Account"

            }

          </button>

          <hr
            style={{
              margin: "28px 0"
            }}
          />

          {/* VENDOR */}

          <div>

            <label style={styles.label}>
              Buy Activation Code
            </label>

            <select
              value={vendorUrl}
              onChange={(e) =>
                setVendorUrl(
                  e.target.value
                )
              }
              style={{
                ...styles.input,
                cursor: "pointer"
              }}
            >

              <option value="">
                Select Vendor
              </option>

              <option value="https://t.me/affilora20">
                Telegram Vendor 1
              </option>

              <option value="https://t.me/affilora55">
                Telegram Vendor 2
              </option>

            </select>

            <button
              type="button"
              onClick={openVendor}
              style={styles.btnGlass}
            >

              Contact Vendor

            </button>

          </div>

        </form>

        {/* LOGIN */}

        <div
          style={{
            textAlign: "center",
            marginTop: "30px"
          }}
        >

          Already have an account?

          <button

            onClick={() =>
              setView("login")
            }

            style={{
              background: "none",
              border: "none",
              color: "gold",
              marginLeft: "8px",
              cursor: "pointer"
            }}

          >

            Login

          </button>

        </div>

      </div>

    </div>

  );

}