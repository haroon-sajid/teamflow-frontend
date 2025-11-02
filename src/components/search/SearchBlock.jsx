
import React, { useState } from 'react';
import styles from "../../styles/SearchBlock.module.css";

const SearchBlock = ({ onSubmit, loading = false }) => {
  // State for all form fields
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchData = {
      fromDate,
      toDate,
      title,
      status,
      assignedTo,
      priority
    };
    
    console.log('🔍 Search data:', searchData);
    
    // Call the parent component's search handler
    if (onSubmit) {
      onSubmit(searchData);
    }
  };

  // Search Icon SVG Component
  const SearchIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={styles.searchIcon}
    >
      <path 
        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M14 14L11.1 11.1" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={styles.searchBlockContainer}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        {/* From Date Field */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            From Date 
          </label>
          <input
            type="date"
            className={styles.formInput}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* To Date Field */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            To Date
          </label>
          <input
            type="date"
            className={styles.formInput}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Title Field with Search Icon */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Title</label>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              className={`${styles.formInput} ${styles.searchInput}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name"
            />
            <span className={styles.searchIcon}>
              <SearchIcon />
            </span>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Status</label>
          <select
            className={styles.formSelect}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Assigned To Field */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Assigned To</label>
          <input
            type="text"
            className={styles.formInput}
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="User name or ID"
          />
        </div>

        {/* Priority Dropdown */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Priority</label>
          <select
            className={styles.formSelect}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Search Button */}
        <div className={styles.searchButtonGroup}>
          <button 
            type="submit" 
            className={styles.searchButton}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBlock;