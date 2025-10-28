// src/components/ProfileMenu.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiHelpCircle, FiLogOut, FiChevronDown } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    initials: "",
    role: ""
  });
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Get user data from localStorage
  useEffect(() => {
    const getUserData = () => {
      try {
        const userRole = localStorage.getItem("userRole") || "";
        const userName = localStorage.getItem("userName") || "";
        const userEmail = localStorage.getItem("userEmail") || "";
        
        // Generate initials from full name
        const getInitials = (name) => {
          if (!name) return "U";
          return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
        };

        setUserData({
          fullName: userName || "User",
          email: userEmail || "user@example.com",
          initials: getInitials(userName),
          role: userRole || "User"
        });
      } catch (error) {
        console.error("Error loading user data:", error);
        // Fallback data
        setUserData({
          fullName: "User",
          email: "user@example.com",
          initials: "U",
          role: "User"
        });
      }
    };

    getUserData();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
    setIsOpen(false);
  };

  const handleHelpClick = () => {
    navigate("/support");  // Navigate to Help & Support page
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
    setIsOpen(false);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  return (
    <div className="profile-menu-container" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profile-button"
      >
        <div className="profile-avatar">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
            {userData.initials}
          </div>
        </div>
        
        <div className="profile-info">
          <span className="profile-name">{userData.fullName}</span>
          <span className="profile-email">{userData.email}</span>
        </div>
        
        <motion.div 
          className="profile-arrow"
          variants={iconVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown size={16} />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="profile-dropdown"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* User Info Header */}
            <div className="dropdown-header">
              <div className="flex items-center gap-3 mb-2">
                <div className="profile-avatar">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {userData.initials}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="profile-name">{userData.fullName}</div>
                  <div className="profile-email">{userData.role}</div>
                </div>
              </div>
              <div className="text-xs text-slate-400">{userData.email}</div>
            </div>

            {/* Menu Items */}
            <div className="dropdown-items">
              <button
                onClick={handleProfileClick}
                className="dropdown-item"
              >
                <FiUser size={16} className="text-slate-400" />
                <span>Profile & Settings</span>
              </button>

              <button
                onClick={handleHelpClick}
                className="dropdown-item"
              >
                <FiHelpCircle size={16} className="text-slate-400" />
                <span>Help & Support</span>
              </button>

              <div className="border-t border-slate-700 my-1"></div>

              <button
                onClick={handleLogout}
                className="dropdown-item text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <FiLogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}