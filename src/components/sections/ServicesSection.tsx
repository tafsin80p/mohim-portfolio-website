import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getServices, type Service } from "@/lib/contentStorage";
import * as Icons from "lucide-react";

export const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      const data = await getServices();
      setServices(data);
    };
    loadServices();
  }, []);

  return (
    <section className="section-padding bg-card/50">
      <div className="container-custom">
        <SectionHeader
          tag="// Services"
          title="What I Do"
          description="Comprehensive WordPress development services to bring your vision to life."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = Icons[service.icon as keyof typeof Icons] || Icons.Settings;
            return (
            <div
                key={service.id}
              className="group p-6 rounded-xl bg-card border border-border hover-lift animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-box transition-all duration-300">
                  <IconComponent className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-mono font-semibold text-lg mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm">{service.description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
