import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="relative rounded-2xl bg-card border border-border overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 py-16 md:py-24 px-6 md:px-12 text-center">
            <h2 className="font-mono text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-up">
              Let's build something
              <br />
              <span className="text-gradient">amazing together</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8 animate-fade-up animation-delay-100">
              Have a project in mind? I'd love to help you bring your WordPress vision to life.
              Let's discuss how we can work together.
            </p>
            <Link to="/contact">
              <Button size="lg" className="glow-box group animate-fade-up animation-delay-200">
                Start a Conversation
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
