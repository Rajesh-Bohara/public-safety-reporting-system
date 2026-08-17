document.addEventListener("DOMContentLoaded", function () {

    const themeOptions = document.querySelectorAll(
        'input[name="theme"]'
    );

    const savedTheme = localStorage.getItem("adminTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-theme");

    } else {

        document.body.classList.add("light-theme");

    }


    themeOptions.forEach(function (option) {

        if (
            savedTheme === "dark" &&
            option.value === "dark"
        ) {
            option.checked = true;
        }

        if (
            savedTheme !== "dark" &&
            option.value === "light"
        ) {
            option.checked = true;
        }


        option.addEventListener("change", function () {

            document.body.classList.remove(
                "light-theme",
                "dark-theme"
            );


            if (this.value === "dark") {

                document.body.classList.add(
                    "dark-theme"
                );

                localStorage.setItem(
                    "adminTheme",
                    "dark"
                );

            } else {

                document.body.classList.add(
                    "light-theme"
                );

                localStorage.setItem(
                    "adminTheme",
                    "light"
                );

            }

        });

    });

});