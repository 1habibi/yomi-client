import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  user: {
    avatar_url?: string | null;
    name: string;
  };
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

/**
 * Унифицированный компонент аватара пользователя с отображением первой буквы имени в случае отсутствия аватара
 */
export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const sizeClass = sizeClasses[size];
  const fallbackLetter = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <Avatar className={`${sizeClass} ${className || ""}`}>
      <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
      <AvatarFallback>{fallbackLetter}</AvatarFallback>
    </Avatar>
  );
}
