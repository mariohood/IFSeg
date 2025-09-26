<script setup>
import { useForm, useField } from "vee-validate";
import { collection, addDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";
import { useRouter } from "vue-router";
import { validationSchema, imageSchema } from "@/validation/usuarioSchema";
import useImage from "@/composables/useImage";

const cursos = [
  "Sistemas para Internet",
  "Gestão Empresarial",
  "Técnico em Administração",
  "Técnico em Contabilidade",
  "Funcionario",
];
const locais = ["POALab", "Lab Robótica"];

const { url, uploadImage, image } = useImage();

const router = useRouter();
const db = useFirestore();

const { handleSubmit } = useForm({
  validationSchema: {
    ...validationSchema,
    ...imageSchema,
  },
});

const nome = useField("nome");
const sobrenome = useField("sobrenome");
const matricula = useField("matricula");
const curso = useField("curso");
const ambiente = useField("ambiente");
const imagen = useField("imagen");
const descricao = useField("descricao");

const submit = handleSubmit(async (values) => {
  const { imagen, ...usuario } = values;

  const docRef = await addDoc(collection(db, "usuarios"), {
    ...usuario,
    image: url.value,
  });
  if (docRef.id) {
    router.push({ name: "admin-usuarios" });
  }
});
</script>

<template>
  <v-card max-width="800" flat class="mx-auto my-10">
    <v-card-title class="text-h4 font-weight-bold" tag="h3">
      Novo usuário
    </v-card-title>
    <v-card-subtitle class="text-h5 py-2">
      Cria um novo usuário prechendo o siguente formulário
    </v-card-subtitle>
    <v-form class="mt-10">
      <v-text-field
        class="mb-5"
        label="Nome"
        v-model="nome.value.value"
        :error-messages="nome.errorMessage.value"
      />
      <v-text-field
        class="mb-5"
        label="Sobrenome"
        v-model="sobrenome.value.value"
        :error-messages="sobrenome.errorMessage.value"
      />
      <v-text-field
        class="mb-5"
        label="Matrícula"
        v-model="matricula.value.value"
        :error-messages="matricula.errorMessage.value"
      />
      <v-row>
        <v-col>
          <v-select
            class="mb-5"
            label="Curso"
            :items="cursos"
            v-model="curso.value.value"
            :error-messages="curso.errorMessage.value"
          />
        </v-col>
        <v-col>
          <v-select
            class="mb-5"
            label="Ambiente"
            :items="locais"
            v-model="ambiente.value.value"
            :error-messages="ambiente.errorMessage.value"
          />
        </v-col>
      </v-row>

      <v-file-input
        accept="image/jpeg"
        label="Fotografia"
        prepend-icon="mdi-camera"
        class="mb-5"
        v-model="imagen.value.value"
        :error-messages="imagen.errorMessage.value"
        @change="uploadImage"
      />

      <div v-if="image" class="my-5">
        <p class="font-weight-bold">Imagem do usuário:</p>
        <img class="w-25" :src="image" />
      </div>

      <v-textarea
        class="mb-5"
        label="Descrição"
        v-model="descricao.value.value"
        :error-messages="descricao.errorMessage.value"
      >
      </v-textarea>

      <v-btn color="pink-accent-3" block @click="submit">
        Agregar Usuário
      </v-btn>
    </v-form>
  </v-card>
</template>
