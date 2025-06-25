import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const TypingText = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const controls = useAnimation();

  // useEffect(() => {
  //   let currentIndex = 0;
  //   setDisplayedText("");

  //   const typingInterval = setInterval(() => {
  //     if (currentIndex < text.length) {
  //       console.log(`Adding character: ${text[currentIndex]}`);
  //       setDisplayedText((prev) => prev + text[currentIndex]);
  //       currentIndex++;
  //     } else {
  //       clearInterval(typingInterval);
  //     }
  //   }, 25); // Adjust typing speed here (lower number = faster)

  //   return () => clearInterval(typingInterval);
  // }, [text]);

  // useEffect(() => {
  //   controls.start({ opacity: 1, y: 0 });
  // }, [controls]);

  return (
    <motion.p
      className={`${className} whitespace-pre-wrap break-words`}
      initial={{ opacity: 1, y: 0 }}
      //animate={controls}
      animate="fade"

      transition={{ duration: 0.5 }}
    >
      {/* {displayedText} */}
      {text}
    </motion.p>
  );
};

export default TypingText;
