<script setup>
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFirestore, useDocument } from "vuefire";
import { doc, updateDoc } from "firebase/firestore";

import { useField, useForm } from "vee-validate";
import useImage from "@/composables/useImage";
import { validationSchema } from "@/validation/usuarioSchema";

const cursos = [
  "Sistemas para Internet",
  "Gestão Empresarial",
  "Técnico em Administração",
  "Técnico em Contabilidade",
  "Funcionario",
];
const locais = ["POALab", "Lab Robótica"];

const { url, uploadImage, image } = useImage();

const { handleSubmit } = useForm({ validationSchema });

const nome = useField("nome");
const sobrenome = useField("sobrenome");
const matricula = useField("matricula");
const curso = useField("curso");
const ambiente = useField("ambiente");
const imagen = useField("imagen");
const descricao = useField("descricao");

const route = useRoute();
const router = useRouter();

// obter o usuário a editar
const db = useFirestore();
const docRef = doc(db, "usuarios", route.params.id);
const usuario = useDocument(docRef);

watch(usuario, (usuario) => {
  nome.value.value = usuario.nome;
  sobrenome.value.value = usuario.sobrenome;
  matricula.value.value = usuario.matricula;
  curso.value.value = usuario.curso;
  ambiente.value.value = usuario.ambiente;
  descricao.value.value = usuario.descricao;
});

const submit = handleSubmit(async values => {
  const {imagen, ...usuario} = values
  if(image.value){
    console.log('ai uma imagem nova')
  }
  else{
    const data = { 
      ...usuario
    }
    await updateDoc(docRef, data)
  }
  router.push({name:'admin-usuarios'})

});
</script>

<template>
  <v-card max-width="800" flat class="mx-auto my-10">
    <v-card-title class="mt-5">
      <h1 class="text-h4 font-weight-bold">Editar Usuário</h1>
    </v-card-title>
    <v-card-subtitle>
      <p class="text-h5">Atualizar informação do usuário</p>
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

      <div class="my-5">
        <p class="font-weight-bold">Imagen Actual:</p>
        <img v-if="image" class="w-25" :src="image"></img>
        <img v-else class="w-25" :src="usuario?.image"></img>
      </div>

      <v-textarea
        class="mb-5"
        label="Descrição"
        v-model="descricao.value.value"
        :error-messages="descricao.errorMessage.value"
      >
      </v-textarea>

      <v-btn color="blue-accent-3" block @click="submit">
        Guardar Cambios
      </v-btn>
    </v-form>
  </v-card>
</template>
