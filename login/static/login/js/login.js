// Show / Hide Password

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");

    } else {

        password.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");

    }

});


// Login Form Validation

document.getElementById("loginForm").addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();

    // Check if fields are empty
    if (email === "" || pass === "") {

        alert("Please fill in all fields.");
        return;

    }

    // Basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");
        return;

    }

    // Password length validation
    if (pass.length < 8) {

        alert("Password must be at least 8 characters long.");
        return;

    }

    // Login Successful
    alert("Login Successful!");

    // Redirect to Dashboard
    window.location.href = "dashboard/css/dashboard.html";

});
