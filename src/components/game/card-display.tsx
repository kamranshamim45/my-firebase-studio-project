"use client";

import type { Card, Suit } from "@/lib/game";
import { cn } from "@/lib/utils";
import { Card as ShadCard, CardContent } from "@/components/ui/card";
import { Heart, Diamond, Club } from "lucide-react"; // Using lucide icons for suits

interface CardDisplayProps {
  card: Card | null;
  facedown?: boolean;
  animate?: boolean;
}

const SuitIcon = ({ suit, className }: { suit: Suit; className?: string }) => {
  const commonProps = { className: cn("w-4 h-4 inline-block", className) };
  switch (suit) {
    case "Hearts":
      return <Heart {...commonProps} fill="currentColor" />;
    case "Diamonds":
      return <Diamond {...commonProps} fill="currentColor" />;
    case "Clubs":
       // Lucide doesn't have a dedicated club icon that looks like a traditional suit, use a placeholder or custom SVG
       return <Club {...commonProps} fill="currentColor" /> // Using Lucide's Club as a placeholder
       // Or provide a custom SVG:
       // return <svg ...>...</svg>
    case "Spades":
      // Lucide doesn't have a dedicated spade icon, use a placeholder or custom SVG
      return <span {...commonProps}>♠</span>; // Using text character
      // Or provide a custom SVG:
      // return <svg ...>...</svg>
    default:
      return null;
  }
};

export const CardDisplay: React.FC<CardDisplayProps> = ({ card, facedown = false, animate = false }) => {
  const suitColor = card && (card.suit === "Hearts" || card.suit === "Diamonds")
    ? "text-accent" // Use red accent for Hearts/Diamonds
    : "text-foreground"; // Use default foreground for Clubs/Spades

  return (
    <ShadCard
      className={cn(
        "w-24 h-36 border-2 flex flex-col items-center justify-center transition-transform duration-300",
        facedown ? "bg-secondary border-secondary-foreground" : "bg-card",
        animate && "animate-card-reveal",
        suitColor // Apply color based on suit
      )}
      style={{ perspective: '1000px' }} // Needed for 3D transform effect if using rotateY
    >
      {facedown || !card ? (
        <CardContent className="flex items-center justify-center h-full">
          {/* Optional: Add a pattern or logo for the card back */}
           <div className="w-full h-full bg-primary rounded-md flex items-center justify-center">
             <span className="text-primary-foreground text-4xl font-bold">A</span>
           </div>
        </CardContent>
      ) : (
        <CardContent className="flex flex-col justify-between items-center h-full w-full p-2">
          <div className="self-start">
            <span className="text-xl font-bold">{card.rank}</span>
            <SuitIcon suit={card.suit} className="ml-1" />
          </div>
          <div className="text-4xl">
            <SuitIcon suit={card.suit} className="w-8 h-8" />
          </div>
          <div className="self-end rotate-180">
             <span className="text-xl font-bold">{card.rank}</span>
             <SuitIcon suit={card.suit} className="ml-1" />
          </div>
        </CardContent>
      )}
    </ShadCard>
  );
};
