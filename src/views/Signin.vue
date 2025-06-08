<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import logo from "@/assets/imagenes/certifpro.webp";
import axios from '@/axios';
import Swal from 'sweetalert2';
import MenuPrincipal from "./components/MenuPrincipal.vue"; 
import Spinner from "@/components/Spinner.vue"
const body = document.getElementsByTagName("body")[0];
const loading = ref(false);
const email = ref('');
const password = ref('');
const rememberPassword = ref(false);
const mostrarReenviar = ref(false);


const login = async () => {
  try {
    mostrarReenviar.value = false;
    if (!email.value || !password.value) {
      Swal.fire({
        icon: "warning",
        title: "Campos Vacíos",
        text: "Por favor, ingrese su email y contraseña.",
        showConfirmButton: false,
        timer: 1500
      });
      return; 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      Swal.fire({
        icon: "warning",
        title: "Email Inválido",
        text: "Ingrese un correo electrónico válido.",
        showConfirmButton: false,
        timer: 1500
      });
      return; 
    }


    if (rememberPassword.value) {
      localStorage.setItem('rememberedEmail', email.value);
      localStorage.setItem('rememberedPassword', password.value);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }

    loading.value = true;
    const response = await axios.post('/auth/login', {
      email: email.value,
      password: password.value,
    });


    const { access_token, user_role, user_id, organizacion_id } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('role', user_role);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('organizacion_id', organizacion_id);

    if (user_role === 'superadministrador' || user_role === 'administrador') {
      window.location.href = '/badges';
    } else {
      window.location.href = `/usuarios/perfil/${user_id}`;
    }

  } catch (error) {
    const errorData = error.response?.data;

    if (errorData?.message === 'Cuenta no verificada') {
        mostrarReenviar.value = true;
        Swal.fire({
          icon: "warning",
          title: "Cuenta no verificada",
          text: "Verifica tu correo electrónico antes de iniciar sesión.",
          confirmButtonText: "Cerrar"
        });
        return;
      }

    if (errorData) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: errorData.message,
        text: `Error ${errorData.statusCode}: ${errorData.error}`,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error desconocido.",
      });
    }
  }
  finally {
    loading.value = false;
  }


};
const reenviarCorreoVerificacion = async () => {
  try {
    loading.value = true;
    await axios.post('/auth/reenviar-verificacion', { email: email.value }); // o crear endpoint: `/auth/reenviar-verificacion`
    Swal.fire({
      icon: 'success',
      title: 'Correo enviado',
      text: 'Revisa tu bandeja de entrada para verificar tu cuenta.',
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error al reenviar',
      text: err.response?.data?.message || 'No se pudo reenviar el correo.',
    });
  }
  finally {
    loading.value = false;
  }
  
}

const store = useStore();

onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");

  const rememberedEmail = localStorage.getItem('rememberedEmail');
  const rememberedPassword = localStorage.getItem('rememberedPassword');
  if (rememberedEmail && rememberedPassword) {
    email.value = rememberedEmail;
    password.value = rememberedPassword;
    rememberPassword.value = true;
  }
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
            <div class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden" style="background: linear-gradient(90deg, #101E4F, #032F8A);">
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  <img :src="logo" alt="Logo" width="200px">
                </h4>
                <p class="text-white position-relative">
                  Desarrolla Tus Habilidades Profesionales. Obtén Credenciales.
                  Descubre Nuevas Oportunidades Profesionales.
                </p>
                <Spinner :loading="loading" message="Cargando" />
              </div>
            </div>
            
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Iniciar Sesión</h4>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="login">
                    <div class="mb-3">
                      <argon-input
                        id="email"
                        type="text"
                        placeholder="Email"
                        name="email"
                        v-model="email"
                        size="lg"                        
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="Contraseña"
                        name="password"
                        v-model="password"
                        size="lg"
                      />
                    </div>
                    <!-- Vinculamos el switch con v-model -->
                    <argon-switch id="rememberMe" name="remember-me" v-model="rememberPassword">
                      Recordarme Contraseña
                    </argon-switch>

                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="primary"
                        fullWidth
                        size="lg"
                        type="submit"
                      >
                        Ingresar
                      </argon-button>
                    </div>
                  </form>
                  <div v-if="mostrarReenviar" class="text-center mt-3">
  <argon-button
    variant="gradient"
    color="warning"
    fullWidth
    size="md"
    @click="reenviarCorreoVerificacion"
  >
    Reenviar correo de verificación
  </argon-button>
</div>

                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    ¿Olvidaste tu contraseña?
                    <a href="/recuperar" class="text-primary text-gradient font-weight-bold">Restablecer Contraseña</a>
                  </p>
                </div>

                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Ya tengo una cuenta.
                    <a href="signup" class="text-primary text-gradient font-weight-bold">Crear Cuenta</a>
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
