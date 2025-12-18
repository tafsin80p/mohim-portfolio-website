import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { getContactInfo, type ContactInfo } from "@/lib/contentStorage";

const Contact = () => {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadContactInfo = async () => {
      const data = await getContactInfo();
      setContactInfo(data);
    };
    loadContactInfo();
  }, []);

  if (!contactInfo) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading contact information...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const contactInfoArray = [
  {
    icon: Mail,
    title: "Email",
      value: contactInfo.email,
      link: `mailto:${contactInfo.email}`,
  },
  {
    icon: Phone,
    title: "Phone",
      value: contactInfo.phone,
      link: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
  },
  {
    icon: MapPin,
    title: "Location",
      value: contactInfo.location,
    link: "#",
  },
  {
    icon: Clock,
    title: "Response Time",
      value: contactInfo.responseTime,
    link: "#",
  },
];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });

    setIsLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            tag="// Get in Touch"
            title="Let's Work Together"
            description="Have a project in mind? I'd love to hear about it. Fill out the form below or reach out directly."
            centered
          />

          <div className="grid lg:grid-cols-3 gap-12 mt-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {contactInfoArray.map((item, index) => (
                <a
                  key={item.title}
                  href={item.link}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors animate-fade-up group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:glow-box transition-all duration-300">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">{item.title}</p>
                    <p className="font-mono text-foreground">{item.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-card border border-border rounded-xl p-6 md:p-8 animate-fade-up"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Project Inquiry"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2 mb-6">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={6}
                    required
                    className="bg-background resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full glow-box" disabled={isLoading}>
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
