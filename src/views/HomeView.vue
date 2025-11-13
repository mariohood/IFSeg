<script setup>
import useUsuarios from "../composables/useUsuarios";
import Usuario from "../components/Usuario.vue";

const { usuariosCollection } = useUsuarios();
</script>

<template>
  <h1 class="text-center text-h3 font-weight-bold my-5">Nossos usúarios</h1>

  <v-card flat class="py-10">
    <v-row>
      <Usuario
        v-for="usuario in usuariosCollection"
        :key="usuario.id"
        :usuario="usuario"
      />
    </v-row>
  </v-card>
</template>
