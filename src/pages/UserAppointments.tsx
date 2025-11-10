import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, AlertCircle, FileText, Edit3 } from "lucide-react";
import { getAppointmentsForUser, Appointment } from "@/utils/appointmentDB";
import { useNavigate } from "react-router-dom";
import { AppointmentNotesDialog } from "@/components/AppointmentNotesDialog";

const UserAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        const userAppointments = await getAppointmentsForUser(user.id);
        userAppointments.sort((a, b) => {
          const dateA = new Date(a.appointment_date).getTime();
          const dateB = new Date(b.appointment_date).getTime();
          return dateB - dateA;
        });
        setAppointments(userAppointments);
      }
    };
    fetchAppointments();
  }, [user]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
          case "scheduled": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";
    case "completed": return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  const handleScheduleNew = () => {
    navigate("/appointment");
  };

  const handleOpenNotes = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowNotesDialog(true);
  };

  const handleNotesUpdated = async () => {
    if (user) {
      const userAppointments = await getAppointmentsForUser(user.id);
      userAppointments.sort((a, b) => {
        const dateA = new Date(a.appointment_date).getTime();
        const dateB = new Date(b.appointment_date).getTime();
        return dateB - dateA;
      });
      setAppointments(userAppointments);
    }
  };
  
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">My Appointments</h1>
      
      <div className="space-y-6">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <CalendarDays className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">No appointments yet</h3>
              <p className="text-center text-muted-foreground mb-6">
                You haven't scheduled any appointments yet
              </p>
              <Button onClick={handleScheduleNew}>Schedule Appointment</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Appointments</h2>
              <Button onClick={handleScheduleNew} variant="outline" size="sm">
                Schedule New
              </Button>
            </div>
            
            <div className="space-y-4">
              {appointments.map((apt) => (
                <Card key={apt.id} className="overflow-hidden">
                  <div className={`h-2 ${
                    apt.status === "scheduled" ? "bg-blue-500" : 
                    apt.status === "completed" ? "bg-green-500" :
                    apt.status === "cancelled" ? "bg-red-500" : "bg-yellow-500"
                  }`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{apt.pet_name} - {apt.service}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    <CardDescription>
                      Appointment #{apt.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(apt.appointment_date).toLocaleDateString(undefined, { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Time</p>
                          <p className="text-sm text-muted-foreground">{apt.time_slot}</p>
                        </div>
                      </div>
                      
                      {/* User Notes Display */}
                      {apt.user_notes && (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Your Notes</p>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                              {apt.user_notes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      {/* Reschedule option removed for booked appointments per request */}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Notes Dialog */}
      {selectedAppointment && (
        <AppointmentNotesDialog
          open={showNotesDialog}
          onOpenChange={setShowNotesDialog}
          appointment={selectedAppointment}
          onNotesUpdated={handleNotesUpdated}
        />
      )}
    </div>
  );
};

export default UserAppointments;