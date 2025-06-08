
<script setup>
import { onBeforeUnmount, onBeforeMount  } from "vue";
import { useStore } from "vuex";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>
<template>
   <MenuPrincipal></MenuPrincipal>
    <div class="container my-5" >
        
      <!-- Imagen y Título -->
      <div class="row text-center">
        <div class="col-12">
          <img :src="badge.ruta_imagen" alt="Badge" class="img-fluid rounded mb-4" style="max-width: 200px;" />
          <h2>{{ badge.nombre }}</h2>
          <h5 class="text-secondary">{{ badge.organizacion?.nombre }}</h5>
        </div>
      </div>
  
      <!-- Descripción -->
      <div class="row justify-content-center mt-4">
        <div class="col-md-8">
          <p class="bg-primary text-white p-3 rounded">
            {{ badge.descripcion }}
          </p>
        </div>
      </div>
  
      <!-- Skills y Criterios -->
      <div class="row mt-5">
        <!-- Skills -->
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title text-center">Skills</h5>
              <ul class="list-group list-group-flush">
                <li v-for="habilidad in badge.habilidades" :key="habilidad" class="list-group-item">
                  {{ habilidad.habilidad.nombre }}
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        <!-- Criterios -->
        <div class="col-md-6">
          <div class="card shadow">
            <div class="card-body">
              <h5 class="card-title text-center">Criterios</h5>
              <ul class="list-group list-group-flush">
                <li v-for="criterio in badge.criterios" :key="criterio" class="list-group-item">
                  
                  <p>{{criterio.criterio.description}} : {{criterio.descripcion}}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
    
      
    </div>
    <FooterPrincipal></FooterPrincipal>
  </template>
  
  <script>
  import axios from "../../axios";
  import MenuPrincipal from "../components/MenuPrincipal.vue";
  import FooterPrincipal from "../components/FooterPrincipal.vue";
  
  export default {
    data() {
      return {
        badge: {}, // Información del badge
        relacionados: [], // Badges relacionados
      };
    },
    methods: {
      async fetchBadgeDetails() {
        try {
          const idbadge = this.$route.params.idbadge;
          const response = await axios.get(`/badges/${idbadge}`);
          this.badge = response.data;
  
          // Obtener badges relacionados
          const relacionadosResponse = await axios.get(`/badges/relacionados/${idbadge}`);
          this.relacionados = relacionadosResponse.data;
        } catch (error) {
          console.error("Error al cargar detalles del badge:", error);
        }
      },
      iraDetalleBadge(idbadge) {
        this.$router.push(`/badges/publico/${idbadge}`);
      },
    },
    mounted() {
      this.fetchBadgeDetails();
    },
  };
  </script>
  
  <style>
  .cursor-pointer {
    cursor: pointer;
  }
  </style>