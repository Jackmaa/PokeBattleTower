// BattleLog.jsx
// Battle log display for showing battle messages and events

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';

/**
 * Single log message entry
 */
function LogMessage({ message, index }) {
  return (
    <motion.div
      className="text-white/90 text-sm py-1 px-2 hover:bg-white/5 rounded transition-colors"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
    >
      {message}
    </motion.div>
  );
}

/**
 * Battle Log component
 * Displays scrollable log of battle events
 */
export default function BattleLog({
  messages = [],
  maxMessages = 10,
  height = 'h-48',
  className = '',
}) {
  const logEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Keep only the most recent messages
  const displayedMessages = messages.slice(-maxMessages);

  return (
    <div className={`bg-black/40 rounded-xl border border-white/10 ${className}`}>
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-2">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span>📜</span>
          Battle Log
        </h3>
      </div>

      {/* Log content */}
      <div className={`${height} overflow-y-auto custom-scrollbar p-2`}>
        <AnimatePresence mode="popLayout">
          {displayedMessages.length > 0 ? (
            displayedMessages.map((message, index) => (
              <LogMessage
                key={`${message}-${index}`}
                message={message}
                index={index}
              />
            ))
          ) : (
            <motion.div
              className="text-white/40 text-sm text-center py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Waiting for battle to start...
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={logEndRef} />
      </div>
    </div>
  );
}

/**
 * Compact battle log for small displays
 */
export function CompactBattleLog({ latestMessage, className = '' }) {
  if (!latestMessage) return null;

  return (
    <motion.div
      className={`bg-black/60 text-white text-sm px-4 py-2 rounded-lg border border-white/20 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      key={latestMessage}
    >
      {latestMessage}
    </motion.div>
  );
}
