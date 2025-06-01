// File: UserProfile.jsx
// Author: montey
// Description: Displays user profile information fetched from an external API. Handles loading, error, and retry logic using a custom data-fetching hook.

import React from 'react';
import { useFetchData } from '../hooks/useFetchData';

export function UserProfile({ userId }) {
  // Fetch user data for the given userId using a custom hook
  const { data, loading, error, refetch } = useFetchData(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  // Show loading indicator while fetching
  if (loading) return <div aria-busy="true">Loading user...</div>;
  // Show error message and retry button if fetch fails
  if (error) {
    return (
      <div role="alert" style={{ color: "red" }}>
        Failed to load user: {error.message}
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }
  // If no data, render nothing
  if (!data) return null;
  // Render user profile details
  return (
    <div className="user-profile" aria-live="polite">
      <h3>{data.name}</h3>
      <p>Email: {data.email}</p>
      <p>Phone: {data.phone}</p>
      <p>Website: <a href={`http://${data.website}`}>{data.website}</a></p>
    </div>
  );
}
