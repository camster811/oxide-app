//  * oxide.INFO.371: Invalid field:basic_blocks for module:basic_blocks

import { Chart, registerables } from "chart.js";
import { chartInstance } from "../state"; // Ensure collectionFiles is imported
Chart.register(...registerables);

const blockLenHistogram = (histogramData) => {
    const ctx = document.getElementById("chartCanvas").getContext("2d");

    // Destroy existing chart instance if it exists
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }

    const labels = Object.keys(histogramData);
    const data = Object.values(histogramData);

    chartInstance.value = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Basic Block Length Frequency",
                    data: data,
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};

export default blockLenHistogram;