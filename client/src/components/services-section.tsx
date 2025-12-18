import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  Brain,
  MessageSquare,
  FileSpreadsheet,
  LayoutDashboard,
  Code2,
  Database,
  Cpu,
  Truck,
  Sparkles,
  Clock,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service, SkillCategory } from "@shared/schema";

const iconMap: Record<string, typeof BarChart3> = {
  BarChart3,
  Brain,
  MessageSquare,
  FileSpreadsheet,
  LayoutDashboard,
  Code2,
  Database,
  Cpu,
  Truck,
};

function ServicesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className={i === 2 ? "md:col-span-2" : ""}>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <Skeleton className="h-6 w-48" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-lg" />
              <Skeleton className="h-5 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ServicesSection() {
  const { data: services, isLoading: servicesLoading, error: servicesError } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: skillCategories, isLoading: skillsLoading, error: skillsError } = useQuery<SkillCategory[]>({
    queryKey: ["/api/skills"],
  });

  return (
    <section
      id="services"
      className="py-16 lg:py-24 bg-muted/30"
      data-testid="section-services"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 lg:mb-16">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Services
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Mes Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Des solutions digitales sur mesure pour optimiser vos opérations et valoriser vos données
          </p>
        </div>

        {servicesLoading ? (
          <ServicesSkeleton />
        ) : servicesError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Une erreur est survenue lors du chargement des services.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {services?.map((service) => {
              const Icon = iconMap[service.icon] || BarChart3;
              const isSpecial = service.id === "ai-solutions";

              return (
                <Card
                  key={service.id}
                  className={`group overflow-visible transition-all duration-300 hover-elevate ${
                    isSpecial ? "md:col-span-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent" : ""
                  }`}
                  data-testid={`card-service-${service.id}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isSpecial ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-serif">{service.title}</CardTitle>
                          {isSpecial && (
                            <Badge variant="default" className="mt-2 gap-1">
                              <Clock className="w-3 h-3" />
                              Pack express 50 min
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="font-serif text-2xl lg:text-3xl font-semibold mb-2">
              Compétences Techniques
            </h3>
            <p className="text-muted-foreground">
              Un éventail de compétences pour répondre à vos besoins
            </p>
          </div>

          {skillsLoading ? (
            <SkillsSkeleton />
          ) : skillsError ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Une erreur est survenue lors du chargement des compétences.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skillCategories?.map((category) => {
                const Icon = iconMap[category.icon] || Code2;

                return (
                  <Card
                    key={category.id}
                    className="group overflow-visible hover-elevate"
                    data-testid={`card-skill-${category.id}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Icon className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-base font-semibold">{category.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.skills.map((skill) => (
                          <li
                            key={skill}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
