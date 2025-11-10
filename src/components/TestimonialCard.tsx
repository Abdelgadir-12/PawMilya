
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  petType: string;
  rating: number;
  testimonial: string;
  image?: string;
}

export function TestimonialCard({
  name,
  petType,
  rating,
  testimonial,
  image
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
      
      <p className="text-muted-foreground mb-6 italic">"{testimonial}"</p>
      
      <div className="flex items-center gap-3">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-pet-gray flex items-center justify-center">
            <span className="text-xl font-medium text-pet-gray-dark">
              {name.charAt(0)}
            </span>
          </div>
        )}
        
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-muted-foreground">{petType}</p>
        </div>
      </div>
    </div>
  );
}
