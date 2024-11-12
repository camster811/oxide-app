<template>
    <div class="flex flex-col min-h-screen h-screen bg-zinc-900">
        <ChartPopup
            :chartModules="chartModules"
            :collections="collections"
            @selectionConfirmed="handleSelectionConfirmed"
        />
        <!-- Rest of your template -->
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import chartpopup from './components/chart_popup.vue';

const chartModules = ["entropy_graph", "byte_histogram", "byte_ngrams", "block_len_histogram", "opcode_histogram", "opcode_ngrams", "call_graph", "control_flow_graph", "binary_visualizer"];
const collections = ref([]);

onMounted(async () => {
    const [modules, collectionsData] = await Promise.all([
        fetch("http://localhost:8000/api/modules/").then((res) => res.json()),
        fetch("http://localhost:8000/api/collections/").then((res) => res.json()),
    ]);
    collections.value = collectionsData;
});

const handleSelectionConfirmed = ({ chartType, collection, file }) => {
    console.log(`Selected Chart Type: ${chartType}, Collection: ${collection}, File: ${file}`);
    // Handle the selection
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