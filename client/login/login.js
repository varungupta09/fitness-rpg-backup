document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-button");
    loginForm.addEventListener("click", handleLogin);
  });
  
  async function handleLogin(event) {
    event.preventDefault(); // Prevent form submission
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      const response = await fetch("/login", {
        method: "POST",
        body: new URLSearchParams(formData),
      });
  
      if (response.ok) {
        // Authentication successful, redirect to dashboard.html
        window.location.href = "/index.html";
      } else {
        // Authentication failed, display error message
        const errorText = await response.text();
        console.error("Login failed:", errorText);
        // Display the error message to the user
      }
    } catch (error) {
      console.error("An error occurred during login:", error);
      // Display an error message to the user
    }
  }