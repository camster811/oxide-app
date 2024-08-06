<script>
import { Chart, registerables } from "chart.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
Chart.register(...registerables);
const plotEntropy = async (entropies, addresses) => {
    const ctx = document.getElementById("entropyChart").getContext("2d");

    // Destroy existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: addresses.map((addr) => `0x${addr.toString(16).toUpperCase()}`),
            datasets: [
                {
                    label: "Entropy",
                    data: entropies,
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
                crosshair: {
                    line: {
                        color: "white",
                        width: 10,
                    },
                    sync: {
                        enabled: false,
                    },
                    zoom: {
                        enabled: false,
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

    const entropyModule = (data, file) => {
        if (selectedModule.value == "entropy") {
            // Step 1: Print all keys in collectionFiles.value
            const keys = Object.keys(collectionFiles.value);
            let oid = null;
            console.log("All keys in collectionFiles.value:", keys);

            // Step 2: Check if the key exists
            let key = file;
            if (keys.includes(key)) {
                oid = collectionFiles.value[key];
                console.log(`OID for key ${key}:`, oid);
            } else {
                console.error(`Key ${key} not found in collectionFiles.value`);
            }

            // Remove the $ character
            oid = oid.toString();
            if (oid.startsWith("$")) {
                oid = oid.substring(1);
            }
            console.log(`Sliced OID: ${oid}`);

            // Check if oid exists in data
            if (data.hasOwnProperty(oid)) {
                console.log(data[oid]);

                if (
                    typeof data[oid] === "object" &&
                    data[oid] !== null &&
                    data[oid].constructor.name === "Proxy"
                ) {
                    data[oid] = Reflect.get(data[oid], "target");
                }
                let {
                    entropies,
                    addresses,
                    block_size,
                    overall_entropy,
                    max_entropy,
                    max_entropy_address,
                } = data[oid];
                plotEntropy(entropies, addresses);
                tableData.value = [
                    {
                        block_size: block_size,
                        overall_entropy: overall_entropy,
                        max_entropy: max_entropy,
                        max_entropy_address: max_entropy_address,
                    },
                ];
            } else {
                console.error(`OID ${oid} not found in data`);
            }
            return;
        }
    };
};

</script>

<template>
    <ScrollPanel style="max-width: 1305px; height: 100%; overflow: scroll">
        <pre v-if="responseData && !chartInstance" style="width: 100%; height: 100%">{{ responseData }}</pre>
        <canvas id="entropyChart" class="pb-10"></canvas>

        <DataTable v-if="chartInstance" :value="tableData" tableStyle="min-width: 50rem">
            <Column field="block_size" header="Block Size"></Column>
            <Column field="overall_entropy" header="Overall Entropy"></Column>
            <Column field="max_entropy" header="Max Entropy"></Column>
            <Column field="max_entropy_address" header="Max Entropy Address"></Column>
        </DataTable>

    </ScrollPanel>

</template>