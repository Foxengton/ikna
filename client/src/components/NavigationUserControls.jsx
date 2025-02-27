import NavigationUserAvatar from "./NavigationUserAvatar.jsx";
import { DropdownMenu } from "radix-ui";
import { NavLink, useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider.jsx";
import {
  PiSignOutBold,
  PiGearFill,
  PiUserFill,
  PiCaretDownFill,
  PiCaretUpFill,
} from "react-icons/pi";

export default function NavigationUserControls({ username }) {
  const [userData, setUserData] = useContext(AuthContext);
  const navigate = useNavigate();

  const items = [
    {
      text: "Profile",
      icon: <PiUserFill size="1.1rem" />,
      link: "/profile",
    },
    {
      text: "Settings",
      icon: <PiGearFill size="1.1rem" />,
      link: "/settings",
    },
    {
      text: "Log out",
      icon: <PiSignOutBold size="1.1rem" />,
      link: "/",
      onClick: handleLogOut,
    },
  ];

  // Deleting the user token works as a sign out
  function handleLogOut() {
    setUserData(null);
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex justify-end items-center gap-3 group">
        <NavigationUserAvatar username={username} className="w-12 w-12" />
        <span>{username}</span>
        {/* Conditional chevron icon */}
        <PiCaretUpFill
          size="0.8rem"
          className="group-data-[state=closed]:hidden"
        />
        <PiCaretDownFill
          size="0.8rem"
          className="group-data-[state=open]:hidden"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white shadow-lg rounded-md py-2 z-20 mt-[-2]"
          align="end"
        >
          {items.map((item, index) => (
            <DropdownMenu.Item className="flex items-center" key={index}>
              <NavLink
                className="px-4 py-2 pe-6 flex w-full items-center gap-2 hover:bg-yellow-300 focus:bg-yellow-300"
                to={item?.link}
                onClick={item?.onClick}
              >
                {item.icon}
                <span>{item.text}</span>
              </NavLink>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
