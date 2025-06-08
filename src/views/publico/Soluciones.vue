<script setup>
import { computed, onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useFetchTextos } from "@/composables/useFetchTextos";
import ContactoForm from "../components/ContactoForm.vue";
import {
  CheckCircleIcon,
  PhoneIcon,
  MailIcon,
  ArrowRightCircleIcon,
  FileTextIcon,
} from 'lucide-vue-next';

const store = useStore();
const body = document.body;

const { textos: textosServicios } = useFetchTextos("servicios");
const { textos: textosGeneral } = useFetchTextos("general");



const telefono = computed(() => textosGeneral.value?.contacto?.telefono || "+51935827678");
const mensajeServicio = computed(() => encodeURIComponent(textosGeneral.value?.mensajes?.servicio || "Hola quiero contratar el servicio de certificaciones digitales"));
const mensajeConsulta = computed(() => encodeURIComponent(textosGeneral.value?.mensajes?.consulta || "Hola tengo una consulta sobre Certif"));

const goToContratar = () => {
  window.open(`https://wa.me/${telefono.value}?text=${mensajeServicio.value}`, '_blank');
};

const goToConsulta = () => {
  window.open(`https://wa.me/${telefono.value}?text=${mensajeConsulta.value}`, '_blank');
};



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

    <section class="hero py-5 text-center text-md-start">
      <div class="container">
        <h1 class="fw-bold fs-4 fs-md-2">{{ textosServicios.hero?.titulo }}</h1>
        <p class="lead fs-6">{{ textosServicios.hero?.descripcion }}</p>

        <div class="row mt-4">
          <div v-for="(beneficio, index) in textosServicios.hero?.beneficios" :key="index" class="col-12 col-md-4 mt-2">
            <div class="card shadow-sm p-3 h-100 d-flex flex-column align-items-center justify-content-center">
              <FileTextIcon class="icono" />
              <CheckCircleIcon class="icono-hero mb-2" />
              <p class="card-text fs-6 text-center">{{ beneficio }}</p>
            </div>
          </div>
        </div>

        <button class="btn btn-gold mt-4 px-5 py-2 d-flex align-items-center gap-2" aria-label="Contactar" @click="goToContratar()">
          <ArrowRightCircleIcon class="icono-boton" />
          {{ textosServicios.hero?.boton }}
        </button>
      </div>
    </section>

    <!-- Certificación Section -->
    <section class="py-5 bg-light text-center">
      <div class="container">
        <h2 class="fw-bold fs-5 fs-md-3">{{ textosServicios.certificacion?.titulo }}</h2>
        <p class="lead fs-6">{{ textosServicios.certificacion?.descripcion }}</p>
        <ol class="list-unstyled mt-3 fs-6 text-start text-md-center mx-auto" style="max-width: 600px;">
          <li v-for="(paso, index) in textosServicios.certificacion?.pasos" :key="index"
            class="d-flex align-items-start gap-2 my-2">
            <CheckCircleIcon class="icono-lista" />
            {{ paso }}
          </li>
        </ol>
        <button class="btn btn-gold mt-3 px-5 py-2 d-flex align-items-center gap-2 mx-auto" aria-label="Consulta" @click="goToConsulta">
          <ArrowRightCircleIcon class="icono-boton" />
          {{ textosServicios.certificacion?.boton }}
        </button>
      </div>
    </section>

    <!-- Sección de Contacto -->
    <section class="py-5 text-center text-md-start">
      <div class="container">
        <div class="row align-items-center">
          <!-- Información de Contacto -->
          <div class="col-12 col-md-6">
            <h2 class="fw-bold fs-5 fs-md-3">{{ textosServicios.contacto?.titulo }}</h2>
            <p class="lead fs-6">{{ textosServicios.contacto?.descripcion }}</p>
            <p class="fs-6">{{ textosServicios.contacto?.detalle }}</p>

            <div class="p-3 border rounded bg-white shadow-sm">
              <p class="mb-2 d-flex align-items-center gap-2">
                <PhoneIcon class="icono-contacto" />
                <strong>{{ textosGeneral.contacto?.telefono }}</strong>
              </p>
              <p class="mb-2 d-flex align-items-center gap-2">
                <MailIcon class="icono-contacto" />
                <strong>{{ textosGeneral.contacto?.correo }}</strong>
              </p>
            </div>
          </div>

          <!-- Formulario de Contacto -->
          <div class="col-12 col-md-6 mt-4 mt-md-0">
            <ContactoForm />


          </div>
        </div>
      </div>
    </section>

    <FooterPrincipal />
  </div>
</template>

<script>
import FooterPrincipal from "../components/FooterPrincipal.vue";
import MenuPrincipal from "../components/MenuPrincipal.vue";

export default {
  data() {
    return {
            enviando: false,
    };
  },
  components: {
    MenuPrincipal,
    FooterPrincipal,
  },
};
</script>

<style scoped>
:root {
  --color-smalt: #003195;
  --color-midnight: #111c4b;
  --gold-start: #cba235;
  --gold-end: #c58a0a;
}


.icono-hero {
  width: 24px;
  height: 24px;
  color: #fff;
}

.icono-boton {
  width: 20px;
  height: 20px;
  color: #fff;
}

.icono-contacto {
  width: 18px;
  height: 18px;
  color: var(--color-smalt);
}

.icono-lista {
  width: 20px;
  height: 20px;
  color: var(--color-smalt);
}

.card {
  transition: box-shadow 0.3s ease-in-out;
}

.card:hover {
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
