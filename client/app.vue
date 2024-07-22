<script setup lang="ts">
import MegaMenu from 'primevue/megamenu';

const [modules, collections] = await Promise.all([
    $fetch('http://localhost:8000/api/modules/get'),
    $fetch('http://localhost:8000/api/collections/get')
  ])
console.log(modules)
</script>

<template>
  <MegaMenu :model="collections" orientation="vertical">
    <template #collection="{ collection }"></template>
  </MegaMenu>
</template>

