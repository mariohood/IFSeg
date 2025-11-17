<script setup>
import { useRoute } from "vue-router";
import { doc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";

// Firestore (dados de usuário)
const route = useRoute();
const db = useFirestore();
const docRef = doc(db, "usuarios", route.params.id);
const usuario = useDocument(docRef);
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
        class="bg-blue-gray-lighten-5 d-flex flex-column flex-md-row align-center"
      >
        <v-card-text>
          Matricula:
          <span class="font-weight-bold">{{ usuario?.matricula }}</span>
        </v-card-text>
        <v-card-text>
          Curso:
          <span class="font-weight-bold">{{ usuario?.curso }}</span>
        </v-card-text>
        <v-card-text>
          Ambiente:
          <span class="font-weight-bold">{{ usuario?.ambiente }}</span>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>
