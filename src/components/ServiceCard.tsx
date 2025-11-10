import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  priceRange?: string;
  className?: string;
  iconClassName?: string;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  priceRange,
  className,
  iconClassName,
}: ServiceCardProps) {
  return (
    <div className={cn("card-glass p-6 group", className)}>
      <div
        className={cn(
          "w-12 h-12 flex items-center justify-center rounded-xl mb-4 transition-all group-hover:scale-110",
          "bg-gradient-to-br from-pet-blue to-pet-blue-dark/90",
          iconClassName
        )}
      >
        <Icon className="text-white" size={24} />
      </div>

      <h3 className="text-xl font-medium mb-2">{title}</h3>

      <p className="text-muted-foreground text-sm mb-4">{description}</p>

      {priceRange && (
        <div className="mt-auto pt-2 border-t border-gray-100">
          <span className="text-sm font-medium">
            Price:{" "}
            <span className="text-pet-blue-dark">₱{priceRange}</span>
          </span>
        </div>
      )}
    </div>
  );
}
