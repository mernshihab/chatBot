import { useEffect, useRef } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

const formatText = (text) => {
  let isCodeBlock = false;
  return text.split("\n")?.map((line, index) => {
    const isBold = line.includes("**");
    let formattedLine = line;
    formattedLine = formattedLine.replace(/```/g, '').replace(/\*\*/g, '');

    if (line.includes("```")) {
      isCodeBlock = !isCodeBlock;
    }

    return (
      <motion.span 
        key={index} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.3, delay: index * 0.1 }}
        style={{
          color: isCodeBlock ? '#f00007' : 'initial',
          fontWeight: isBold ? 'bold' : 'initial',
        }}
      >
        {formattedLine}
        <br />
      </motion.span>
    );
  });
};


export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.2
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
  }, [words]);

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
