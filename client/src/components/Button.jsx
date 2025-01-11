import { Children } from "react";
import { NavLink } from "react-router";

export default function Button({ className, to = null, children }) {
  return (
    <NavLink
      className={"whitespace-nowrap h-min px-4 py-2 rounded-lg " + className}
      to={to}
    >
      {Children.toArray(children)}
    </NavLink>
  );
}
