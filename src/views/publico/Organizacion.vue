<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
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
  <MenuPrincipal />
  <div class="py-4 container">
    <div class="row">
      <div class="col-12">
        <!-- Información de la organización -->
        <div class="card mb-4">
          <div class="card-body text-center">
            <img
              :src="organizacion.url_imagen"
              alt="Logo"
              class="mb-3"
              width="150"
            />
            <h3 class="text-uppercase fs-4">{{ organizacion.razon_social }}</h3>
            <p>{{ organizacion.descripcion }}</p>
          </div>
        </div>

        <!-- Lista de Badges -->
        <div class="card">
          <div class="card-header pb-0 d-flex align-items-center">
            <h6 class="me-auto">Certificaciones</h6>
            <input
              v-model="filtroGlobal"
              placeholder="Buscar certificación"
              class="search-input form-control w-25"
            />
          </div>
          <div class="card-body">
            <div class="row">
              <div
                class="col-md-4 mb-4"
                v-for="badge in badgesPaginados"
                :key="badge.id"
                @click="iraDetalleBadge(badge.id)"
              >
                <div class="card text-center">
                  <img
                    :src="badge.ruta_imagen"
                    class="card-img-top p-3"
                    alt="Badge"
                  />
                  <div class="card-body">
                    <h6 class="card-title">{{ badge.nombre }}</h6>
                  </div>
                </div>
              </div>
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
  <FooterPrincipal />
</template>

<script>
import axios from "@/axios";
import MenuPrincipal from "../components/MenuPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";

export default {
  components: { MenuPrincipal, FooterPrincipal },
  data() {
    return {
      organizacion: {},
      badges: [],
      filtroGlobal: "",
      paginaActual: 1,
      elementosPorPagina: 9,
    };
  },
  computed: {
    badgesFiltrados() {
      if (!this.filtroGlobal) return this.badges;
      const f = this.filtroGlobal.toLowerCase().trim();
      return this.badges.filter((b) =>
        b.nombre.toLowerCase().includes(f)
      );
    },
    totalPaginas() {
      return Math.ceil(this.badgesFiltrados.length / this.elementosPorPagina);
    },
    badgesPaginados() {
      const start = (this.paginaActual - 1) * this.elementosPorPagina;
      return this.badgesFiltrados.slice(
        start,
        start + this.elementosPorPagina
      );
    },
  },
  methods: {
    iraDetalleBadge(idbadge) {
      this.$router.push(`/badges/publico/${idbadge}`);
    },
    async fetchDatosOrganizacion(idorganizacion) {
      const { data } = await axios.get(`/organizaciones/${idorganizacion}`);
      this.organizacion = data;
    },
    async fetchBadges(idorganizacion) {
  try {
    const { data } = await axios.get(`/badges/organizacion/${idorganizacion}`);
    // data puede ser { items, total }
    this.badges = Array.isArray(data) ? data : data.items;
  } catch (error) {
    console.error("Error al obtener datos:", error);
  }
}

  },
  mounted() {
    const idorg = this.$route.params.idorganizacion;
    this.fetchDatosOrganizacion(idorg);
    this.fetchBadges(idorg);
  },
};
</script>

<style scoped>
.card-img-top {
  max-height: 150px;
  object-fit: contain;
}
.pagination button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
