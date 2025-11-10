import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, PawPrint, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminStats, type AdminStats } from "@/utils/adminStats";
import { getAppointmentsFromDB, Appointment } from "@/utils/appointmentDB";
import { Button } from "@/components/ui/button";


const Dashboard = () => {
  const [nextAppointments, setNextAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalAppointments: 0,
    totalPets: 0,
    activeClients: 0,
    scheduledAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const adminStats = await getAdminStats();
      setStats(adminStats);
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const loadNextAppointments = async () => {
      try {
        console.log('🔍 Loading next appointments from database...');
        
        const allAppointments = await getAppointmentsFromDB();
        console.log('✅ Appointments loaded successfully:', allAppointments.length);
        
        const now = new Date();
        // Filter for upcoming appointments in the next 24 hours, not cancelled/completed
        const upcoming = allAppointments.filter((apt: any) => {
          const status = (apt.status || '').toLowerCase();
          if (status === 'cancelled' || status === 'completed') return false;
          const appointmentDate = new Date(apt.appointment_date);
          const timeDiff = appointmentDate.getTime() - now.getTime();
          const hoursDiff = timeDiff / (1000 * 3600);
          return hoursDiff > 0 && hoursDiff <= 24;
        });
        setNextAppointments(upcoming);
      } catch (error) {
        console.error('❌ Failed to load appointments:', error);
      }
    };
    loadNextAppointments();
  }, []);

  const handleRefresh = () => {
    loadStats();
  };



  const statsCards = [
    { 
      title: "Total Appointments", 
      value: stats.totalAppointments.toString(), 
      icon: Calendar, 
      color: "bg-blue-500" 
    },
    { 
      title: "Registered Pets", 
      value: stats.totalPets.toString(), 
      icon: PawPrint, 
      color: "bg-green-500" 
    },
    { 
      title: "Scheduled Appointments", 
      value: stats.scheduledAppointments.toString(), 
      icon: Clock, 
      color: "bg-yellow-500" 
    },
    { 
      title: "Completed Appointments", 
      value: stats.completedAppointments.toString(), 
      icon: CheckCircle, 
      color: "bg-green-600" 
    },
    { 
      title: "Cancelled Appointments", 
      value: stats.cancelledAppointments.toString(), 
      icon: XCircle, 
      color: "bg-red-500" 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments (Next 24 Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            {nextAppointments.length === 0 ? (
              <div className="text-muted-foreground">No upcoming appointments.</div>
            ) : (
              <ul className="space-y-2">
                {nextAppointments.map(apt => (
                  <li key={apt.id} className="border-b pb-2">
                    <strong>{apt.pet_name}</strong> with <strong>{apt.owner_name}</strong> for <strong>{apt.service}</strong> on <strong>{apt.appointment_date}</strong> at <strong>{apt.time_slot}</strong>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefresh} 
            disabled={isLoading}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          statsCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.color} p-2 rounded-full text-white`}>
                  <stat.icon size={16} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  Real-time data
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
