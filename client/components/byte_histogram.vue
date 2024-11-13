<template>
    <div>
        <canvas id="chartCanvas"></canvas>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
    props: {
        file: String,
        selectedModule: String,
        selectedCollection: String,
    },
    setup(props) {
        const chartInstance = ref(null);

        const fetchDataAndPlot = async () => {
            try {
                const url = new URL("http://localhost:8000/api/retrieve");
                url.searchParams.append("selected_module", props.selectedModule);
                url.searchParams.append("selected_collection", props.selectedCollection);

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('API Response:', data);

                const ctx = document.getElementById('chartCanvas').getContext('2d');

                chartInstance.value = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: Object.keys(data),
                        datasets: [
                            {
                                label: "Byte Frequency (log scale)",
                                data: Object.values(data),
                                backgroundColor: "rgba(75, 192, 192, 0.2)",
                                borderColor: "rgba(75, 192, 192, 1)",
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            y: {
                                type: 'logarithmic',
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value, index, values) {
                                        if (value === 1 || value === 10 || value === 100 || value === 1000 || value === 10000) {
                                            return value;
                                        }
                                        return null;
                                    }
                                }
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: 12
                                    },
                                    color: 'white'
                                }
                            },
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const index = context.dataIndex;
                                        const actualValue = context.dataset.data[index];
                                        return `Byte Freqency: ${actualValue}`;
                                    }
                                }
                            },
                            legend: {
                                labels: {
                                    font: {
                                        size: 20
                                    }
                                }
                            }
                        }
                    },
                });

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        onMounted(() => {
            fetchDataAndPlot();
        });

        watch(() => [props.selectedModule, props.selectedCollection, props.file], () => {
            fetchDataAndPlot();
        });

        return {
            chartInstance,
        };
    },
};
</script>

<style scoped>
canvas {
    max-width: 100%;
}
</style>