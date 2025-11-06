// // src/components/Sidebar.jsx
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { useState, useEffect } from "react";
// import "../styles/Sidebar.css"; 
// import "../styles/ProfileMenu.css";

// import {
//   FiHome,
//   FiFolder,
//   FiCheckSquare,
//   FiUser,
//   FiBarChart2,
//   FiLogOut,
//   FiUsers,
//   FiFileText,
//   FiSettings,
//   FiMenu,
//   FiX
// } from "react-icons/fi";

// import ProfileMenu from "./profile/ProfileMenu";

// export default function Sidebar() {
//   const nav = useNavigate();
//   const location = useLocation();
//   const [userRole, setUserRole] = useState("");
//   const [isMobileOpen, setIsMobileOpen] = useState(false);

//   useEffect(() => {
//     const role = localStorage.getItem("userRole");
//     setUserRole(role || "");
//   }, []);

//   const isActive = (path) => (location.pathname === path ? "active" : "");
//   const isAdminUser = userRole === "admin" || userRole === "super_admin";

//   const closeMobileSidebar = () => {
//     setIsMobileOpen(false);
//   };

//   return (
//     <>
//       {/* Mobile Menu Toggle Button */}
//       <button 
//         className="mobile-menu-toggle"
//         onClick={() => setIsMobileOpen(!isMobileOpen)}
//       >
//         {isMobileOpen ? <FiX /> : <FiMenu />}
//       </button>

//       {/* Overlay for mobile */}
//       {isMobileOpen && (
//         <div 
//           className="sidebar-overlay"
//           onClick={closeMobileSidebar}
//         ></div>
//       )}

//       <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
//         <div className="sidebar-header">
//           <h2 className="logo">TeamFlow</h2>
//           <p className="tagline">
//             {isAdminUser ? "Admin Panel" : "Member Panel"}
//           </p>
//         </div>

//         <nav className="sidebar-nav">
//           {isAdminUser ? (
//             <>
//               <button
//                 className={`sidebar-btn ${isActive("/admin")}`}
//                 onClick={() => { nav("/admin"); closeMobileSidebar(); }}
//               >
//                 <FiHome className="sidebar-icon" />
//                 <span className="sidebar-text">Dashboard</span>
//               </button>

//               <button
//                 className={`sidebar-btn ${isActive("/projects")}`}
//                 onClick={() => { nav("/projects"); closeMobileSidebar(); }}
//               >
//                 <FiFolder className="sidebar-icon" />
//                 <span className="sidebar-text">Projects</span>
//               </button>

//               <button
//                 className={`sidebar-btn ${isActive("/create-task")}`}
//                 onClick={() => { nav("/create-task"); closeMobileSidebar(); }}
//               >
//                 <FiCheckSquare className="sidebar-icon" />
//                 <span className="sidebar-text">Tasks</span>
//               </button>

//               <button
//                 className={`sidebar-btn ${isActive("/invite-user")}`}
//                 onClick={() => { nav("/invite-user"); closeMobileSidebar(); }}
//               >
//                 <FiUsers className="sidebar-icon" />
//                 <span className="sidebar-text">Invite Users</span>
//               </button>

//               <button
//                 className={`sidebar-btn ${isActive("/reports")}`}
//                 onClick={() => { nav("/reports"); closeMobileSidebar(); }}
//               >
//                 <FiBarChart2 className="sidebar-icon" />
//                 <span className="sidebar-text">Reports</span>
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 className={`sidebar-btn ${isActive("/member")}`}
//                 onClick={() => { nav("/member"); closeMobileSidebar(); }}
//               >
//                 <FiHome className="sidebar-icon" />
//                 <span className="sidebar-text">Dashboard</span>
//               </button>
//             </>
//           )}

//           <div className="sidebar-divider"></div>
//         </nav>

//         {/* Updated Footer with Profile Icon */}
//         <div className="sidebar-footer">
//           <div className="flex items-center justify-center py-4 border-t border-slate-700">
//             <ProfileMenu />
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }








// src/components/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import "../styles/Sidebar.css"; 
import "../styles/ProfileMenu.css";

import {
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiUser,
  FiBarChart2,
  FiLogOut,
  FiUsers,
  FiFileText,
  FiSettings,
  FiMenu,
  FiX,
  FiClock
} from "react-icons/fi";

import ProfileMenu from "./profile/ProfileMenu";

export default function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role || "");
  }, []);

  const isActive = (path) => (location.pathname === path ? "active" : "");
  const isAdminUser = userRole === "admin" || userRole === "super_admin";

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
        ></div>
      )}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="logo">TeamFlow</h2>
          <p className="tagline">
            {isAdminUser ? "Admin Panel" : "Member Panel"}
          </p>
        </div>

        <nav className="sidebar-nav">
          {isAdminUser ? (
            <>
              <button
                className={`sidebar-btn ${isActive("/admin")}`}
                onClick={() => { nav("/admin"); closeMobileSidebar(); }}
              >
                <FiHome className="sidebar-icon" />
                <span className="sidebar-text">Dashboard</span>
              </button>

              <button
                className={`sidebar-btn ${isActive("/projects")}`}
                onClick={() => { nav("/projects"); closeMobileSidebar(); }}
              >
                <FiFolder className="sidebar-icon" />
                <span className="sidebar-text">Projects</span>
              </button>

              <button
                className={`sidebar-btn ${isActive("/create-task")}`}
                onClick={() => { nav("/create-task"); closeMobileSidebar(); }}
              >
                <FiCheckSquare className="sidebar-icon" />
                <span className="sidebar-text">Tasks</span>
              </button>

              {/* New TimeSheet Button for Admin */}
              <button
                className={`sidebar-btn ${isActive("/timesheet")}`}
                onClick={() => { nav("/timesheet"); closeMobileSidebar(); }}
              >
                <FiClock className="sidebar-icon" />
                <span className="sidebar-text">Time Sheet</span>
              </button>

              <button
                className={`sidebar-btn ${isActive("/invite-user")}`}
                onClick={() => { nav("/invite-user"); closeMobileSidebar(); }}
              >
                <FiUsers className="sidebar-icon" />
                <span className="sidebar-text">Invite Users</span>
              </button>

              <button
                className={`sidebar-btn ${isActive("/reports")}`}
                onClick={() => { nav("/reports"); closeMobileSidebar(); }}
              >
                <FiBarChart2 className="sidebar-icon" />
                <span className="sidebar-text">Reports</span>
              </button>
            </>
          ) : (
            <>
              <button
                className={`sidebar-btn ${isActive("/member")}`}
                onClick={() => { nav("/member"); closeMobileSidebar(); }}
              >
                <FiHome className="sidebar-icon" />
                <span className="sidebar-text">Dashboard</span>
              </button>

              {/* New TimeSheet Button for Members */}
              <button
                className={`sidebar-btn ${isActive("/timesheet")}`}
                onClick={() => { nav("/timesheet"); closeMobileSidebar(); }}
              >
                <FiClock className="sidebar-icon" />
                <span className="sidebar-text">Time Sheet</span>
              </button>
            </>
          )}

          <div className="sidebar-divider"></div>
        </nav>

        {/* Updated Footer with Profile Icon */}
        <div className="sidebar-footer">
          <div className="flex items-center justify-center py-4 border-t border-slate-700">
            <ProfileMenu />
          </div>
        </div>
      </aside>
    </>
  );
}