<template>
    <div class="chart-container">
        <canvas id="chartCanvas"></canvas>

        <div class="table-container">
            <DataTable :value="tableData" tableStyle="min-width: 50rem;">
                <Column field="block_size" header="Block Size" style="border: 2px solid aqua"></Column>
                <Column field="overall_entropy" header="Overall Entropy" style="border: 2px solid aqua"></Column>
                <Column field="max_entropy" header="Max Entropy" style="border: 2px solid aqua"></Column>
                <Column field="max_entropy_address" header="Max Entropy Address" style="border: 2px solid aqua">
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
    props: {
        file: String,
        selectedModule: String,
        selectedCollection: String,
        oid: String,
    },
    setup(props) {
        const chartInstance = ref(null);
        const tableData = ref([]);

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
                console.log("API Response:", data);

                if (!data[props.oid].addresses || !data[props.oid].entropies) {
                    console.error("Missing addresses or entropies in the API response");
                    return;
                }

                const ctx = document.getElementById("chartCanvas").getContext("2d");

                if (chartInstance.value && typeof chartInstance.value.destroy === "function") {
                    chartInstance.value.destroy();
                    chartInstance.value = null;
                }

                chartInstance.value = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: data[props.oid].addresses.map(
                            (addr) => `0x${addr.toString(16).toUpperCase()}`
                        ),
                        datasets: [
                            {
                                label: "Entropy",
                                data: data[props.oid].entropies,
                                borderColor: "rgba(75, 192, 192, 1)",
                                borderWidth: 1,
                                fill: false,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            x: {
                                type: "category",
                                title: {
                                    display: true,
                                    text: "Address (hex)",
                                    color: "rgba(75, 192, 192, 1)",
                                    font: {
                                        size: 16,
                                    },
                                },
                                ticks: {
                                    color: "rgba(75, 183, 137, 0.8)",
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "Entropy",
                                    color: "rgba(75, 192, 192, 1)",
                                    font: {
                                        size: 16,
                                    },
                                },
                                ticks: {
                                    color: "rgba(75, 183, 137, 0.8)",
                                },
                                min: 0,
                                max: 1,
                            },
                        },
                        plugins: {
                            tooltip: {
                                enabled: true,
                                mode: "nearest",
                                intersect: false,
                                callbacks: {
                                    label: function (context) {
                                        const entropy = context.raw;
                                        return `Entropy: ${entropy}`;
                                    },
                                },
                            },
                        },
                        hover: {
                            mode: "nearest",
                            intersect: false,
                            onHover: function (event, chartElement) {
                                const chart = chartElement[0];
                                if (chart) {
                                    const x = chart.element.x;
                                    const y = chart.element.y;
                                    const tooltip = chart.tooltip;
                                    tooltip.setActiveElements(
                                        [{ datasetIndex: 0, index: chart.index }],
                                        { x, y }
                                    );
                                    tooltip.update();
                                }
                            },
                        },
                    },
                });

                // Update tableData
                tableData.value = [
                    {
                        block_size: data[props.oid].block_size,
                        overall_entropy: data[props.oid].overall_entropy,
                        max_entropy: data[props.oid].max_entropy,
                        max_entropy_address: data[props.oid].max_entropy_address,
                    },
                ];
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        onMounted(() => {
            fetchDataAndPlot();
        });

        watch(
            () => [props.selectedModule, props.selectedCollection, props.file, props.oid],
            () => {
                fetchDataAndPlot();
            }
        );

        return {
            chartInstance,
            tableData,
        };
    },
};
</script>

<style scoped>
.chart-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.table-container {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>