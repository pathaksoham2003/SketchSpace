import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateColorFromString, initials } from "../utils/helper.ts";
import ParticipantHoverCard from "./ParticipantHoverCard.tsx";
import { User } from "../types/user.ts";
import { useAppSelector } from "../hooks/redux.ts";

interface ParticipantsModalProps {
  show: boolean;
  participants: User[];
  inviteEmail: string;
  setInviteEmail: React.Dispatch<React.SetStateAction<string>>;
  handleInvite: () => void;
  onClose: () => void;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({
  show,
  participants,
  inviteEmail,
  setInviteEmail,
  handleInvite,
  onClose,
}) => {
  const [hoveredParticipant, setHoveredParticipant] = useState<any>(null);
  const part = useAppSelector(state=>state.whiteboard.participants)
 console.log("Part",part)
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 right-10 w-80 bg-white rounded-xl shadow-xl z-10 p-6 border border-gray-300"
        >
          <h3 className="text-lg font-semibold mb-4 text-indigo-700">
            Participants
          </h3>
          <ul className="max-h-48 overflow-y-auto space-y-2 mb-4 relative z-10">
            {part.length > 0 ? (
              part.map((p, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-gray-700 text-sm border-b pb-1 relative"
                  onMouseEnter={() => {
                    setHoveredParticipant(p);
                  }}
                  onMouseLeave={() => {
                    setHoveredParticipant(null);
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full text-xs flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundColor: generateColorFromString(p?.name || "User"),
                    }}
                  >
                    {initials(p?.name || "User")}
                  </div>
                  {p?.name || "User"}
                </li>
              ))
            ) : (
              <li className="text-gray-400">No participants yet</li>
            )}
          </ul>

          {hoveredParticipant && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="fixed z-50 left-[calc(100vw-550px)] top-[calc(4rem+2.5rem)]"
            >
              <ParticipantHoverCard participant={hoveredParticipant} />
            </motion.div>
          )}

          <input
            type="email"
            placeholder="Invite by email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full mb-3 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleInvite}
            className="w-full mb-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition"
          >
            Invite
          </button>
          <button
            onClick={onClose}
            className="w-full text-indigo-600 hover:underline text-sm"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ParticipantsModal;
