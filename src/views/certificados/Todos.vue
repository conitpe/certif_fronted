<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <!-- Header -->
          <div class="card-header pb-0 d-flex align-items-center">
            <h6 class="me-auto">Lista de Certificados</h6>
            <h6 v-if="badgeId" class="ms-3">
              Para Badge: {{ badgeId }}
            </h6>
          </div>
          <!-- Búsqueda -->
          <div class="p-4">
            <input
              v-model="filtroGlobal"
              placeholder="Buscar certificados"
              class="search-input form-control"
            />
          </div>
          <!-- Loader -->
          <div v-if="cargando" class="preloader text-center p-4">
            <div class="spinner"></div>
            <p>Cargando certificados...</p>
          </div>
          <!-- Tabla -->
          <div v-else class="card-body">
            <div class="table-responsive p-4">
              <table class="table table-sm p-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Propietario</th>
                    <th>Badge</th>
                    <th>Fecha de Emisión</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="certificados.length === 0">
                    <td colspan="5" class="text-center text-secondary py-4">
                      Sin registros
                    </td>
                  </tr>
                  <tr
                    v-for="(cert, i) in certificados"
                    :key="cert.id"
                    class="row-hover cursor-pointer"
                    @click="goToVerCertificado(cert.badge.id, cert.id)"
                  >
                    <td>{{ (paginaActual - 1) * elementosPorPagina + i + 1 }}</td>
                    <td>{{ cert.propietario.nombre }} {{ cert.propietario.apellido }}</td>
                    <td>{{ cert.badge.nombre }}</td>
                    <td>{{ cert.fecha_emision }}</td>
                    <td
                      :class="{
                        'text-success': cert.estado === 'aceptado',
                        'text-danger':  cert.estado === 'rechazado'
                      }"
                    >
                        {{ cert.estado.charAt(0).toUpperCase() + cert.estado.slice(1) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Paginación -->
            <div
              v-if="totalPaginas > 1"
              class="pagination d-flex justify-content-center p-4"
            >
              <button
                class="btn btn-link"
                :disabled="paginaActual === 1"
                @click="paginaActual--"
              >
                ‹ Anterior
              </button>
              <span class="mx-3 align-self-center">
                Página {{ paginaActual }} de {{ totalPaginas }}
              </span>
              <button
                class="btn btn-link"
                :disabled="paginaActual >= totalPaginas"
                @click="paginaActual++"
              >
                Siguiente ›
              </button>
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
  name: "CertificadosTodos",
  data() {
    return {
      certificados:       [],
      totalItems:         0,
      filtroGlobal:       this.$route.query.search || "",
      paginaActual:       parseInt(this.$route.query.page, 10)  || 1,
      elementosPorPagina: parseInt(this.$route.query.limit, 10) || 20,
      organizacionId:      localStorage.getItem("organizacion_id"),

      cargando:           false,
    };
  },
  computed: {
    badgeId() {
      return this.$route.query.badge_id || null;
    },
    totalPaginas() {
      return Math.ceil(this.totalItems / this.elementosPorPagina);
    },
  },
  watch: {
    paginaActual() {
      this.updateRoute();
      this.fetchCertificados();
    },
    filtroGlobal() {
      this.paginaActual = 1;
      this.updateRoute();
      this.fetchCertificados();
    },
  },
  methods: {
    updateRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: {
          organizacion_id: this.organizacionId,
          page: this.paginaActual,
          limit: this.elementosPorPagina,
          ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
        },
      });
    },
    async fetchCertificados() {
      this.cargando = true;
      try {
        const params = {
          organizacion_id: this.organizacionId,
          page: this.paginaActual,
          limit: this.elementosPorPagina,
          ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
        };
        const { data } = await axios.get(
          "/certificados/listar/organizacion",
          { params }
        );
        this.certificados = data.items;
        this.totalItems   = data.total;
      } catch (error) {
        console.error("Error al obtener certificados:", error);
      } finally {
        this.cargando = false;
      }
    },
    goToVerCertificado(badgeId, certId) {
      this.$router.push(`/certificados/${badgeId}/ver/${certId}`);
    },
  },
  mounted() {
    this.fetchCertificados();
  },
};
</script>

<style scoped>
.pagination button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
