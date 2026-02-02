"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef, ReactNode } from "react";

// Fade in from bottom on scroll
export function FadeInUp({ 
  children, 
  delay = 0,
  duration = 0.6,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade in from left
export function FadeInLeft({ 
  children, 
  delay = 0,
  duration = 0.6,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade in from right
export function FadeInRight({ 
  children, 
  delay = 0,
  duration = 0.6,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale up on scroll
export function ScaleIn({ 
  children, 
  delay = 0,
  duration = 0.6,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation container
export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className = ""
}: { 
  children: ReactNode; 
  staggerDelay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger item (use inside StaggerContainer)
export function StaggerItem({ 
  children,
  className = ""
}: { 
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Parallax scroll effect
export function ParallaxSection({ 
  children, 
  speed = 0.5,
  className = ""
}: { 
  children: ReactNode; 
  speed?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

// Blur in effect
export function BlurIn({ 
  children, 
  delay = 0,
  duration = 0.8,
  className = ""
}: { 
  children: ReactNode; 
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={isInView ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Text reveal animation (word by word)
export function TextReveal({ 
  text, 
  className = "",
  wordClassName = ""
}: { 
  text: string; 
  className?: string;
  wordClassName?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words = text.split(" ");

  return (
    <motion.span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ 
            duration: 0.4, 
            delay: i * 0.08,
            ease: [0.25, 0.4, 0.25, 1]
          }}
          className={`inline-block mr-[0.25em] ${wordClassName}`}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Hover scale effect wrapper
export function HoverScale({ 
  children, 
  scale = 1.02,
  className = ""
}: { 
  children: ReactNode; 
  scale?: number;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Counter animation (for stats)
export function AnimatedNumber({ 
  value, 
  duration = 2,
  className = ""
}: { 
  value: number; 
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      className={className}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <CountUp value={value} duration={duration} />
        </motion.span>
      )}
    </motion.span>
  );
}

// Helper component for counting
function CountUp({ value, duration }: { value: number; duration: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        onAnimationStart={() => {
          if (!ref.current) return;
          let start = 0;
          const end = value;
          const startTime = performance.now();
          
          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutQuart * end);
            
            if (ref.current) {
              ref.current.textContent = currentValue.toLocaleString();
            }
            
            if (progress < 1) {
              requestAnimationFrame(step);
            } else if (ref.current) {
              ref.current.textContent = end.toLocaleString();
            }
          };
          
          requestAnimationFrame(step);
        }}
      >
        0
      </motion.span>
    </motion.span>
  );
}

// Floating animation (subtle up/down movement)
export function FloatingElement({ 
  children, 
  duration = 3,
  distance = 10,
  className = ""
}: { 
  children: ReactNode; 
  duration?: number;
  distance?: number;
  className?: string;
}) {
  return (
    <motion.div
      animate={{ 
        y: [-distance, distance, -distance],
      }}
      transition={{ 
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glow pulse effect
export function GlowPulse({ 
  children, 
  className = ""
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div
      animate={{ 
        boxShadow: [
          "0 0 20px rgba(255,255,255,0.1)",
          "0 0 40px rgba(255,255,255,0.2)",
          "0 0 20px rgba(255,255,255,0.1)"
        ]
      }}
      transition={{ 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
