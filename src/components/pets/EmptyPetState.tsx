
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PawPrint, Plus } from "lucide-react";

interface EmptyPetStateProps {
  onAddPet: () => void;
}

const EmptyPetState = ({ onAddPet }: EmptyPetStateProps) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <PawPrint className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium mb-2">No pets yet</h3>
        <p className="text-center text-muted-foreground mb-6">
          Add your pets to keep track of their health records and appointments
        </p>
        <Button onClick={onAddPet}>
          <Plus className="mr-2 h-4 w-4" />
          Add Your First Pet
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyPetState;
