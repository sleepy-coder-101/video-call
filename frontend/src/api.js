export const fetchToken = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/meeting/fetch-token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
      `${import.meta.env.VITE_BACKEND_URL}/api/meeting/create-room`,
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

export const signupUser = async (
  username,
  email,
  password,
  institute,
  role
) => {
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
          email,
          password,
          institute,
          role,
        }),
      }
    );

    const data = await response.json();
    return {
      status: response.status,
      message: data.message,
      token: data.token,
    };
  } catch (error) {
    console.error("Error in signing up the user", error);
    throw error;
  }
};

export const signinUser = async (email, password) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    return {
      status: response.status,
      message: data.message,
      token: data.token,
    };
  } catch (error) {
    console.error("Error in signing in the user", error);
    throw error;
  }
};
