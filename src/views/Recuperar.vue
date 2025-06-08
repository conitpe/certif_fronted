<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import Spinner from "@/components/Spinner.vue"
import logo from "@/assets/imagenes/certifpro.webp";
import axios from '@/axios';
import Swal from 'sweetalert2';
import MenuPrincipal from "./components/MenuPrincipal.vue"; 
const body = document.getElementsByTagName("body")[0];

const loading = ref(false);
const email = ref('');
const mensaje = ref('');
const errorMensaje = ref('');

const solicitarRecuperacion = async () => {
  try {
     
    if (!email.value) {
      Swal.fire({
        icon: "warning",
        title: "Campo Vacío",
        text: "Por favor, ingresa tu correo electrónico.",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    // 2️⃣ **Validar formato de email**
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      Swal.fire({
        icon: "warning",
        title: "Email Inválido",
        text: "Ingresa un correo electrónico válido.",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    loading.value = true;
    await axios.post('/auth/solicitar-recuperacion', { email: email.value });


    Swal.fire({
      icon: "success",
      title: "Solicitud Enviada",
      text: "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.",
      timer: 3000,
      showConfirmButton: false
    });

    mensaje.value = 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';
    errorMensaje.value = '';

  } catch (error) {
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || "No se pudo procesar la solicitud. Inténtalo nuevamente.";

    Swal.fire({
      icon: "error",
      title: "Error",
      text: errorMessage,
    });

    errorMensaje.value = errorMessage;
  } 
  finally {
    loading.value = false;
  }
};

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
          <div class="row">
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style=" background: linear-gradient(90deg, #101E4F, #032F8A);">
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  <img :src="logo" alt="" srcset="" width="200px">
                </h4>
                <p class="text-white position-relative">
                  Desarrolla Tus Habilidades Profesionales. Obtenga Credenciales.
                  Descubre Nuevas Oportunidades Profesionales
                </p>
                <Spinner :loading="loading" message="Cargando" />
              </div>
            </div>
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card">
                <div class="card-header text-center">
                  <h4>Recuperar Contraseña</h4>
                </div>
                <div class="card-body">
                  <form @submit.prevent="solicitarRecuperacion">
                    <div class="mb-3">
                      <argon-input type="text" placeholder="Correo Electrónico" v-model="email" required />
                    </div>
                    <argon-button type="submit" variant="gradient" color="primary" fullWidth>
                      Enviar Enlace de Recuperación
                    </argon-button>
                  </form>
                  <p v-if="mensaje" class="text-success mt-3">{{ mensaje }}</p>
                  <p v-if="errorMensaje" class="text-danger mt-3">{{ errorMensaje }}</p>
                </div>
                <div class="card-footer text-center">
                  <a href="/signin" class="text-primary">Volver al inicio de sesión</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
