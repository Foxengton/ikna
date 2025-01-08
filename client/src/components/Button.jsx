export default function Button({ className, text = "Button" }) {
  return (
    <div
      className={"whitespace-nowrap h-min px-4 py-2 rounded-lg " + className}
    >
      {text}
    </div>
  );
}
