'use client';
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Optional delay for staggered animations
}

export default function FadeInSection({ children, className = "", delay = 0 }: FadeInSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    triggerOnce: false,
    threshold: 0.3,
  });

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  const fadeInFromBottom = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, delay: delay + 0.3, ease: "easeInOut" }, // Slower, smoother animation
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      variants={fadeInFromBottom}
      className={className}
    >
      {children}
    </motion.div>
  );
}
