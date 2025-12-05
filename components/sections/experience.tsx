// src/components/sections/experience.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Head of Production & Web Developer",
    company: "Summr Solutions",
    location: "Karachi, Pakistan",
    period: "Aug 2024 – Present",
    highlights: [
      "Lead production operations, managing developers and designers",
      "Architect full-stack web applications using React and Next.js",
      "Liaison between production and sales teams",
      "Maintained 100% on-time delivery rate",
    ],
    tags: ["React", "Next.js", "Team Leadership", "Project Management"],
  },
  {
    title: "Web Developer",
    company: "Forge Technologies",
    location: "Karachi, Pakistan",
    period: "May 2023 – Present",
    highlights: [
      "Developed 20+ websites for international clients",
      "Custom e-commerce solutions with payment integrations",
      "Achieved 95%+ mobile performance scores",
      "99% client satisfaction rate",
    ],
    tags: ["WordPress", "Shopify", "Webflow", "E-commerce"],
  },
  {
    title: "Web Developer",
    company: "Social Brandup (UK)",
    location: "Remote",
    period: "Jun 2024 – Jan 2025",
    highlights: [
      "Developed websites for UK-based e-commerce businesses",
      "Collaborated with international teams across time zones",
      "Implemented SEO best practices improving search rankings",
    ],
    tags: ["WordPress", "Shopify", "SEO", "International"],
  },
  {
    title: "Web Developer",
    company: "Toobitech",
    location: "Karachi, Pakistan",
    period: "Jun 2022 – May 2023",
    highlights: [
      "Transitioned from intern to full-time in 4 months",
      "Created interactive websites with GSAP animations",
      "Improved user engagement through optimization",
    ],
    tags: ["HTML/CSS", "JavaScript", "jQuery", "GSAP"],
  },
];

export function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-32 bg-secondary/20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Experience
          </span>
          <h2 className="text-4xl font-bold mt-4">Where I&apos;ve worked</h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
                className={`relative grid md:grid-cols-2 gap-8 ${
                  index % 2 === 0 ? "md:text-right" : "md:text-left"
                }`}
              >
                {/* Timeline dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.15 }}
                  className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-primary -translate-x-1/2 top-2"
                />

                <div
                  className={`${
                    index % 2 === 0 ? "md:pr-12" : "md:order-2 md:pl-12"
                  } pl-8 md:pl-0`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-1">{exp.title}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-4 flex-wrap justify-start md:justify-end">
                      <Building2 className="w-4 h-4" />
                      <span>{exp.company}</span>
                      <span className="hidden md:inline">•</span>
                      <Calendar className="w-4 h-4 md:hidden" />
                      <span className="text-sm">{exp.period}</span>
                    </div>
                    <ul
                      className={`space-y-2 mb-4 text-sm text-muted-foreground ${
                        index % 2 === 0 ? "md:text-right" : "text-left"
                      }`}
                    >
                      {exp.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span className="text-primary mt-1">→</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className={index % 2 === 0 ? "md:order-2" : ""} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
