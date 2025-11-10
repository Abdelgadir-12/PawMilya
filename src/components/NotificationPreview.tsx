import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X } from "lucide-react";

interface NotificationPreviewProps {
  name?: string;
  service?: string;
  date?: string;
  time?: string;
  hasAppointment?: boolean;
}

export function NotificationPreview({
  name = "Sarah",
  service = "Pet Checkup",
  date = "Tomorrow",
  time = "10:00 AM",
  hasAppointment = false,
}: NotificationPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only show notification if there's an active appointment
    if (hasAppointment) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasAppointment]);

  // Don't render if there's no appointment or notification is dismissed
  if (!isVisible || !hasAppointment) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-pet-blue to-pet-teal p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bell className="text-white" size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium">Appointment Reminder</h3>
            <p className="text-white/80 text-sm">Automated notification preview</p>
          </div>
          <button 
            className="text-white/80 hover:text-white transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-3">
            Hi {name}, this is a reminder about your upcoming appointment for {service} tomorrow.
          </p>
          
          <div className="bg-pet-gray rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-medium">{date}</p>
              </div>
              <div>
                <p className="text-gray-500">Time</p>
                <p className="font-medium">{time}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <button 
              className="text-xs text-pet-blue-dark font-medium"
              onClick={() => navigate("/appointment")}
            >
              Reschedule
            </button>
            <button 
              className="text-xs px-3 py-1.5 bg-pet-blue-dark text-white rounded-lg"
              onClick={() => {
                alert("Appointment confirmed!");
                setIsVisible(false); 
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
