import React from "react";
import { motion } from "framer-motion";

const ParticipantHoverCard = ({ participant }: { participant: any }) => {
  return (
    <motion.div
    className="w-48 p-3 bg-white border border-gray-300 rounded-l-lg rounded-tr-lg shadow-lg z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <p className="font-semibold text-gray-800">{participant.name}</p>
    <p className="text-sm text-gray-500">{participant.email}</p>
    <p className="text-xs text-gray-400 mt-1">
      Joined: {participant.joinedAt}
    </p>
  </motion.div>
  
  );
};

export default ParticipantHoverCard;
