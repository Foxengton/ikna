import { Children } from "react";

export default function Button({ className, onClick, children }) {
  return (
    <button
      className={`flex justify-center items-center gap-2 whitespace-nowrap ${className}`}
      onClick={onClick}
    >
      {Children.toArray(children)}
    </button>
  );
}
