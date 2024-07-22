<script setup lang="ts">
import { ref } from 'vue';

const [modules, collections] = await Promise.all([
    fetch('http://localhost:8000/api/modules/get').then(res => res.json()),
    fetch('http://localhost:8000/api/collections/get').then(res => res.json())
])
const selectedCollection = ref();
console.log(modules)
</script>

<template>
  <div class="card flex justify-center">
    <div class="inline-block">
      <Listbox v-model="selectedCollection" :options="collections" filter optionlabel="" class="md:w-56" />
    </div>
  </div>
</template>