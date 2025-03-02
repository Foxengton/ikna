import { Children } from "react";
import { NavLink } from "react-router";

export default function ButtonLink({ className, to, children }) {
  return (
    <NavLink
      className={`flex justify-center items-center gap-2 whitespace-nowrap ${className}`}
      to={to}
    >
      {Children.toArray(children)}
    </NavLink>
  );
}
