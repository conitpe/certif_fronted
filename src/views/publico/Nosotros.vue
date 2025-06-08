<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useFetchTextos } from "@/composables/useFetchTextos";
import ContactoForm from "../components/ContactoForm.vue";
import FooterPrincipal from "../components/FooterPrincipal.vue";
import MenuPrincipal from "../components/MenuPrincipal.vue";
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


const { textos: textosNosotros } = useFetchTextos("nosotros");
const { textos: textosGeneral } = useFetchTextos("general");
</script>


<template>
  <div v-if="textosNosotros && Object.keys(textosNosotros).length">
    <MenuPrincipal />

    
      <!-- ¿Quiénes Somos? -->
      <section class="bg-light p-5 rounded shadow-sm">
        <div class="container">
        <h2 class="text-center fw-bold fs-5 fs-md-3">
          {{ textosNosotros.quienesSomos.titulo }}
        </h2>
        <p class="text-center text-muted fs-6">
          {{ textosNosotros.quienesSomos.descripcion }}
        </p>
        <div class="row align-items-center mt-4">
          <div class="col-md-8">
            <ul class="list-unstyled fs-6">
              <li v-for="(item, index) in textosNosotros.quienesSomos.lista" :key="index" class="mb-2">
                <i class="fas fa-check-circle text-success"></i> {{ item }}
              </li>
            </ul>
          </div>
          <div class="col-md-4 text-center">
            <img src="@/assets/imagenes/personas-sonriendo.webp" alt="Certif" class="img-fluid rounded shadow-sm" />
          </div>
        </div>
    </div>
      </section>

      <!-- Misión & Visión -->
      <section class="py-5">
        <div class="container">
        <div class="row row-cols-1 row-cols-md-2 g-4">
          <div class="col">
            <div class="card shadow-sm p-4 text-center h-100">
              <h3 class="fw-bold fs-6">
                <i class="fas fa-bullhorn text-primary"></i> {{ textosNosotros.misionVision.mision.titulo }}
              </h3>
              <p class="text-muted">
                {{ textosNosotros.misionVision.mision.descripcion }}
              </p>
            </div>
          </div>
          <div class="col">
            <div class="card shadow-sm p-4 text-center h-100">
              <h3 class="fw-bold fs-6">
                <i class="fas fa-globe text-primary"></i> {{ textosNosotros.misionVision.vision.titulo }}
              </h3>
              <p class="text-muted">
                {{ textosNosotros.misionVision.vision.descripcion }}
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      <!-- ¿Qué Hacemos? -->
      <section class="py-5 bg-light rounded shadow-sm">
        <div class="container">
        <h2 class="text-center fw-bold fs-5 fs-md-3 mb-4">
          {{ textosNosotros.queHacemos.titulo }}
        </h2>
        <div class="row row-cols-1 row-cols-md-2 g-4">
          <div class="col" v-for="(opcion, index) in textosNosotros.queHacemos.opciones" :key="index">
            <div class="card shadow-sm p-4 text-center">
              <h3 class="fw-bold fs-6">
                <!-- Se pueden agregar iconos fijos si se desea -->
                {{ opcion.titulo }}
              </h3>
              <p class="text-muted">
                {{ opcion.descripcion }}
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      <!-- Nuestros Valores -->
      <section class="py-5">
        <div class="container">
        <h2 class="text-center fw-bold fs-5 fs-md-3 mb-4">
          {{ textosNosotros.valores.titulo }}
        </h2>
        <div class="row row-cols-1 row-cols-md-4 g-4">
  <div
    class="col d-flex"
    v-for="(valor, index) in textosNosotros.valores.opciones"
    :key="index"
  >
    <div class="card shadow-sm p-4 text-center w-100 d-flex flex-column">
      <h3 class="fw-bold fs-6">
        {{ valor.titulo }}
      </h3>
      <p class="text-muted mt-auto">
        {{ valor.descripcion }}
      </p>
    </div>
  </div>
</div>



        </div>
      </section>

      <!-- Contacto -->
      <section class="py-5 bg-light text-center rounded shadow-sm" id="contacto">
        <div class="container">
        <h2 class="fw-bold fs-5 fs-md-3">
          {{ textosNosotros.contacto.titulo }}
        </h2>
        <p class="text-muted">
          {{ textosNosotros.contacto.descripcion }}
        </p>
        <p><strong>{{  textosGeneral.contacto?.telefono }}</strong></p>
        <p><strong>{{ textosGeneral.contacto?.correo }}</strong></p>

        <div class="">
          <ContactoForm />

          </div>
        </div>
      </section>

    <FooterPrincipal />
  </div>
  <div v-else class="text-center py-5">
    <p>Cargando...</p>
  </div>
</template>

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
