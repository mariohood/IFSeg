<script setup>
import { computed, ref } from "vue";
import useUsuarios from "../composables/useUsuarios";
import Usuario from "../components/Usuario.vue";

const { usuariosCollection } = useUsuarios();

// sala selecionada no v-select
const salaSelecionada = ref(null);

// lista de salas (pode vir fixa ou dinâmica)
const salas = computed(() => {
  return [...new Set(usuariosCollection.value.map((u) => u.ambiente))];
});

// usuários filtrados por sala
const usuariosFiltrados = computed(() => {
  if (!salaSelecionada.value) return usuariosCollection.value;
  return usuariosCollection.value.filter(
    (u) => u.ambiente === salaSelecionada.value
  );
});
</script>

<template>
  <h1 class="text-center text-h3 font-weight-bold my-5">Nossos usúarios</h1>

  <!-- SELECT DE SALA -->
  <v-row justify="center" class="mb-6">
    <v-col cols="12" md="4">
      <v-select
        v-model="salaSelecionada"
        :items="salas"
        label="Filtrar por sala"
        clearable
        variant="outlined"
      />
    </v-col>
  </v-row>

  <v-card flat class="py-10">
    <v-row>
      <Usuario
        v-for="usuario in usuariosFiltrados"
        :key="usuario.id"
        :usuario="usuario"
      />
    </v-row>
    <div v-if="!usuariosFiltrados.length" class="text-center text-grey mt-5">
      Nenhum usuário nesta sala.
    </div>
  </v-card>
</template>
