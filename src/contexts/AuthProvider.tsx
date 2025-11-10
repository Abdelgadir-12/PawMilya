
import React, { useState, useEffect } from "react";
import { User as AuthUser } from "@supabase/supabase-js";
import { Profile, Pet, Appointment } from "@/types/database";
import { supabase } from "@/lib/supabase";
import { AuthContext, AuthContextType } from "./auth.context";
import {
  getProfile,
  updateProfile,
  getPets,
  createPet,
  updatePet as updatePetInDB,
  deletePet as deletePetFromDB,
  getPet,
  getAppointments,
} from "@/lib/database";
import { withTimeout } from '@/lib/promiseTimeout';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(AuthUser & Profile) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await getProfile(session.user.id);
          if (profile) setUser({ ...session.user, ...profile });
        }
      } catch (err) {
        console.error("initialize auth error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await getProfile(session.user.id);
        if (profile) setUser({ ...session.user, ...profile });
      } else {
        setUser(null);
      }
    });

    return () => {
      data.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // wrap auth call with a timeout so slow networks fail fast
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        10000,
        'Login timed out. Please check your connection.'
      );
      if (error) throw error;
      if (data?.user) {
        const { data: profile } = await getProfile(data.user.id);
        if (profile) setUser({ ...data.user, ...profile });
        return { success: true, isAdmin: profile?.role === "admin" };
      }
      return { success: false };
    } catch (err) {
      console.error("login error:", err);
      return { success: false };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        }),
        12000,
        'Signup timed out. Please check your connection.'
      );
      if (error) throw error;
      if (data?.user) {
        // create profile row
        const { error: profileError } = await supabase.from("profiles").insert([
          { id: data.user.id, email, full_name: name, role: "user" },
        ]);
        if (profileError) throw profileError;
        return true;
      }
      return false;
    } catch (err) {
      console.error("signup error:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      console.error("logout error:", err);
    }
  };

  const updateUserProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    try {
      const { data, error } = await updateProfile(user.id, updates);
      if (error) throw error;
      if (data) setUser({ ...user, ...data });
    } catch (err) {
      console.error("update profile error:", err);
      throw err;
    }
  };

  const getUserPets = async () => {
    if (!user) return [];
    const { data, error } = await getPets(user.id);
    if (error) {
      console.error("get pets error:", error);
      return [];
    }
    return data || [];
  };

  const addPet = async (pet: Omit<Pet, "id" | "owner_id" | "created_at" | "updated_at">) => {
    if (!user) throw new Error("Not authenticated");
    const { data, error } = await createPet({ ...pet, owner_id: user.id });
    if (error) throw error;
    return data!;
  };

  const updatePet = async (id: string, updates: Partial<Omit<Pet, "id" | "owner_id" | "created_at" | "updated_at">>) => {
    const { data, error } = await updatePetInDB(id, updates as Partial<Pet>);
    if (error) {
      console.error("update pet error:", error);
      return false;
    }
    return !!data;
  };

  const deletePet = async (id: string) => {
    const { error } = await deletePetFromDB(id);
    if (error) {
      console.error("delete pet error:", error);
      return false;
    }
    return true;
  };

  const getPetById = async (id: string) => {
    const { data, error } = await getPet(id);
    if (error) {
      console.error("get pet error:", error);
      return null;
    }
    return data || null;
  };

  const getUserAppointments = async () => {
    if (!user) return [];
    const { data, error } = await getAppointments(user.id);
    if (error) {
      console.error("get appointments error:", error);
      return [];
    }
    return data || [];
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateUserProfile,
    getUserPets,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    calculatePetAge: (birthDate: string) => {
      const birth = new Date(birthDate);
      const today = new Date();
      const years = today.getFullYear() - birth.getFullYear();
      const months = today.getMonth() - birth.getMonth();
      if (years > 0) return `${years} year${years > 1 ? "s" : ""}`;
      if (months > 0) return `${months} month${months > 1 ? "s" : ""}`;
      const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} day${days > 1 ? "s" : ""}`;
    },
    getUserAppointments,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// useAuth is provided by src/hooks/useAuth.ts
