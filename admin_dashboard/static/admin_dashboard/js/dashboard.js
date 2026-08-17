// ==========================
// Notification Bell Animation
// ==========================

const bell = document.querySelector(".notification i");

setInterval(() => {

    bell.classList.toggle("fa-shake");

}, 2500);


// ==========================
// Sidebar Active Menu
// ==========================

const menuItems = document.querySelectorAll(".sidebar ul li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

    });

});


// ==========================
// Welcome Message
// ==========================

window.onload = function(){

    console.log("Public Safety Admin Dashboard Loaded");

};