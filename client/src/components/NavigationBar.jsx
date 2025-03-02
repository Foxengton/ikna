import { useContext } from "react";
import { NavLink } from "react-router";
import ButtonLink from "../components/ButtonLink.jsx";
import { AuthContext } from "../contexts/AuthProvider.jsx";
import NavigationUserControls from "./NavigationUserControls.jsx";

export default function NavigationBar() {
  const [userData, setUserData] = useContext(AuthContext);
  const username = userData?.username;
  return (
    <header className="bg-white h-16 drop-shadow-lg flex px-6 z-10">
      {/* Left bar corner */}
      <div className="flex-1"></div>
      {/* Navigation buttons */}
      <div className="flex justify-center items-center h-min-fit shrink-0">
        <NavLink className="px-6 font-semibold" to="/">
          Home
        </NavLink>
        <NavLink className="px-6 font-semibold" to="/decks">
          Decks
        </NavLink>
        <NavLink
          className="px-6 font-semibold"
          to="https://github.com/Xijiks/ikna"
        >
          About
        </NavLink>
      </div>
      {/* Right bar corner */}
      <div className="flex flex-1 items-center flex-row-reverse gap-2">
        {!username ? (
          <ButtonLink
            className="bg-yellow-300 font-semibold rounded-lg px-4 py-2"
            to="/login"
          >
            Sign in
          </ButtonLink>
        ) : (
          <NavigationUserControls username={username} />
        )}
      </div>
    </header>
  );
}
