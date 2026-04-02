import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Club } from "@/types/clubType";
import { Clock, User } from "lucide-react";

const GRADIENTS = [
  "from-indigo-400 to-violet-500",
  "from-cyan-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
];

function getGradient(id: string) {
  return GRADIENTS[id.charCodeAt(id.length - 1) % GRADIENTS.length];
}

interface ClubBannerProps {
  data: Club;
}

const ClubBanner: React.FC<ClubBannerProps> = ({ data }) => {
  const gradient = getGradient(data._id);
  const formattedDate = new Date(data.createdAt).toLocaleDateString("zh-TW");

  return (
    <div className="w-full rounded-xl border border-border overflow-hidden bg-card">
      {/* Cover */}
      <div className={`relative h-28 sm:h-36 w-full bg-gradient-to-br ${gradient}`}>
        {data.picture && (
          <img src={data.picture} alt={data.name} className="w-full h-full object-cover absolute inset-0" />
        )}
      </div>

      {/* Avatar + info row */}
      <div className="px-5 pb-5">
        <div className="flex items-end gap-4 -mt-8 mb-3">
          <Avatar className="h-16 w-16 border-4 border-background shadow-md shrink-0">
            <AvatarImage src={data.picture} />
            <AvatarFallback className="text-xl font-bold bg-muted">
              {data.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="pb-1 min-w-0">
            <h1 className="font-display font-bold text-xl sm:text-2xl leading-tight truncate">{data.name}</h1>
          </div>
        </div>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            <span>
              Owner：
              <span className="font-medium text-foreground">{data.owner.name}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>建立於 {formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubBanner;
