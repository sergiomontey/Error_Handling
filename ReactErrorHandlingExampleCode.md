# ⚙️ React Error Handling Example – Code with Annotations

This file contains an annotated implementation of error handling in React using a custom `useFetchData` hook. The example demonstrates how to show loading states, handle API failures, and retry logic—all with clean separation of concerns.

---

## 📦 Files & Components

### 🔄 `useFetchData` Custom Hook

```jsx
import React, { useState, useEffect } from 'react';

function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

---

### 👤 `UserProfile` Component

```jsx
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetchData(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  if (loading) {
    return (
      <div className="user-profile loading">
        <p>Loading user data...</p>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile error">
        <p>Error loading user: {error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (user) {
    return (
      <div className="user-profile">
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Website: <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">{user.website}</a></p>
        <p>Company: {user.company.name}</p>
      </div>
    );
  }

  return null;
}
```

---

### 🚀 `App` Component – Root Entry

```jsx
function App() {
  const [currentUserId, setCurrentUserId] = useState(1);

  const handleNextUser = () => {
    setCurrentUserId(prevId => (prevId % 10) + 1);
  };

  return (
    <div className="app-container">
      <h1>Asynchronous Behavior in React UI</h1>
      <button onClick={handleNextUser}>Load Next User ({currentUserId})</button>

      <div className="profile-section">
        <UserProfile userId={currentUserId} />
      </div>

      <style jsx>{`
        .app-container {
          font-family: sans-serif;
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
          border: 1px solid #eee;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
          text-align: center;
        }
        button {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-bottom: 20px;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        button:hover {
          background-color: #0056b3;
        }
        .user-profile {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          margin-top: 20px;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        .user-profile h2 {
          color: #007bff;
          margin-bottom: 10px;
        }
        .user-profile p {
          margin: 5px 0;
          color: #555;
        }
        .user-profile a {
          color: #007bff;
          text-decoration: none;
        }
        .user-profile a:hover {
          text-decoration: underline;
        }
        .user-profile.loading {
          background-color: #f9f9f9;
          color: #888;
        }
        .user-profile.error {
          background-color: #ffe0e0;
          border-color: #ff9999;
          color: #d8000c;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #007bff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin-top: 10px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
```

---

## 📜 License

MIT © 2025 Sergio Montecinos
