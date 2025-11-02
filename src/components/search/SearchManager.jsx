// src/components/SearchManager.jsx
import React, { useState } from 'react';
import SearchBlock from './SearchBlock';
import SearchResultsBlock from './SearchResultsBlock';
import { searchTasks } from '../api/tasks';

const TaskSearchManager = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      console.log('🔄 Starting search with:', searchData);
      
      // Map frontend field names to backend field names
      const apiFilters = {
        fromDate: searchData.fromDate,
        toDate: searchData.toDate,
        title: searchData.title,
        status: searchData.status,
        priority: searchData.priority,
        assignedTo: searchData.assignedTo === '-AliRazaNaqvi' ? '' : searchData.assignedTo
      };

      // Remove empty values
      Object.keys(apiFilters).forEach(key => {
        if (!apiFilters[key]) {
          delete apiFilters[key];
        }
      });

      console.log('📤 Sending API filters:', apiFilters);

      const results = await searchTasks(apiFilters);
      console.log('📥 Received results:', results);
      setSearchResults(results);
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseResults = () => {
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
  };

  // Transform API data to match SearchResultsBlock format
  const transformResults = (apiResults) => {
    return apiResults.map((task, index) => ({
      id: task.id,
      ticketId: task.project_name || `Task-${task.id}`,
      title: task.title,
      projectType: task.project_name || 'General',
      status: task.status,
      priority: task.priority,
      createdBy: 'Current User', // You might want to get this from task data
      department: 'Operation',   // Default or from user data
      location: 'Office',        // Default
      assignedTo: task.member_ids && task.member_ids.length > 0 ? `User ${task.member_ids[0]}` : 'Unassigned',
      assignedDepartment: 'Dev'  // Default
    }));
  };

  return (
    <div>
      <SearchBlock onSubmit={handleSearch} />
      
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666'
        }}>
          Searching...
        </div>
      )}
      
      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#dc2626',
          backgroundColor: '#fef2f2',
          margin: '10px 0',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      {hasSearched && !loading && (
        <SearchResultsBlock 
          searchResults={transformResults(searchResults)} 
          onClose={handleCloseResults}
        />
      )}
    </div>
  );
};

export default TaskSearchManager;