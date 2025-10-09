<script setup>
import useUsuarios from "../composables/useUsuarios";
import Usuario from "../components/Usuario.vue";

const { usuariosCollection } = useUsuarios();
</script>

<template>
  <h1 class="text-center text-h3 font-weight-bold my-5">Nossos usuários</h1>

  <v-card flat class="py-10">
    <v-row>
      <usuario
        v-for="Usuario in usuariosCollection"
        :key="usuariosCollection.id"
        :usuario="usuario"
      />
    </v-row>
  </v-card>
</template>
