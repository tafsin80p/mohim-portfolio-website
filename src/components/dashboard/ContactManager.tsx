import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getContactInfo, saveContactInfo, type ContactInfo } from "@/lib/contentStorage";

export const ContactManager = () => {
  const [formData, setFormData] = useState<ContactInfo>({
    email: "",
    phone: "",
    location: "",
    responseTime: "",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
    smtpFromEmail: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const info = await getContactInfo();
    setFormData(info);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveContactInfo(formData);
    toast({
      title: "Success",
      description: "Contact information updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-mono font-semibold text-lg">Public Contact Details</h3>
          <p className="text-muted-foreground text-sm mb-2">
            These details are visible on the public contact page.
          </p>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="responseTime">Response Time</Label>
            <Input
              id="responseTime"
              value={formData.responseTime}
              onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="font-mono font-semibold text-lg">SMTP Settings</h3>
          <p className="text-muted-foreground text-sm mb-2">
            Configure SMTP credentials for sending contact form emails. This information is stored securely
            and is <span className="font-semibold">not shown on the public site</span>.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Host</Label>
              <Input
                id="smtpHost"
                placeholder="smtp.yourprovider.com"
                value={formData.smtpHost || ""}
                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Port</Label>
              <Input
                id="smtpPort"
                placeholder="587"
                value={formData.smtpPort || ""}
                onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpUser">SMTP Username</Label>
              <Input
                id="smtpUser"
                placeholder="user@yourdomain.com"
                value={formData.smtpUser || ""}
                onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                placeholder="••••••••"
                value={formData.smtpPassword || ""}
                onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="smtpFromEmail">From Email</Label>
            <Input
              id="smtpFromEmail"
              type="email"
              placeholder="no-reply@yourdomain.com"
              value={formData.smtpFromEmail || ""}
              onChange={(e) => setFormData({ ...formData, smtpFromEmail: e.target.value })}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            These settings will be used by your backend/email service. Frontend currently simulates send,
            but the config is ready when you hook up a real SMTP sender.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};





