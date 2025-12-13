// src/components/teams/AttendanceStatsCards.jsx
import {
  FiUsers,
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiTrendingUp
} from "react-icons/fi";
import styles from "../../styles/attendance/AttendanceStatsCards.module.css";

const AttendanceStatsCards = ({ stats, isLoading }) => {
  const cards = [
    {
      id: "total_employees",
      title: "Total Employees",
      value: stats.total_employees || 0,
      icon: <FiUsers />,
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    },
    {
      id: "present_today",
      title: "Present Today",
      value: stats.present_today || 0,
      icon: <FiCheckCircle />,
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    {
      id: "on_leave",
      title: "On Leave",
      value: stats.on_leave || 0,
      icon: <FiCalendar />,
      color: "#F59E0B",
      bgColor: "#FFFBEB"
    },
    {
      id: "late_arrivals",
      title: "Late Arrivals",
      value: stats.late_arrivals || 0,
      icon: <FiClock />,
      color: "#EF4444",
      bgColor: "#FEF2F2"
    },
    {
      id: "average_hours",
      title: "Avg. Hours",
      value: typeof stats.average_hours === 'number' 
        ? stats.average_hours.toFixed(1)
        : '0.0',
      icon: <FiTrendingUp />,
      color: "#8B5CF6",
      bgColor: "#F5F3FF"
    }
  ];

  return (
    <div className={styles["stats-cards"]}>
      {cards.map(card => (
        <div 
          key={card.id} 
          className={styles["stat-card"]}
          style={{ backgroundColor: card.bgColor }}
        >
          <div className={styles["stat-content"]}>
            <div className={styles["stat-text"]}>
              <div className={styles["stat-value"]}>
                {isLoading ? (
                  <div className={styles["value-skeleton"]}></div>
                ) : (
                  card.value
                )}
              </div>
              <div className={styles["stat-title"]}>{card.title}</div>
            </div>
            <div 
              className={styles["stat-icon"]}
              style={{ color: card.color }}
            >
              {card.icon}
            </div>
          </div>
          
          {/* Progress bar for average hours */}
          {card.id === "average_hours" && !isLoading && (
            <div className={styles["progress-bar"]}>
              <div 
                className={styles["progress-fill"]}
                style={{
                  width: `${Math.min(100, (parseFloat(card.value) / 8) * 100)}%`,
                  backgroundColor: card.color
                }}
              ></div>
              <div className={styles["progress-labels"]}>
                <span>0h</span>
                <span>Target: 8h</span>
                <span>12h</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttendanceStatsCards;