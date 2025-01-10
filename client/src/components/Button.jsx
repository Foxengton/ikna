import { Children } from "react";

export default function Button({ className, children }) {
  return (
    <div
      className={"whitespace-nowrap h-min px-4 py-2 rounded-lg " + className}
    >
      {Children.toArray(children)}
    </div>
  );
}
