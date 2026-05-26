// Create this in a utils/logger.js file
export const logError = (error: any) => {
  if (!error) {
    console.log("Null or undefined error received");
    return;
  }

  console.log("=== ERROR LOG START ===");

  // Log basic error info
  console.log("Error type:", error.constructor.name);
  console.log("Error message:", error.message);

  // Convert error to a simple object for better logging
  const errorObj = {} as any;
  Object.getOwnPropertyNames(error).forEach((key) => {
    try {
      const value = error[key];
      if (typeof value === "object" && value !== null) {
        errorObj[key] = JSON.stringify(value);
      } else {
        errorObj[key] = value;
      }
    } catch (e) {
      errorObj[key] = "Error serializing property";
    }
  });

  console.log("Error details:", errorObj);

  // If it's an Axios error, extract useful parts
  if (error.isAxiosError) {
    console.log("--- Axios Error Details ---");
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", JSON.stringify(error.response.data));
    }
    if (error.config) {
      console.log("Request URL:", error.config.url);
      console.log("Request Method:", error.config.method);
    }
  }

  console.log("=== ERROR LOG END ===");
};
