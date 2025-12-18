import { Link } from "react-router-dom";
import { Code2 } from "lucide-react";

export const MobileLogo = () => {
  return (
    <div className="md:hidden fixed top-6 left-6 z-50">
      <Link to="/" className="flex items-center gap-2 group px-3 py-2 rounded-lg bg-background/80 backdrop-blur-xl border border-border shadow-lg">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:glow-box transition-all duration-300">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <span className="font-mono font-bold text-lg text-foreground">Tafsin Ahmed</span>
      </Link>
    </div>
  );
};

