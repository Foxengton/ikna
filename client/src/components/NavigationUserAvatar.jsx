import { Avatar } from "radix-ui";

export default function NavigationUserAvatar({ username, className }) {
  return (
    <Avatar.Root>
      <Avatar.Image
        className={`rounded-full ${className}`}
        src={`https://ui-avatars.com/api/?background=ffdf20&length=1&bold=true&name=${username}`}
      />
    </Avatar.Root>
  );
}
