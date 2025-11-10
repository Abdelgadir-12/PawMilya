import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Pet } from "@/types/auth";

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
}

const PetCard = ({ pet, onEdit, onDelete }: PetCardProps) => {
  const { calculatePetAge } = useAuth();
  
  // Get appropriate icon based on pet type
  const getPetIcon = (type: string) => {
    switch (type) {
      case "dog": return "🐕";
      case "cat": return "🐈";
      case "bird": return "🦜";
      default: return "🐾";
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between">
          <span className="flex items-center">
            <span className="mr-2 text-xl">{getPetIcon(pet.type)}</span>
            {pet.name}
          </span>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(pet)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(pet)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {pet.breed ? `${pet.type} · ${pet.breed}` : pet.type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Birth Date:</span>
            <span>{new Date(pet.birthDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age:</span>
            <span>{calculatePetAge(pet.birthDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gender:</span>
            <span className="capitalize">{pet.gender}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <span className="text-xs text-muted-foreground flex items-center">
          <Heart className="h-3 w-3 mr-1 fill-pet-teal stroke-none" />
          Since {new Date(parseInt(pet.id.split('-')[1])).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
