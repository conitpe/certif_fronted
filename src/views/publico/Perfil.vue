

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
    <div class="container py-5">
        <header class="header">
            <div class="container-fluid d-flex justify-content-between align-items-center py-3">
                <img src="@/assets/imagenes/logo.png" width="100px" alt="Logo" class="logo" />
                <div class="d-flex align-items-center">
                <p class="mb-0 me-3">Nombre Usuario</p>
                <div class="status-circle"></div>
                </div>
            </div>
        </header>
      <!-- Cabecera del Usuario -->
      <div class="row align-items-center mb-4">
        <div class="col-md-2 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="172" height="172" viewBox="0 0 172 172">
  <g id="Rectángulo_1068" data-name="Rectángulo 1068" transform="translate(6 6)" fill="#efefef" stroke="#fff" stroke-linecap="round" stroke-width="6">
    <rect width="160" height="160" rx="80" stroke="none"/>
    <rect x="-3" y="-3" width="166" height="166" rx="83" fill="none"/>
  </g>
</svg>

        </div>
        <div class="col-md-8">
          <h3 class="fw-bold">{{ usuario.nombre }} {{ usuario.apellido }}</h3>
          <a :href="usuario.linkedin || '#'" target="_blank" class="text-primary">
            <i class="fab fa-linkedin fs-4"></i>
          </a>
        </div>
      </div>
  
      <!-- Skills del Usuario -->
      <div class="row mb-5">
        <div class="col-12">
          <h5 class="fw-bold mb-3">Skills</h5>
          <div class="d-flex flex-wrap">
            <span
              v-for="skill in usuario.skills"
              :key="skill"
              class="badge bg-light text-dark border me-2 mb-2 px-3 py-2"
            >
              {{ skill }}
            </span>
          </div>
        </div>
      </div>
  
      <!-- Lista de Badges -->
      <div class="row">
        <div class="col-12">
          <h5 class="fw-bold mb-4">Badges</h5>
          <div class="row g-3">
            <div
              class="col-sm-6 col-md-4 col-lg-3"
              v-for="certificado in certificados"
              :key="certificado.id"
            >
              <div class="card border-0 shadow-sm" @click="irADetalleBadge(certificado.badge.id)" style="cursor: pointer;">
                <img
                  :src="certificado.badge.ruta_imagen"
                  class="card-img-top rounded"
                  alt="Badge"
                />
                <div class="card-body text-center">
                  <h6 class="card-title fw-bold">{{ certificado.badge.nombre }}</h6>
                  <p class="text-muted mb-0">{{ certificado.badge.organizacion }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "../../axios";
  
  export default {
    data() {
      return {
        usuario: {
          nombre: "",
          apellido: "",
          linkedin: "",
          skills: [],
        },
        certificados: [],
      };
    },
    methods: {
      async fetchUsuario(idUsuario) {
        try {
          const response = await axios.get(`/usuarios/${idUsuario}`);
          this.usuario = response.data;
        } catch (error) {
          console.error("Error al obtener usuario:", error);
        }
      },
      async fetchCertificados(idUsuario) {
        try {
          const response = await axios.get(`/usuarios/${idUsuario}/certificados`);
          this.certificados = response.data;
        } catch (error) {
          console.error("Error al obtener certificados:", error);
        }
      },
      irADetalleBadge(idBadge) {
        this.$router.push(`/badges/publico/${idBadge}`);
      },
    },
    mounted() {
      const idUsuario = this.$route.params.idusuario || "default_id"; // ID por defecto
      this.fetchUsuario(idUsuario);
      this.fetchCertificados(idUsuario);
    },
  };
  </script>
  
  <style scoped>
  .badge {
    font-size: 0.9rem;
    border-radius: 12px;
    font-weight: 500;
  }
  .card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  </style>