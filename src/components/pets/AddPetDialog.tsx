
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type PetFormData = {
  name: string;
  type: "dog" | "cat" | "bird" | "rabbit" | "hamster" | "fish" | "reptile" | "other";
  species: string;
  breed?: string;
  breedOther?: string;
  weight?: string;
  birthDate: string;
  gender: "male" | "female";
};

export const DEFAULT_PET_FORM: PetFormData = {
  name: "",
  type: "dog",
  species: "dog",
  breed: "",
  breedOther: "",
  weight: "",
  birthDate: "",
  gender: "male"
};

interface AddPetDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onPetAdded: () => void;
}

const AddPetDialog = ({ isOpen, setIsOpen, onPetAdded }: AddPetDialogProps) => {
  const { addPet, user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<PetFormData>(DEFAULT_PET_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  
  const handleFormChange = (field: keyof PetFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Always sync species to selected type to keep DB consistent
      if (field === "type") {
        updated.species = value;
        // Clear breed when type changes
        updated.breed = "";
        updated.breedOther = "";
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
  
  const handleAddPet = async () => {
    if (!user?.id) {
      toast({
        title: "Not signed in",
        description: "Please log in to add a pet.",
        variant: "destructive",
      });
      return;
    }
    if (!formData.name.trim()) {
      toast({
        title: "Pet name required",
        description: "Please enter your pet's name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.birthDate) {
      toast({
        title: "Birth date required",
        description: "Please enter your pet's birth date.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Handle breed selection
      let finalBreed = formData.breed;
      if (formData.breed === "Other" && formData.breedOther) {
        finalBreed = formData.breedOther;
      }
      
      const petData = {
        ...formData,
        breed: finalBreed
      };
      
      console.log("Adding pet with data:", petData);
      
      await addPet(petData);
      
      console.log("Pet added successfully");
      setIsOpen(false);
      setFormData(DEFAULT_PET_FORM);
      onPetAdded();
      
      toast({
        title: "Pet added",
        description: `${formData.name} has been added to your pets.`,
      });
    } catch (error: any) {
      console.error("Error adding pet:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to add pet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Pet</DialogTitle>
          <DialogDescription>
            Enter your pet's information below
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pet Name*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Enter pet name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Pet Type*</Label>
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
                  <SelectItem value="fish">Fish</SelectItem>
                  <SelectItem value="reptile">Reptile</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender*</Label>
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
            <Label htmlFor="breed">Breed (Optional)</Label>
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
              <Label htmlFor="breedOther">Please specify the breed</Label>
              <Input
                id="breedOther"
                value={formData.breedOther || ""}
                onChange={(e) => handleFormChange("breedOther", e.target.value)}
                placeholder="Enter the specific breed name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (Optional)</Label>
            <Input
              id="weight"
              value={formData.weight}
              onChange={(e) => handleFormChange("weight", e.target.value)}
              placeholder="Enter weight (e.g., 5 kg, 10 lbs)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth Date*</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleFormChange("birthDate", e.target.value)}
              required
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-muted-foreground">Required to calculate your pet's age</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner">Owner</Label>
            <Input
              id="owner"
              value={user?.name || ""}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddPet} 
            disabled={!formData.name.trim() || !formData.birthDate || isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Pet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPetDialog;
