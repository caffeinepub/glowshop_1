import { useState } from "react";

interface ProductImageProps {
  imageUrl?: string;
  category: string;
  name: string;
  className?: string;
}

const categoryGradients: Record<string, string> = {
  "Skin Care": "from-rose-100 via-pink-50 to-rose-200",
  Skincare: "from-rose-100 via-pink-50 to-rose-200",
  "Hair Care": "from-amber-100 via-yellow-50 to-amber-200",
  Haircare: "from-amber-100 via-yellow-50 to-amber-200",
  Makeup: "from-pink-200 via-rose-100 to-fuchsia-200",
  "Body Care": "from-teal-100 via-emerald-50 to-teal-200",
  "Personal Care": "from-sky-100 via-blue-50 to-sky-200",
  Fragrance: "from-purple-100 via-violet-50 to-purple-200",
  Beauty: "from-pink-100 via-rose-50 to-fuchsia-100",
  "Luxury Products": "from-amber-100 via-yellow-50 to-orange-100",
};

const categoryEmoji: Record<string, string> = {
  "Skin Care": "✨",
  Skincare: "✨",
  "Hair Care": "💆",
  Haircare: "💆",
  Makeup: "💄",
  "Body Care": "🧴",
  "Personal Care": "🧴",
  Fragrance: "🌸",
  Beauty: "💅",
  "Luxury Products": "👑",
};

export default function ProductImage({
  imageUrl,
  category,
  name,
  className = "",
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const gradient =
    categoryGradients[category] ?? "from-rose-100 via-pink-50 to-rose-200";
  const emoji = categoryEmoji[category] ?? "✨";

  if (imageUrl && !errored) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`w-full h-full object-cover ${className}`}
        onError={() => setErrored(true)}
      />
    );
  }

  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center ${className}`}
    >
      <span className="text-4xl opacity-80">{emoji}</span>
    </div>
  );
}
