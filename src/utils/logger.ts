export const logError = (error: any) => {
  if (!error) {
    console.log("Null or undefined error received");
    return;
  }

  console.log("=== ERROR LOG START ===");

  console.log("Error type:", error.constructor.name);
  console.log("Error message:", error.message);

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
