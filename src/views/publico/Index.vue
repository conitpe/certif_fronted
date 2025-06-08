<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { MessageSquareIcon, CheckCircleIcon, ArrowRightCircleIcon, SearchIcon, StarIcon } from 'lucide-vue-next';
import { useStore } from "vuex";
import { useFetchTextos } from "@/composables/useFetchTextos";
import logo from '@/assets/imagenes/credly.webp';

const store = useStore();
const body = document.body;

onBeforeMount(() => {
    store.state.hideConfigButton = true;
    store.state.showNavbar = false;
    store.state.showSidenav = false;
    store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
    const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = logo; 
        document.head.appendChild(link);
});

onBeforeUnmount(() => {
    store.state.hideConfigButton = false;
    store.state.showNavbar = true;
    store.state.showSidenav = true;
    store.state.showFooter = true;
    body.classList.add("bg-gray-100");
});


const { textos } = useFetchTextos("inicio");
</script>

<template>
    <div>
        <!-- Header -->
        <MenuPrincipal />

        <!-- Hero Section -->
        <section class="hero py-5 text-center text-md-start">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-12 col-md-6">
                        <h1 class="fw-bold fs-4 fs-md-2 text-white">
                            {{ textos.hero?.titulo }}
                        </h1>
                        <p class="lead fs-6 text-white">
                            {{ textos.hero?.descripcion }}
                        </p>
                        <a :href="'https://wa.me/51935827678?text=' + encodeURIComponent(textos.hero?.mensajeWhatsapp)"
                            class="btn btn-success gap-2">
                            <MessageSquareIcon class="icono" />
                            {{ textos.hero?.boton }}
                        </a>
                    </div>
                    <div class="col-12 col-md-5 text-center">
                        <img :src="logo" alt="Logo" class="img-fluid" />
                    </div>
                </div>
            </div>
        </section>

        
        <section class="py-5 text-center bg-light" style="min-height: 500px;">
            <div class="container">
                <h2 class="fw-bold fs-5 fs-md-3">{{ textos.certificaciones?.titulo }}</h2>
                <p class="lead fs-6">{{ textos.certificaciones?.descripcion }}</p>
                <div class="row mt-4">
                    <div v-for="(beneficio, index) in textos.certificaciones?.beneficios" :key="index"
                        class="col-12 col-md-4 mt-2">
                        <div class="card p-3 shadow-sm">
                            <div class="icono-container">
                                <CheckCircleIcon class="icono-beneficio" />
                            </div>
                            <p class="fw-bold fs-6">{{ beneficio.titulo }}</p>
                            <p class="fs-6">{{ beneficio.descripcion }}</p>
                        </div>
                    </div>
                </div>
                <a href="/soluciones" class="btn btn-success mt-4 gap-2  justify-content-center">
                    <ArrowRightCircleIcon class="icono" />
                    {{ textos.certificaciones?.boton }}
                </a>
            </div>
        </section>

        <!-- Search Section -->
        <section class="bg-light py-5 text-center">
            <div class="container">
                <h2 class="fw-bold fs-5 fs-md-3">{{ textos.verificacion?.titulo }}</h2>
                <p class="lead fs-6">{{ textos.verificacion?.descripcion }}</p>
                <div class="row justify-content-center mt-3">
                    <div class="col-12 col-md-6">
                        <div class="input-group">
                            <input type="text" v-model="idcertificado" class="form-control"
                                :placeholder="textos.verificacion?.placeholder"
                                style="border-top-right-radius: 0; border-bottom-right-radius: 0; height: 45px;" required />
                            <button  class="btn btn-success text-dark fw-bold gap-2" aria-label="Verificar"
                                @click="buscarCertificado"
                                style="border-top-left-radius: 0; border-bottom-left-radius: 0; height: 45px; min-width: 100px;">
                                <SearchIcon class="icono" />
                                {{ textos.verificacion?.boton }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Call to Action -->
        <section class="py-5 text-center">
            <div class="container">
                <h2 class="fw-bold fs-5 fs-md-3">{{ textos.cta?.titulo }}</h2>
                <p class="lead fs-6">{{ textos.cta?.descripcion }}</p>
                <a :href="'https://wa.me/51935827678?text=' + encodeURIComponent(textos.hero?.mensajeWhatsapp)"
                    class="btn btn-success gap-2  justify-content-center">
                    <StarIcon class="icono" />
                    {{ textos.cta?.boton }}
                </a>
            </div>
        </section>

        <FooterPrincipal />
    </div>
</template>

<script>
import FooterPrincipal from "../components/FooterPrincipal.vue";
import MenuPrincipal from "../components/MenuPrincipal.vue";
import {  showError } from "@/utils/alertService";

export default {
    name: "CertifHomePage",
    data() {
        return {
            idcertificado: ''
        };
    },
    components: {
        MenuPrincipal,
        FooterPrincipal,
    },
    methods: {
        buscarCertificado() {
            if (this.idcertificado) {
                this.$router.push({ 
                    name: 'BadgeBeneficiario', params: { idcertificado: this.idcertificado }

                }).catch(err => {
                    console.error(err);
                    showError("fetch"); 
                });
            } else {
                showError("fetch"); 
            }
        }
    }
};
</script>

<style scoped>
.hero {
 
  background: linear-gradient(45deg, var(--color-smalt), var(--color-midnight));
  color: #fff;
}

.btn-success {
  background: linear-gradient(135deg, var(--gold-start), var(--gold-end)) !important;
  border: none !important;
  color: #fff !important;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
}

.btn-success:hover {
  filter: brightness(0.9);
  transform: scale(1.03);
}

.icono {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease-in-out;
}
.btn:hover .icono {
  transform: scale(1.1);
}

.icono-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
.icono-beneficio {
  width: 30px;
  height: 30px;
  color: #198754; 
  transition: transform 0.2s ease-in-out;
}
.icono-beneficio:hover {
  transform: scale(1.2);
}

.card {
  transition: box-shadow 0.3s ease-in-out;
}
.card:hover {
  box-shadow: 0px 5px 15px rgba(0,0,0,0.1);
}

.fade-in {
  animation: fadeIn 0.8s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
