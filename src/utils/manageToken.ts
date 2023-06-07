import { getAuth } from "firebase/auth";
import { app } from "../firebase";

async function refreshIdToken() {
  const user = getAuth(app).currentUser;
  if (user) {
    try {
      await user.getIdToken(true); // Force refresh the ID token
    } catch (error:any) {
      // Handle the error case
      console.error('Error refreshing ID token:', error.message);
      // Redirect the user to the login page or show an error message
      return null;
    }
  } else {
    // Redirect the user to the login page or show an error message
    return null;
  }

  // Get the updated ID token
  const idToken = await user.getIdToken();
  return idToken;
}


// Function to check if the user is authenticated
function isAuthenticated() {
  const user = getAuth(app).currentUser;
  return !!user;
}

// Example usage: Get the latest auth token
export async function getLatestAuthToken() {
  const authStatus = await isAuthenticated();
  if (authStatus) {
    const idToken = await refreshIdToken();
    if (idToken) {
      // localStorage.setItem('token', idToken);
      return idToken;
    }
  }
}

// Listen for changes in the user's authentication state
getAuth(app).onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    // Perform actions to persist the login state, e.g., store user data in local storage, set a flag, etc.
    // You can also redirect the user to a logged-in page if needed

    // Call the function to get the latest auth token
    getLatestAuthToken();
  } else {
    // User is signed out
    // Perform actions to clear the persisted login state, e.g., remove user data from local storage, reset the flag, etc.
  }
});