<script setup>
import useUsuarios from "@/composables/useUsuarios";

const { usuariosCollection } = useUsuarios();
</script>

<template>
  <h2 class="text-center text-h3 my-5 font-weight-bold">Admin Panel</h2>
  <v-btn color="blue" variant="flat" :to="{ name: 'novo-usuario' }">
    Novo Usuário
  </v-btn>

  <v-card>
    <v-list>
      <v-list-item v-for="usuario in usuariosCollection" :key="usuario.id">
        <v-list-item-title
          >{{ usuario.nome }} {{ usuario.sobrenome }}</v-list-item-title
        >
        <v-list-item-subtitle>{{ usuario.curso }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-card>
</template>
