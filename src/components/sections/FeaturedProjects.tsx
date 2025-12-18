import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { getProjects, type Project } from "@/lib/contentStorage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    const loadProjects = async () => {
      const allProjects = await getProjects();
      setProjects(allProjects.slice(0, 3)); // Show first 3 projects
    };
    loadProjects();
  }, []);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <SectionHeader
            tag="// Featured Work"
            title="Recent Projects"
            description="A selection of my latest WordPress development work."
          />
          <Link to="/projects" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All Projects
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="w-full text-left">
                    <ProjectCard 
                      title={project.title}
                      description={project.description}
                      image={project.image}
                      tags={project.tags}
                      liveUrl={project.liveUrl}
                      githubUrl={project.githubUrl}
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl w-[95vw] p-0 overflow-hidden">
                  <DialogHeader className="px-6 pt-6 pb-4">
                    <DialogTitle className="font-mono text-xl md:text-2xl">
                      {project.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Live preview of this WordPress project.
                    </DialogDescription>
                  </DialogHeader>

                  {project.liveUrl ? (
                    <div className="px-6 pb-6">
                      {/* Preview mode controls */}
                      <div className="flex items-center justify-end gap-2 mb-3">
                        <Button
                          type="button"
                          size="sm"
                          variant={previewMode === "desktop" ? "default" : "outline"}
                          onClick={() => setPreviewMode("desktop")}
                        >
                          Desktop
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={previewMode === "tablet" ? "default" : "outline"}
                          onClick={() => setPreviewMode("tablet")}
                        >
                          Tablet
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={previewMode === "mobile" ? "default" : "outline"}
                          onClick={() => setPreviewMode("mobile")}
                        >
                          Mobile
                        </Button>
                      </div>

                      {/* Responsive preview frame */}
                      <div className="w-full flex justify-center">
                        <div
                          className={
                            "h-[360px] md:h-[420px] rounded-xl border border-border overflow-hidden bg-muted shadow-inner transition-all duration-300 " +
                            (previewMode === "desktop"
                              ? "w-full"
                              : previewMode === "tablet"
                              ? "w-[768px] max-w-full"
                              : "w-[390px] max-w-full")
                          }
                        >
                          <iframe
                            src={project.liveUrl}
                            title={project.title}
                            className="w-full h-full border-0"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xs text-muted-foreground">
                          Previewing as{" "}
                          <span className="font-semibold">
                            {previewMode === "desktop"
                              ? "Desktop"
                              : previewMode === "tablet"
                              ? "Tablet"
                              : "Mobile"}
                          </span>
                          . For full experience, open it in a new tab.
                        </p>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="gap-2"
                        >
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Open Live Website
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-6 pb-6">
                      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          No live URL has been added for this project yet. You can add one from the dashboard.
                        </p>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
