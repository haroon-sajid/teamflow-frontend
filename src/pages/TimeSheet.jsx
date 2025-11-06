// Update in TimeSheet.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Header from '../components/Header';
import styles from '../styles/TimeSheet.module.css';
import { 
  getEmployeesTimesheet, 
  getCurrentWeekStart, 
  getNextWeekStart,
  getPreviousWeekStart,
  formatDateForDisplay,
  getUserTasksForWeek,
  getFilteredUserTasks,  // NEW: Import filtered endpoint
  getWorklogsSummary     // NEW: For TWH/TTT calculations
} from '../api/timesheet';
import { getOrganizationMembers } from '../api/users';

const TimeSheet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    employee_id: '',
    week_start: getCurrentWeekStart(),
    week_type: 'this-week',
    custom_start: '',
    custom_end: ''
  });

  // NEW: Track current date for filtering
  const [currentDate] = useState(new Date());

  // NEW: Get today's date for TTT calculation
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Fetch initial data
  useEffect(() => {
    fetchTimesheetData();
    fetchOrganizationMembers();
  }, []);

  const fetchOrganizationMembers = async () => {
    try {
      const members = await getOrganizationMembers();
      setEmployees(members);
    } catch (error) {
      console.error('Error fetching organization members:', error);
      setEmployees([]);
    }
  };

  // UPDATED: Fetch timesheet data with proper filtering
  const fetchTimesheetData = async () => {
    setLoading(true);
    try {
      let apiFilters = {};
      
      switch (filters.week_type) {
        case 'prev-week':
          apiFilters.week_start = getPreviousWeekStart(filters.week_start);
          break;
        case 'next-week':
          apiFilters.week_start = getNextWeekStart(filters.week_start);
          break;
        case 'custom-range':
          if (filters.custom_start && filters.custom_end) {
            apiFilters.start_date = filters.custom_start;
            apiFilters.end_date = filters.custom_end;
          } else {
            apiFilters.week_start = getCurrentWeekStart();
          }
          break;
        default:
          apiFilters.week_start = filters.week_start;
      }

      if (filters.employee_id) {
        apiFilters.user_id = filters.employee_id;
      }

      Object.keys(apiFilters).forEach(key => {
        if (apiFilters[key] === '') {
          delete apiFilters[key];
        }
      });

      let timesheetData;
      
      if (filters.employee_id) {
        // NEW: Use filtered endpoint for proper date handling
        const taskData = await getFilteredUserTasks(apiFilters);
        const formattedData = formatEmployeeTaskData(taskData, filters.employee_id);
        timesheetData = formattedData;
      } else {
        const summaryResponse = await getEmployeesTimesheet(apiFilters);
        timesheetData = summaryResponse.data || summaryResponse || [];
        
        if (timesheetData.length > 0) {
          const enhancedData = await enhanceDataWithTaskDetails(timesheetData, apiFilters.week_start || apiFilters.start_date);
          timesheetData = enhancedData;
        }
      }
      
      setData(timesheetData);
    } catch (error) {
      console.error('Error fetching timesheet data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Enhanced data formatting with proper TWH/TTT calculations
  // UPDATED: Enhanced data formatting with proper TWH/TTT calculations
const enhanceDataWithTaskDetails = async (timesheetData, weekStart) => {
  try {
    const enhancedData = [];
    const currentDate = new Date().toISOString().split('T')[0];
    const todayDate = getTodayDate(); // NEW: For TTT calculation
    
    for (const employee of timesheetData) {
      try {
        // Use filtered endpoint for proper date handling
        const taskData = await getFilteredUserTasks({
          week_start: weekStart,
          user_id: employee.user_id || employee.id
        });
        
        const weekDates = getWeekDates();
        const dailyDataWithTasks = [];
        let weeklyTotalHours = 0; // NEW: Track weekly total for TWH
        let todayTaskTime = 0;    // NEW: Track today's task time for TTT
        
        weekDates.forEach((weekDate, index) => {
          const dateStr = weekDate.isoDate;
          const isFutureDate = dateStr > currentDate;
          const isToday = dateStr === todayDate; // NEW: Check if this is today
          
          // NEW: Only get tasks for this specific date, and only if not future date
          const dayTasks = !isFutureDate ? (taskData.daily_tasks?.[dateStr] || []) : [];
          
          const existingDayData = (employee.daily_data || employee.week_data || [])[index] || {};
          
          // FIXED: Use work_hours from existing data OR calculate from tasks if not available
          const dailyWorkHours = existingDayData.work_hours || existingDayData.hours || 
                               dayTasks.reduce((sum, task) => sum + (task.logged_hours || 0), 0);
          const dailyTaskHours = dayTasks.reduce((sum, task) => sum + (task.logged_hours || 0), 0);
          
          // NEW: Accumulate weekly total - use work_hours if available, otherwise task hours
          weeklyTotalHours += dailyWorkHours;
          
          // NEW: If this is today, set today's task time
          if (isToday && !isFutureDate) {
            todayTaskTime = dailyTaskHours;
          }
          
          dailyDataWithTasks.push({
            day: weekDate.day,
            date: weekDate.date,
            isoDate: dateStr,
            work_hours: dailyWorkHours,
            task_time: dailyTaskHours,
            tasks: dayTasks,
            isFuture: isFutureDate,
            isToday: isToday // NEW: Track today's date
          });
        });
        
        // NEW: Use proper calculations for TWH and TTT
        const totalWorkHours = weeklyTotalHours; // TWH: Total weekly work hours
        const totalTaskTime = todayTaskTime;     // TTT: Only today's task time
        
        enhancedData.push({
          ...employee,
          daily_data: dailyDataWithTasks,
          total_work_hours: totalWorkHours,  // TWH - Weekly total
          total_task_time: totalTaskTime,     // TTT - Today's task time only
          weekly_total_hours: weeklyTotalHours // NEW: Keep track of weekly total separately
        });
      } catch (error) {
        console.error(`Error fetching tasks for employee ${employee.user_id}:`, error);
        // NEW: Provide fallback calculations
        const todayDate = getTodayDate();
        const dailyData = employee.daily_data || employee.week_data || [];
        
        // FIXED: Calculate weekly total from daily work hours
        const weeklyTotal = dailyData.reduce((sum, day) => {
          return sum + (day.work_hours || day.hours || 0);
        }, 0);
        
        const todayData = dailyData.find(day => day.isoDate === todayDate) || {};
        const todayTaskTime = todayData.task_time || todayData.task_hours || 0;
        
        enhancedData.push({
          ...employee,
          total_work_hours: weeklyTotal,  // TWH
          total_task_time: todayTaskTime   // TTT
        });
      }
    }
    
    return enhancedData;
  } catch (error) {
    console.error('Error enhancing data with task details:', error);
    return timesheetData;
  }
};

  // UPDATED: Format employee task data with proper TWH/TTT
  const formatEmployeeTaskData = (taskData, employeeId) => {
    if (!taskData || !taskData.daily_tasks) return [];
    
    const employee = employees.find(emp => emp.id === parseInt(employeeId));
    if (!employee) return [];
    
    const weekDates = getWeekDates();
    const currentDate = new Date().toISOString().split('T')[0];
    const todayDate = getTodayDate(); // NEW: For TTT calculation
    const formattedData = [];
    let weeklyTotalHours = 0; // NEW: Track weekly total
    let todayTaskTime = 0;    // NEW: Track today's task time
    
    weekDates.forEach((weekDate, index) => {
      const dateStr = weekDate.isoDate;
      const isFutureDate = dateStr > currentDate;
      const isToday = dateStr === todayDate; // NEW: Check if today
      
      // NEW: Only show tasks for current and past dates
      const dayTasks = !isFutureDate ? (taskData.daily_tasks[dateStr] || []) : [];
      
      const dailyTaskHours = dayTasks.reduce((sum, task) => sum + (task.logged_hours || 0), 0);
      const dailyWorkHours = dailyTaskHours; // Assuming work hours = task hours for single employee view
      
      // NEW: Accumulate weekly total
      weeklyTotalHours += dailyWorkHours;
      
      // NEW: If this is today, set today's task time
      if (isToday && !isFutureDate) {
        todayTaskTime = dailyTaskHours;
      }
      
      formattedData.push({
        day: weekDate.day,
        date: weekDate.date,
        isoDate: dateStr,
        work_hours: dailyWorkHours,
        task_time: dailyTaskHours,
        tasks: dayTasks,
        isFuture: isFutureDate,
        isToday: isToday // NEW: Track today's date
      });
    });
    
    // NEW: Use proper calculations
    const totalWorkHours = weeklyTotalHours; // TWH: Weekly total
    const totalTaskTime = todayTaskTime;     // TTT: Today's task time only
    
    return [{
      id: employeeId,
      user_id: employeeId,
      first_name: employee.first_name,
      last_name: employee.last_name,
      full_name: employee.full_name,
      user_name: employee.user_name,
      profile_image: employee.profile_image,
      designation: employee.designation || employee.role || 'Employee',
      total_work_hours: totalWorkHours,  // TWH - Weekly total
      total_task_time: totalTaskTime,     // TTT - Today's task time only
      daily_data: formattedData,
      weekly_total_hours: weeklyTotalHours // NEW: Keep weekly total
    }];
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = () => {
    fetchTimesheetData();
  };

  const getWeekDates = () => {
    let startDate;
    
    switch (filters.week_type) {
      case 'prev-week':
        startDate = getPreviousWeekStart(filters.week_start);
        break;
      case 'next-week':
        startDate = getNextWeekStart(filters.week_start);
        break;
      case 'custom-range':
        startDate = filters.custom_start || getCurrentWeekStart();
        break;
      default:
        startDate = filters.week_start;
    }

    const dates = [];
    const daysCount = filters.week_type === 'custom-range' && filters.custom_end ? 
      Math.ceil((new Date(filters.custom_end) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 : 7;
    
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      if (filters.week_type === 'custom-range' && filters.custom_end && date > new Date(filters.custom_end)) {
        break;
      }
      
      const isoDate = date.toISOString().split('T')[0];
      dates.push({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date.getDay()] || `Day ${i+1}`,
        date: formatDateForDisplay(isoDate),
        isoDate: isoDate,
        isFuture: isoDate > new Date().toISOString().split('T')[0]  // NEW: Track future dates
      });
    }
    return dates;
  };

  // UPDATED: Render task names with future date handling
  const renderTaskNames = (tasks, dateStr, isFuture = false) => {
    // NEW: Don't show tasks for future dates
    if (isFuture) {
      return (
        <div className={styles.futureDate}>
          Future Date
        </div>
      );
    }
    
    if (!tasks || tasks.length === 0) {
      return null;
    }

    return (
      <div className={styles.tasksList}>
        {tasks.slice(0, 3).map((task, taskIndex) => (
          <div 
            key={taskIndex} 
            className={`${styles.taskItem} ${styles[getPriorityClass(task.priority)]}`}
          >
            <span className={styles.taskTitle}>
              {task.task_title || task.title || `Task #${task.task_id || task.id}`}
            </span>
            {task.logged_hours > 0 && (
              <span className={styles.taskHours}>
                ({task.logged_hours}h)
              </span>
            )}
          </div>
        ))}
        {tasks.length > 3 && (
          <div className={styles.moreTasks}>
            +{tasks.length - 3} more
          </div>
        )}
      </div>
    );
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'taskPriorityHigh';
      case 'medium':
        return 'taskPriorityMedium';
      case 'low':
        return 'taskPriorityLow';
      default:
        return 'taskPriorityDefault';
    }
  };

  const weekDates = getWeekDates();

  return (
    <Layout>
      <Header 
        title="Time Sheet"
        subtitle="Manage and view employee timesheets"
      />

      <div className={styles.container}>
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <div className={`${styles.filterGroup} ${filters.week_type === 'custom-range' ? styles.shrinkField : ''}`}>
            <label className={styles.filterLabel}>Employees</label>
            <select 
              className={styles.dropdown}
              value={filters.employee_id}
              onChange={(e) => handleFilterChange('employee_id', e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.full_name || emp.user_name || `${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <div className={`${styles.filterGroup} ${styles.weekSelectionGroup} ${filters.week_type === 'custom-range' ? styles.expandField : ''}`}>
            <label className={styles.filterLabel}>Select Week</label>
            <div className={styles.weekSelectionContainer}>
              <select 
                className={`${styles.dropdown} ${styles.weekTypeDropdown}`}
                value={filters.week_type}
                onChange={(e) => handleFilterChange('week_type', e.target.value)}
              >
                <option value="prev-week">Prev Week</option>
                <option value="this-week">This Week</option>
                <option value="next-week">Next Week</option>
                <option value="custom-range">Custom Range</option>
              </select>
              
              {filters.week_type === 'custom-range' && (
                <div className={styles.customRangeContainer}>
                  <input
                    type="date"
                    className={`${styles.dropdown} ${styles.dateInput}`}
                    value={filters.custom_start}
                    onChange={(e) => handleFilterChange('custom_start', e.target.value)}
                    placeholder="Start Date"
                  />
                  <span className={styles.dateSeparator}>to</span>
                  <input
                    type="date"
                    className={`${styles.dropdown} ${styles.dateInput}`}
                    value={filters.custom_end}
                    onChange={(e) => handleFilterChange('custom_end', e.target.value)}
                    placeholder="End Date"
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.searchButtonContainer}>
            <button 
              className={styles.searchButton} 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.buttonSpinner}></span>
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>

        {/* Week Header */}
        {!loading && data.length > 0 && (
          <div className={styles.weekHeader}>
            <div className={styles.employeeInfoHeader}></div>
            <div className={styles.daysGrid} style={{ gridTemplateColumns: `repeat(${weekDates.length}, 1fr)` }}>
              {weekDates.map((date, index) => (
                <div key={index} className={styles.dayHeader}>
                  <div className={styles.dayName}>{date.day}</div>
                  <div className={styles.date}>{date.date}</div>
                  {date.isFuture && <div className={styles.futureBadge}>Future</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner}></div>
            Loading timesheet data...
          </div>
        )}

      {/* Timesheet Grid */}
      {!loading && data.length > 0 && (
        <div className={styles.timesheetGrid}>
          {data.map(employee => (
            <div
              key={employee.id || employee.user_id}
              className={styles.employeeCard}
            >
              <div className={styles.employeeInfo}>
                <div className={styles.employeeAvatar}>
                  {employee.profile_image ? (
                    <img
                      src={
                        employee.profile_picture ||
                        employee.profile_image
                      }
                      alt={
                        employee.full_name ||
                        employee.user_name ||
                        "Employee"
                      }
                    />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      {(employee.full_name ||
                        employee.user_name ||
                        "EE").charAt(0)}
                    </div>
                  )}
                </div>

                <div className={styles.employeeDetails}>
                  <h3 className={styles.employeeName}>
                    {employee.full_name ||
                      employee.user_name ||
                      "Unknown"}
                  </h3>
                  <p className={styles.employeeDesignation}>
                    {employee.designation ||
                      employee.role ||
                      "Employee"}
                  </p>

                  {/* UPDATED: Fixed employee stats with correct TWH/TTT mapping */}
                  <div className={styles.employeeStats}>
                    <span className={styles.statTwh}>
                      TWH:{" "}
                      {employee.total_work_hours?.toFixed(1) ||
                        employee.weekly_total_hours?.toFixed(1) ||
                        "0.0"}{" "}
                      hours
                    </span>
                    <span className={styles.statTtt}>
                      TTT:{" "}
                      {employee.total_task_time?.toFixed(1) ||
                        "0.0"}{" "}
                      hours
                    </span>
                  </div>
                </div>
              </div>

                <div
                  className={styles.daysGrid}
                  style={{
                    gridTemplateColumns: `repeat(${weekDates.length}, 1fr)`
                  }}
                >
                  {(employee.daily_data ||
                    Array(weekDates.length)
                      .fill()
                      .map((_, i) => ({
                        day: weekDates[i]?.day || `Day ${i + 1}`,
                        work_hours: 0,
                        task_time: 0,
                        tasks: [],
                        isFuture: weekDates[i]?.isFuture || false
                      })))
                    .slice(0, weekDates.length)
                    .map((dayData, index) => (
                      <div
                        key={index}
                        className={`${styles.dayCell} ${
                          dayData.isFuture ? styles.futureDay : ""
                        }`}
                      >
                        {dayData.isFuture ? (
                          <div className={styles.futureDateContent}>
                            <div className={styles.futureText}>
                              Future Date
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={styles.workHours}>
                              WH: 8.0
                            </div>
                            <div className={styles.taskTime}>
                              Task Time:{" "}
                              {(dayData.task_time ||
                                dayData.task_hours ||
                                0
                              ).toFixed(1)}
                            </div>
                            {/* UPDATED: Pass isFuture flag */}
                            {renderTaskNames(
                              dayData.tasks,
                              dayData.isoDate,
                              dayData.isFuture
                            )}
                          </>
                        )}
                      </div>
                    ))}
                </div>

              
            </div>
          ))}
        </div>
      )}
      
        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📊</div>
            <h3>No timesheet data found</h3>
            <p>Please adjust your filters or add new entries.</p>
            <button className={styles.retryButton} onClick={handleSearch}>
              Try Again
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TimeSheet;