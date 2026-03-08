import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  productId?: string;
}

// Generate a deterministic rating between 4.0–5.0 based on product id
function getRating(productId?: string): number {
  if (!productId) return 4.5;
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = ((hash << 5) - hash + productId.charCodeAt(i)) | 0;
  }
  const normalized = Math.abs(hash % 10) / 10;
  return 4.0 + normalized;
}

export default function StarRating({ rating, productId }: StarRatingProps) {
  const score = rating ?? getRating(productId);
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((pos) => {
        const i = pos - 1;
        const filled = i < fullStars || (i === fullStars && hasHalf);
        return (
          <Star
            key={pos}
            className={`w-3.5 h-3.5 ${
              filled
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30"
            }`}
          />
        );
      })}
      <span className="text-xs text-muted-foreground ml-1">
        ({score.toFixed(1)})
      </span>
    </div>
  );
}
