<script setup>
import { useFetchTextos } from "@/composables/useFetchTextos";
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import MenuPrincipal from "../components/MenuPrincipal.vue";

const { textos } = useFetchTextos("legal");

const store = useStore();
const body = document.body;

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
    <div>
        <MenuPrincipal />
        <!-- Sección de términos legales -->
        <section class="py-5 bg-light">
            <div class="container">
                <h1 class="fw-bold text-center">{{ textos.titulo }}</h1>
                <p class="text-muted text-center">{{ textos.fecha }}</p>

                <div class="row justify-content-center">
                    <div class="col-12 col-md-10 col-lg-8">
                        <div v-for="(seccion, index) in textos.secciones" :key="index" class="mt-4">
                            <h3 class="fw-bold ">{{ seccion.titulo }}</h3>
                            <p v-html="seccion.contenido"></p>
                        </div>

                        <div class="text-center mt-5">
                            <a href="/" class="btn btn-success w-100 w-md-auto">{{ textos.boton }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <FooterPrincipal />
    </div>
</template>
