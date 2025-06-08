<script setup>
import { ref, onMounted,onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Swal from 'sweetalert2';
import logo from "@/assets/imagenes/certifpro.webp";
import MenuPrincipal from "./components/MenuPrincipal.vue";
import axios from '@/axios';
const body = document.getElementsByTagName("body")[0];

const mensaje = ref('');
const estado = ref('cargando');

const route = useRoute();
const token = route.query.token;

onMounted(async () => {
  if (!token) {
    estado.value = 'error';
    mensaje.value = 'Token no proporcionado';
    return;
  }

  try {
    const response = await axios.get(`/auth/verificar?token=${token}`);
    mensaje.value = response.data.mensaje || 'Cuenta verificada';
    estado.value = 'ok';

    Swal.fire({
      icon: "success",
      title: "Cuenta Verificada",
      text: mensaje.value,
      confirmButtonText: "Iniciar Sesión",
    }).then(() => {
      window.location.href = "/signin"; // Redirige al login
    });
  } catch (error) {
    estado.value = 'error';
    mensaje.value = error.response?.data?.message || 'Error al verificar el correo';
    Swal.fire({
      icon: "error",
      title: "Verificación Fallida",
      text: mensaje.value,
      confirmButtonText: "Volver",
    });
  }
});
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
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row justify-content-center align-items-center">
            <div class="col-lg-6 col-md-8 col-12">
              <div class="text-center">
                <img :src="logo" alt="Logo" width="200" class="mb-4" />
                <h4 class="mb-3 text-primary fw-bold">
                  {{ estado === 'ok' ? 'Verificación Exitosa' : 'Verificando Cuenta...' }}
                </h4>
                <p class="text-secondary">{{ mensaje }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
