<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { useFirestore, useCollection } from "vuefire";
import { collection } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

function parseDataBrasil(str) {
  if (!str) return new Date("2000-01-01"); // fallback seguro

  // Se for timestamp numérico (ex: 1701024451000)
  if (typeof str === "number") return new Date(str);

  // Se já for Date
  if (str instanceof Date) return str;

  // Se não for string, fallback
  if (typeof str !== "string") return new Date("2000-01-01");

  // Se for string "05/12/2025, 18:51:51"
  if (str.includes("/")) {
    try {
      const [data, hora] = str.split(", ");
      const [dia, mes, ano] = data.split("/").map(Number);

      let h = 0,
        m = 0,
        s = 0;
      if (hora) [h, m, s] = hora.split(":").map(Number);
      if (!log.dataHora) {
        console.warn("⚠ Registro sem dataHora:", log);
      }

      return new Date(ano, mes - 1, dia, h, m, s);
    } catch (e) {
      return new Date("2000-01-01");
    }
  }

  // Se for "2025-12-05T18:51:51" (ISO)
  const d = new Date(str);
  if (!isNaN(d)) return d;

  return new Date("2000-01-01");
}

//Filtros de data
const dataInicio = ref(null);
const dataFim = ref(null);

// Relaciona log com usuário
const logsComUsuarios = computed(() => {
  return logs.value.map((log) => {
    const usuario = usuariosCollection.value.find((u) => u.tag === log.tag);
    const data = parseDataBrasil(log.dataHora);

    return {
      ...log,
      nome: usuario?.nome || "Desconhecido",
      sobrenome: usuario?.sobrenome || "",
      matricula: usuario?.matricula || "",
      curso: usuario?.curso || "",
      dataObj: data,
      dataFormatada: data.toLocaleString("pt-BR"),
    };
  });
});

// ---- FILTRO POR DATA ----
const logsFiltrados = computed(() => {
  const inicio = dataInicio.value
    ? new Date(dataInicio.value).setHours(0, 0, 0, 0)
    : null;

  const fim = dataFim.value
    ? new Date(dataFim.value).setHours(23, 59, 59, 999)
    : null;

  return logsComUsuarios.value
    .filter((l) => {
      const dataLog = l.dataObj.getTime(); // 🔥 conversão correta

      if (inicio && dataLog < inicio) return false;
      if (fim && dataLog > fim) return false;

      return true;
    })
    .sort((a, b) => parseDataBrasil(b.dataHora) - parseDataBrasil(a.dataHora)); // ordenação correta
});

// ---- EXPORTAÇÃO PARA PDF ----
const exportarPDF = () => {
  const doc = new jsPDF();

  doc.text(`Histórico da Sala: ${sala}`, 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [["Nome", "Sobrenome", "Matrícula", "Curso", "Status", "Data"]],
    body: logsFiltrados.value.map((l) => [
      l.nome,
      l.sobrenome,
      l.matricula,
      l.curso,
      l.status,
      l.dataFormatada,
    ]),
  });

  doc.save(`historico-${sala}.pdf`);
};

onMounted(() => {
  carregarLogs();
});
</script>

<template>
  <h1 class="text-center text-h4 font-weight-bold my-4">
    Histórico da Sala: {{ sala }}
  </h1>

  <v-card class="pa-4 mb-4">
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="dataInicio"
          label="Data inicial"
          type="date"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field
          v-model="dataFim"
          label="Data final"
          type="date"
          variant="outlined"
        />
      </v-col>

      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn color="red" class="mt-3" @click="exportarPDF">
          Exportar PDF
        </v-btn>
      </v-col>
    </v-row>
  </v-card>

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
        <tr v-for="(item, index) in logsFiltrados" :key="index">
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

    <div v-if="!logsFiltrados.length" class="text-center text-grey my-6">
      Nenhum registro encontrado para este filtro.
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
thead th {
  font-weight: bold !important;
}
</style>
