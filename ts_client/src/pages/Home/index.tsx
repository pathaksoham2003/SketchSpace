import React, { useEffect, useState } from 'react';
import { useKeycloak } from "@react-keycloak/web";
import useAuth from '../../services/useAuth';
import { User } from '../../types/user';
import { useNavigate } from 'react-router-dom';
import useBoard from '../../services/useBoard';
import { motion } from 'framer-motion';
import { storeKey } from '../../utils/localStorage';
import MyBoards, { Board } from '../../component/MyBoards';
import SharedBoards from '../../component/SharedBoards';

const Home: React.FC = () => {
  const { initialized, keycloak } = useKeycloak();
  const [userInfo, setUserInfo] = useState<any>(null);
  const { storeUserDetails } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [sharedBoards, setSharedBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState<string>('');
  const { create, getByMe, getSharedToMe } = useBoard();

  const createBoard = async () => {
    if (!newBoardName || !keycloak.token) return;
    try {
      const data = await create({ name: newBoardName });
      setBoards(prev => [...prev, data]);
      setNewBoardName('');
    } catch (err) {
      console.error("Error creating board", err);
    }
  };

  useEffect(() => {
    const sendUserDataToBackend = async (tokenParsed: any) => {
      const userData: User = {
        name: tokenParsed.name,
        preferred_username: tokenParsed.preferred_username,
        given_name: tokenParsed.given_name,
        family_name: tokenParsed.family_name,
        email: tokenParsed.email,
      };
      try {
        const data = await storeUserDetails(userData);
        storeKey("user", data);
        const boardByMe = await getByMe();
        const sharedToMe = await getSharedToMe();
        setBoards(boardByMe);
        setSharedBoards(sharedToMe);
      } catch (err) {
        console.error("Failed to send user info to backend:", err);
      }
    };

    if (initialized && keycloak.authenticated) {
      const tokenParsed = keycloak.tokenParsed;
      setUserInfo(tokenParsed);
      if (tokenParsed) sendUserDataToBackend(tokenParsed);
    }

    if (initialized && !keycloak.authenticated) {
      keycloak.login();
    }
  }, [initialized, keycloak]);

  if (!initialized) return <div className="text-center mt-10">Loading Keycloak...</div>;
  if (!keycloak.authenticated) return null;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const backgroundBalls = [
    { top: "10%", left: "10%", bg: "bg-orange-200", size: "w-40 h-40", delay: 0 },
    { top: "20%", right: "5%", bg: "bg-yellow-200", size: "w-52 h-52", delay: 1 },
    { bottom: "10%", left: "5%", bg: "bg-pink-300", size: "w-36 h-36", delay: 2 },
    { bottom: "20%", right: "10%", bg: "bg-cyan-200", size: "w-40 h-40", delay: 2.5 },
    { top: "80%", right: "40%", bg: "bg-cyan-200", size: "w-32 h-32", delay: 1 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden p-6 z-0">
      {backgroundBalls.map((ball, index) => (
        <motion.div
          key={index}
          style={{
            top: ball.top,
            bottom: ball.bottom,
            left: ball.left,
            right: ball.right,
          }}
          className={`
            absolute
      ${ball.bg} ${ball.size}
          rounded-full opacity-60 blur-3xl z-0
          mix-blend-screen drop-shadow-[0_0_60px_rgba(255, 255, 255, 0.4)]`
          }
          animate={{
            y: [0, 60, 0],
            x: [0, -80, 0],
            rotate: [0, 360],
            scale: [1, 1.30, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 12 + index * 0.5,
            delay: ball.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl pt-5 font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
            Dream. Draw. Collaborate.
          </h1>
          <p className="text-gray-500 mt-2 italic">
            “Every blank canvas is a new beginning—make your mark.”
          </p>
        </div>
        <div className="flex justify-between items-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-1"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back,{" "}
              <span className="bg-gradient-to-tr from-cyan-400 to-gray-300 bg-clip-text text-transparent">
                {userInfo?.name} 👋
              </span>
            </h2>
            <div className="text-sm text-gray-600">
              <div><span className="font-medium text-gray-700">Username:</span> {userInfo?.preferred_username}</div>
              <div><span className="font-medium text-gray-700">Email:</span> {userInfo?.email}</div>
            </div>
          </motion.div>

          <button
            onClick={() => keycloak.logout()}
            className="bg-white text-gray-800 font-semibold px-5 py-2 rounded-full shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300 hover:shadow-xl active:shadow-inner"
          >
            Logout
          </button>
        </div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg p-6 rounded-2xl mb-10"
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Create a New Board</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Enter board name"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={createBoard}
              className="bg-white text-gray-800 font-semibold px-6 py-2 rounded-full shadow-lg border border-gray-200 hover:scale-105 transition-all duration-300 
              hover:shadow-xl active:shadow-inner"
            >
              Create
            </button>
          </div>
        </motion.div>
        <MyBoards boards={boards} />
        <SharedBoards boards={sharedBoards} />
      </div>
    </div>
  );
};

export default Home;
