<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useCurrentUser } from "vuefire";
import useUsuarios from "../composables/useUsuarios";
import Usuario from "../components/Usuario.vue";

const router = useRouter();
const { usuariosCollection } = useUsuarios();

// Verificar o login
const user = useCurrentUser();
const isLogged = computed(() => !!user.value);

// Sala selecionada no v-select
const salaFiltro = ref(null);
const salaSelecionada = ref(null);

// Funcao para bloquear acesso vai para o login
function checarLogin() {
  if (!isLogged.value) {
    router.push({ name: "login" });
  }
}

function irParaSala(sala) {
  if (!sala) return;

  router.push({
    name: "admin-sala",
    params: { sala },
  });
}

// lista de salas
const salas = computed(() => {
  return [...new Set(usuariosCollection.value.map((u) => u.ambiente))];
});

// usuários filtrados por sala
const usuariosFiltrados = computed(() => {
  if (!salaFiltro.value) return usuariosCollection.value;
  return usuariosCollection.value.filter(
    (u) => u.ambiente === salaFiltro.value
  );
});
</script>

<template>
  <h1 class="text-center text-h3 font-weight-bold my-5">Nossos usúarios</h1>

  <v-row align="center" class="mb-2" justify="space-between">
    <!-- SELECT FILTRO  esquerda-->
    <v-col cols="12" md="3">
      <v-select
        v-model="salaFiltro"
        :items="salas"
        label="Filtrar usuários"
        clearable
        variant="outlined"
        density="comfortable"
        :disabled="!isLogged"
        @mousedown.prevent="!isLogged && checarLogin()"
      />
    </v-col>

    <!-- SELECT SALA (aciona histórico automaticamente) -->
    <v-col cols="12" md="3">
      <v-select
        v-model="salaSelecionada"
        :items="salas"
        label="Selecionar sala"
        clearable
        variant="outlined"
        density="comfortable"
        :disabled="!isLogged"
        @mousedown.prevent="!isLogged && checarLogin()"
        @update:model-value="irParaSala"
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
