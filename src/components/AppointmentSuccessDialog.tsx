
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, Clock, User, PawPrint, Stethoscope, Mail } from "lucide-react";

type AppointmentDetails = {
  petName: string;
  petSpecies: string;
  ownerName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  diagnosis: string;
};

interface AppointmentSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentDetails: AppointmentDetails | null;
  onBookAgain: () => void;
  onChangeSchedule: () => void;
}

export function AppointmentSuccessDialog({
  open,
  onOpenChange,
  appointmentDetails,
  onBookAgain,
  onChangeSchedule,
}: AppointmentSuccessDialogProps) {
  if (!appointmentDetails) return null;

  const formatSpecies = (species: string) => {
    if (species.startsWith("reptile:")) {
      const reptileType = species.substring(8);
      return `${reptileType.charAt(0).toUpperCase() + reptileType.slice(1)} (Reptile)`;
    }
    if (species.startsWith("other:")) {
      return species.substring(6);
    }
    return species.charAt(0).toUpperCase() + species.slice(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-center">
            Booking Successful!
          </DialogTitle>
          <DialogDescription className="text-center">
            Your appointment has been successfully booked. You can view and manage your booking in the "My Appointments" section.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
              Appointment Details
            </h4>
            
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Pet:</span>
                <span>{appointmentDetails.petName} ({formatSpecies(appointmentDetails.petSpecies)})</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Owner:</span>
                <span>{appointmentDetails.ownerName}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Service:</span>
                <span>{appointmentDetails.service}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Date:</span>
                <span>{formatDate(appointmentDetails.date)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Time:</span>
                <span>{appointmentDetails.timeSlot}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <Stethoscope className="h-4 w-4 text-pet-blue-dark mt-0.5" />
                <span className="font-medium">Reason:</span>
                <span className="break-words">{appointmentDetails.diagnosis}</span>
              </div>
            </div>
          </div>
          
          {/* Email confirmation removed */}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onChangeSchedule}
            className="w-full sm:w-auto"
          >
            Change Schedule
          </Button>
          <Button
            onClick={onBookAgain}
            className="w-full sm:w-auto bg-pet-blue-dark hover:bg-pet-blue-dark/90"
          >
            Book Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
