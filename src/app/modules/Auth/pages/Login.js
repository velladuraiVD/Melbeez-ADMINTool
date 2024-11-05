import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import logoImg from "./logos/loginLogo.png";
import { setProfile } from "../../../../redux/slice/myProfile";
function Login(props) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };
  
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false; // Cleanup function to set to false when unmounted
    };
  }, []);
  const dispatch = useDispatch();
  const handleUser = (e) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleAPI = async (e) => {
    e.preventDefault();
    setLoading(true);
    const controller = new AbortController(); // Create an AbortController
    const { signal } = controller; // Get the signal from the controller
    var obj = {
      username: username,
      password: password,
    };
    var myHeaders = {
      "Content-Type": "application/json",
      "melbeez-platform": "AdminPortal",
    };
    const reqOption = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(obj),
      signal, // Pass the signal to the fetch request
    };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/authenticate`,
        reqOption
      );
      const result = await res.json();
      if (isMounted.current) {
        if (
          result.result.phoneNumberConfirmed ||
          result.result.emailConfirmed
        ) {
          props.login(result.result.token);
          props.fulfillUser(result.result);
          props.setUser(result.result);
          localStorage.setItem("userDetail", JSON.stringify(result.result));
          localStorage.setItem("authToken", result.result.token);
          localStorage.setItem("refToken", result.result.refreshToken);
          localStorage.setItem("Role", result.result.role);
        } else {
          localStorage.clear();
          setErrorMessage("Please Confirm Your Phone or Email to Login");
        }
        const myprof = {
          firstName: result.result.firstName,
          lastName: result.result.lastName,
          username: result.result.username,
          phoneNumber: result.result.phoneNumber,
          email: result.result.email,
        };
        dispatch(setProfile(myprof));
      }
    } catch (error) {
      if (isMounted.current) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setErrorMessage("Invalid Username or Password");
        }
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
    return () => {
      controller.abort(); // Cancel the fetch request on unmount
    };
  };
  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      <div className="text-center mb-10 mb-lg-20">
        <h3 className="font-size-h1">
          <FormattedMessage id="AUTH.LOGIN.TITLE" />
        </h3>
      </div>
      <img
        className="d-block mx-auto img-fluid w-50 mb-20"
        src={logoImg}
        alt="logo"
      />
      <form
        onSubmit={handleAPI}
        className="form fv-plugins-bootstrap fv-plugins-framework"
      >
        {errorMessage && (
          <div className="text-danger text-center mb-5">{errorMessage}</div>
        )}
        <div className="form-group fv-plugins-icon-container">
          <input
            placeholder="Email/User Name"
            type="text"
            className={`form-control form-control-solid h-auto py-5 px-6`}
            name="username"
            style={{ background: "#E5E5E5" }}
            value={username}
            onChange={handleUser}
            required
          />
        </div>
        <div
          className="form-group fv-plugins-icon-container"
          style={{ display: "flex", background: "#E5E5E5" }}
        >
          <div style={{ width: "600px" }}>
            <input
              placeholder="Password"
              type={passwordShown ? "text" : "password"}
              className={`form-control form-control-solid h-auto py-5 px-6`}
              name="password"
              style={{ background: "#E5E5E5", border: "0" }}
              value={password}
              onChange={handlePassword}
              required
            />
          </div>
          <div style={{ marginTop: "18px", marginRight: "15px" }}>
            <span onClick={togglePassword}>
              <i
                className={`fa ${passwordShown ? "fa-eye" : "fa-eye-slash"}`}
                aria-hidden="true"
              ></i>
            </span>
          </div>
        </div>
        <div className="form-group d-flex flex-wrap justify-content-between align-items-center">
          <Link
            to="/auth/forgot-password"
            className="text-105ad0-50 text-hover-danger my-3 mr-2"
            id="kt_login_forgot"
          >
            <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
          </Link>
          <button
            id="kt_login_signin_submit"
            type="submit"
            className={`btn font-weight-bold px-9 py-4 my-3 bg-primary`}
          >
            Sign In
            {loading && <span className="ml-3 spinner spinner-white"></span>}
          </button>
        </div>
      </form>
    </div>
  );
}
export default injectIntl(connect(null, auth.actions)(Login));