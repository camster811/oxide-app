<script setup lang="ts">
import MegaMenu from 'primevue/megamenu';

const { status, data: modules } = useFetch("http://localhost:8000/api/modules/get", {
  lazy: true,
});
console.log(modules);
</script>

<template>
  <!-- you will need to handle a loading state -->
  <div v-if="status === 'pending'">
    Loading ...
  </div>
  <div v-else>
    <MegaMenu :model="modules" orientation="vertical"/>
  </div>
</template>

