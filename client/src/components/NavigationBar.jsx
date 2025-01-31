import { useContext } from "react";
import { NavLink } from "react-router";
import Button from "../components/Button.jsx";
import AuthContext from "../contexts/AuthContext.jsx";

export default function NavigationBar() {
  const username = useContext(AuthContext)?.username;
  return (
    <header className="bg-slate-50 h-16 drop-shadow-lg grid grid-cols-[1fr,_auto,_1fr] px-6 z-10">
      {/* Left bar corner */}
      <div></div>
      {/* Navigation buttons */}
      <div className="flex justify-center items-center h-min-fit">
        <NavLink className="px-6 font-semibold" to="/">
          Home
        </NavLink>
        <NavLink className="px-6 font-semibold" to="/decks">
          Decks
        </NavLink>
        <NavLink className="px-6 font-semibold" to="/about">
          About
        </NavLink>
      </div>
      {/* Right bar corner */}
      <div className="flex items-center flex-row-reverse gap-2">
        {username ? `Welcome, ${username}!` : null}
        <Button className="bg-yellow-300 font-semibold" to="/login">
          Sign in
        </Button>
      </div>
    </header>
  );
}
