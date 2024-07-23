<script setup>
import { ref } from "vue";

const [modules, collections] = await Promise.all([
    fetch("http://localhost:8000/api/modules/get").then((res) => res.json()),
    fetch("http://localhost:8000/api/collections/get").then((res) => res.json()),
]);
const selectedModule = ref();
const selectedCollection = ref();
</script>

<template>
    <div class="flex flex-col min-h-screen h-screen bg-zinc-900">
        <div class="flex flex-row flex-grow pt-4">
            <div class="flex flex-row space-x-4">
                <div class="card bg-primary w-1/2 flex flex-col pb-4  pl-4 flex-grow">
                    <div class="flex flex-grow min-h-0 pb-4 h-64">
                        <Listbox v-model="selectedCollection" :options="collections" filter scrollHeight="95%" />
                    </div>
                </div>
                <div class="card w-1/2 flex flex-col pb-4 flex-grow">
                    <div class="flex flex-grow min-h-0 pb-4 h-64">
                        <Listbox v-model="selectedModule" :options="modules" filter scrollHeight="95%" />
                    </div>
                </div>
            </div>
            <div class="flex flex-col flex-grow">
                <div class="flex flex-row justify-between">
                    <div class="self-start mb-4">
                        <Button :disabled="!selectedModule || !selectedCollection" class="btn">Run module</Button>
                    </div>
                    <div class="pr-4">
                        <input type="text" placeholder="Search for file..." class="input search-input p-3" />
                    </div>
                </div>
                <div id="canvas" class="flex items-center flex-grow pb-8 pr-4">
                    <div class="bg-gray-800 border border-gray-300 w-full h-full"></div>
                </div>
            </div>
        </div>
    </div>
</template>


<style>
@import url("~/assets/css/base.css");
</style>