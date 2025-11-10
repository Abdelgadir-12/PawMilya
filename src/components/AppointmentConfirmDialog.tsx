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
import { Calendar, Clock, User, PawPrint, Stethoscope, CreditCard } from "lucide-react";

type AppointmentData = {
  petName: string;
  petSpecies: string;
  breed: string;
  weight: string;
  ownerName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  diagnosis: string;
  bloodTest: string;
  additionalInfo: string;
};

interface AppointmentConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentData: AppointmentData | null;
  onConfirm: () => void;
  onEdit: () => void;
}

export function AppointmentConfirmDialog({
  open,
  onOpenChange,
  appointmentData,
  onConfirm,
  onEdit,
}: AppointmentConfirmDialogProps) {
  if (!appointmentData) return null;

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

  const formatWeight = (weight: string) => {
    if (!weight) return "Not specified";
    const weightMap: { [key: string]: string } = {
      "small": "Small (5-10 kg)",
      "medium": "Medium (10-25 kg)",
      "large": "Large (25-45 kg)",
      "extra-large": "Extra Large (45+ kg)",
      "unknown": "Unknown"
    };
    return weightMap[weight] || weight;
  };

  const formatBloodTest = (bloodTest: string) => {
    if (!bloodTest || bloodTest === "none") return "No blood test";
    const testMap: { [key: string]: string } = {
      "basic": "Basic Blood Chemistry - ₱1,200",
      "complete": "Complete Blood Chemistry - ₱2,500"
    };
    return testMap[bloodTest] || bloodTest;
  };

  const getServicePrice = (service: string) => {
    const prices: { [key: string]: string } = {
      "General Consultation": "₱1,500",
      "Vaccination": "₱800",
      "Pet Grooming": "₱2,000",
      "Dental Care": "₱2,500",
      "Surgery": "₱8,000",
      "Emergency Care": "₱3,000"
    };
    return prices[service] || "";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Confirm Your Appointment
          </DialogTitle>
          <DialogDescription className="text-center">
            Please review your appointment details before confirming
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pet Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <PawPrint className="h-4 w-4" />
              Pet Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Name:</span> {appointmentData.petName}
              </div>
              <div>
                <span className="font-medium">Species:</span> {formatSpecies(appointmentData.petSpecies)}
              </div>
              {appointmentData.breed && (
                <div>
                  <span className="font-medium">Breed:</span> {appointmentData.breed}
                </div>
              )}
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Owner Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Name:</span> {appointmentData.ownerName}
              </div>
              <div>
                <span className="font-medium">Email:</span> {appointmentData.email}
              </div>
              <div className="md:col-span-2">
                <span className="font-medium">Phone:</span> {appointmentData.phone}
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Service:</span>
                <span>{appointmentData.service} {getServicePrice(appointmentData.service)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Date:</span>
                <span>{formatDate(appointmentData.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Time:</span>
                <span>{appointmentData.timeSlot}</span>
              </div>
              <div className="flex items-start gap-2">
                <Stethoscope className="h-4 w-4 text-pet-blue-dark mt-0.5" />
                <span className="font-medium">Reason:</span>
                <span className="break-words">{appointmentData.diagnosis}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-pet-blue-dark" />
                <span className="font-medium">Blood Test:</span>
                <span>{formatBloodTest(appointmentData.bloodTest)}</span>
              </div>
              {appointmentData.additionalInfo && (
                <div className="flex items-start gap-2">
                  <span className="font-medium">Additional Info:</span>
                  <span className="break-words">{appointmentData.additionalInfo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            Edit Details
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full sm:w-auto bg-pet-blue-dark hover:bg-pet-blue-dark/90"
          >
            Confirm Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
