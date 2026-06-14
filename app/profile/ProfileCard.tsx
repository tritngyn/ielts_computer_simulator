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
    <div className="paper-card p-6 rotate-[-1deg] relative">
      <div className="tape tape-yellow absolute -top-3 left-1/2 -translate-x-1/2 rotate-[-2deg]" />
      
      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        {isEditing ? (
          <>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="p-2 rounded-full bg-accent-green/10 text-accent-green hover:bg-accent-green/20 transition-colors disabled:opacity-50"
              title="Save changes"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleEditToggle}
              disabled={isSaving}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button 
            onClick={handleEditToggle}
            className="p-2 rounded-full bg-paper-kraft text-text-secondary hover:text-accent-blue transition-colors"
            title="Edit profile"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex flex-col items-center text-center mt-4">
        <div className="relative group">
          <div 
            className={`w-28 h-28 rounded-full overflow-hidden mb-4 photo-frame ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            {avatar ? (
              <Image 
                src={avatar} 
                alt={displayName} 
                width={112}
                height={112}
                unoptimized
                className={`w-full h-full object-cover ${isEditing ? 'group-hover:opacity-50 transition-opacity' : ''}`} 
              />
            ) : (
              <div className={`w-full h-full bg-amber-100 flex items-center justify-center text-amber-600 text-4xl font-hand ${isEditing ? 'group-hover:opacity-50 transition-opacity' : ''}`}>
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <Camera className="w-8 h-8 text-white drop-shadow-md" />
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
            className="text-2xl font-bold text-center text-text-heading mb-1 bg-amber-50 border-b-2 border-accent-blue outline-none px-2 py-1 rounded-t-sm w-full max-w-[200px]"
            placeholder="Tên hiển thị"
            disabled={isSaving}
          />
        ) : (
          <h2 className="text-2xl font-bold text-text-heading mb-1">{displayName}</h2>
        )}
        
        <p className="text-text-secondary font-body break-all">{email}</p>
        
        <div className="w-full h-px bg-amber-200/50 my-6" />
        
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 text-text-secondary">
              <BookOpen className="w-4 h-4" />
              <span className="font-body">Tổng bài làm</span>
            </div>
            <span className="font-bold text-lg font-hand text-accent-blue">{totalTests}</span>
          </div>
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 text-text-secondary">
              <Award className="w-4 h-4" />
              <span className="font-body">Điểm trung bình</span>
            </div>
            <span className="font-bold text-lg font-hand text-accent-green">{avgScore}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
