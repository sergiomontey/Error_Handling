import React, { useState, useEffect } from 'react';

// --- 1. Custom Hook for Data Fetching: `useFetchData` ---
// This custom hook is designed to encapsulate the entire logic for fetching data
// asynchronously. It promotes reusability, separates concerns (data fetching
// from UI rendering), and makes components cleaner.
function useFetchData(url) {
  // `data` state: Stores the fetched data. Initially null.
  const [data, setData] = useState(null);
  // `loading` state: Indicates whether an API call is currently in progress.
  // True when fetching, false otherwise. Initially true because we assume data
  // will be fetched immediately on component mount.
  const [loading, setLoading] = useState(true);
  // `error` state: Stores any error object that might occur during the fetch.
  // Initially null.
  const [error, setError] = useState(null);

  // `useEffect` hook is used to perform side effects in functional components.
  // In this case, the side effect is making an asynchronous API call.
  // The dependency array `[url]` means this effect will re-run whenever the
  // `url` prop changes, triggering a new data fetch.
  useEffect(() => {
    // Define an asynchronous function `fetchData` inside `useEffect`.
    // This allows us to use `async/await` syntax for cleaner asynchronous code.
    const fetchData = async () => {
      // 1. **Loading State & Feedback**: Set `loading` to true immediately
      //    before starting the fetch operation. This signals to the UI that
      //    data is being loaded.
      setLoading(true);
      // 2. **Error Handling**: Clear any previous error messages before a new
      //    fetch attempt. This ensures the UI doesn't show stale error states.
      setError(null);

      try {
        // `await` pauses the execution until the `fetch` Promise resolves.
        // `fetch(url)` initiates an HTTP request to the specified URL.
        const response = await fetch(url);

        // Check if the HTTP response was successful (status code 200-299).
        // If not, throw an error to be caught by the `catch` block.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // `await` pauses again until the response body is parsed as JSON.
        const result = await response.json();
        // Update the `data` state with the fetched result.
        setData(result);
      } catch (err) {
        // 3. **Error Handling**: If any error occurs during the `fetch` or
        //    JSON parsing, it will be caught here.
        console.error("Fetch error:", err); // Log the error for debugging.
        // Update the `error` state, which will be used by the UI to display
        // an error message.
        setError(err);
      } finally {
        // The `finally` block ensures this code runs regardless of whether
        // the `try` block completed successfully or an error occurred.
        // 4. **Loading State & Feedback**: Set `loading` to false. This
        //    indicates that the fetch operation has completed (either
        //    successfully or with an error), and the UI can stop showing
        //    a loading indicator.
        setLoading(false);
      }
    };

    // Call the `fetchData` function to execute the API request.
    fetchData();
  }, [url]); // Dependency array: Effect re-runs if `url` changes.

  // Return the current state values. This makes the hook reusable and
  // provides clear access to the data, loading status, and error status.
  return { data, loading, error };
}

// --- 2. UserProfile Component ---
// This component is responsible for displaying user data fetched asynchronously.
// It leverages the `useFetchData` hook to manage the data fetching lifecycle.
function UserProfile({ userId }) {
  // Destructure the values returned by our custom hook.
  // `data: user` renames the `data` variable to `user` for clarity.
  const { data: user, loading, error } = useFetchData(
    // Construct the API URL using the `userId` prop.
    // `https://jsonplaceholder.typicode.com` is a public fake API for testing.
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );

  // --- Conditional Rendering based on Async States ---
  // This is a common pattern in React for handling different UI states
  // during asynchronous operations.

  // 1. **Loading State & Feedback**: If `loading` is true, display a loading indicator.
  // This provides immediate feedback to the user that something is happening.
  if (loading) {
    return (
      <div className="user-profile loading">
        <p>Loading user data...</p>
        {/* A simple CSS spinner to visually indicate activity. */}
        <div className="spinner"></div>
      </div>
    );
  }

  // 2. **Error Handling**: If `error` is not null, display an error message.
  // This informs the user if something went wrong during the fetch.
  if (error) {
    return (
      <div className="user-profile error">
        {/* Display the error message from the caught exception. */}
        <p>Error loading user: {error.message}</p>
        {/* A simple retry button. In a more complex app, this might trigger
            a re-fetch mechanism within the hook or component state.
            Here, it just reloads the entire page. */}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // 3. **Success State**: If `user` data is available (meaning `loading` is false
  //    and `error` is null), render the user's profile information.
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

  // Fallback: If for some reason none of the above conditions are met (e.g.,
  // initial render before fetch starts and data is null, but not technically
  // loading or errored yet), return null to render nothing.
  return null;
}

// --- 3. App Component (Main Container) ---
// This component serves as the entry point and demonstrates how to use the
// `UserProfile` component and trigger different async states.
function App() {
  // `currentUserId` state controls which user's data is being fetched.
  const [currentUserId, setCurrentUserId] = useState(1);

  // Handler for the "Load Next User" button.
  // It cycles `currentUserId` from 1 to 10.
  const handleNextUser = () => {
    // `prevId` is the previous value of `currentUserId`.
    // `(prevId % 10) + 1` ensures it wraps around from 10 back to 1.
    setCurrentUserId(prevId => (prevId % 10) + 1);
  };

  return (
    <div className="app-container">
      <h1>Asynchronous Behavior in React UI</h1>

      {/* Button to change the `userId` prop, which will trigger a new fetch. */}
      <button onClick={handleNextUser}>Load Next User ({currentUserId})</button>

      <div className="profile-section">
        {/* Render the `UserProfile` component, passing the current user ID.
            Changes to `currentUserId` will cause `UserProfile` to re-render
            and initiate a new data fetch via its `useFetchData` hook. */}
        <UserProfile userId={currentUserId} />
      </div>

      {/* --- Basic CSS for Visual Feedback --- */}
      {/* This `style jsx` block contains basic styling for the components
          to visually demonstrate the loading, error, and success states. */}
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
          min-height: 150px; /* To prevent layout shift during loading */
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
