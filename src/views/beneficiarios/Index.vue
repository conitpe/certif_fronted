<template>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header pb-0 d-flex align-items-center">
              <h6 class="me-auto">Lista de Beneficiarios</h6>
              
            </div>
            <div class="p-4">
                <input
                v-model="filtroGlobal"
                placeholder="Buscar beneficiarios"
                class="search-input form-control"
              />
            </div>
            <div v-if="cargando" class="preloader text-center p-4">
              <div class="spinner"></div>
              <p>Cargando usuarios...</p>
            </div>
            <div v-else class="card-body p-4">
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(u,i) in usuarios" :key="i" @click="goToVerUsuario(u.id)" class="cursor-pointer">
                        <td class="text-sm">{{ (paginaActual - 1) * elementosPorPagina + i + 1 }}</td>
                      <td>{{ u.nombre }}</td>
                      <td>{{ u.apellido }}</td>
                      <td>{{ u.email }}</td>
                    </tr>
                    <tr v-if="!usuarios.length">
                      <td colspan="4" class="text-center text-secondary py-4">Sin registros</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="totalPaginas > 1" class="pagination d-flex justify-content-center mt-3">
                <button class="btn btn-link" :disabled="paginaActual===1" @click="paginaActual--">‹ Anterior</button>
                <span class="px-3 align-self-center">{{ paginaActual }} de {{ totalPaginas }}</span>
                <button class="btn btn-link" :disabled="paginaActual>=totalPaginas" @click="paginaActual++">Siguiente ›</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "@/axios";
  
  export default {
    data() {
      return {
        usuarios: [],
        totalItems: 0,
        filtroGlobal: this.$route.query.search || "",
        paginaActual: Number(this.$route.query.page) || 1,
        elementosPorPagina: 20,
        cargando: false,
      };
    },
    computed: {
      totalPaginas() {
        return Math.ceil(this.totalItems / this.elementosPorPagina);
      },
    },
    watch: {
      filtroGlobal() {
        this.paginaActual = 1;
        this.updateRoute();
        this.fetchUsuarios();
      },
      paginaActual() {
        this.updateRoute();
        this.fetchUsuarios();
      },
    },
    methods: {
      updateRoute() {
        this.$router.replace({
          path: this.$route.path,
          query: {
            ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
            page: this.paginaActual,
          },
        });
      },
      async fetchUsuarios() {
        this.cargando = true;
        try {
          const params = {
            page: this.paginaActual,
            limit: this.elementosPorPagina,
            ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
          };
          const { data } = await axios.get("/usuarios/beneficiarios", { params });
          this.usuarios   = data.items;
          this.totalItems = data.total;
        } catch (error) {
          console.error("❌ Error al obtener beneficiarios:", error);
        } finally {
          this.cargando = false;
        }
      },
      goToVerUsuario(id) {
        this.$router.push(`/usuarios/ver/${id}`);
      },
    },
    mounted() {
      this.fetchUsuarios();
    },
  };
  </script>
  
  <style scoped>
  .preloader {
    display: flex; flex-direction: column; align-items: center; height: 100px;
  }
  .spinner {
    border: 5px solid #f3f3f3; border-top-color: #007bff; border-radius: 50%;
    width: 40px; height: 40px; animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pagination button[disabled] { cursor: not-allowed; opacity: 0.5; }
  </style>
  