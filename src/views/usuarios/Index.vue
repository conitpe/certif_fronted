<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <!-- Header -->
          <div class="card-header pb-0 d-flex align-items-center">
            <h6 class="me-auto">Lista de Usuarios</h6>
            <button @click="goToCreateUser()" class="btn btn-primary">
              + Nuevo Usuario
            </button>

          </div>
          <div class="p-4">
            <input v-model="filtroGlobal" placeholder="Buscar usuarios" class="search-input form-control ms-3" />
          </div>
          <!-- Loader -->
          <div v-if="cargando" class="preloader text-center p-4">
            <div class="spinner"></div>
            <p>Cargando usuarios...</p>
          </div>

          <!-- Tabla -->
          <div v-else class="card-body p-4">
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!usuarios.length">
                    <td colspan="4" class="text-center text-secondary py-4">
                      Sin registros
                    </td>
                  </tr>
                  <tr v-for="usuario in usuarios" :key="usuario.id" class="row-hover cursor-pointer"
                    @click="goToVerUsuario(usuario.id)">
                    <td>{{ usuario.nombre }}</td>
                    <td>{{ usuario.apellido }}</td>
                    <td>{{ usuario.email }}</td>
                    <td>
                      {{ usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            <div v-if="totalPaginas > 1" class="pagination d-flex justify-content-center mt-3">
              <button class="btn btn-link" :disabled="paginaActual === 1" @click="paginaActual--">
                ‹ Anterior
              </button>
              <span class="mx-3 align-self-center">
                Página {{ paginaActual }} de {{ totalPaginas }}
              </span>
              <button class="btn btn-link" :disabled="paginaActual >= totalPaginas" @click="paginaActual++">
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
import axios from "../../axios";

export default {
  data() {
    return {
      usuarios: [],
      filtroGlobal: this.$route.query.search || "",
      paginaActual: Number(this.$route.query.page) || 1,

      elementosPorPagina: 20,
      cargando: false,
      totalItems: 0,

      organizacionId: localStorage.getItem("organizacion_id"),
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
    goToCreateUser() {
      this.$router.push("/usuarios/crear");
    },
    goToVerUsuario(id) {
      this.$router.push(`/usuarios/ver/${id}`);
    },

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
        const { data } = await axios.get(
          `/usuarios/organizacion/vinculados/${this.organizacionId}`,
          { params }
        );
        // data = { items, total }
        this.usuarios = data.items;
        this.totalItems = data.total;
      } catch (error) {
        console.error("Error al obtener usuarios vinculados:", error);
      } finally {
        this.cargando = false;
      }
    },
  },
  mounted() {
    this.fetchUsuarios();
  },
};
</script>

<style scoped>
.preloader {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
}

.spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pagination button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>