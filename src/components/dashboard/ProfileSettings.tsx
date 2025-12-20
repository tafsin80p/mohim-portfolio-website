import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadcareUploader } from "@/components/ui/UploadcareUploader";

interface ProfileSettingsProps {
  onClose?: () => void;
}

export const ProfileSettings = ({ onClose }: ProfileSettingsProps) => {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        avatar_url: user.avatar_url || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const isAvailable = !!(url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key');

      if (isAvailable && user) {
        // Update user metadata in Supabase
        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            full_name: formData.full_name,
            avatar_url: formData.avatar_url || undefined,
          },
        });

        if (updateError) throw updateError;

        // Update email if changed
        if (formData.email !== user.email) {
          const { error: emailError } = await supabase.auth.updateUser({
            email: formData.email,
          });

          if (emailError) throw emailError;
        }

        // Refresh user data
        if (refreshUser) {
          await refreshUser();
        } else {
          // Fallback: reload page to refresh user data
          window.location.reload();
        }

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

        // Close dialog after successful update
        if (onClose) {
          setTimeout(() => onClose(), 500);
        }
      } else {
        // Fallback to localStorage
        const currentUser = JSON.parse(localStorage.getItem('local-auth-user') || '{}');
        const updatedUser = {
          ...currentUser,
          full_name: formData.full_name,
          email: formData.email,
        };
        localStorage.setItem('local-auth-user', JSON.stringify(updatedUser));
        if (refreshUser) {
          await refreshUser();
        } else {
          window.location.reload();
        }

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

        // Close dialog after successful update
        if (onClose) {
          setTimeout(() => onClose(), 500);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-mono text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your account information and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-mono font-semibold text-lg">Profile Picture</h3>
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-2 border-border">
              <AvatarImage src={formData.avatar_url} alt={formData.full_name || formData.email || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                {(formData.full_name || formData.email || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label>Upload Profile Image</Label>
              <UploadcareUploader
                value={formData.avatar_url}
                onChange={(url) => setFormData({ ...formData, avatar_url: url })}
                imagesOnly={true}
                crop="1:1"
                label="Upload Image"
                showPreview={false}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: Square image (400x400px or larger). JPG, PNG, or GIF.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-mono font-semibold text-lg">Personal Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Changing your email will require verification.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

