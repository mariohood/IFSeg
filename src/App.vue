<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

</script>

<template>
  <v-card
    elevation="3"
    max-width="1200"
    class="mx-auto"
  >
    <v-layout>
      
      <v-app-bar
        color="green-darken-2"
      >
        <template v-slot:prepend>
          <v-btn
          :to="{ name: 'home' }"
          >
            IFSeg - TCC2
          </v-btn>  
        </template>

        <template v-slot:append>
          <div v-if="auth.isAuth">
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

