import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Appointment, getAppointmentsFromDB } from "@/utils/appointmentDB";
import { useToast } from "@/hooks/use-toast";
 
 const BookingRecords = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        console.log('🔍 Loading booking records from database...');
        
        const appointmentsFromDB = await getAppointmentsFromDB();
        console.log('✅ Booking records loaded successfully:', appointmentsFromDB.length);
        
        // Map DB fields to expected frontend fields
        const mapped = (appointmentsFromDB || []).map((apt: any) => ({
          id: apt.id,
          ownerName: apt.owner_name,
          petName: apt.pet_name,
          petSpecies: apt.pet_species || '',
          service: apt.service,
          date: apt.appointment_date,
          time: apt.time_slot,
          status: apt.status,
          phone: apt.phone || '',
          email: apt.email || '',
          createdAt: apt.created_at,
        }));
        setAppointments(mapped);
        
      } catch (error) {
        console.error('❌ Failed to load booking records:', error);
        toast({
          title: "Error",
          description: "Failed to load booking records. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadAppointments();
  }, [toast]);

  // Filter bookings based on search term, status, and date
  const filteredBookings = appointments.filter(appointment => {
    const matchesSearch = 
      (appointment.ownerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (appointment.petName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (appointment.service?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (appointment.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (appointment.status?.toLowerCase() || '') === statusFilter.toLowerCase();
    const matchesDate = !dateFilter || appointment.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Status badge color mapper
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500 text-white";
      case "scheduled": return "bg-blue-500 text-white";
      case "cancelled": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };
 
  return (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold tracking-tight">Booking Records</h2>
       </div>
 
             {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search bookings..."
            className="pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            className="w-auto"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
 
             {/* Booking Records Table */}
      <div className="border rounded-md dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Pet</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Clock className="animate-spin h-4 w-4 mr-2" />
                    Loading booking records...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.slice().reverse().map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.id}</TableCell>
                  <TableCell>{appointment.ownerName}</TableCell>
                  <TableCell>{appointment.petName}</TableCell>
                  <TableCell className="capitalize">{appointment.petSpecies}</TableCell>
                  <TableCell className="capitalize">{appointment.service}</TableCell>
                  <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.time || appointment.timeSlot || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(appointment.status)}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No booking records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
     </div>
   );
 };
 
 export default BookingRecords;