import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileSettingsProps {
  onClose?: () => void;
}

export const ProfileSettings = ({ onClose }: ProfileSettingsProps) => {
  const { user: clerkUser } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
  });

  // Convert Clerk user to compatible format
  const user = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    full_name: clerkUser.firstName && clerkUser.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser.firstName || clerkUser.lastName || undefined,
    avatar_url: clerkUser.imageUrl || undefined,
    created_at: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
  } : null;

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!clerkUser) {
        throw new Error("User not found");
      }

      // Update user in Clerk
      const nameParts = formData.full_name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      await clerkUser.update({
        firstName: firstName,
        lastName: lastName || undefined,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
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
              <AvatarImage src={clerkUser?.imageUrl} alt={formData.full_name || formData.email || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-2xl">
                {(formData.full_name || formData.email || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Profile picture is managed by Clerk. Update it in your Clerk account settings.
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
                placeholder="your.email@example.com"
                disabled={true}
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                Email is managed by Clerk. To change it, please use Clerk's user management.
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
