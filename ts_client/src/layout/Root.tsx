import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  FiChevronDown,
  FiPhoneCall,
  FiMessageCircle,
  FiMail,
} from 'react-icons/fi';

const Root: React.FC = () => {
  const location = useLocation();
  const showNav = !location.pathname.startsWith("/whiteboard");

  return (
    <div className='w-full min-h-screen relative overflow-hidden'>

      {/* Top Notch Contact Panel */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md">
        <div className="flex flex-col items-center group">
          
          {/* Trigger button with peer class */}
          <div
            className="bg-black text-white px-8 py-2 rounded-b-lg shadow-md cursor-pointer flex items-center gap-2 
                       transition-all hover:bg-gray-900 peer"
          >
            Contact the Developer
            <FiChevronDown size={20} />
          </div>

          {/* Modal that stays open on hover */}
          <div
            className="w-full bg-white shadow-md z-50 rounded-b-lg border-t border-gray-200 overflow-hidden 
                       max-h-0 opacity-0 
                       peer-hover:max-h-60 peer-hover:opacity-100 
                       group-hover:max-h-60 group-hover:opacity-100 
                       transition-all duration-300 ease-in-out"
          >
            <div className="p-4 space-y-3 text-center">
              <p className="text-gray-700 text-sm">Reach out to the developer via:</p>
              <div className="flex justify-center gap-6 flex-wrap">
                <a
                  href="tel:+917887557175"
                  target="_blank"
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                >
                  <FiPhoneCall size={18} /> Call
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=917887557175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 flex items-center gap-1"
                >
                  <FiMessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href="mailto:pathaksoham2003@gmail.com"
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FiMail size={18} /> Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className='h-full w-full flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
