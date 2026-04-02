"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Club } from "@/types/clubType";
import { Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Gradient placeholders when a club has no cover image
const GRADIENTS = [
  "from-indigo-400 to-violet-500",
  "from-cyan-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
];

function getGradient(id: string) {
  const index = id.charCodeAt(id.length - 1) % GRADIENTS.length;
  return GRADIENTS[index];
}

interface ClubCardProps {
  club: Club;
  isMember: boolean;
  onJoin: (clubId: string) => void;
}

const ClubCard = ({ club, isMember, onJoin }: ClubCardProps) => {
  const gradient = getGradient(club._id);
  const visibleTags = club.tags?.slice(0, 3) ?? [];
  const extraTags = (club.tags?.length ?? 0) - 3;

  return (
    <div className="group rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      {/* Cover image / gradient banner */}
      <div className="relative aspect-video w-full overflow-hidden">
        {club.picture ? (
          <img src={club.picture} alt={club.name} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
        )}
        {/* Floating club avatar */}
        <div className="absolute -bottom-5 left-4">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src={club.picture} />
            <AvatarFallback className="text-sm font-semibold bg-background">
              {club.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Card body */}
      <div className="pt-7 px-4 pb-4 flex flex-col flex-1">
        <div className="flex-1">
          {/* Name */}
          {isMember ? (
            <Link href={`/myclubs/${club._id}`} className="hover:underline">
              <h3 className="font-display font-semibold text-base leading-snug line-clamp-1">{club.name}</h3>
            </Link>
          ) : (
            <h3 className="font-display font-semibold text-base leading-snug line-clamp-1">{club.name}</h3>
          )}

          {/* Description */}
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2 leading-relaxed">{club.description}</p>

          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {visibleTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                  {tag}
                </Badge>
              ))}
              {extraTags > 0 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{extraTags}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">{club.members.length}</span>
          </div>
          {!isMember && (
            <Button size="sm" onClick={() => onJoin(club._id)}>
              加入
            </Button>
          )}
          {isMember && (
            <Link href={`/myclubs/${club._id}`}>
              <Button size="sm" variant="outline">
                進入
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubCard;
