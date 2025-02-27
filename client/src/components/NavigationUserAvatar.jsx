export default function NavigationUserAvatar({ username, className }) {
  return (
    <img
      className={`rounded-full ${className}`}
      src={`https://ui-avatars.com/api/?background=ffdf20&length=1&bold=true&name=${username}`}
    />
  );
}
