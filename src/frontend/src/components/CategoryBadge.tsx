interface CategoryBadgeProps {
  category: string;
  size?: "sm" | "md";
}

const categoryColors: Record<string, string> = {
  "Skin Care": "bg-rose-50 text-rose-700 border border-rose-200",
  Skincare: "bg-rose-50 text-rose-700 border border-rose-200",
  "Hair Care": "bg-amber-50 text-amber-700 border border-amber-200",
  Haircare: "bg-amber-50 text-amber-700 border border-amber-200",
  Makeup: "bg-pink-50 text-pink-700 border border-pink-200",
  "Body Care": "bg-teal-50 text-teal-700 border border-teal-200",
  "Personal Care": "bg-sky-50 text-sky-700 border border-sky-200",
  Fragrance: "bg-purple-50 text-purple-700 border border-purple-200",
  Beauty: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
  "Luxury Products": "bg-amber-50 text-amber-800 border border-amber-300",
};

export default function CategoryBadge({
  category,
  size = "sm",
}: CategoryBadgeProps) {
  const colorClass =
    categoryColors[category] ??
    "bg-gray-50 text-gray-700 border border-gray-200";
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
    >
      {category}
    </span>
  );
}
