import React from 'react';
import { useFetchData } from '../hooks/useFetchData';

export function UserProfile({ userId }) {
  const { data, loading, error, refetch } = useFetchData(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (loading) return <div aria-busy="true">Loading user...</div>;
  if (error) {
    return (
      <div role="alert" style={{ color: "red" }}>
        Failed to load user: {error.message}
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }
  if (!data) return null;
  return (
    <div className="user-profile" aria-live="polite">
      <h3>{data.name}</h3>
      <p>Email: {data.email}</p>
      <p>Phone: {data.phone}</p>
      <p>Website: <a href={`http://${data.website}`}>{data.website}</a></p>
    </div>
  );
}
