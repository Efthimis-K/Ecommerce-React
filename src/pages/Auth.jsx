// Always search for a relevant css file to apply the correct styling
// The styling is already set up in the App.css file

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContect";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [type, setType] = useState("register");
  const [error, setError] = useState(null);

  //navigate
  const navigate = useNavigate();

  //context
  const { signup, login, user, logout } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // onSubmit function
  function onSubmit(data) {
    setError(null);
    const result =
      type === "login"
        ? login(data.email, data.password)
        : signup(data.email, data.password);

    if (!result.success) {
      setError(result.message);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="auth-container">
          {/* do a check if user is logged in */}
          {user && (
            <div>
              <div>Welcome {user.email}</div>
              <button className="btn btn-primary btn-large" onClick={logout}>
                Logout
              </button>
            </div>
          )}
          <h1 className="page-title">
            {type === "login" ? "Welcome" : "Register"}
          </h1>
          {/* <p>Please login or register</p> */}
          <form
            className="auth-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {error && <p className="error-message">{error}</p>}

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                className="form-input"
                type="email"
                name="email"
                id="email"
                {...register("email", {
                  required: "Email is required!",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
                    message: "Invalid email address!",
                  },
                })}
              />
              {errors.email && (
                <p className="form-error">{errors.email.message}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                className="form-input"
                type="password"
                name="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="form-error">{errors.password.message}</p>
              )}
            </div>

            {/* <button className="btn btn-primary btn-large" type="submit">Login</button> */}
            <button className="btn btn-primary btn-large" type="submit">
              {type === "login" ? "Login" : "Register"}
            </button>
          </form>
          <div className="auth-switch">
            <p>
              {type === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <span
                className="auth-link"
                onClick={() => setType(type === "login" ? "register" : "login")}
              >
                {type === "login" ? "Register" : "Login"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
