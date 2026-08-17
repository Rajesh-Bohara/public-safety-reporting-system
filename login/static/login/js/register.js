// ==============================
// Show / Hide Password
// ==============================

const togglePasswords = document.querySelectorAll(".togglePassword");

togglePasswords.forEach(function(icon){

    icon.addEventListener("click", function(){

        const input = this.previousElementSibling;

        if(input.type === "password"){

            input.type = "text";

            this.classList.replace("fa-eye", "fa-eye-slash");

        }else{

            input.type = "password";

            this.classList.replace("fa-eye-slash", "fa-eye");

        }

    });

});


// ==============================
// Form Validation
// ==============================

document.getElementById("registerForm").addEventListener("submit", function(e){

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    if(fullname === "" ||
       email === "" ||
       phone === "" ||
       address === "" ||
       password === "" ||
       confirmPassword === "")
    {
        e.preventDefault();
        alert("Please fill in all fields.");
        return;
    }

    if(phone.length < 10){

        e.preventDefault();
        alert("Please enter a valid phone number.");
        return;

    }

    if(password.length < 8){

        e.preventDefault();
        alert("Password must be at least 8 characters.");
        return;

    }

    if(password !== confirmPassword){

        e.preventDefault();
        alert("Passwords do not match.");
        return;

    }

    if(!terms){

        e.preventDefault();
        alert("Please accept the Terms & Conditions.");
        return;

    }

    // No preventDefault here.
    // Django will receive the form and handle registration.

});