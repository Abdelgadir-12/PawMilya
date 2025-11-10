import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Clock, PawPrint } from "lucide-react";
import { saveAppointmentToDB } from "@/utils/appointmentDB";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AppointmentSuccessDialog } from "@/components/AppointmentSuccessDialog";
import { AppointmentConfirmDialog } from "@/components/AppointmentConfirmDialog";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petSpecies: z.string().min(1, "Pet species is required"),
  reptileType: z.string().optional(),
  otherSpecies: z.string().optional(),
  breed: z.string().optional(), 
  breedOther: z.string().optional(),
  weight: z.string().optional(),
  ownerName: z.string().min(1, "Owner name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  service: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  bloodTest: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function AppointmentForm() {
  const { toast } = useToast();
  const { user, getUserPets } = useAuth();
  const [userPets, setUserPets] = useState<any[]>([]);
  const [petsLoading, setPetsLoading] = useState(false);
  const [showReptileType, setShowReptileType] = useState(false);
  const [showOtherSpecies, setShowOtherSpecies] = useState(false);
  const [showBreedOther, setShowBreedOther] = useState(false);
  const [showBreedSelection, setShowBreedSelection] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [pendingAppointmentData, setPendingAppointmentData] = useState<any>(null);
  const navigate = useNavigate();

  const petSpeciesOptions = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "bird", label: "Bird" },
    { value: "rabbit", label: "Rabbit" },
    { value: "reptile", label: "Reptile" },
    { value: "other", label: "Other" },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // Set default values for ownerName, email, and phone if user is available
    defaultValues: {
      ownerName: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // Load user's pets on component mount
  React.useEffect(() => {
    if (user) {
      setPetsLoading(true);
      (async () => {
        try {
          const pets = await getUserPets();
          setUserPets(pets || []);
        } catch (error) {
          setUserPets([]);
        } finally {
          setPetsLoading(false);
        }
      })();
    }
  }, [user, getUserPets]);

  // Autofill ownerName, email, and phone when user changes
  React.useEffect(() => {
    if (user) {
      form.setValue("ownerName", user.name || "");
      form.setValue("email", user.email || "");
      form.setValue("phone", user.phone || "");
    }
  }, [user, form]);

  const watchedSpecies = form.watch("petSpecies");
  const watchedReptileType = form.watch("reptileType");
  const watchedBreed = form.watch("breed");

  // Show/hide conditional fields based on species selection
  React.useEffect(() => {
    setShowReptileType(watchedSpecies === "reptile");
    setShowOtherSpecies(watchedSpecies === "other");
    setShowBreedSelection(watchedSpecies !== "reptile");
    // Clear fields when species changes
    if (watchedSpecies !== "reptile") {
      form.setValue("reptileType", "");
    }
    if (watchedSpecies !== "other") {
      form.setValue("otherSpecies", "");
    }
    // Show breed dropdown for all species except reptile, clear when species changes
    if (watchedSpecies === "reptile") {
      form.setValue("breed", "");
      setShowBreedOther(false);
    } else {
      form.setValue("breed", "");
      setShowBreedOther(false);
    }
  }, [watchedSpecies, form]);



  // Show/hide breedOther field for "Other" breed
  React.useEffect(() => {
    if (watchedBreed === "Other") {
      setShowBreedOther(true);
    } else {
      setShowBreedOther(false);
      form.setValue("breedOther", "");
    }
  }, [watchedBreed, form]);

  // Handle pet selection for autofill
  const handlePetSelect = (petId: string) => {
    if (petId === "none") {
             form.reset({
         ...form.getValues(),
         petName: "",
         petSpecies: "",
         reptileType: "",
         otherSpecies: "",
         breed: "",
         breedOther: "",
         weight: "",
       });
      return;
    }
    const selectedPet = userPets.find(pet => pet.id === petId);
    if (selectedPet) {
      form.setValue("petName", selectedPet.name);
      // Handle species and type
      if (selectedPet.species?.startsWith("reptile:")) {
        form.setValue("petSpecies", "reptile", { shouldValidate: true });
        const reptileType = selectedPet.species.substring(8);
        setTimeout(() => {
          form.setValue("reptileType", reptileType, { shouldValidate: true });
        }, 100);
      } else if (selectedPet.species?.startsWith("other:")) {
        form.setValue("petSpecies", "other", { shouldValidate: true });
        setTimeout(() => {
          form.setValue("otherSpecies", selectedPet.species.substring(6), { shouldValidate: true });
        }, 100);
      } else {
        form.setValue("petSpecies", selectedPet.type || selectedPet.species, { shouldValidate: true });
      }
      // Handle breed if available
      if (selectedPet.breed) {
        // Try to match breed to dropdown, otherwise set as "Other" and fill breedOther
        const species = selectedPet.type || selectedPet.species;
        const breedList = getBreedOptions(species);
        const match = breedList.find(b => b.toLowerCase() === selectedPet.breed.toLowerCase());
        if (match) {
          setTimeout(() => {
            form.setValue("breed", match, { shouldValidate: true });
          }, 100);
        } else {
          setTimeout(() => {
            form.setValue("breed", "Other", { shouldValidate: true });
            form.setValue("breedOther", selectedPet.breed, { shouldValidate: true });
          }, 100);
        }
      }
      // Handle weight if available
      if (selectedPet.weight) {
        setTimeout(() => {
          form.setValue("weight", selectedPet.weight, { shouldValidate: true });
        }, 100);
      }
      // Trigger form validation
      form.trigger(["petSpecies", "reptileType", "otherSpecies", "breed", "weight"]);
      toast({
        title: "Pet information filled",
        description: `Information for ${selectedPet.name} has been added to the form.`,
      });
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
             let finalSpecies = data.petSpecies;
       if (data.petSpecies === "reptile" && data.reptileType) {
         finalSpecies = `reptile:${data.reptileType}`;
       } else if (data.petSpecies === "other" && data.otherSpecies) {
         finalSpecies = `other:${data.otherSpecies}`;
       }
             let finalBreed = data.breed || "";
       if (data.breed === "Other" && data.breedOther) {
         finalBreed = data.breedOther;
       }
      const appointmentData = {
        petName: data.petName,
        petSpecies: finalSpecies,
        breed: finalBreed || "",
        weight: data.weight || "",
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        service: data.service,
        date: data.date,
        timeSlot: data.timeSlot,
        bloodTest: data.bloodTest || "",
        additionalInfo: data.additionalInfo || "",
        petAge: "",
        petGender: "",
        status: "Pending" as const,
      };
      setPendingAppointmentData(appointmentData);
      setShowConfirmDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to prepare appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConfirmAppointment = async () => {
    if (!pendingAppointmentData) return;
    if (!user?.id) {
      toast({
        title: "Not signed in",
        description: "Please log in to book an appointment.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let savedAppointment = null;
      
      try {
        // Save to localStorage
        console.log('🔄 Saving appointment...');
        savedAppointment = await saveAppointmentToDB({
          owner_id: user.id,
          pet_name: pendingAppointmentData.petName,
          pet_species: pendingAppointmentData.petSpecies,
          owner_name: pendingAppointmentData.ownerName,
          email: pendingAppointmentData.email,
          phone: pendingAppointmentData.phone,
          service: pendingAppointmentData.service,
          appointment_date: pendingAppointmentData.date,
          time_slot: pendingAppointmentData.timeSlot,
          additional_info: pendingAppointmentData.additionalInfo,
          blood_test: pendingAppointmentData.bloodTest
        });
        
        console.log('✅ Successfully saved appointment');
        
      } catch (error) {
        console.error('❌ Failed to save appointment:', error);
        toast({
          title: "Error",
          description: (error as any)?.message || "Failed to save appointment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (savedAppointment) {
        setAppointmentDetails({
          petName: pendingAppointmentData.petName,
          petSpecies: pendingAppointmentData.petSpecies,
          ownerName: pendingAppointmentData.ownerName,
          email: pendingAppointmentData.email,
          phone: pendingAppointmentData.phone,
          service: pendingAppointmentData.service,
          date: pendingAppointmentData.date,
          timeSlot: pendingAppointmentData.timeSlot,
        });
        setShowConfirmDialog(false);
        setShowSuccessDialog(true);
        form.reset();
        setPendingAppointmentData(null);
        
        // Show appropriate success message
        const storageMethod = 'local storage';
        toast({
          title: "Appointment Booked Successfully!",
          description: `Your appointment has been saved successfully.`,
        });
      } else {
        throw new Error('No appointment data returned from save operation');
      }
      
    } catch (error) {
      console.error('❌ Failed to save appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const handleEditAppointment = () => {
    setShowConfirmDialog(false);
  };

  const handleBookAgain = () => {
    setShowSuccessDialog(false);
  };

  const handleChangeSchedule = () => {
    setShowSuccessDialog(false);
    if (appointmentDetails) {
      form.setValue("petName", appointmentDetails.petName);
      form.setValue("ownerName", appointmentDetails.ownerName);
      form.setValue("email", appointmentDetails.email);
      form.setValue("phone", appointmentDetails.phone);
      form.setValue("service", appointmentDetails.service);
      // form.setValue("diagnosis", appointmentDetails.diagnosis); // Remove, not in schema
      if (appointmentDetails.petSpecies.startsWith("reptile:")) {
        form.setValue("petSpecies", "reptile");
        form.setValue("reptileType", appointmentDetails.petSpecies.substring(8));
      } else if (appointmentDetails.petSpecies.startsWith("other:")) {
        form.setValue("petSpecies", "other");
        form.setValue("otherSpecies", appointmentDetails.petSpecies.substring(6));
      } else {
        form.setValue("petSpecies", appointmentDetails.petSpecies);
      }
      form.setValue("date", "");
      form.setValue("timeSlot", "");
    }
    // Navigate to the AppointmentForm route for rescheduling
    navigate("/appointment");
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

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

  // Function to get breed options based on species
  const getBreedOptions = (species: string) => {
    switch (species) {
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

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-pet-blue-dark" />
            Book an Appointment
          </CardTitle>
          <CardDescription>
            Fill out the form below to schedule a visit for your pet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* ...existing code... */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <PawPrint size={18} />
                  Pet Information
                </h3>
                {/* ...existing code... */}
                <div className="p-4 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <FormLabel className="text-sm font-medium mb-2 block">
                    Quick Fill from Your Pets
                  </FormLabel>
                  {petsLoading ? (
                    <div className="text-sm text-muted-foreground">Loading your pets...</div>
                  ) : userPets.length > 0 ? (
                    <>
                      <Select onValueChange={handlePetSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose one of your registered pets to autofill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Manual entry (clear selection)</SelectItem>
                          {userPets.map((pet) => (
                            <SelectItem key={pet.id} value={pet.id}>
                              {pet.name} ({pet.species || pet.type}
                              {pet.breed && `, ${pet.breed}`}
                              {pet.weight && `, ${pet.weight}`})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="mt-1">
                        You have {userPets.length} registered pet{userPets.length !== 1 ? 's' : ''}. Select one to automatically fill the form below with their details.
                      </FormDescription>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      You don't have any registered pets yet. You can register your pets
                      for auto fill next time.
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="petName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your pet's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="petSpecies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Species</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={value => {
                              field.onChange(value);
                            }}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select pet species" />
                            </SelectTrigger>
                            <SelectContent>
                              {petSpeciesOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Reptile Type Selection */}
                {showReptileType && (
                  <FormField
                    control={form.control}
                    name="reptileType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Reptile</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reptile type" />
                            </SelectTrigger>
                          </FormControl>
                                                     <SelectContent>
                             <SelectItem value="lizard">Lizard</SelectItem>
                             <SelectItem value="iguana">Iguana</SelectItem>
                             <SelectItem value="turtle">Turtle</SelectItem>
                             <SelectItem value="chameleon">Chameleon</SelectItem>
                           </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Other Species Comment Box */}
                {showOtherSpecies && (
                  <FormField
                    control={form.control}
                    name="otherSpecies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify the type of pet</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Ferret, Guinea Pig, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                                 {/* Breed Selection */}
                 {showBreedSelection && (
                   <FormField
                     control={form.control}
                     name="breed"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Breed</FormLabel>
                         <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                           <FormControl>
                             <SelectTrigger>
                               <SelectValue placeholder="Select breed" />
                             </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                             {watchedSpecies && getBreedOptions(watchedSpecies).map((breed) => (
                               <SelectItem key={breed} value={breed}>
                                 {breed}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 )}
                {/* Breed Other Comment Box */}
                {showBreedOther && (
                  <FormField
                    control={form.control}
                    name="breedOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please specify the breed</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the specific breed name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {/* Weight Field */}
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter weight (e.g., 5 kg, 10 lbs)" {...field} />
                      </FormControl>
                      <FormDescription>
                        Helpful for medication dosing and health assessment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Blood Test Selection */}
                <FormField
                  control={form.control}
                  name="bloodTest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Chemistry Test (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood test type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No blood test needed</SelectItem>
                          <SelectItem value="basic">Basic Blood Chemistry - ₱1,200</SelectItem>
                          <SelectItem value="complete">Complete Blood Chemistry - ₱2,500</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Blood tests help assess your pet's overall health and organ function
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* ...existing code... */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* ...existing code... */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <CalendarDays size={18} />
                  Appointment Details
                </h3>
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="General Consultation">General Consultation</SelectItem>
                          <SelectItem value="Vaccination">Vaccination</SelectItem>
                          <SelectItem value="Pet Grooming">Pet Grooming</SelectItem>
                          <SelectItem value="Dental Care">Dental Care</SelectItem>
                          <SelectItem value="Surgery">Surgery</SelectItem>
                          <SelectItem value="Emergency Care">Emergency Care</SelectItem>
                          <SelectItem value="Hematology">Hematology</SelectItem>
                          <SelectItem value="Pharmacy Services">Pharmacy Services</SelectItem>
                          <SelectItem value="Digital X-Ray">Digital X-Ray</SelectItem>
                          <SelectItem value="Blood Chemistry">Blood Chemistry</SelectItem>
                          <SelectItem value="Tonometry">Tonometry</SelectItem>
                          <SelectItem value="Surgery with Gas Anesthetic Machine">Surgery with Gas Anesthetic Machine</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock size={16} />
                          Preferred Time
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional information about your pet's condition or special requirements..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Provide any additional details that might help us prepare for your visit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-pet-blue-dark hover:bg-pet-blue-dark/90">
                Review Appointment
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AppointmentConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        appointmentData={pendingAppointmentData}
        onConfirm={handleConfirmAppointment}
        onEdit={handleEditAppointment}
      />
      <AppointmentSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        appointmentDetails={appointmentDetails}
        onBookAgain={handleBookAgain}
        onChangeSchedule={handleChangeSchedule}
      />
    </>
  );
}
