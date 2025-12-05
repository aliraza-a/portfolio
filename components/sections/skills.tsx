// src/components/sections/skills.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Frontend Development",
    skills: [
      { name: "React.js", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "JavaScript (ES6+)", level: 95 },
      { name: "TypeScript", level: 70 },
      { name: "HTML5/CSS3", level: 98 },
    ],
  },
  {
    title: "Styling & Animation",
    skills: [
      { name: "Tailwind CSS", level: 95 },
      { name: "GSAP", level: 85 },
      { name: "Framer Motion", level: 80 },
      { name: "Bootstrap", level: 90 },
    ],
  },
  {
    title: "CMS & E-commerce",
    skills: [
      { name: "WordPress", level: 95 },
      { name: "Shopify", level: 90 },
      { name: "Webflow", level: 85 },
      { name: "WooCommerce", level: 88 },
    ],
  },
  {
    title: "Tools & Others",
    skills: [
      { name: "Git/GitHub", level: 90 },
      { name: "Figma", level: 80 },
      { name: "REST APIs", level: 88 },
      { name: "SEO", level: 85 },
    ],
  },
];

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">
            Skills
          </span>
          <h2 className="text-4xl font-bold mt-4">Technical Proficiencies</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + categoryIndex * 0.1 }}
              className="p-6 rounded-2xl bg-secondary/20 border border-border/50"
            >
              <h3 className="text-lg font-semibold mb-6">{category.title}</h3>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${skill.level}%` } : {}}
                        transition={{
                          delay: 0.5 + categoryIndex * 0.1 + skillIndex * 0.05,
                          duration: 0.8,
                          ease: "easeOut",
                        }}
                        className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Key Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 p-8 rounded-2xl bg-linear-to-br from-primary/10 to-secondary/10 border border-border/50"
        >
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Key Achievements
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: "15+", label: "Concurrent Projects Managed" },
              { value: "30%", label: "Team Efficiency Increase" },
              { value: "40%", label: "Avg. Search Ranking Improvement" },
              { value: "100%", label: "On-time Delivery Rate" },
            ].map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4"
              >
                <div className="text-3xl font-bold text-primary mb-2">
                  {achievement.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {achievement.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
