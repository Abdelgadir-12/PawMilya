import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PetFormData, DEFAULT_PET_FORM } from "./AddPetDialog";
import { Pet } from "@/types/auth";

interface EditPetDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentPet: Pet | null;
  onPetUpdated: () => void;
}

const EditPetDialog = ({ isOpen, setIsOpen, currentPet, onPetUpdated }: EditPetDialogProps) => {
  const { updatePet, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PetFormData>(DEFAULT_PET_FORM);
  const [showBreedOther, setShowBreedOther] = useState(false);

  // Breed options for each pet type
  const dogBreeds = [
    "Golden Retriever", "Labrador Retriever", "German Shepherd", "Bulldog",
    "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund",
    "Siberian Husky", "Boxer", "Border Collie", "Chihuahua", "Shih Tzu", "Mixed Breed", "Other"
  ];

  const catBreeds = [
    "Persian", "Maine Coon", "Siamese", "Ragdoll", "British Shorthair",
    "Abyssinian", "Birman", "Oriental Shorthair", "American Shorthair",
    "Scottish Fold", "Sphynx", "Russian Blue", "Mixed Breed", "Other"
  ];

  const birdBreeds = [
    "Budgerigar", "Cockatiel", "Cockatoo", "African Grey", "Macaw",
    "Parakeet", "Canary", "Finch", "Lovebird", "Conure", "Mixed Breed", "Other"
  ];

  const rabbitBreeds = [
    "Netherland Dwarf", "Holland Lop", "Mini Rex", "Lionhead", "Angora",
    "Flemish Giant", "Rex", "Mini Lop", "English Lop", "French Lop", "Mixed Breed", "Other"
  ];

  const reptileBreeds = [
    "Bearded Dragon", "Leopard Gecko", "Ball Python", "Corn Snake", "Iguana",
    "Chameleon", "Turtle", "Tortoise", "Monitor Lizard", "Boa", "Mixed Breed", "Other"
  ];

  const otherBreeds = [
    "Hamster", "Guinea Pig", "Ferret", "Chinchilla", "Hedgehog",
    "Sugar Glider", "Rat", "Mouse", "Gerbil", "Hamster", "Mixed Breed", "Other"
  ];

  // Function to get breed options based on pet type
  const getBreedOptions = (type: string) => {
    switch (type) {
      case "dog":
        return dogBreeds;
      case "cat":
        return catBreeds;
      case "bird":
        return birdBreeds;
      case "rabbit":
        return rabbitBreeds;
      case "reptile":
        return reptileBreeds;
      case "other":
        return otherBreeds;
      default:
        return [];
    }
  };
  
  useEffect(() => {
    if (currentPet) {
      // Handle breed selection for existing pets
      let breedValue = currentPet.breed || "";
      let breedOtherValue = "";
      
      // Check if the breed exists in the dropdown options
      const breedOptions = getBreedOptions(currentPet.type);
      const breedExists = breedOptions.includes(currentPet.breed || "");
      
      if (currentPet.breed && !breedExists) {
        breedValue = "Other";
        breedOtherValue = currentPet.breed;
        setShowBreedOther(true);
      } else {
        setShowBreedOther(false);
      }
      
      setFormData({
        name: currentPet.name,
        type: (currentPet.type === "fish" ? "other" : currentPet.type),
        species: currentPet.species,
        breed: breedValue,
        breedOther: breedOtherValue,
        weight: currentPet.weight || "",
        birthDate: currentPet.birthDate,
        gender: currentPet.gender
      });
    }
  }, [currentPet]);
  
  const handleFormChange = (field: keyof PetFormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Auto-update species when type changes for simple types
      if (field === "type" && ["dog", "cat", "bird", "fish", "hamster", "rabbit"].includes(value)) {
        updated.species = value;
        // Clear breed when type changes
        updated.breed = "";
        setShowBreedOther(false);
      }
      // Handle breed selection
      if (field === "breed") {
        setShowBreedOther(value === "Other");
        if (value !== "Other") {
          updated.breedOther = "";
        }
      }
      return updated;
    });
  };
  
  const handleEditPet = async () => {
    if (!currentPet) return;

    if (!formData.birthDate) {
      toast({
        title: "Birth date required",
        description: "Please enter your pet's birth date.",
        variant: "destructive",
      });
      return;
    }

    // Handle breed selection
    let finalBreed = formData.breed;
    if (formData.breed === "Other" && formData.breedOther) {
      finalBreed = formData.breedOther;
    }

    const petData = {
      ...formData,
      breed: finalBreed
    };

    const success = await updatePet(currentPet.id, petData);

    if (success) {
      onPetUpdated();
      setIsOpen(false);
      toast({
        title: "Pet updated",
        description: `${formData.name}'s information has been updated.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update pet. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pet</DialogTitle>
          <DialogDescription>
            Update your pet's information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Pet Name*</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter pet name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Pet Type*</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleFormChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="rabbit">Rabbit</SelectItem>
                  <SelectItem value="hamster">Hamster</SelectItem>
                  <SelectItem value="reptile">Reptile</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-gender">Gender*</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleFormChange("gender", value as "male" | "female")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-breed">Breed (Optional)</Label>
            <Select
              value={formData.breed}
              onValueChange={(value) => handleFormChange("breed", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select breed" />
              </SelectTrigger>
              <SelectContent>
                {getBreedOptions(formData.type).map((breed) => (
                  <SelectItem key={breed} value={breed}>
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {showBreedOther && (
            <div className="space-y-2">
              <Label htmlFor="edit-breedOther">Please specify the breed</Label>
              <Input
                id="edit-breedOther"
                value={formData.breedOther || ""}
                onChange={(e) => handleFormChange("breedOther", e.target.value)}
                placeholder="Enter the specific breed name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-weight">Weight (Optional)</Label>
            <Input
              id="edit-weight"
              value={formData.weight}
              onChange={(e) => handleFormChange("weight", e.target.value)}
              placeholder="Enter weight (e.g., 5 kg, 10 lbs)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-birthDate">Birth Date*</Label>
            <Input
              id="edit-birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleFormChange("birthDate", e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground">Required to calculate your pet's age</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-owner">Owner</Label>
            <Input
              id="edit-owner"
              value={user?.name || ""}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditPet} disabled={!formData.name || !formData.birthDate}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPetDialog;
