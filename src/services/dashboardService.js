const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      // Adjust URL if needed
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // If protected
      }
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Tell TypeScript what structure to expect
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Could not fetch dashboard stats:', error);
    throw error;
  }
};
