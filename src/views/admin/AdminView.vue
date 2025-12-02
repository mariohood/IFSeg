<script setup>
import useUsuarios from "@/composables/useUsuarios";

const { usuariosCollection, deleteUsuario } = useUsuarios();
</script>

<template>
  <h2 class="text-center text-h3 my-5 font-weight-bold">Admin Panel</h2>
  <v-btn color="blue" variant="flat" :to="{ name: 'novo-usuario' }">
    Novo Usuário
  </v-btn>

  <v-card class="mx-auto mt-10" flat>
    <v-list>
      <v-list-item v-for="usuario in usuariosCollection" :key="usuario.id">
        <template v-slot:prepend>
          <v-list-item-media start="true">
            <img width="130" :src="usuario.image" />
          </v-list-item-media>
        </template>
        <v-list-item-title
          >{{ usuario.nome }} {{ usuario.sobrenome }}</v-list-item-title
        >
        <v-list-item-subtitle>{{ usuario.curso }}</v-list-item-subtitle>
        <template v-slot:append>
          <v-btn
            color="info"
            flat
            class="mr-2"
            :to="{ name: 'editar-usuario', params: { id: usuario.id } }"
          >
            Editar
          </v-btn>

          <v-btn color="red-darken-3" flat @click="deleteUsuario(usuario.id)">
            Excluir
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>
