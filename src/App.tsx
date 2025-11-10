
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PetGrooming from "@/pages/PetGrooming";
import VeterinaryCare from "@/pages/VeterinaryCare";
import Vaccination from "@/pages/Vaccination";
import Hematology from "@/pages/Hematology";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Services from "@/pages/Services";
import PetShop from "@/pages/PetShop";
import Tonometry from "@/pages/Tonometry";

import SurgeryWithGas from "@/pages/SurgeryWithGas";
import DigitalXRay from "@/pages/DigitalXRay";

import { ErrorBoundary } from "react-error-boundary";
import Dentistry from "@/pages/Dentistry";
import PharmacyServices from "@/pages/PharmacyServices";
import BloodChemistry from "@/pages/BloodChemistry";

// Data initialization is handled by localStorage

const Index = lazy(() => import("@/pages/Index"));
const Appointment = lazy(() => import("@/pages/Appointment"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup")); // Added missing Signup import
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Profile = lazy(() => import("@/pages/Profile"));
const UserPets = lazy(() => import("@/pages/UserPets"));
const UserAppointments = lazy(() => import("@/pages/UserAppointments"));

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminAppointments = lazy(() => import("@/pages/admin/Appointments"));
const AdminPets = lazy(() => import("@/pages/admin/Pets"));
const BookingRecords = lazy(() => import("@/pages/admin/BookingRecords"));
const AdminFeedback = lazy(() => import("@/pages/admin/Feedback"));
const PasswordResets = lazy(() => import("@/pages/admin/PasswordResets"));

// Redirect component based on auth status
const AuthRedirect = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      // If user is authenticated and on login/signup page, redirect to home
      if (['/login', '/signup'].includes(location.pathname)) {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // keep query data fresh for 5 minutes to reduce network calls and perceived slowness
  staleTime: 1000 * 60 * 5,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2>Something went wrong!</h2>
    <p>{error.message}</p>
  </div>
);

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthRedirect />
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/pet-grooming" element={<PetGrooming />} />
                      <Route path="/veterinary-care" element={<VeterinaryCare />} />
                      <Route path="/vaccination" element={<Vaccination />} />
                      <Route path="/pet-shop" element={<PetShop />} />
                      <Route path="/tonometry" element={<Tonometry />} />
                      <Route path="/surgery-with-gas-anesthetic-machine" element={<SurgeryWithGas />} />
                      <Route path="/hematology" element={<Hematology />} />
                      <Route path="/digital-xray" element={<DigitalXRay />} />
                      <Route path="/dentistry" element={<Dentistry />} />
                      <Route path="/pharmacy-services" element={<PharmacyServices />} />
                      <Route path="/blood-chemistry" element={<BloodChemistry />} />
                      <Route path="/appointment" element={
                        <ProtectedRoute>
                          <Appointment />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      <Route path="/my-pets" element={
                        <ProtectedRoute>
                          <UserPets />
                        </ProtectedRoute>
                      } />
                      <Route path="/my-appointments" element={
                        <ProtectedRoute>
                          <UserAppointments />
                        </ProtectedRoute>
                      } />

                      {/* Protected Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminLayout />
                        </ProtectedRoute>
                      }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="appointments" element={<AdminAppointments />} />
                        <Route path="booking-records" element={<BookingRecords />} />
                        <Route path="pets" element={<AdminPets />} />
                        <Route path="password-resets" element={<PasswordResets />} />
                        <Route path="feedback" element={<AdminFeedback />} />
                      </Route>

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;











