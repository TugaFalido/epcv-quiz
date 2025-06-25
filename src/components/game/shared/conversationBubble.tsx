import React, { ReactNode } from "react";
import { motion } from "framer-motion";

const ConversationBubble = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`
        max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 
        min-w-[150px] md:min-w-[200px] lg:min-w-[500px] xl:min-w-[600px]
        h-fit
        break-words whitespace-pre-wrap
        rounded-xl p-2 lg:p-5
        bg-blue-500 text-white rounded-bl-none
        
      `}
    >
      <div className="relative">
        {children}
        {/* <motion.div
          className="absolute w-4 h-4 bg-blue-500 rotate-45 -left-2 bottom-0 translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        /> */}
      </div>
    </motion.div>
  );
};

export default ConversationBubble;
// absolute left-36 lg:left-48 bottom-1/2