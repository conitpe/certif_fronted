<script setup>
import { ref, onMounted , onBeforeUnmount ,onBeforeMount} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import Spinner from "@/components/Spinner.vue"

import logo from "@/assets/imagenes/certifpro.webp";
import axios from '@/axios';
const body = document.getElementsByTagName("body")[0];

const route = useRoute();
const router = useRouter();
const token = ref('');
const password = ref('');
const confirmPassword = ref('');
const mensaje = ref('');
const errorMensaje = ref('');
const loading = ref(false);

onMounted(() => {
  token.value = route.params.token; 
});

const restablecerContraseña = async () => {
  if (password.value !== confirmPassword.value) {
    errorMensaje.value = 'Las contraseñas no coinciden.';
    return;
  }

  try {
    loading.value = true;
    errorMensaje.value = '';
    await axios.post('/auth/reset-password', {
      token: token.value,
      password: password.value,
    });

    mensaje.value = 'Contraseña restablecida con éxito. Redirigiendo al login...';
    errorMensaje.value = '';

    setTimeout(() => {
      router.push('/signin');
    }, 3000);
  } catch (error) {
    errorMensaje.value = 'No se pudo restablecer la contraseña. Inténtalo nuevamente.';
    console.error(error);
  } finally {
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
  <main class="mt-0 main-content">
    <section>
        <div class="page-header min-vh-100">
      <div class="container">
        <div class="row">
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style=" background: linear-gradient(90deg, #101E4F, #032F8A);"
              >
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  <img 
                  :src="logo"
                   alt="" srcset="" width="200px">
                </h4>
                <p class="text-white position-relative">
                  Desarrolla Tus Habilidades Profesionales. Obtenga Credenciales.
                  Descubre Nuevas Oportunidades Profesionales
                </p>
                <Spinner :loading="loading" message="Cargando" />
              </div>
            </div>

          <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
            <div class="card">
              <div class="card-header text-center">
                <h4>Restablecer Contraseña</h4>
              </div>
              <div class="card-body">
                <form @submit.prevent="restablecerContraseña">
                  <div class="mb-3">
                    <argon-input
                      type="password"
                      placeholder="Nueva Contraseña"
                      v-model="password"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <argon-input
                      type="password"
                      placeholder="Confirmar Contraseña"
                      v-model="confirmPassword"
                      required
                    />
                  </div>
                  <argon-button type="submit" variant="gradient" color="primary" fullWidth>
                    Restablecer Contraseña
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
