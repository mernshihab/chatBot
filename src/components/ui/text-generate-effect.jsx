"use client";
import { useState, useEffect, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

const formatText = (text) => {
  return text.split("\n").map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
};

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.3
}) => {
  const [scope, animate] = useAnimate();
  const wordsRef = useRef(words);

  useEffect(() => {
    if (words && words.length > 0) {
      animate("span", {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      }, {
        duration: duration || 1,
        delay: stagger(0.1),
      });
    }
  }, [scope.current, words]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {formatText(words)}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-light", className)}>
      <div className="p-2">
        {renderWords()}
      </div>
    </div>
  );
};
