<template>
    <div class="flex flex-col min-h-screen h-screen bg-zinc-900">
        <ChartPopup
            :chartModules="chartModules"
            :collections="collections"
            @selectionConfirmed="handleSelectionConfirmed"
        />
        <component :is="currentChartComponent" :file="selectedFile" :selectedModule="selectedModule" :selectedCollection="selectedCollection" v-if="currentChartComponent"></component>
        <!-- Rest of your template -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChartPopup from './components/chart_popup.vue';
import EntropyChart from './components/EntropyChart.vue'; // Import the EntropyChart component
import { entropyModule, byteHistogram, blockLenHistogram, opcodeHistogram, opcodeNgramsHeatmap, callGraphModule, flowGraph, plotBinary } from './functions';

const chartModules = ["entropy_graph", "byte_histogram", "byte_ngrams", "block_len_histogram", "opcode_histogram", "opcode_ngrams", "call_graph", "control_flow_graph", "binary_visualizer"];
const collections = ref([]);
const selectedFile = ref('');
const selectedModule = ref('');
const selectedCollection = ref('');
const currentChartComponent = ref(null);

onMounted(async () => {
    const [modules, collectionsData] = await Promise.all([
        fetch("http://localhost:8000/api/modules/").then((res) => res.json()),
        fetch("http://localhost:8000/api/collections/").then((res) => res.json()),
    ]);
    collections.value = collectionsData;
});

const handleSelectionConfirmed = ({ chartType, collection, file }) => {
    console.log(`Selected Chart Type: ${chartType}, Collection: ${collection}, File: ${file}`);
    selectedFile.value = file;
    selectedModule.value = chartType;
    selectedCollection.value = collection;

    switch (chartType) {
        case "entropy_graph":
            currentChartComponent.value = EntropyChart; // Set the component to EntropyChart
            break;
        case "byte_histogram":
            currentChartComponent.value = byteHistogram;
            break;
        case "byte_ngrams":
            currentChartComponent.value = ngramsHeatmap;
            break;
        case "block_len_histogram":
            currentChartComponent.value = blockLenHistogram;
            break;
        case "opcode_histogram":
            currentChartComponent.value = opcodeHistogram;
            break;
        case "opcode_ngrams":
            currentChartComponent.value = opcodeNgramsHeatmap;
            break;
        case "call_graph":
            currentChartComponent.value = callGraphModule;
            break;
        case "control_flow_graph":
            currentChartComponent.value = flowGraph;
            break;
        case "binary_visualizer":
            currentChartComponent.value = plotBinary;
            break;
        default:
            currentChartComponent.value = null;
            break;
    }
};
</script>

<style>
@import url("~/assets/css/base.css");

.ChartPopup {
    position: fixed;
    right: 5%;
    top: 50%;
    width: 500px;
    border: 5px solid black;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}
</style>