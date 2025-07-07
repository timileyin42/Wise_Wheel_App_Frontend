export async function testBackendConnection() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cars?limit=1`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      status: response.status,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Usage in browser console:
// await window.testConnection()
