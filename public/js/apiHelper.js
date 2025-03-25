// Helper function to make authenticated API requests
export async function apiRequest(url, options = {}) {
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You are not logged in. Please log in first.');
        window.location.href = '/login';
        return;
    }

    // Add the Authorization header with the token
    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.message || 'An error occurred.');
        }
    } catch (error) {
        console.error(error);
        alert(error.message || 'An error occurred. Please try again.');
    }
}