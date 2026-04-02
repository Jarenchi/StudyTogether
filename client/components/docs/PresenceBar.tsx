import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface PresenceUser {
  name: string;
  picture: string;
}

interface PresenceBarProps {
  users: PresenceUser[];
}

const MAX_VISIBLE = 4;

const PresenceBar = ({ users }: PresenceBarProps) => {
  if (users.length === 0) return null;

  const visible = users.slice(0, MAX_VISIBLE);
  const extra = users.length - MAX_VISIBLE;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {visible.map((user) => (
            <Tooltip key={user.name}>
              <TooltipTrigger asChild>
                <Avatar className="h-7 w-7 border-2 border-background ring-1 ring-primary/30 cursor-default">
                  <AvatarImage src={user.picture} alt={user.name} />
                  <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {extra > 0 && (
            <div className="h-7 w-7 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
              +{extra}
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {users.length} 人在線
        </span>
      </div>
    </TooltipProvider>
  );
};

export default PresenceBar;
