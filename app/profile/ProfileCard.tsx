"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { BookOpen, Award, Pencil, Check, X, Camera, Loader2 } from "lucide-react";
import { updateProfile } from "@/lib/actions/user.actions";

interface ProfileCardProps {
  initialDisplayName: string;
  email: string;
  initialAvatar: string | null;
  totalTests: number;
  avgScore: number;
}

export default function ProfileCard({
  initialDisplayName,
  email,
  initialAvatar,
  totalTests,
  avgScore,
}: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatar, setAvatar] = useState<string | null>(initialAvatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit
      setDisplayName(initialDisplayName);
      setAvatar(initialAvatar);
      setAvatarFile(null);
    }
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      if (displayName !== initialDisplayName) {
        formData.append("fullName", displayName);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const result = await updateProfile(formData);
      
      if (result.success) {
        setIsEditing(false);
        setAvatarFile(null);
        // The page will revalidate and show new data, but we can keep our local state updated too
      } else {
        alert(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="liquid-glass p-8 rounded-3xl relative">
      
      {/* Action Buttons */}
      <div className="absolute top-6 right-6 flex gap-2">
        {isEditing ? (
          <>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="p-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
              title="Save changes"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleEditToggle}
              disabled={isSaving}
              className="p-2.5 rounded-full bg-black/5 text-foreground hover:bg-black/10 transition-colors disabled:opacity-50"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button 
            onClick={handleEditToggle}
            className="p-2.5 rounded-full bg-black/5 text-foreground/70 hover:bg-black/10 hover:text-foreground transition-colors"
            title="Edit profile"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex flex-col items-center text-center mt-2">
        <div className="relative group">
          <div 
            className={`w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-black/5 ${isEditing ? 'cursor-pointer ring-4 ring-foreground/10' : ''} transition-all`}
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            {avatar ? (
              <Image 
                src={avatar} 
                alt={displayName} 
                width={128}
                height={128}
                unoptimized
                className={`w-full h-full object-cover ${isEditing ? 'group-hover:opacity-50 transition-opacity' : ''}`} 
              />
            ) : (
              <div className={`w-full h-full bg-black/5 flex items-center justify-center text-foreground font-display text-4xl ${isEditing ? 'group-hover:opacity-50 transition-opacity' : ''}`}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera className="w-8 h-8 text-foreground drop-shadow-sm" />
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {isEditing ? (
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="text-2xl font-bold font-display text-center text-foreground mb-1 bg-background border border-border outline-none px-4 py-2 rounded-xl w-full max-w-[250px] focus:ring-2 focus:ring-foreground/20"
            placeholder="Tên hiển thị"
            disabled={isSaving}
          />
        ) : (
          <h2 className="text-2xl font-bold font-display text-foreground mb-1">{displayName}</h2>
        )}
        
        <p className="text-muted-foreground text-sm break-all">{email}</p>
        
        <div className="w-full h-px bg-border my-8" />
        
        <div className="w-full space-y-5 px-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-medium">Tổng bài làm</span>
            </div>
            <span className="font-bold text-xl text-foreground">{totalTests}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-medium">Điểm trung bình</span>
            </div>
            <span className="font-bold text-xl text-foreground">{avgScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
