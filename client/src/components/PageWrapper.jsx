import { useLayoutEffect } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import NavigationBar from "../components/NavigationBar.jsx";
import { AuthContext } from "../contexts/AuthProvider.jsx";

export default function PageWrapper({
  children,
  authRedirect = "",
  title = "Ikna",
}) {
  const navigate = useNavigate();
  const [userData, setUserData] = useContext(AuthContext);
  const username = userData?.username;
  const [showContent, setShowContent] = useState(false);
  if (!title) title = "Ikna";

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    if (authRedirect && !username) {
      navigate(authRedirect);
    } else setShowContent(true);
  }, []);

  return (
    <div className="relative bg-slate-50 min-h-screen flex flex-col font-noto">
      <NavigationBar />
      {showContent ? children : null}
    </div>
  );
}
