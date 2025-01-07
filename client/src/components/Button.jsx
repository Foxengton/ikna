export default function Button(className) {
  return (
    <div
      className={
        "whitespace-nowrap h-min px-4 py-2 rounded-lg " + className.className
      }
    >
      Sign in
    </div>
  );
}
