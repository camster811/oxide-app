<script setup>
import { ref, watch, nextTick } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

// Fetch modules and collections
const [modules, collections] = await Promise.all([
    fetch("http://localhost:8000/api/modules/get").then((res) => res.json()),
    fetch("http://localhost:8000/api/collections/get").then((res) => res.json()),
]);

const selectedModule = ref();
const selectedCollection = ref();
const responseData = ref(null);
const collectionFiles = ref([]);
let chartInstance = null;

const plotEntropy = async (entropies, addresses) => {
    await nextTick();
    responseData.value = null;
    const ctx = document.getElementById('entropyChart').getContext('2d');
    
    // Destroy existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: addresses.map(addr => `0x${addr.toString(16).toUpperCase()}`),
            datasets: [{
                label: 'Entropy',
                data: entropies,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Address (hex)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Entropy'
                    },
                    min: 0,
                    max: 1
                }
            },
            plugins: {
                    tooltip: {
                        enabled: true,
                        mode: 'nearest',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                const entropy = context.raw;
                                return `Entropy: ${entropy}`;
                            }
                        }
                    },
                    crosshair: {
                        line: {
                            color: 'white',
                            width: 10
                        },
                        sync: {
                            enabled: false
                        },
                        zoom: {
                            enabled: false
                        }
                    }
                },
                hover: {
                    mode: 'nearest',
                    intersect: false,
                    onHover: function(event, chartElement) {
                        const chart = chartElement[0];
                        if (chart) {
                            const x = chart.element.x;
                            const y = chart.element.y;
                            const tooltip = chart.tooltip;
                            tooltip.setActiveElements([{ datasetIndex: 0, index: chart.index }], { x, y });
                            tooltip.update();
                        }
                    }
                }
            }
        });
};

// Watch for changes in collection
watch(selectedCollection, async (newVal) => {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    if (newVal) {
        try {
            const url = new URL('http://localhost:8000/api/collections/files');
            url.searchParams.append('selected_collection', newVal);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            collectionFiles.value = data;

            console.log(collectionFiles.value); // debug
        } catch (error) {
            console.error(error);
            collectionFiles.value = [];
        }
    } else {
        collectionFiles.value = [];
    }
});

// Function to run the module
const runModule = async () => {
    if (!selectedModule.value || !selectedCollection.value) {
        return;
    }

    try {
        const url = new URL('http://localhost:8000/api/retrieve');
        url.searchParams.append('selected_module', selectedModule.value);
        url.searchParams.append('selected_collection', selectedCollection.value);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (selectedModule.value == 'entropy') {
            const keys = Object.keys(data);
            const { entropies, addresses } = data[keys[0]];
            console.log(entropies, addresses);
            plotEntropy(entropies, addresses);
            return;
        }

        responseData.value = data;
        // Handle the data here
        console.log(data);
        

    } catch (error) {
        // Handle the error here
        console.error(error);
    }
};

const handleFileSelection = (file) => {
    let oid = collectionFiles.value[`${file.value}`]
    //console.log(data[keys[oid]]);
};

const downloadChart = () => {
    const canvas = document.getElementById('entropyChart');
    const ctx = canvas.getContext('2d');

    // Save the current state
    ctx.save();

    // Set the background color
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = '#091d33';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the chart again to ensure it is on top of the background
    chartInstance.update();

    // Download the image
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'EntropyChart.png';
    link.click();

    // Restore the state
    ctx.restore();
};

</script>



<template>
    <div class="flex flex-col min-h-screen h-screen bg-zinc-900">
        <div class="flex flex-row flex-grow pt-4">
            <div class="flex flex-row space-x-4" style="flex-grow: 0; flex-shrink: 0;">
                <div class="card bg-primary w-1/2 flex flex-col pb-4  pl-4">
                    <div class="flex flex-grow min-h-0 pb-4 h-64">
                        <Listbox v-model="selectedCollection" :options="collections" filter scrollHeight="95%" />

                    </div>
                    <div class="flex flex-grow min-h-0 pb-4 h-64">
                        <Listbox v-model="selectedFile" :options="collectionFiles" filter
                            scrollHeight="95%" @click="handleFileSelection" />
                    </div>
                </div>
                <div class="card w-1/2 flex flex-col pb-4">
                    <div class="flex flex-grow min-h-0 pb-4 h-64">
                        <Listbox v-model="selectedModule" :options="modules" filter scrollHeight="95%" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col flex-grow">
                <div class="flex flex-row justify-between">
                    <div class="self-start mb-4 pl-4">
                        <Button :disabled="!selectedModule || !selectedCollection" @click="runModule" class="btn">Run
                            module</Button>
                    </div>
                    <div class="pr-4">
                        <Button @click="downloadChart" v-if="selectedModule == 'entropy'">Download chart</Button>
                    </div>
                </div>
                <div class="flex items-center pl-4 pb-8 pr-4"
                    style="height: 95vh; max-width: 100%; position: relative;">
                    <div class="bg-gray-800 border border-gray-300 w-full h-full">
                        <ScrollPanel style="max-width: 1305px; height: 100%; overflow: scroll;">
                            <pre v-if="responseData" style="width: 100%; height:100%">{{ responseData }}</pre>
                            <canvas id="entropyChart"></canvas>
                        </ScrollPanel>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
@import url("~/assets/css/base.css");
</style>