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
    <MenuPrincipal></MenuPrincipal>
    <div class="py-4 container">
        <div class="row">
            <div class="col-12">
                <div class="card mb-4">
                    <div class="card-body text-center">
                        <h3 class="text-uppercase fs-4">Organizaciones</h3>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header pb-0">
                        <h6>Buscar Organización</h6>
                        <input
  v-model="terminoBusqueda"
  placeholder="Buscar Organización"
  class="search-input form-control"
  @input="buscarOrganizaciones"
/>

                    </div>
                    <div class="card-body">
                        <!-- Si hay resultados, mostramos la grid -->
                        <div class="row" v-if="organizaciones.length > 0">
                            <div 
                                class="col-md-4 mb-4" 
                                v-for="organizacion in organizaciones" 
                                :key="organizacion.id"
                            >
                                <div 
                                    class="card text-center" 
                                    @click="iraDetalleOrganizacion(organizacion.id)"
                                >
                                    <img 
                                        :src="organizacion.url_imagen" 
                                        class="card-img-top p-3" 
                                        alt="Badge" 
                                    />
                                    <div class="card-body">
                                        <h6 class="card-title">
                                            {{ organizacion.razon_social }}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Si no hay resultados, mostramos el mensaje -->
                        <div class="text-center" v-else-if="terminoBusqueda">
  No hay organizaciones
</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <FooterPrincipal></FooterPrincipal>
</template>

<script>
import axios from "../../../axios";
import MenuPrincipal from "../../components/MenuPrincipal.vue";
import FooterPrincipal from "../../components/FooterPrincipal.vue";

export default {
    data() {
        return {
            filtroGlobal: "",
            terminoBusqueda: "", 
            organizaciones: [],  
        };
    },

    components: {
        MenuPrincipal,
        FooterPrincipal,
    },

    mounted() {
       
        const qParam = this.$route.query.q;
        if (qParam && qParam.trim() !== "") {
            this.terminoBusqueda = qParam;
            this.buscarOrganizaciones();
        }
    },

    methods: {
        async cargarOrganizaciones() {
         
            try {
                const response = await axios.get("/organizaciones");
                this.organizaciones = response.data;
            } catch (error) {
                console.error("Error al cargar organizaciones:", error);
            }
        },

        iraDetalleOrganizacion(idorganizacion) {
            this.$router.push({ name: 'Organizacion', params: { idorganizacion } });
        },

        async buscarOrganizaciones() {
            
            if (!this.terminoBusqueda.trim()) {
                this.organizaciones = [];
                this.$router.replace({ query: {} }); 
                return;
            }

            try {
             
                this.$router.replace({
                    query: { q: this.terminoBusqueda },
                });

                const response = await axios.get("/organizaciones/buscar", {
                    params: {
                        q: this.terminoBusqueda
                    }
                });
                this.organizaciones = response.data;
            } catch (error) {
                console.error("Error al buscar organizaciones:", error);
                this.organizaciones = [];
            }
        },
    },
};
</script>

<style>
.card-img-top {
    max-height: 150px;
    object-fit: contain;
}
</style>
