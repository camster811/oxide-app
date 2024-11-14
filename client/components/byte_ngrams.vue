<template>
    <div>
        <canvas id="chartCanvas"></canvas>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart, registerables } from 'chart.js';
Chart.register(MatrixController, MatrixElement);
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

                const compareNGrams = (a, b) => {
                    const aParts = a[0].split(',').map(Number);
                    const bParts = b[0].split(',').map(Number);

                    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                        const aPart = aParts[i] || 0;
                        const bPart = bParts[i] || 0;

                        if (aPart !== bPart) {
                            return aPart - bPart;
                        }
                    }
                    return 0;
                };

                const dataArray = Object.entries(data);
                dataArray.sort(compareNGrams);

                const totalItems = dataArray.length;
                const numColumns = Math.ceil(Math.sqrt(totalItems));
                const numRows = Math.ceil(totalItems / numColumns);

                const heatmapData = dataArray.map((item, index) => ({
                    x: index % numColumns, // Adjust for grid layout
                    y: Math.floor(index / numColumns), // Adjust for grid layout
                    v: item[1]
                }));

                const maxValue = Math.max(...heatmapData.slice(1).map(d => d.v));

                chartInstance.value = new Chart(ctx, {
                    type: 'matrix',
                    data: {
                        datasets: [{
                            label: 'Byte Frequency',
                            data: heatmapData,
                            backgroundColor: (context) => {
                                const value = context.dataset.data[context.dataIndex].v;
                                const logValue = Math.log(value + 1); // Apply logarithmic scale
                                const logMaxValue = Math.log(maxValue + 1);
                                const alpha = logValue / logMaxValue;
                                const r = Math.floor(255 * alpha);
                                const g = Math.floor(255 * (1 - alpha));
                                return `rgba(${r}, ${g}, 0, 1)`;
                            },
                            borderColor: 'rgba(0, 0, 0, 0.1)',
                            borderWidth: 1,
                            width: (context) => {
                                const chartArea = context.chart.chartArea || { width: 1 };
                                return (chartArea.width) / numColumns;
                            },
                            height: (context) => {
                                const chartArea = context.chart.chartArea || { height: 1 };
                                return (chartArea.height) / numRows;
                            },
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                top: 30,
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: false,
                                    text: 'Byte n-grams'
                                },
                                ticks: {
                                    display: false
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Frequency'
                                },
                                ticks: {
                                    display: false
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                mode: 'nearest',
                                position: 'average',
                                callbacks: {
                                    label: function (context) {
                                        const index = context.dataIndex;
                                        const label = dataArray[index][0];
                                        const value = context.raw.v;
                                        return `Byte n-gram: ${label}, Frequency: ${value}`;
                                    }
                                }
                            },
                            legend: {
                                display: false
                            }
                        }
                    }
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