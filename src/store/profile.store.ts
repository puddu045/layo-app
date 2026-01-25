import { create } from "zustand";
import api from "../api/client";

type UserBasic = {
  email: string;
  firstName: string;
  lastName: string;
};

type UserProfile = {
  bio: string | null;
  city: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  location: string | null;
  nationality: string | null;
  profilePhotoUrl: string | null;
  updatedAt: string;
};

type UserProfileState = {
  user: UserBasic | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  fetchMyProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
};

export const useUserProfileStore = create<UserProfileState>((set) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,

  fetchMyProfile: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get("/users/me");

      set({
        user: {
          email: res.data.email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
        },
        profile: res.data.profile,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Failed to load profile",
        loading: false,
      });
    }
  },

  updateProfile: async (data) => {
    console.log("Updating profile with:", data);

    set({ loading: true, error: null });

    try {
      const res = await api.patch("/users/me/profile", data);
      console.log("Backend response:", res.data);

      set({
        profile: res.data,
        loading: false,
      });
    } catch (err: any) {
      console.log("Update profile error:", err?.response);

      set({
        error: err?.response?.data?.message ?? "Failed to update profile",
        loading: false,
      });
    }
  },

  clearProfile: () =>
    set({
      user: null,
      profile: null,
      loading: false,
      error: null,
    }),
}));
