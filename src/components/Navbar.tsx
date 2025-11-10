import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, Bell, Settings, UserCircle, LogOut } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationPreview } from "./NotificationPreview";
import { FeedbackDialog } from "./FeedbackDialog";
import { useAuth } from "@/contexts/AuthContext";


interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'service' | 'vaccination' | 'general';
  timestamp: Date;
  read: boolean;
  status?: string;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout, getUserAppointments, getUserPets } = useAuth();
  
  // Check if we're on an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate real-time notifications based on user data
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      return;
    }

    const generateNotifications = async () => {
      const newNotifications: Notification[] = [];
      const now = new Date();
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);

      try {
        // Get user appointments and pets from DB
        let appointments = await getUserAppointments();
        const pets = await getUserPets();

        // Fallback: if no DB appointments (or user previously saved to local storage), use localStorage
        if (!appointments || appointments.length === 0) {
          try {
            const localApts = [];
            appointments = (localApts || [])
              .filter((apt: any) => apt?.email && apt.email === user.email)
              .map((apt: any) => ({
                id: apt.id,
                petName: apt.petName,
                service: apt.service,
                date: apt.date,
                timeSlot: apt.timeSlot || apt.time || "",
                ownerName: apt.ownerName,
                ownerId: user.id,
                status: apt.status,
              }));
          } catch (e) {
            // ignore fallback errors
          }
        }

        console.log("Generating notifications for user:", user.name);
        console.log("User appointments:", appointments);
        console.log("User pets:", pets);

        // Check for upcoming appointments (within next 7 days), excluding cancelled/completed
        (appointments || []).forEach(appointment => {
          const status = (appointment.status || '').toLowerCase();
          if (status === 'cancelled' || status === 'completed') {
            return; // Skip notifications for non-active appointments
          }
          const appointmentDate = new Date(appointment.date);
          const timeDiffMs = appointmentDate.getTime() - now.getTime();
          const hoursDiff = timeDiffMs / (1000 * 3600);
          const isFuture = timeDiffMs > 0;
          const within7Days = appointmentDate <= nextWeek;

          if (isFuture && within7Days) {
            const message = hoursDiff <= 24
              ? `Your pet ${appointment.petName}'s ${appointment.service} is ${hoursDiff <= 1 ? 'in less than an hour' : `tomorrow at ${appointment.timeSlot || ''}`}`
              : `Upcoming: ${appointment.petName}'s ${appointment.service} on ${appointment.date}${appointment.timeSlot ? ` at ${appointment.timeSlot}` : ''}`;

            newNotifications.push({
              id: `appointment-${appointment.id}`,
              title: hoursDiff <= 24 ? "Appointment Reminder" : "Upcoming Appointment",
              message,
              type: 'appointment',
              timestamp: new Date(),
              read: false,
              status: appointment.status,
            });
          }
        });

        // Check for pet vaccination reminders (pets older than 6 months without recent vaccinations)
        (pets || []).forEach(pet => {
          const birthDate = new Date(pet.birthDate);
          const ageInMonths = (now.getTime() - birthDate.getTime()) / (1000 * 3600 * 24 * 30);
          
          if (ageInMonths >= 6) {
            // Check if pet has recent vaccination appointment
            const hasRecentVaccination = (appointments || []).some(apt => 
              apt.petName === pet.name && 
              apt.service.toLowerCase().includes('vaccination') &&
              new Date(apt.date) > new Date(now.getTime() - (365 * 24 * 3600 * 1000)) // within last year
            );

            if (!hasRecentVaccination) {
              newNotifications.push({
                id: `vaccination-${pet.id}`,
                title: "Vaccination Due",
                message: `${pet.name}'s vaccination may be due. Consider scheduling a checkup.`,
                type: 'vaccination',
                timestamp: new Date(),
                read: false
              });
            }
          }
        });

        // Add promotional notifications only if user has pets
        if (pets.length > 0) {
          newNotifications.push({
            id: 'promo-grooming',
            title: "New Service Available",
            message: "Try our new grooming package with 10% off this month!",
            type: 'service',
            timestamp: new Date(),
            read: false
          });
        }

      } catch (error) {
        console.error("Error generating notifications:", error);
      }

      console.log("Generated notifications:", newNotifications);
      setNotifications(newNotifications);
    };

    generateNotifications();
    
    // Update notifications every minute for real-time updates
    const interval = setInterval(generateNotifications, 60000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated, user, getUserAppointments, getUserPets]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Appointment", href: "/appointment" },
    { name: "FAQ", href: "/faq" },
  ];

  // Don't show the navbar on admin pages
  if (isAdminRoute) {
    return null;
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-9 w-9 rounded-full bg-pet-blue-dark flex items-center justify-center">
            <span className="font-bold text-white text-lg">PM</span>
          </span>
          <span className="font-display font-semibold text-xl dark:text-white">PawMilya </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors dark:text-white",
                location.pathname === link.href
                  ? "bg-pet-blue text-pet-blue-dark dark:bg-pet-blue/30 dark:text-white"
                  : "hover:bg-pet-gray dark:hover:bg-gray-800"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* User Controls - Right side */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-pet-gray dark:hover:bg-gray-800 transition-colors relative dark:text-white">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0 dark:bg-gray-900 dark:border-gray-800">
                  <div className="bg-pet-blue-dark text-white p-3">
                    <h3 className="font-medium">
                      Notifications {unreadCount > 0 && `(${unreadCount})`}
                    </h3>
                  </div>
                  <div className="p-3 max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No notifications</p>
                        <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
                      </div>
                    ) : (
                      notifications.map((notification, index) => (
                        <div 
                          key={notification.id}
                          className={cn(
                            "border-b border-gray-100 dark:border-gray-800 pb-2 mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded",
                            !notification.read && "bg-blue-50 dark:bg-blue-900/20",
                            index === notifications.length - 1 && "border-b-0 mb-0"
                          )}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium dark:text-white">{notification.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                {notification.message}
                                {notification.type === 'appointment' && notification.status && (
                                  <span className={cn(
                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border",
                                    notification.status.toLowerCase() === 'scheduled' && "bg-blue-50 text-blue-700 border-blue-200",
                                    notification.status.toLowerCase() === 'confirmed' && "bg-green-50 text-green-700 border-green-200",
                                    notification.status.toLowerCase() === 'completed' && "bg-gray-100 text-gray-700 border-gray-200",
                                    notification.status.toLowerCase() === 'cancelled' && "bg-red-50 text-red-700 border-red-200"
                                  )}>
                                    {notification.status}
                                  </span>
                                )}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Feedback */}
              <FeedbackDialog />

              {/* User Profile */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-full hover:bg-pet-gray dark:hover:bg-gray-800 transition-colors dark:text-white">
                    <UserCircle size={20} />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 dark:bg-gray-900 dark:border-gray-800">
                  <div className="flex items-center gap-3 mb-3 p-2">
                    <div className="w-10 h-10 rounded-full bg-pet-blue-dark flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm dark:text-white">{user?.name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || ""}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      Your Profile
                    </Link>
                    <Link to="/my-pets" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      My Pets
                    </Link>
                    <Link to="/my-appointments" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md dark:text-white">
                      My Appointments
                    </Link>
                    
                    {/* Show Admin Link only for admin users */}
                    {isAdmin && (
                      <Link to="/admin" className="block px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md font-medium text-pet-blue-dark dark:text-pet-blue">
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-pet-gray dark:hover:bg-gray-800 rounded-md text-red-500"
                    >
                      <span>Sign Out</span>
                      <LogOut size={16} />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <FeedbackDialog />
              <Link
                to="/login"
                className="px-4 py-2 bg-pet-blue-dark text-white rounded-full text-sm font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 dark:text-white" />
            ) : (
              <Menu className="h-6 w-6 dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md py-4 animate-fade-in">
          <nav className="container mx-auto px-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors dark:text-white",
                  location.pathname === link.href
                    ? "bg-pet-blue text-pet-blue-dark dark:bg-pet-blue/30 dark:text-white"
                    : "hover:bg-pet-gray dark:hover:bg-gray-800"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pet-gray dark:hover:bg-gray-800 dark:text-white">
                    <Bell size={18} />
                    <span className="text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pet-gray dark:hover:bg-gray-800 dark:text-white">
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </button>
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pet-gray dark:hover:bg-gray-800 dark:text-white">
                    <UserCircle size={18} />
                    <span className="text-sm">Profile</span>
                  </Link>
                </div>
                
                {/* Feedback in mobile menu */}
                <div className="mt-2">
                  <FeedbackDialog />
                </div>
                
                {/* Add links for My Pets and My Appointments in mobile menu */}
                <Link
                  to="/my-pets"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pet-gray dark:hover:bg-gray-800 dark:text-white"
                >
                  <span className="text-sm">My Pets</span>
                </Link>
                
                <Link
                  to="/my-appointments"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pet-gray dark:hover:bg-gray-800 dark:text-white"
                >
                  <span className="text-sm">My Appointments</span>
                </Link>
                
                {/* Admin Link for admin users */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-pet-gray dark:bg-gray-800 text-pet-blue-dark dark:text-pet-blue font-medium mt-2"
                  >
                    <UserCircle size={18} />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium mt-2"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <div className="mt-4">
                  <FeedbackDialog />
                </div>
                <Link
                  to="/login"
                  className="mt-4 px-5 py-3 bg-pet-blue text-pet-blue-dark dark:bg-pet-blue/30 dark:text-white rounded-lg text-sm font-medium transition-all text-center"
                >
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
