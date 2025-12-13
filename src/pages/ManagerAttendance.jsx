// src/pages/ManagerAttendance.jsx
import { useState, useEffect } from "react";
import {
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiActivity,
  FiFilter,
  FiDownload,
  FiSearch,
  FiCalendar,
  FiBarChart2,
  FiUserCheck,
  FiUserX
} from "react-icons/fi";
import { format, isToday, parseISO, differenceInHours, differenceInMinutes } from "date-fns";
import styles from "../styles/ManagerAttendance.module.css";
import Layout from "../components/layout/Layout.jsx";
import Header from "../components/layout/Header.jsx";
import { useAuth } from "../hooks/useAuth";
import BaseModal from "../components/modals/BaseModal";
import { API_URL } from "../config/apiConfig";

const ManagerAttendance = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalEmployees: 0,
    checkedIn: 0,
    checkedOut: 0,
    onBreak: 0,
    averageHours: 0,
    attendanceRate: 0
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("Notification");
  const [isExporting, setIsExporting] = useState(false);

  // Mock data - Replace with API call
  const mockEmployees = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Senior Developer",
      department: "Engineering",
      avatar: "JD",
      status: "checked_in",
      checkInTime: "2024-01-15T09:00:00",
      checkOutTime: null,
      location: "Office",
      totalHoursToday: "08:30",
      breakTime: "01:00",
      productiveHours: "07:30",
      lastActivity: "2024-01-15T16:30:00",
      weeklyHours: 42.5,
      attendanceRate: 98
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Product Manager",
      department: "Product",
      avatar: "JS",
      status: "checked_out",
      checkInTime: "2024-01-15T08:45:00",
      checkOutTime: "2024-01-15T17:15:00",
      location: "Remote",
      totalHoursToday: "08:30",
      breakTime: "00:45",
      productiveHours: "07:45",
      lastActivity: "2024-01-15T17:15:00",
      weeklyHours: 40.0,
      attendanceRate: 100
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Designer",
      department: "Design",
      avatar: "BJ",
      status: "on_break",
      checkInTime: "2024-01-15T09:30:00",
      checkOutTime: null,
      location: "Office",
      totalHoursToday: "06:15",
      breakTime: "00:30",
      productiveHours: "05:45",
      lastActivity: "2024-01-15T15:45:00",
      weeklyHours: 38.5,
      attendanceRate: 95
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "QA Engineer",
      department: "Engineering",
      avatar: "AB",
      status: "not_checked_in",
      checkInTime: null,
      checkOutTime: null,
      location: null,
      totalHoursToday: "00:00",
      breakTime: "00:00",
      productiveHours: "00:00",
      lastActivity: null,
      weeklyHours: 35.5,
      attendanceRate: 92
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "DevOps Engineer",
      department: "Engineering",
      avatar: "CW",
      status: "checked_in",
      checkInTime: "2024-01-15T08:00:00",
      checkOutTime: null,
      location: "Client Site",
      totalHoursToday: "09:45",
      breakTime: "01:15",
      productiveHours: "08:30",
      lastActivity: "2024-01-15T17:45:00",
      weeklyHours: 45.0,
      attendanceRate: 99
    },
  ];

  useEffect(() => {
    // In real app, fetch from API
    setEmployees(mockEmployees);
    calculateStats(mockEmployees);
    setLoading(false);
  }, []);

  const calculateStats = (empList) => {
    const checkedIn = empList.filter(e => e.status === "checked_in").length;
    const checkedOut = empList.filter(e => e.status === "checked_out").length;
    const onBreak = empList.filter(e => e.status === "on_break").length;
    const totalHours = empList.reduce((sum, emp) => {
      const [h, m] = emp.totalHoursToday.split(":").map(Number);
      return sum + h + (m / 60);
    }, 0);

    setStats({
      totalEmployees: empList.length,
      checkedIn,
      checkedOut,
      onBreak,
      averageHours: totalHours / empList.length,
      attendanceRate: ((checkedIn + checkedOut) / empList.length) * 100
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "checked_in": return styles["status-checked-in"];
      case "checked_out": return styles["status-checked-out"];
      case "on_break": return styles["status-on-break"];
      case "not_checked_in": return styles["status-not-checked"];
      default: return styles["status-unknown"];
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "checked_in": return "Checked In";
      case "checked_out": return "Checked Out";
      case "on_break": return "On Break";
      case "not_checked_in": return "Not Checked In";
      default: return "Unknown";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "checked_in": return <FiCheckCircle className={styles["icon-checked-in"]} />;
      case "checked_out": return <FiXCircle className={styles["icon-checked-out"]} />;
      case "on_break": return <FiClock className={styles["icon-on-break"]} />;
      default: return <FiClock className={styles["icon-unknown"]} />;
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || employee.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/attendance/export-report`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `attendance-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setModalTitle("Success");
      setModalMessage("✓ Report exported successfully!");
      setShowModal(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
      
    } catch (error) {
      console.error("Export error:", error);
      setModalTitle("Error");
      setModalMessage("✗ Failed to export report. Please try again.");
      setShowModal(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDateChange = (e) => {
    // Handle date filter change
    console.log("Date changed:", e.target.value);
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles["loading-container"]}>
          <div className={styles["loading-spinner"]}></div>
          <p>Loading attendance data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        title="Team Attendance"
        subtitle="Monitor and manage team check-ins"
        actionButtonText={isExporting ? "Exporting..." : "Export Report"}
        onActionClick={handleExportReport}
        actionButtonVariant="secondary"
        actionIcon={!isExporting && <FiDownload />}
      />

      <div className={styles["manager-container"]}>
        {/* Statistics Cards */}
        <div className={styles["stats-grid"]}>
          <div className={styles["stat-card"]}>
            <div className={styles["stat-header"]}>
              <div className={`${styles["stat-icon"]} ${styles["total-icon"]}`}>
                <FiUsers />
              </div>
              <div className={styles["stat-trend"]}>+2%</div>
            </div>
            <div className={styles["stat-value"]}>{stats.totalEmployees}</div>
            <div className={styles["stat-label"]}>Total Employees</div>
          </div>

          <div className={styles["stat-card"]}>
            <div className={styles["stat-header"]}>
              <div className={`${styles["stat-icon"]} ${styles["checked-in-icon"]}`}>
                <FiUserCheck />
              </div>
              <div className={styles["stat-trend"]}>+5%</div>
            </div>
            <div className={styles["stat-value"]}>{stats.checkedIn}</div>
            <div className={styles["stat-label"]}>Currently Working</div>
          </div>

          <div className={styles["stat-card"]}>
            <div className={styles["stat-header"]}>
              <div className={`${styles["stat-icon"]} ${styles["break-icon"]}`}>
                <FiClock />
              </div>
              <div className={styles["stat-trend"]}>-1%</div>
            </div>
            <div className={styles["stat-value"]}>{stats.onBreak}</div>
            <div className={styles["stat-label"]}>On Break</div>
          </div>

          <div className={styles["stat-card"]}>
            <div className={styles["stat-header"]}>
              <div className={`${styles["stat-icon"]} ${styles["attendance-icon"]}`}>
                <FiBarChart2 />
              </div>
              <div className={styles["stat-trend"]}>+0.5%</div>
            </div>
            <div className={styles["stat-value"]}>{stats.attendanceRate.toFixed(1)}%</div>
            <div className={styles["stat-label"]}>Attendance Rate</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className={styles["controls-section"]}>
          <div className={styles["search-box"]}>
            <FiSearch className={styles["search-icon"]} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles["search-input"]}
            />
          </div>

          <div className={styles["filters"]}>
            <div className={styles["filter-group"]}>
              <FiFilter className={styles["filter-icon"]} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles["filter-select"]}
              >
                <option value="all">All Status</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="on_break">On Break</option>
                <option value="not_checked_in">Not Checked In</option>
              </select>
            </div>

            <div className={styles["filter-group"]}>
              <FiCalendar className={styles["filter-icon"]} />
              <input
                type="date"
                value={format(filterDate, "yyyy-MM-dd")}
                onChange={handleDateChange}
                className={styles["date-input"]}
              />
            </div>

            <button className={styles["refresh-btn"]}>
              <FiActivity className={styles["refresh-icon"]} />
              Refresh
            </button>
          </div>
        </div>

        {/* Employees Table */}
        <div className={styles["employees-table-container"]}>
          <div className={styles["table-header"]}>
            <h3>Employee Attendance</h3>
            <span className={styles["table-subtitle"]}>
              Showing {filteredEmployees.length} of {employees.length} employees
            </span>
          </div>

          <div className={styles["table-responsive"]}>
            <table className={styles["employees-table"]}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Location</th>
                  <th>Total Hours</th>
                  <th>Break Time</th>
                  <th>Productive</th>
                  <th>Weekly Hours</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <div className={styles["employee-info"]}>
                        <div className={styles["avatar"]}>
                          {employee.avatar}
                        </div>
                        <div className={styles["employee-details"]}>
                          <div className={styles["employee-name"]}>
                            {employee.name}
                          </div>
                          <div className={styles["employee-role"]}>
                            {employee.role} • {employee.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`${styles["status-badge"]} ${getStatusBadgeClass(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        <span>{getStatusText(employee.status)}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles["time-cell"]}>
                        {employee.checkInTime ? (
                          <>
                            <div className={styles["time-value"]}>
                              {format(parseISO(employee.checkInTime), "hh:mm a")}
                            </div>
                            {employee.checkOutTime && (
                              <div className={styles["time-out"]}>
                                Out: {format(parseISO(employee.checkOutTime), "hh:mm a")}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className={styles["no-data"]}>--:--</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {employee.location ? (
                        <div className={styles["location-cell"]}>
                          <FiMapPin className={styles["location-icon"]} />
                          <span>{employee.location}</span>
                        </div>
                      ) : (
                        <span className={styles["no-data"]}>--</span>
                      )}
                    </td>
                    <td>
                      <div className={styles["hours-cell"]}>
                        <span className={`${styles["hours-value"]} ${parseInt(employee.totalHoursToday) >= 8 ? styles["hours-good"] : styles["hours-low"]}`}>
                          {employee.totalHoursToday}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles["break-cell"]}>
                        {employee.breakTime}
                      </div>
                    </td>
                    <td>
                      <div className={styles["productive-cell"]}>
                        <div className={styles["productive-bar"]}>
                          <div
                            className={styles["productive-fill"]}
                            style={{
                              width: `${(parseInt(employee.productiveHours) / parseInt(employee.totalHoursToday || 1)) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className={styles["productive-value"]}>
                          {employee.productiveHours}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles["weekly-cell"]}>
                        {employee.weeklyHours.toFixed(1)}h
                      </div>
                    </td>
                    <td>
                      <div className={styles["attendance-cell"]}>
                        <div className={styles["attendance-bar"]}>
                          <div
                            className={`${styles["attendance-fill"]} ${employee.attendanceRate >= 95 ? styles["fill-excellent"] :
                              employee.attendanceRate >= 90 ? styles["fill-good"] :
                                employee.attendanceRate >= 80 ? styles["fill-average"] :
                                  styles["fill-poor"]
                              }`}
                            style={{ width: `${employee.attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className={styles["attendance-value"]}>
                          {employee.attendanceRate}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={styles["actions-cell"]}>
                        <button
                          className={styles["view-btn"]}
                          onClick={() => console.log("View details", employee.id)}
                        >
                          View Details
                        </button>
                        <button
                          className={styles["message-btn"]}
                          onClick={() => console.log("Message", employee.id)}
                        >
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className={styles["no-results"]}>
              <div className={styles["no-results-icon"]}>
                <FiUsers />
              </div>
              <h4>No employees found</h4>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className={styles["summary-section"]}>
          <div className={styles["summary-card"]}>
            <h3 className={styles["summary-title"]}>Daily Summary</h3>
            <div className={styles["summary-content"]}>
              <div className={styles["summary-item"]}>
                <span className={styles["summary-label"]}>Average Hours Today:</span>
                <span className={styles["summary-value"]}>{stats.averageHours.toFixed(1)} hours</span>
              </div>
              <div className={styles["summary-item"]}>
                <span className={styles["summary-label"]}>On Time Rate:</span>
                <span className={styles["summary-value"]}>94.3%</span>
              </div>
              <div className={styles["summary-item"]}>
                <span className={styles["summary-label"]}>Late Arrivals:</span>
                <span className={styles["summary-value"]}>2 employees</span>
              </div>
              <div className={styles["summary-item"]}>
                <span className={styles["summary-label"]}>Early Departures:</span>
                <span className={styles["summary-value"]}>1 employee</span>
              </div>
            </div>
          </div>

          <div className={styles["summary-card"]}>
            <h3 className={styles["summary-title"]}>Location Distribution</h3>
            <div className={styles["summary-content"]}>
              <div className={styles["location-item"]}>
                <div className={styles["location-label"]}>
                  <div className={`${styles["location-dot"]} ${styles["office-dot"]}`}></div>
                  Office
                </div>
                <div className={styles["location-value"]}>65%</div>
              </div>
              <div className={styles["location-item"]}>
                <div className={styles["location-label"]}>
                  <div className={`${styles["location-dot"]} ${styles["remote-dot"]}`}></div>
                  Remote
                </div>
                <div className={styles["location-value"]}>25%</div>
              </div>
              <div className={styles["location-item"]}>
                <div className={styles["location-label"]}>
                  <div className={`${styles["location-dot"]} ${styles["client-dot"]}`}></div>
                  Client Site
                </div>
                <div className={styles["location-value"]}>10%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BaseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        showCloseButton={true}
      >
        <div style={{ padding: '20px', textAlign: 'center', fontSize: '16px' }}>
          {modalMessage}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
             <button 
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
             >
                Close
             </button>
        </div>
      </BaseModal>
    </Layout>
  );
};

export default ManagerAttendance;