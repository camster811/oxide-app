import { Chart, registerables } from "chart.js";
import { chartInstance } from "../state"; // Ensure collectionFiles is imported
Chart.register(...registerables);

const byteHistogram = (histogramData) => {
    const ctx = document.getElementById("chartCanvas").getContext("2d");

    // Destroy existing chart instance if it exists
    if (chartInstance.value) {
        chartInstance.value.destroy();
    }

    const values = Object.values(histogramData).sort((a, b) => b - a);
    const maxYValue = Math.floor(values[1] * 1.1);

    chartInstance.value = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(histogramData),
            datasets: [
                {
                    label: "Byte Frequency",
                    data: Object.values(histogramData),
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
                    max: maxYValue,
                },
            },
        },
    });
};

export default byteHistogram;