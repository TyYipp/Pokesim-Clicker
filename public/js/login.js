document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
  
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
  
        try {
          const res = await fetch("/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
  
          const data = await res.json();
  
          if (!res.ok) {
            alert(data.message || "Login failed");
            return;
          }
  
          // Save token in localStorage
          localStorage.setItem("token", data.token);
  
          // Redirect to admin dashboard or protected page
          window.location.href = "/admin";
        } catch (err) {
          console.error("Login error:", err);
          alert("Something went wrong during login");
        }
      });
    }
  });
  