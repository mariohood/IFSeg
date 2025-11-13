<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

console.log(route.params.id);
</script>

<template>
  <div>
    <h1>Usuario....</h1>
  </div>
</template>
