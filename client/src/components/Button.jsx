import { Children } from "react";
import { NavLink } from "react-router";

export default function Button({ className, to = null, onClick, children }) {
  return (
    <NavLink
      className={"whitespace-nowrap px-4 py-2 rounded-lg " + className}
      to={to}
      onClick={onClick}
    >
      {Children.toArray(children)}
    </NavLink>
  );
}
