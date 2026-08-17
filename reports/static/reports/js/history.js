// Report History Page

document.addEventListener("DOMContentLoaded", function(){

    console.log("Report History Loaded");

    const searchInput = document.querySelector(".search-box input");

    const cards = document.querySelectorAll(".report-card");

    searchInput.addEventListener("keyup", function(){

        let value = this.value.toLowerCase();

        cards.forEach(function(card){

            let text = card.innerText.toLowerCase();

            if(text.includes(value)){

                card.style.display = "block";

            }

            else{

                card.style.display = "none";

            }

        });

    });

});