/**
 * Utility function for making API calls
 * @param {string} url - The API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The response data
 */
export async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
