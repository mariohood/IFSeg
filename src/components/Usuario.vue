<script setup>
defineProps({
  usuario: {
    type: Object,
  },
});
</script>

<template>
  <v-col cols="12" md="2">
    <v-card>
      <v-img :src="usuario.image" height="250" cover />

      <v-card-title class="font-weight-bold">
        {{ usuario.nome }} {{ usuario.sobrenome }}
      </v-card-title>
      <v-card-title class="pa-0 text-body-2">
        {{ usuario.curso }}
      </v-card-title>
      <v-card-title class="pa-0 text-body-2">
        {{ usuario.ambiente }}
      </v-card-title>

      <template v-slot:actions>
        <v-btn block color="info" variant="flat"> Veja usuário </v-btn>
      </template>
    </v-card>
  </v-col>
</template>
