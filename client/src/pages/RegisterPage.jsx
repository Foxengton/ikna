import { useState } from "react";
import { NavLink } from "react-router";
import Button from "../components/Button.jsx";
import PageWrapper from "../components/PageWrapper.jsx";
import api from "../services/api.jsx";
import Cookie from "js-cookie";
import { useNavigate } from "react-router";

const usernameRegex = new RegExp("^[A-Za-z0-9_-]*$");
const PASSWORD_MIN_LENGTH = 8;
const USERNAME_MIN_LENGTH = 4;

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [usernameErrors, setUsernameErrors] = useState([]);
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const navigate = useNavigate();

  // Check for username and password validity and update error labels
  function checkValidity() {
    let isValid = true;
    setUsernameErrors(() => []);
    setPasswordErrors(() => []);
    if (!usernameRegex.test(username)) {
      isValid = false;
      setUsernameErrors((prev) => [
        ...prev,
        "Username must contain only alphanumerics, dash, and/or underscore characters.",
      ]);
    }
    if (username.length < USERNAME_MIN_LENGTH) {
      isValid = false;
      setUsernameErrors((prev) => [
        ...prev,
        `Username must have ${USERNAME_MIN_LENGTH} or more characters.`,
      ]);
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      isValid = false;
      setPasswordErrors((prev) => [
        ...prev,
        `Password must have ${PASSWORD_MIN_LENGTH} or more characters.`,
      ]);
    }
    return isValid;
  }

  // Sumbitting account creation request
  async function handleRegister() {
    if (!checkValidity) return;
    const result = await api("post", "/register", {
      username: username,
      password: password,
    });
    if (result?.data) {
      Cookie.set("user-data", JSON.stringify(result.data));
      navigate("/");
    }
  }

  return (
    <PageWrapper>
      <div className="absolute h-screen w-screen">
        <div className="flex h-full justify-center items-center">
          <form className="flex flex-col p-4 bg-white rounded justify-center items-center shadow-xl w-72">
            <h1 className="font-semibold text-2xl mb-2">Register</h1>
            {/* Username */}
            <div className="flex flex-col w-full">
              {/* Username label */}
              <label className="flex flex-col gap-2 p-1 text-red-600 text-sm">
                {usernameErrors.map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </label>
              {/* Username input */}
              <input
                className="shadow-inner rounded p-2 bg-slate-50"
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameErrors([]);
                }}
                value={username}
              />
            </div>
            {/* Password */}
            <div className="flex flex-col w-full mb-4">
              {/* Password label */}
              <label className="flex flex-col gap-2 p-1 text-red-600 text-sm">
                {passwordErrors.map((item, index) => (
                  <span key={index}>{item}</span>
                ))}
              </label>
              {/* Password input */}
              <input
                type="password"
                className="shadow-inner rounded p-2 bg-slate-50"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordErrors([]);
                }}
                value={password}
              />
            </div>
            <span className="mb-4 p-1 w-full items-left text-sm">
              Already have an account?{" "}
              <NavLink className="underline" to="/login">
                Log in
              </NavLink>
              .
            </span>
            {/* Submit */}
            <Button
              className={"bg-yellow-300 px-4 py-1 font-medium"}
              onClick={() => handleRegister()}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
