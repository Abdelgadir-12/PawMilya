
import { User } from "lucide-react";

interface VetProfileCardProps {
  name: string;
  specialty: string;
  experience: number;
  image?: string;
  description: string;
}

export function VetProfileCard({
  name,
  specialty,
  experience,
  image,
  description
}: VetProfileCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
      <div className="h-48 overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-pet-gray flex items-center justify-center">
            <User size={64} className="text-pet-gray-dark" />
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-medium mb-1">{name}</h3>
        <p className="text-pet-blue-dark font-medium text-sm mb-3">{specialty}</p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="font-medium">Experience:</span> {experience} years
        </div>

        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

        
        
