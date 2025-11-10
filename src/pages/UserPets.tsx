
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import AddPetDialog from "@/components/pets/AddPetDialog";
import EditPetDialog from "@/components/pets/EditPetDialog";
import EmptyPetState from "@/components/pets/EmptyPetState";
import PetCard from "@/components/pets/PetCard";
import { Pet } from "@/types/auth";
import { Link } from "react-router-dom";

const UserPets = () => {
  const { getUserPets, deletePet } = useAuth();
  const { toast } = useToast();
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initial pet load and refresh function
  useEffect(() => {
    refreshPets();
  }, []);
  
  const refreshPets = async () => {
    try {
      setIsLoading(true);
      const userPets = await getUserPets();
      setPets(userPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      toast({
        title: "Error",
        description: "Failed to load your pets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeletePet = async (pet: Pet) => {
    if (confirm(`Are you sure you want to remove ${pet.name} from your pets?`)) {
      const success = await deletePet(pet.id);
      
      if (success) {
        await refreshPets();
        
        toast({
          title: "Pet removed",
          description: `${pet.name} has been removed from your pets.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to remove pet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  const startEditPet = (pet: Pet) => {
    setCurrentPet(pet);
    setIsEditDialogOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse">Loading your pets...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Pets</h1>
        
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Pet
        </Button>
      </div>
      
      <div className="space-y-6">
        {pets.length === 0 ? (
          <EmptyPetState onAddPet={() => setIsAddDialogOpen(true)} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pets.map((pet) => (
                <PetCard 
                  key={pet.id} 
                  pet={pet} 
                  onEdit={startEditPet} 
                  onDelete={handleDeletePet} 
                />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link to="/appointment" className="text-pet-blue-dark hover:underline">
                Schedule an appointment for your pet →
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Add Pet Dialog */}
      <AddPetDialog 
        isOpen={isAddDialogOpen} 
        setIsOpen={setIsAddDialogOpen} 
        onPetAdded={refreshPets} 
      />
      
      {/* Edit Pet Dialog */}
      <EditPetDialog 
        isOpen={isEditDialogOpen} 
        setIsOpen={setIsEditDialogOpen} 
        currentPet={currentPet} 
        onPetUpdated={refreshPets} 
      />
    </div>
  );
};

export default UserPets;
