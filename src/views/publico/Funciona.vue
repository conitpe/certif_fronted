<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useFetchTextos } from "@/composables/useFetchTextos";
import MenuPrincipal from "../components/MenuPrincipal.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import axios from "@/axios";
const { textos: textosFuncionamiento } = useFetchTextos("funcionamiento");
const { textos: textosGeneral } = useFetchTextos("general");
import ContactoForm from "../components/ContactoForm.vue";
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
  <div v-if="textosFuncionamiento && Object.keys(textosFuncionamiento).length">
    <MenuPrincipal />
    <section class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold fs-5 fs-md-3 mb-4">
          {{ textosFuncionamiento.seccionFunciona?.titulo }}
        </h2>
        <p class="text-center text-muted fs-6 mb-5">
          {{ textosFuncionamiento.seccionFunciona?.descripcion }}
        </p>

        <div class="row g-4">
  <div class="col-12 col-md-6 d-flex">
    <div class="card shadow-sm p-4 h-100 d-flex flex-column w-100">
      <h3 class="fw-bold fs-6">
        {{ textosFuncionamiento.seccionFunciona?.empresas?.titulo }}
      </h3>
      <p class="text-muted">
        {{ textosFuncionamiento.seccionFunciona?.empresas?.descripcion }}
      </p>
      <ol class="list-group list-group-numbered m-2">
        <li
          class="list-group-item"
          v-for="(paso, index) in textosFuncionamiento.seccionFunciona?.empresas?.pasos"
          :key="index"
        >
          {{ paso }}
        </li>
      </ol>
      <a
        class="btn btn-primary mt-auto w-100"
        href="/nosotros"
      >
        {{ textosFuncionamiento.seccionFunciona?.empresas?.boton }}
      </a>
    </div>
  </div>

  <div class="col-12 col-md-6 d-flex">
    <div class="card shadow-sm p-4 h-100 d-flex flex-column w-100">
      <h3 class="fw-bold fs-6">
        {{ textosFuncionamiento.seccionFunciona?.acreditados?.titulo }}
      </h3>
      <p class="text-muted">
        {{ textosFuncionamiento.seccionFunciona?.acreditados?.descripcion }}
      </p>
      <ol class="list-group list-group-numbered m-2">
        <li
          class="list-group-item"
          v-for="(paso, index) in textosFuncionamiento.seccionFunciona?.acreditados?.pasos"
          :key="index"
        >
          {{ paso }}
        </li>
      </ol>
      <a
        class="btn btn-primary mt-auto w-100"
        :href="`/beneficiario/perfil/${userId}`"
      >
        {{ textosFuncionamiento.seccionFunciona?.acreditados?.boton }}
      </a>
    </div>
  </div>
</div>

      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center fw-bold fs-5 fs-md-3 mb-4">
          {{ textosFuncionamiento.seccionPorQueCertif?.titulo }}
        </h2>
        <p class="text-center text-muted fs-6 mb-5">
          {{ textosFuncionamiento.seccionPorQueCertif?.descripcion }}
        </p>

        <div class="card shadow-sm p-4">
          <h3 class="fw-bold fs-6">
            {{ textosFuncionamiento.seccionPorQueCertif?.subtitulo }}
          </h3>
          <p class="text-muted">
            {{ textosFuncionamiento.seccionPorQueCertif?.subdescripcion }}
          </p>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              v-for="(beneficio, index) in textosFuncionamiento.seccionPorQueCertif?.beneficios"
              :key="index"
            >
              <strong>{{ beneficio.titulo }}:</strong>
              {{ beneficio.descripcion }}
            </li>
          </ul>
          <button
            class="btn btn-primary mt-4 w-100"
            @click="discoverMore"
          >
            {{ textosFuncionamiento.seccionPorQueCertif?.boton }}
          </button>
        </div>
      </div>
    </section>
    <section class="py-5">
      <div class="container">
        <h2 class="text-center fw-bold fs-5 fs-md-3 mb-4">
          {{ textosFuncionamiento.seccionSoporte?.titulo }}
        </h2>
        <p class="text-center text-muted fs-6 mb-5">
          {{ textosFuncionamiento.seccionSoporte?.descripcion }}
        </p>

        <div class="row justify-content-center">
          <div class="col-12 col-md-8">
            <div class="card shadow-sm p-4">
              <h3 class="fw-bold fs-6">
                {{ textosFuncionamiento.seccionSoporte?.contacto?.titulo }}
              </h3>
              <p class="text-muted">
                {{ textosFuncionamiento.seccionSoporte?.contacto?.descripcion }}
              </p>
              <p>{{ textosGeneral.contacto?.telefono  }}</p>
              <p>{{ textosGeneral.contacto?.correo  }}</p>

              <div class="">
                <ContactoForm />

          </div></div>
          </div>
        </div>
      </div>
    </section>

    <FooterPrincipal />
  </div>

  <div v-else>
    <p class="text-center py-5">Cargando...</p>
  </div>
</template>
<script>

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
        discoverMore() {
            this.$router.push({ name: "Soluciones" });
        }
    }
};

</script>

<style scoped>
.btn-primary {
  transition: background-color 0.3s ease-in-out;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.card {
  transition: transform 0.2s ease-in-out;
}
.card:hover {
  transform: scale(1.03);
}
</style>
