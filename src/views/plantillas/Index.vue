<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <!-- Header -->
          <div class="card-header pb-0">
            <div class="d-flex align-items-center">
              <h6 class="me-auto">Lista de Plantillas</h6>
              <button @click="goToCreateTemplate" class="btn btn-primary me-3">
                + Nueva Plantilla
              </button>
            </div>
            <div class="mt-3">
              <input
                v-model="filtroGlobal"
                placeholder="Buscar plantillas"
                class="search-input form-control"
              />
            </div>
          </div>

          <!-- Loader -->
          <div v-if="cargando" class="preloader text-center p-4">
            <div class="spinner"></div>
            <p>Cargando plantillas...</p>
          </div>

          <!-- Tabla y Paginación -->
          <div v-else class="card-body">
            <div class="table-responsive p-4">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Badge</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Sin registros -->
                  <tr v-if="plantillas.length === 0">
                    <td colspan="5" class="text-center text-secondary py-4">
                      Sin registros
                    </td>
                  </tr>
                  <!-- Listado -->
                  <tr
                    v-for="(tpl, i) in plantillas"
                    :key="tpl.id"
                    class="row-hover cursor-pointer"
                    @click="goToVerTemplate(tpl.id)"
                  >
                    <td>{{ (paginaActual - 1) * elementosPorPagina + i + 1 }}</td>
                    <td>{{ tpl.id }}</td>
                    <td>{{ tpl.titulo }}</td>
                    <td>{{ tpl.badge.nombre }}</td>
                    <td :class="tpl.es_predeterminada ? 'text-success' : 'text-danger'">
                      {{ tpl.es_predeterminada ? 'Activo' : 'Borrador' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div
              v-if="totalPaginas > 1"
              class="pagination d-flex justify-content-center align-items-center p-4"
            >
              <button
                class="btn btn-link"
                :disabled="paginaActual === 1"
                @click="paginaActual--"
              >
                ‹ Anterior
              </button>
              <span class="mx-3">
                Página {{ paginaActual }} de {{ totalPaginas }}
              </span>
              <button
                class="btn btn-link"
                :disabled="paginaActual === totalPaginas"
                @click="paginaActual++"
              >
                Siguiente ›
              </button>
            </div>
          </div>
          <!-- Fin Tabla y Paginación -->

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
      plantillas: [],         
      totalItems: 0,          
      filtroGlobal: "",       
      paginaActual: 1,       
      elementosPorPagina: 20, 
      cargando: false,       
      organizacionId: localStorage.getItem("organizacion_id"),
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.totalItems / this.elementosPorPagina);
    },
  },
  watch: {
    paginaActual() {
      this.updateRoute();
      this.fetchPlantillas();
    },
    filtroGlobal() {
      this.paginaActual = 1;
      this.updateRoute();
      this.fetchPlantillas();
    },
  },
  methods: {
    goToCreateTemplate() {
      this.$router.push("/plantillas/crear");
    },
    goToVerTemplate(id) {
      this.$router.push(`/plantillas/ver/${id}`);
    },
    updateRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: {
          organizacion_id: this.organizacionId,
          page:            this.paginaActual,
          limit:           this.elementosPorPagina,
          ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
        },
      });
    },
    async fetchPlantillas() {
      this.cargando = true;
      try {
        const params = {
          organizacion_id: this.organizacionId,
          page:            this.paginaActual,
          limit:           this.elementosPorPagina,
          ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
        };
        const { data } = await axios.get(
          "/plantillas-certificados/listar/organizacion",
          { params }
        );
        this.plantillas = data.items;
        this.totalItems = data.total;
      } catch (error) {
        console.error("Error al obtener plantillas:", error);
      } finally {
        this.cargando = false;
      }
    },
  },
  mounted() {
    const { page, search } = this.$route.query;
    if (page)   this.paginaActual = parseInt(page, 10);
    if (search) this.filtroGlobal = search;
    this.fetchPlantillas();
  },
};
</script>

<style scoped>
.pagination button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
