import { supabase } from "../lib/supabase";
import type { AppRole, Profile, ProfileWithRoles } from "../types/database";

export async function fetchProfile(userId: string): Promise<ProfileWithRoles | null> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }
  if (!profile) {
    return null;
  }

  const { data: roles, error: rolesError } = await supabase
    .from("profile_roles")
    .select("role")
    .eq("profile_id", userId);

  if (rolesError) {
    throw rolesError;
  }

  return {
    ...(profile as Profile),
    roles: (roles ?? []).map((r) => r.role as AppRole),
  };
}

export async function updateProfile(
  userId: string,
  updates: Pick<Profile, "display_name" | "avatar_url" | "onboarding_completed">,
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Profile;
}

export async function setProfileRoles(userId: string, roles: AppRole[]) {
  const { error: deleteError } = await supabase
    .from("profile_roles")
    .delete()
    .eq("profile_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  if (roles.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from("profile_roles").insert(
    roles.map((role) => ({
      profile_id: userId,
      role,
    })),
  );

  if (insertError) {
    throw insertError;
  }
}
