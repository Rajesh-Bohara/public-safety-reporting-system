document.addEventListener("DOMContentLoaded", function () {

    console.log("Analytics JS loaded");


    // ==========================================
    // GET DATA FROM DJANGO
    // ==========================================

    const incidentLabels = JSON.parse(
        document.getElementById("incident-labels").textContent
    );

    const incidentValues = JSON.parse(
        document.getElementById("incident-values").textContent
    );


    const priorityLabels = JSON.parse(
        document.getElementById("priority-labels").textContent
    );

    const priorityValues = JSON.parse(
        document.getElementById("priority-values").textContent
    );


    const sosLabels = JSON.parse(
        document.getElementById("sos-labels").textContent
    );

    const sosValues = JSON.parse(
        document.getElementById("sos-values").textContent
    );


    console.log("Incident labels:", incidentLabels);
    console.log("Incident values:", incidentValues);

    console.log("Priority labels:", priorityLabels);
    console.log("Priority values:", priorityValues);

    console.log("SOS labels:", sosLabels);
    console.log("SOS values:", sosValues);


    // ==========================================
    // INCIDENT PIE CHART
    // ==========================================

    const incidentCanvas =
        document.getElementById("incidentChart");

    if (incidentCanvas) {

        new Chart(incidentCanvas, {

            type: "pie",

            data: {

                labels: incidentLabels,

                datasets: [{

                    data: incidentValues,

                    borderWidth: 2

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: true,

                        position: "bottom"

                    }

                }

            }

        });

    }


    // ==========================================
    // PRIORITY DOUGHNUT CHART
    // ==========================================

    const priorityCanvas =
        document.getElementById("priorityChart");

    if (priorityCanvas) {

        new Chart(priorityCanvas, {

            type: "doughnut",

            data: {

                labels: priorityLabels,

                datasets: [{

                    data: priorityValues,

                    borderWidth: 2

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: true,

                        position: "bottom"

                    }

                }

            }

        });

    }


    // ==========================================
    // SOS BAR CHART
    // ==========================================

    const sosCanvas =
        document.getElementById("sosChart");

    if (sosCanvas) {

        new Chart(sosCanvas, {

            type: "bar",

            data: {

                labels: sosLabels,

                datasets: [{

                    label: "SOS Alerts",

                    data: sosValues,

                    borderWidth: 1

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            precision: 0

                        }

                    }

                }

            }

        });

    }

});