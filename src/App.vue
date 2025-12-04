<script setup>
import { RouterView, RouterLink } from "vue-router";
import { useAuthStore } from "./stores/auth";
import { useMqttStore } from "@/stores/mqttStore";
import { computed } from "vue";
import logo from "@/assets/IFSeg_logo.png";

const auth = useAuthStore();
const mqttStore = useMqttStore();

// Computed para definir cor e texto do botão dinamicamente
const mqttButtonColor = computed(() => {
  if (mqttStore.connecting) return "warning";
  return mqttStore.isConnected ? "success" : "error";
});

const mqttButtonText = computed(() => {
  if (mqttStore.connecting) return "Conectando...";
  return mqttStore.isConnected ? "Conectado" : "Conectar";
});

// Cor do texto (para garantir contraste)
const mqttButtonTextColor = computed(() => {
  if (mqttStore.connecting) return "#FFFFFF";
  if (mqttStore.isConnected) return "#FFFFFF";
  return "#FFFFFF";
});

// Função ao clicar no botão
const handleMqttClick = () => {
  if (!mqttStore.isConnected && !mqttStore.connecting) {
    // Se ainda não estiver conectado → conecta
    mqttStore.connect("wss://test.mosquitto.org:8081");
  } else if (mqttStore.isConnected) {
    // Se já estiver conectado → desconecta
    mqttStore.disconnect();
  }
};
</script>

<template>
  <v-card elevation="3" max-width="1200" class="mx-auto">
    <v-layout>
      <v-app-bar color="green-darken-2" height="120" density="comfortable">
        <!-- ESQUERDA (LOGO – sem fundo/hover) -->
        <template #prepend>
          <v-container class="d-flex align-center pa-2" style="width: 350px">
            <RouterLink :to="{ name: 'home' }">
              <v-img :src="logo" width="110" height="110" contain />
            </RouterLink>
          </v-container>
        </template>
        <!-- TEXTO CENTRAL -->
        <v-app-bar-title class="text-center text-h4 font-weight-bold">
          IFSeg — Controle de Acesso
        </v-app-bar-title>

        <template v-slot:append>
          <div v-if="auth.isAuth" class="d-flex aling-center gap-2">
            <!--<v-btn :to="{ name: 'mqtt-conectar' }">Conectar</v-btn>-->
            <!-- ✅ Botão que muda de cor e leva à página de conexão -->
            <v-btn
              :color="mqttButtonColor"
              :style="{ color: mqttButtonTextColor }"
              class="font-weight-bold"
              :to="{ name: 'mqtt-conectar' }"
              rounded
              elevation="2"
              prepend-icon="mdi-access-point-network"
            >
              {{ mqttButtonText }}
            </v-btn>
            <v-btn :to="{ name: 'admin-usuarios' }">Admin</v-btn>
            <v-btn @click="auth.logout">Fechar Sessão</v-btn>
          </div>
          <div v-else>
            <v-btn :to="{ name: 'home' }">Inicio</v-btn>
            <v-btn :to="{ name: 'login' }">Iniciar Sessão</v-btn>
          </div>
        </template>
      </v-app-bar>
      <v-main>
        <v-container>
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
