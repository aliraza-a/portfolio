// src/components/sections/about.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar, Award, Users } from "lucide-react";

const stats = [
  { icon: Calendar, value: "4+", label: "Years Experience" },
  { icon: Award, value: "50+", label: "Projects Delivered" },
  { icon: Users, value: "100%", label: "Client Satisfaction" },
  { icon: MapPin, value: "Global", label: "Client Base" },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="text-primary text-sm font-medium tracking-widest uppercase"
            >
              About Me
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mt-4 mb-6"
            >
              Building digital experiences that matter
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="space-y-4 text-muted-foreground leading-relaxed"
            >
              <p>
                I&apos;m a results-driven Web Developer and Head of Production
                based in Karachi, Pakistan. With over 4 years of experience,
                I&apos;ve delivered high-performance websites and web
                applications for clients across the UK, USA, and Middle East.
              </p>
              <p>
                Currently, I lead production operations at Summr Solutions,
                where I manage cross-functional teams and drive seamless
                coordination between departments to ensure on-time project
                delivery.
              </p>
              <p>
                My expertise spans modern frontend technologies like React and
                Next.js, along with CMS platforms including WordPress, Shopify,
                and Webflow.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 text-primary mb-4" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
