"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session?.user) {
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

    // Update the user record in Prisma Database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(fullName !== null && { fullName }),
        ...(avatarUrl && { avatarUrl }),
      },
    });

    // Note: We are primarily updating the Prisma Database here since our app 
    // reads user info from `dbUser`. We could optionally also update Supabase Auth 
    // metadata (`supabase.auth.updateUser`) but it's not strictly necessary.

    revalidatePath("/profile");
    return { success: true };

  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
