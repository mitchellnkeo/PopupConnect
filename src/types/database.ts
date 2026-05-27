export type AppRole = "vendor" | "host" | "organizer";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileRole = {
  id: string;
  profile_id: string;
  role: AppRole;
  created_at: string;
};

export type ProfileWithRoles = Profile & {
  roles: AppRole[];
};
