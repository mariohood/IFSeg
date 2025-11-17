<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { doc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { firebaseApp } from "@/config/firebase";

// Firestore (dados de usuário)
const route = useRoute();
const db = useFirestore();
const docRef = doc(db, "usuarios", route.params.id);
const usuario = useDocument(docRef);

// RTDB (logs de acesso)
const rtdb = getDatabase(firebaseApp);
const logsUsuario = ref([]);

watch(usuario, (u) => {
  if (!u) return;

  const tag = u.tag;

  const logsRef = dbRef(rtdb, "logs");
  onValue(logsRef, (snapshot) => {
    const data = snapshot.val() || {};

    logsUsuario.value = Object.values(data)
      .filter((log) => log.tag === tag) // só logs da Tag deste usuário
      .map((log) => ({
        ...log,
        dataHoraFormatada: log.horario
          ? new Date(log.horario).toLocaleString("pt-BR")
          : "-",
      }))
      .reverse(); //ordem: mais recente primeiro
  });
});
</script>

<template>
  <div>
    <v-card flat>
      <v-card-title class="mt-5 text-h3 text-center py-5 font-weight-bold">
        {{ usuario?.nome }} {{ usuario?.sobrenome }}
      </v-card-title>
      <v-img
        :src="usuario?.image"
        width="250"
        height="400"
        class="mx-auto"
        cover
      />
      <div
        class="bg-blue-grey-lighten-5 d-flex flex-column flex-md-row align-center"
      >
        <v-card-text class="text-h5">
          Matricula:
          <span class="font-weight-bold">{{ usuario?.matricula }}</span>
        </v-card-text>
        <v-card-text class="text-h5">
          Curso:
          <span class="font-weight-bold">{{ usuario?.curso }}</span>
        </v-card-text>
        <v-card-text class="text-h5">
          Ambiente:
          <span class="font-weight-bold">{{ usuario?.ambiente }}</span>
        </v-card-text>
      </div>
      <div>
        <v-card class="mt-10 pa-5">
          <h2 class="text-h5 mb-3">Histórico de Acessos</h2>

          <v-list v-if="logsUsuario.length">
            <v-list-item
              v-for="(log, i) in logsUsuario"
              :key="i"
              :class="
                log.status === 'autorizado'
                  ? 'bg-green-lighten-5'
                  : 'bg-red-lighten-5'
              "
            >
              <v-list-item-content>
                <v-list-item-title>
                  <strong>{{ log.status.toUpperCase() }}</strong>
                  — Sala {{ log.ambiente }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  <strong>Data:</strong> {{ log.dataHoraFormatada }} |
                  <strong>Tag:</strong> {{ log.tag }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <div v-else class="text-grey text-center py-5">
            Nenhum acesso registrado para este usuário.
          </div>
        </v-card>
      </div>
    </v-card>
  </div>
</template>
