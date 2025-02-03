import Cookies from "js-cookie";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Button from "../components/Button.jsx";
import PageWrapper from "../components/PageWrapper.jsx";
import api from "../services/api.jsx";
import Cookie from "js-cookie";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  // Sumbitting account creation request
  async function loginHandle() {
    setErrors((prev) => (prev = []));
    const result = await api("post", "/login", {
      username: username,
      password: password,
    });
    if (result?.data) {
      Cookie.set("user-data", JSON.stringify(result.data));
      navigate("/");
    } else setErrors((prev) => [...prev, "Wrong username or password."]);
  }

  return (
    <PageWrapper>
      <div className="absolute h-screen w-screen">
        <div className="flex h-full justify-center items-center">
          <form className="flex flex-col p-4 bg-white rounded justify-center items-center shadow-xl w-72">
            <h1 className="font-semibold text-2xl mb-2">Login</h1>
            {/* Errors*/}
            <label className="flex flex-col items-start w-full gap-2 p-1 text-red-600 text-sm">
              {errors.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </label>
            {/* Username */}
            <div className="flex flex-col w-full">
              {/* Username input */}
              <input
                className="shadow-inner rounded p-2 bg-slate-50 mb-2"
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors([]);
                }}
                value={username}
              />
            </div>
            {/* Password */}
            <div className="flex flex-col w-full mb-4">
              {/* Password input */}
              <input
                type="password"
                className="shadow-inner rounded p-2 bg-slate-50"
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors([]);
                }}
                value={password}
              />
            </div>
            <span className="mb-4 p-1 w-full items-left text-sm">
              Don't have an account?{" "}
              <NavLink className="underline" to="/register">
                Register
              </NavLink>
              .
            </span>
            {/* Submit */}
            <Button
              className={"bg-yellow-300 px-4 py-1 font-medium"}
              onClick={() => loginHandle()}
            >
              Log in
            </Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
