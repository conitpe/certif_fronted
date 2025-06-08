<template>
    <div class="py-4 container-fluid">
      <div class="row"><div class="col-12">
        <div class="card">
          <!-- Header -->
          <div class="card-header d-flex align-items-center">
            <h6 class="me-auto">Organizaciones</h6>
         
          </div>
          <div class="p-4">
            <input
              v-model="filtroGlobal"
              placeholder="Buscar organizaciones"
              class="search-input form-control "
            />
          </div>
  
          <!-- Loader -->
          <div v-if="cargando" class="preloader text-center p-4">
            <div class="spinner"></div>
            <p>Lista de organizaciones...</p>
          </div>
  
          <!-- Tabla -->
          <div v-else class="card-body p-4">
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>#</th><th>Nombre</th><th>Tipo</th><th>Web</th><th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!organizaciones.length">
                    <td colspan="5" class="text-center text-secondary py-4">
                      Sin registros
                    </td>
                  </tr>
                  <tr
                    v-for="org in organizaciones"
                    :key="org.id"
                    class="row-hover cursor-pointer"
                    @click="goToVerOrganizacion(org.id)"
                  >
                    <td>{{ org.id }}</td>
                    <td>{{ org.razon_social }}</td>
                    <td>{{ org.tipo }}</td>
                    <td>{{ org.url_web }}</td>
                    <td>{{ org.email_contacto }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- Paginación -->
            <div v-if="totalPaginas>1" class="pagination d-flex justify-content-center mt-3">
              <button class="btn btn-link" :disabled="paginaActual===1" @click="paginaActual--">
                ‹ Anterior
              </button>
              <span class="mx-3 align-self-center">
                Página {{ paginaActual }} de {{ totalPaginas }}
              </span>
              <button class="btn btn-link" :disabled="paginaActual>=totalPaginas" @click="paginaActual++">
                Siguiente ›
              </button>
            </div>
          </div>
        </div>
      </div></div>
    </div>
  </template>
  
  <script>
  import axios from "../../axios";
  
  export default {
    data() {
      return {
        organizaciones:      [],
        totalItems:          0,
        filtroGlobal:        this.$route.query.search || "",
        paginaActual:        Number(this.$route.query.page) || 1,
        elementosPorPagina:  20,
        cargando:            false,
        organizacionId: localStorage.getItem('organizacion_id'),
        rol: localStorage.getItem('role'),
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
        this.fetchOrganizaciones();
      },
      paginaActual() {
        this.updateRoute();
        this.fetchOrganizaciones();
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
      goToVerOrganizacion(id) {
        this.$router.push(`/organizacion/ver/${id}`);
      },
      async fetchOrganizaciones() {
  this.cargando = true;
  try {
    const params = {
      page:  this.paginaActual,
      limit: this.elementosPorPagina,
      ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
    };

    let res;   

    if (this.rol === "superadministrador") {
      // llamamos al endpoint paginado
      res = await axios.get("/organizaciones/paginado", { params });
      // res.data = { items, total }
      this.organizaciones = res.data.items;
      this.totalItems      = res.data.total;

    } else if (this.rol === "administrador" && this.organizacionId) {
      // sólo su propia organización
      res = await axios.get(`/organizaciones/${this.organizacionId}`);
      // res.data = la org única
      this.organizaciones = [res.data];
      this.totalItems      = 1;

    } else {
      this.organizaciones = [];
      this.totalItems      = 0;
      return;
    }

  } catch (err) {
    console.error("Error al obtener organizaciones:", err);
  } finally {
    this.cargando = false;
  }
},

    },
    mounted() {
      this.fetchOrganizaciones();
    },
  };
  </script>
  
  <style scoped>
  .preloader {
    display: flex; flex-direction: column; align-items: center; height: 100px;
  }
  .spinner {
    border: 5px solid #f3f3f3; border-top: 5px solid #007bff;
    border-radius: 50%; width: 40px; height: 40px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pagination button[disabled] { cursor: not-allowed; opacity: 0.5; }
  </style>
  