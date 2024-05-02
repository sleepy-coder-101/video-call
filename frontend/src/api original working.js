export const fetchToken = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Failed to get an AuthToken from backend", error);
    throw error;
  }
};

export const createMeeting = async (authToken) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/meetings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authToken }),
      }
    );

    const data = await response.json();
    return data.meetingId;
  } catch (error) {
    console.error("Error in creating a meeting", error);
    throw error;
  }
};

export const signupUser = async (username, password, institute, role) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          institute,
          role,
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    return { status: response.status, message: data.message };
  } catch (error) {
    console.error("Error in signing up the user", error);
    throw error;
  }
};
