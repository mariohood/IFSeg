<script setup>
import { useRoute } from "vue-router";
import { doc } from "firebase/firestore";
import { useDocument, useFirestore } from "vuefire";

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
    </v-card>
  </div>
</template>
