<script setup>
import { ref } from "vue";

const [modules, collections] = await Promise.all([
    fetch("http://localhost:8000/api/modules/get").then((res) => res.json()),
    fetch("http://localhost:8000/api/collections/get").then((res) => res.json()),
]);
const selectedModule = ref();
const selectedCollection = ref();
const responseData = ref(null);
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
        responseData.value = data;
        // Handle the data here
        console.log(data);
    } catch (error) {
        // Handle the error here
        console.error(error);
    }
}
</script>



<template>
    <div class="flex flex-col min-h-screen h-screen bg-zinc-900">
        <div class="flex flex-row flex-grow pt-4">
            <div class="flex flex-row space-x-4" style="flex-grow: 0; flex-shrink: 0;">
                <div class="card bg-primary w-1/2 flex flex-col pb-4  pl-4">
                    <div class="flex flex-grow min-h-0 pb-4 h-64">
                        <Listbox v-model="selectedCollection" :options="collections" filter scrollHeight="95%" />
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
                    <div class="self-start mb-4">
                        <Button :disabled="!selectedModule || !selectedCollection" @click="runModule" class="btn">Run
                            module</Button>
                    </div>
                    <div class="pr-4">
                        <input type="text" placeholder="Search for file..." class="input search-input p-3" />
                    </div>
                </div>
                <div id="canvas" class="flex items-center pl-4 pb-8 pr-4"
                    style="height: 95vh; max-width: 100%; position: relative;">
                    <div class="bg-gray-800 border border-gray-300 w-full h-full">
                        <ScrollPanel style="width: 100%; height: 100%">
                            <p>
                                {{ responseData }}
                            </p>
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