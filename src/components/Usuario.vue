<script setup>
import { computed } from "vue";
import { useCurrentUser } from "vuefire";
import { useRouter } from "vue-router";

const props = defineProps({
  usuario: Object,
});

const router = useRouter();
const user = useCurrentUser();

// verifica se está logado
const isLogged = computed(() => !!user.value);

function abrirUsuario() {
  if (!isLogged.value) {
    router.push({ name: "login" });
    return;
  }

  router.push({
    name: "usuario",
    params: { id: props.usuario.id },
  });
}
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

      <!-- Botão com segurança -->
      <template v-slot:actions>
        <v-btn block color="info" variant="flat" @click="abrirUsuario">
          Veja usuário
        </v-btn>
      </template>
    </v-card>
  </v-col>
</template>
