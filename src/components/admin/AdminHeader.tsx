import { Bell, Search, Settings, User, LogOut, Calendar, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAppointments } from "@/utils/localStorageDB";


export function AdminHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
   
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const formatAppointmentTime = (timeSlot: string | undefined, time: string | undefined) => {
    if (timeSlot) return timeSlot;
    if (time) return time;
    return 'TBD';
  };

  const formatAppointmentDate = (date: string) => {
    const appointmentDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (appointmentDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (appointmentDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return appointmentDate.toLocaleDateString();
    }
  };

  const fetchUpcomingAppointments = () => {
    try {
      const allAppointments = getAppointments();
      
      // Filter for upcoming appointments (today and future dates)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingAppointments = allAppointments
        .filter(apt => {
          const appointmentDate = new Date(apt.date);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate >= today && apt.status !== 'Cancelled';
        })
        .sort((a, b) => {
          // Sort by date and time
          const dateA = new Date(`${a.date} ${a.timeSlot || a.time || '00:00'}`);
          const dateB = new Date(`${b.date} ${b.timeSlot || b.time || '00:00'}`);
          return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 5); // Show only the next 5 appointments
      
      setAppointments(upcomingAppointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    fetchUpcomingAppointments();
    
    // Refresh appointments every 5 minutes
    const interval = setInterval(fetchUpcomingAppointments, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-60 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pet-blue-dark focus:border-transparent"
            />
          </div>
          
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell size={20} />
                {appointments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
                    {appointments.length > 9 ? '9+' : appointments.length}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <div className="bg-pet-blue-dark text-white p-3 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Upcoming Appointments</h3>
                </div>
                <button 
                  onClick={fetchUpcomingAppointments}
                  className="p-1 rounded-full hover:bg-blue-600 transition-colors"
                  title="Refresh appointments"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3 max-h-[300px] overflow-y-auto">
                {appointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No upcoming appointments
                  </p>
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="border-b border-gray-100 pb-2 mb-2 last:border-b-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-1">
                          <Calendar className="h-3 w-3 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.service}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.ownerName}'s pet {appointment.petName}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-600">
                              {formatAppointmentDate(appointment.date)} at {formatAppointmentTime(appointment.timeSlot, appointment.time)}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* User Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100">
                <div className="h-8 w-8 rounded-full bg-pet-blue-dark flex items-center justify-center text-white">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium text-gray-800">{user?.name}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 p-0">
              <div className="bg-pet-blue-dark text-white p-3">
                <h3 className="font-medium">User Menu</h3>
              </div>
              <div className="p-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left rounded-md p-2 hover:bg-gray-100"
                >
                  <LogOut size={16} className="text-gray-700" />
                  <span className="text-sm font-medium text-gray-800">Logout</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}