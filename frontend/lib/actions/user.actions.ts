"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session?.user || !session?.access_token) {
      return { success: false, error: "Unauthorized" };
    }

    const user = session.user;
    const fullName = formData.get("fullName") as string | null;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl = undefined;

    // Handle avatar upload if a file was provided
    if (avatarFile && avatarFile.size > 0) {
      // Create a unique file name
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, {
          upsert: true,
          contentType: avatarFile.type,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { success: false, error: "Failed to upload avatar image." };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl = publicUrl;
    }

    // Call NestJS API to update the profile in the database
    const payload: any = {};
    if (fullName !== null) payload.fullName = fullName;
    if (avatarUrl) payload.avatarUrl = avatarUrl;

    const response = await fetch(`${API_URL}/api/v1/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile via API");
    }

    revalidatePath("/profile");
    return { success: true };

  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}

