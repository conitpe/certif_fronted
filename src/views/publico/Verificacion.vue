<template>
    <div v-if="textos && Object.keys(textos).length">
        <MenuPrincipal />

        <!-- Sección de Verificación y Búsqueda -->
        <section class="py-5 text-center">
            <div class="container">
                <!-- Título y descripción -->
                <h2 class="fw-bold fs-5 fs-md-3 mb-3">{{ textos.titulo }}</h2>
                <p class="lead fs-6 mb-5">{{ textos.descripcion }}</p>

                <div class="row g-4 justify-content-center align-items-stretch">
    <!-- Tarjeta: Búsqueda de Perfiles Certificados -->
    <div class="col-12 col-md-6 col-lg-5 d-flex">
        <div class="card border-0 shadow-sm h-100 w-100">
            <div class="card-body p-4 d-flex flex-column">
                <div class="text-center mb-3">
                    <UserIcon class="icono-busqueda" />
                </div>
                <h4 class="card-title text-center mb-2">{{ textos.perfil.titulo }}</h4>
                <p class="card-text text-center text-muted">{{ textos.perfil.descripcion }}</p>

                <a class="btn btn-primary mt-auto d-block mx-auto" :href="`/beneficiario/perfil/${userId}`">
                    {{ textos.perfil.boton }}
                </a>
            </div>
        </div>
    </div>

    <!-- Tarjeta: Búsqueda de Empresas Partners -->
    <div class="col-12 col-md-6 col-lg-5 d-flex">
        <div class="card border-0 shadow-sm h-100 w-100">
            <div class="card-body p-4 d-flex flex-column">
                <div class="text-center mb-3">
                    <BuildingIcon class="icono-busqueda" />
                </div>
                <h4 class="card-title text-center mb-2">{{ textos.empresa.titulo }}</h4>
                <p class="card-text text-center text-muted">{{ textos.empresa.descripcion }}</p>

                <a href="/empresas" class="btn btn-primary mt-auto d-block mx-auto">
                    {{ textos.empresa.boton }}
                </a>
            </div>
        </div>
    </div>
</div>


            </div>
        </section>

        <FooterPrincipal />
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useFetchTextos } from "@/composables/useFetchTextos";
import MenuPrincipal from "../components/MenuPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";

import { UserIcon, BuildingIcon } from 'lucide-vue-next';

const { textos } = useFetchTextos("busqueda");

const store = useStore();
const body = document.getElementsByTagName("body")[0];


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
<script>
import axios from "@/axios";

export default {
    name: "Verificacion",
    data() {
        return {
            userId: null,
        };
    },
    mounted() {
        this.userId = localStorage.getItem("user_id");
    },
    components: {
        MenuPrincipal,
        FooterPrincipal
    },
    methods: {
        async fetchUsuario() {
            try {
                const response = await axios.get(`/usuarios/${this.idUsuario}`);
                this.usuario = response.data;
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            }
        },
    }
};

</script>

<style scoped>
.btn {
    
}

.icono-busqueda {
    width: 40px;
    height: 40px;
    color: var(--color-smalt);
    transition: transform 0.2s ease-in-out;
}

.icono-busqueda:hover {
    transform: scale(1.1);
}

.card {
    border-radius: 0.75rem;
}

.card:hover {
    transform: translateY(-2px);
    transition: transform 0.3s ease-in-out;
}

.card-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.card .btn {
  margin-bottom: 0 !important;
}
</style>