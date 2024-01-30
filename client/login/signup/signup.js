document.addEventListener("DOMContentLoaded", () => {
    const signupButton = document.getElementById("login-button");
    signupButton.addEventListener("click", signUp);
  });
  
  async function signUp() {
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password
    };
  
    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });
  
      if (response.ok) {
        // Redirect to index.html or any other desired page upon successful signup
        window.location.href = "/index.html";
      } else {
        // Handle signup failure
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("An error occurred during signup", error);
    }
  }
  