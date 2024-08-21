<script setup>
import { ref, watch } from "vue";
import { Chart, registerables } from "chart.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { ngramsHeatmap, entropyModule, byteHistogram, blockLenHistogram, opcodeHistogram, opcodeNgramsHeatmap, callGraphModule } from "./functions";
import { selectedModule, selectedCollection, chartInstance, responseData, tableData, collectionFiles, showTable } from "./state";
Chart.register(MatrixController, MatrixElement);
Chart.register(...registerables);
const chartModules = ["entropy", "byte_histogram", "byte_ngrams", "block_len_histogram", "opcode_histogram", "opcode_ngrams", "call_graph"];
const viewMode = ref("chart");

// Fetch modules and collections
const [modules, collections] = await Promise.all([
    fetch("http://localhost:8000/api/modules/").then((res) => res.json()),
    fetch("http://localhost:8000/api/collections/get").then((res) => res.json()),
]);

// Watch for changes in collection
watch(selectedCollection, async (newVal) => {
    if (newVal) {
        try {
            const url = new URL("http://localhost:8000/api/collections/files");
            url.searchParams.append("selected_collection", newVal);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            collectionFiles.value = data;

            //console.log(collectionFiles.value); // debug
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
    showTable.value = false
    if (!selectedModule.value || !selectedCollection.value) {
        return;
    }

    //needs fix when one histo ran after the other
    if (chartInstance.value && typeof chartInstance.value.destroy === "function") {
        chartInstance.value.destroy();
        chartInstance.value = null;
    }

    try {
        const url = new URL("http://localhost:8000/api/retrieve");
        url.searchParams.append("selected_module", selectedModule.value);
        url.searchParams.append("selected_collection", selectedCollection.value);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        responseData.value = data;
        console.log(responseData.value);

        let firstFile = Object.keys(collectionFiles.value)[0];

        switch (selectedModule.value) {
            case "entropy":
                entropyModule(responseData.value, firstFile);
                break;
            case "byte_histogram":
                byteHistogram(responseData.value);
                break;
            case "byte_ngrams":
                ngramsHeatmap(responseData.value);
                break;
            case "block_len_histogram":
                blockLenHistogram(responseData.value);
                break;
            case "opcode_histogram":
                opcodeHistogram(responseData.value);
                break;
            case "opcode_ngrams":
                opcodeNgramsHeatmap(responseData.value);
                break;
            case "call_graph":
                chartInstance.value = await callGraphModule(responseData.value, firstFile);
                break;
            default:
                viewMode.value = "json";
                break;
        }

    } catch (error) {
        // Handle the error here
        console.error(error);
    }
};

const handleFileSelection = (file) => {
    console.log(`Selected file: ${file}`);
    if (selectedModule.value == "entropy") {
        entropyModule(responseData.value, file);
    }
    if (selectedModule.value == "call_graph") {
        callGraphModule(responseData.value, file);
    }
};

const downloadChart = () => {
    const canvas = document.getElementById("chartCanvas");
    const ctx = canvas.getContext("2d");

    // Save the current state
    ctx.save();

    // Set the background color
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#091d33";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the chart again to ensure it is on top of the background
    chartInstance.update();

    // Download the image
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "chart.png";
    link.click();

    // Restore the state
    ctx.restore();
};

const isChartModuleSelected = computed(() => {
    return chartModules.includes(selectedModule.value);
});

// Computed property for button text
const buttonText = computed(() => {
    return viewMode.value === "chart" ? "Switch to JSON View" : "Switch to Chart View";
});

// Function to toggle view mode
const toggleViewMode = () => {
    viewMode.value = viewMode.value === "chart" ? "json" : "chart";
};

watch(viewMode, (newVal) => {
    runModule();
});
</script>



<template>
    <div class="flex flex-col min-h-screen h-screen bg-zinc-900">
        <div class="flex flex-row flex-grow pt-4">
            <div class="flex flex-row space-x-4" style="flex-grow: 0; flex-shrink: 0">
                <div class="card bg-primary w-1/2 flex flex-col pb-4 pl-4">
                    <div class="flex flex-grow min-h-0 pb-4 h-64">
                        <Listbox v-model="selectedCollection" :options="collections" filter scrollHeight="95%" />
                    </div>
                    <div class="flex flex-grow min-h-0 pb-4 h-64">
                        <Listbox v-model="selectedFile" :options="Object.keys(collectionFiles)" filter
                            scrollHeight="95%" @click="handleFileSelection(selectedFile)" />
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
                    <div class="self-start mb-4">
                        <Button @click="toggleViewMode" :disabled="!isChartModuleSelected">
                            {{ buttonText }}
                        </Button>
                    </div>
                    <div class="pr-4">
                        <Button @click="downloadChart" :disabled="!isChartModuleSelected">Download chart</Button>
                    </div>
                </div>
                <div class="flex items-center pl-4 pb-8 pr-4" style="height: 95vh; max-width: 100%; position: relative">
                    <div class="bg-gray-800 border border-gray-300 w-full h-full">
                        <ScrollPanel style="width: auto; height: 100%; overflow: auto;">
                            <pre v-if="viewMode == 'json'">{{ JSON.stringify(responseData, null, 2)}}</pre>
                            <canvas v-if="viewMode == 'chart' && selectedModule != 'call_graph'" id="chartCanvas" style="width: 100%; height: 100%;"></canvas>
                            <div id="network" v-if="selectedModule == 'call_graph' && viewMode === 'chart'" style="width: 100%; height: 100%;"></div>

                            <DataTable v-if="showTable && viewMode == 'chart'" :value="tableData" tableStyle="min-width: 50rem">
                                <Column field="block_size" header="Block Size"></Column>
                                <Column field="overall_entropy" header="Overall Entropy"></Column>
                                <Column field="max_entropy" header="Max Entropy"></Column>
                                <Column field="max_entropy_address" header="Max Entropy Address"></Column>
                            </DataTable>
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
