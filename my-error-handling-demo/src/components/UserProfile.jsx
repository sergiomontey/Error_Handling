/*
 * File: UserProfile.jsx
 * Author: Sergio Montecinos
 * Description: Displays user profile data, handling async loading, errors, and retry using the useFetchData hook.
 */

import React from 'react';
import { useFetchData } from '../hooks/useFetchData';

/**
 * Fetches and displays user profile data from the API.
 * Shows a loading spinner, error message with retry, or user details.
 */
export function UserProfile({ userId }) {
  // Fetch user data using the custom hook
  const { data, loading, error, refetch } = useFetchData(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  // Display loading indicator with ARIA support
  if (loading) return <div aria-busy="true">Loading user...</div>;

  // If error, show message and retry option (role=alert for accessibility)
  if (error) {
    return (
      <div role="alert" style={{ color: "red" }}>
        Failed to load user: {error.message}
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  // No data fetched yet, don't render
  if (!data) return null;

  // Display fetched user details
  return (
    <div className="user-profile" aria-live="polite">
      <h3>{data.name}</h3>
      <p>Email: {data.email}</p>
      <p>Phone: {data.phone}</p>
      <p>Website: <a href={`http://${data.website}`}>{data.website}</a></p>
    </div>
  );
}
