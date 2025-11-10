import { useState, useEffect } from "react";
import { AppointmentForm } from "@/components/AppointmentForm";
import { CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

const Appointment = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userAppointments, setUserAppointments] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  
  // Automatically set the email from the authenticated user
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setUserEmail(user.email);
      checkAppointments(user.email);
    }
  }, [isAuthenticated, user]);
  
  const checkAppointments = (email: string = userEmail) => {
    if (!email) return;
    
    setIsChecking(true);
    // Removed localStorage usage
    setIsChecking(false);
  };
  
  // Get species icon based on pet type
  const getSpeciesIcon = (species: string | undefined) => {
    if (!species) {
      return "🐾";
    }
    
    if (species.startsWith("reptile:")) {
      const reptileType = species.substring(8);
      switch(reptileType) {
        case "snake": return "🐍";
        case "lizard": return "🦎";
        case "turtle": return "🐢";
        case "gecko": return "🦎";
        case "iguana": return "🦎";
        default: return "🦎";
      }
    }
    
    if (species.startsWith("other:")) {
      return "🐾";
    }
    
    switch(species) {
      case "dog": return "🐕";
      case "cat": return "🐈"; 
      case "bird": return "🦜";
      case "rabbit": return "🐇";
      case "hamster": return "🐹";
      case "reptile": return "🦎";
      default: return "🐾";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  // Format pet species for display
  const formatPetSpecies = (species: string) => {
    if (species.startsWith("reptile:")) {
      const reptileType = species.substring(8);
      return `${reptileType.charAt(0).toUpperCase() + reptileType.slice(1)} (Reptile)`;
    }
    if (species.startsWith("other:")) {
      return species.substring(7);
    }
    return species;
  };
  
  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please login to book an appointment",
      variant: "destructive",
    });
    
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen pt-20">
      {/* Page Header */}
      <section className="bg-pet-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Book an Appointment</h1>
            <p className="text-lg text-muted-foreground">
              Schedule a visit for your pet with our comprehensive booking system. Get instant consultations and expert care.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            <AppointmentForm />
          </div>
          
          {/* Right Column - Info & FAQ */}
          <div className="space-y-6">
            {/* Your Recent Appointments */}
            <div className="card-glass p-6">
              <div className="space-y-4">
                {userAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {userAppointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {apt.petName} {getSpeciesIcon(apt.petSpecies)} - {apt.service}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(apt.date).toLocaleDateString()} at {apt.time || apt.timeSlot}
                            </p>
                            {apt.diagnosis && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Reason: {apt.diagnosis}
                              </p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {userAppointments.length > 3 && (
                      <div className="text-center mt-2">
                        <a href="/my-appointments" className="text-sm text-pet-blue-dark hover:underline">
                          View all appointments →
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center mt-2">
                  </div>
                )}
              </div>
            </div>

            
            {/* Additional Services */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Additional Services</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Besides appointments, we offer these additional services for your pet:
                </p>
                
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                    <h4 className="font-medium">Pet Grooming Packages</h4>
                    <p className="text-sm text-gray-600 mt-1">Complete grooming services starting from ₱2,000</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-green-50 to-green-100">
                    <h4 className="font-medium">Pet Dental Care</h4>
                    <p className="text-sm text-gray-600 mt-1">Professional teeth cleaning and oral care from ₱1,500</p>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
                    <h4 className="font-medium">Pet Boarding</h4>
                    <p className="text-sm text-gray-600 mt-1">Safe and comfortable boarding facilities from ₱800/night</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <a href="/services" className="text-pet-blue-dark hover:underline text-sm">
                    Learn more about our services →
                  </a>
                </div>
              </div>
            </div>
            
            {/* Appointment Information */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Appointment Information</h3>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Schedule an appointment for your pet's checkup, vaccination, grooming, or other services. Our team will confirm your appointment via email or phone.
                </p>
                
                <div className="space-y-3">
                  {/* Email confirmation removed */}
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-blue-dark shrink-0 mt-0.5" size={18} />
                    <p className="text-sm">
                      <span className="font-medium">Reminders:</span> We'll send you a reminder 24 hours before your appointment.
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-blue-dark shrink-0 mt-0.5" size={18} />
                    <p className="text-sm">
                      <span className="font-medium">Rescheduling:</span> Need to reschedule? Please give us at least 24 hours notice.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preparing for Your Visit */}
            <div className="card-glass p-6">
              <h3 className="text-xl font-medium mb-4">Preparing for Your Visit</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  To ensure a smooth and effective appointment, please:
                </p>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>Arrive 10-15 minutes before your scheduled time</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>Bring any previous medical records if you're a new patient</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>Keep dogs on leashes and cats in carriers</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>Bring a list of questions or concerns you'd like to discuss</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="text-pet-teal-dark shrink-0 mt-0.5" size={18} />
                    <span>For grooming appointments, let us know of any specific requests</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
