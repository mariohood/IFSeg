<script setup>
import { ref, computed } from "vue";
import { useMqttStore } from "@/stores/mqttStore";

const mqttStore = useMqttStore();
</script>

<template>
  <v-container class="pa-4" style="max-width: 600px">
    <h1 class="text-h5 mb-4">Conexão MQTT</h1>

    <!-- Status -->
    <v-card class="pa-4 mb-4">
      <v-alert
        :type="
          mqttStore.isConnected
            ? 'success'
            : mqttStore.connecting
            ? 'warning'
            : 'error'
        "
        dense
        class="mb-4"
      >
        {{
          mqttStore.connecting
            ? "Conectando..."
            : mqttStore.isConnected
            ? "Conectado"
            : "Desconectado"
        }}
      </v-alert>

      <!-- Seleção de Broker -->
      <v-select
        label="Broker"
        :items="mqttStore.brokers"
        item-title="name"
        v-model="mqttStore.selectedBroker"
        @change="mqttStore.changeBroker"
        outlined
        dense
      ></v-select>

      <v-btn
        class="mt-3"
        color="primary"
        :loading="mqttStore.connecting"
        @click="
          mqttStore.isConnected ? mqttStore.disconnect() : mqttStore.connect()
        "
      >
        {{ mqttStore.isConnected ? "Desconectar" : "Conectar" }}
      </v-btn>
    </v-card>

    <!-- Publicação -->
    <v-card class="pa-4 mb-4" v-if="mqttStore.isConnected">
      <h3 class="text-h6 mb-3">Publicar Mensagem</h3>

      <v-select
        label="Tópico"
        :items="mqttStore.availableTopics"
        v-model="mqttStore.topic"
        outlined
        dense
        class="mb-3"
      ></v-select>

      <v-text-field
        label="Mensagem"
        v-model="mqttStore.newMessage"
        outlined
        dense
      ></v-text-field>

      <v-btn
        color="success"
        class="mt-2"
        @click="mqttStore.publish(mqttStore.newMessage)"
      >
        📤 Publicar
      </v-btn>
    </v-card>

    <!-- Mensagens Recebidas -->
    <v-card class="pa-4 mb-4" v-if="mqttStore.messages.length">
      <h3 class="text-h6 mb-2">Mensagens Recebidas</h3>
      <v-list max-height="200" class="overflow-y-auto">
        <v-list-item v-for="(msg, i) in mqttStore.messages" :key="i">
          <v-list-item-content>
            <v-list-item-title>{{ msg.message }}</v-list-item-title>
            <v-list-item-subtitle
              >{{ msg.topic }} • {{ msg.timestamp }}</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Logs -->
    <v-card class="pa-4">
      <h3 class="text-h6 mb-2">Logs</h3>
      <v-list max-height="200" class="overflow-y-auto">
        <v-list-item v-for="(log, i) in mqttStore.logs" :key="i">
          <v-list-item-content>
            <v-list-item-subtitle class="font-mono text-caption">{{
              log
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>
