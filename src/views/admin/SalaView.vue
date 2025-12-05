<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { useFirestore, useCollection } from "vuefire";
import { collection } from "firebase/firestore";

const route = useRoute();
const sala = route.params.sala;

// Firestore - usuários
const db = useFirestore();
const usuariosCollection = useCollection(collection(db, "usuarios"));

// Realtime DB logs da sala
const logs = ref([]);
const carregarLogs = () => {
  const rtdb = getDatabase();
  const logsRef = dbRef(rtdb, "logs");

  onValue(logsRef, (snapshot) => {
    const data = snapshot.val() || {};
    logs.value = Object.values(data).filter((l) => l.ambiente === sala);
  });
};

// Relaciona log com usuário
const logsComUsuarios = computed(() => {
  return logs.value.map((log) => {
    const usuario = usuariosCollection.value.find((u) => u.tag === log.tag);

    return {
      ...log,
      nome: usuario?.nome || "Desconhecido",
      sobrenome: usuario?.sobrenome || "",
      matricula: usuario?.matricula || "",
      curso: usuario?.curso || "",
      dataFormatada: new Date(log.dataHora).toLocaleString("pt-BR"),
    };
  });
});

onMounted(() => {
  carregarLogs();
});
</script>

<template>
  <h1 class="text-center text-h4 font-weight-bold my-4">
    Histórico da Sala: {{ sala }}
  </h1>

  <v-card class="pa-4">
    <v-table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Sobrenome</th>
          <th>Matrícula</th>
          <th>Curso</th>
          <th>Status</th>
          <th>Data</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in logsComUsuarios" :key="index">
          <td>{{ item.nome }}</td>
          <td>{{ item.sobrenome }}</td>
          <td>{{ item.matricula }}</td>
          <td>{{ item.curso }}</td>
          <td :class="item.status === 'autorizado' ? 'text-green' : 'text-red'">
            {{ item.status }}
          </td>
          <td>{{ item.dataFormatada }}</td>
        </tr>
      </tbody>
    </v-table>

    <div v-if="!logsComUsuarios.length" class="text-center text-grey my-6">
      Nenhum registro encontrado para esta sala.
    </div>
  </v-card>
</template>

<style>
.text-green {
  color: #2ecc71;
}
.text-red {
  color: #e74c3c;
}
</style>
