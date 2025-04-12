// src/components/Boards/MyBoards.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Board } from "../types/board";

interface MyBoardsProps {
  boards: Board[];
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const MyBoards: React.FC<MyBoardsProps> = ({ boards }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">Your Boards</h3>
      {boards.length === 0 ? (
        <p className="text-gray-500">You haven't created any boards yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {boards.map((board) => (
            <motion.div
              key={board._id}
              className="bg-gradient-to-tr from-purple-100 via-indigo-100 to-white rounded-2xl shadow-md p-5 hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/board/${board._id}`)}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <h4 className="text-lg font-semibold text-gray-700">{board.name}</h4>
              <p className="text-sm text-gray-500 mt-1">
                Created at: {new Date(board.createdAt).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBoards;
