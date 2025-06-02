// For Vite:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    let errorMessage = `Login attempt failed with status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (parseError) {
      console.error('Could not parse API error response as JSON:', parseError);
    }
    throw new Error(errorMessage);
  }
  return await response.json(); // If response.ok, parse the success JSON
};

// Ensure your registerUser function has similar robust error handling
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    let errorMessage = `Registration failed with status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (parseError) {
      console.error('Could not parse API error response as JSON (register):', parseError);
    }
    throw new Error(errorMessage);
  }
  // For registration, backend might not return a full user object + token, adjust as needed
  // It might just return a success message or an empty 201.
  try {
    return await response.json();
  } catch (e) {
    return { message: 'Registration successful, please login.' }; // Or handle empty response
  }
};
