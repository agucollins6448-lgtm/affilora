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



  return (

    <div className="admin-gen">

      <form
        onSubmit={handleLogin}
        className="admin-form"
      >

        <h1 className="admin-text">
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
          className="input-style admin-input"
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
          className="input-style admin-input-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-base btn-primary"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

      </form>

    </div>

  );

}