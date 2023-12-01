document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("registerButton").onclick = register;
    document.getElementById("loginButton").onclick = login;
  
    async function register(event) {
      event.preventDefault();
      const username = document.getElementById("username");
      const password = document.getElementById("password");
  
      const formData = {
        username: username.value,
        password: password.value
      }
  
      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          const data = await response.json();
          showToast('User registered successfully', 'success');
        } else {
          throw new Error("Failed to Register User");
        }
      } catch (error) {
        console.error("Error registering user:", error);
        showToast('Failed to register user', 'error');
      }
    }
  
    async function login(event) {
      event.preventDefault();
      const username = document.getElementById("username");
      const password = document.getElementById("password");
  
      const formData = {
        username: username.value,
        password: password.value
      }
  
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          setTimeout(() => {
            window.location.href = "form.html";
          }, 2000);
        } else {
          throw new Error("Failed to Log In User");
        }
      } catch (error) {
        console.error("Error Logging in user:", error);
        showToast('Failed to log in user', 'error');
      }
    }
  
    function showToast(message, type = 'info') {
      const toastContainer = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.classList.add('toast', `toast-${type}`);
      toast.textContent = message;
  
      toastContainer.appendChild(toast);
  
      setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => {
            toast.remove();
          }, 300);
        }, 3000); 
      }, 100); 
    }
  });
  