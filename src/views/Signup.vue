<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import Spinner from "@/components/Spinner.vue"
import axios from "@/axios";
import logo from "@/assets/imagenes/certifpro.webp";
import MenuPrincipal from "./components/MenuPrincipal.vue"; 
const body = document.getElementsByTagName("body")[0];

const tipoRegistro = ref("beneficiario"); 
const nombre = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const loading = ref(false);

const razonSocial = ref("");
const ruc = ref("");

const register = async () => {
 
  successMessage.value = "";
  errorMessage.value = "";
  if (!nombre.value || !email.value || !password.value) {
    errorMessage.value = "Todos los campos son obligatorios.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Las contraseñas no coinciden.";
    return;
  }

  try {
    let payload;
    loading.value = true;
    if (tipoRegistro.value === "beneficiario") {

      payload = {
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        contrasena: password.value.trim(),
        rol: "beneficiario",
      };
    } else {

      if (!razonSocial.value || !ruc.value) {
        errorMessage.value = "Debe completar los datos de la organización.";
        return;
      }

      payload = {
        nombreAdmin: nombre.value.trim(),
        emailAdmin: email.value.trim(),
        contrasena: password.value.trim(),
        razon_social: razonSocial.value.trim(),
        ruc: ruc.value.trim(),
      };
    }

    const endpoint = tipoRegistro.value === "beneficiario" ? "/usuarios" : "/organizaciones/registro";
    const response = await axios.post(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(response.data);
    
    successMessage.value = `
  Cuenta creada exitosamente, VERIFICA TU CORREO ELECTRÓNICO PARA ACTIVAR TU CUENTA.
  <a href="/signin" class="text-primary text-gradient font-weight-bold">Iniciar Sesión</a>
`;

    errorMessage.value = "";
    resetForm();
  } catch (error) {
   
    errorMessage.value = error.response?.data?.message || "Ocurrió un error al registrar la cuenta.";
  }
  finally {
    loading.value = false;
  }
};

const resetForm = () => {
  nombre.value = "";
  email.value = "";
  password.value = "";
  confirmPassword.value = "";
  razonSocial.value = "";
  ruc.value = "";
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
            <div class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column">
              <div class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="background: linear-gradient(90deg, #101E4F, #032F8A);">
                <h4 class="mt-5 text-white font-weight-bolder position-relative">
                  <img :src="logo" alt="" width="200px">
                </h4>
                <p class="text-white position-relative">
                  Desarrolla Tus Habilidades Profesionales. Obtén Credenciales. Descubre Nuevas Oportunidades Profesionales.
                </p>
                <Spinner :loading="loading" message="Cargando" />
              </div>
            </div>

            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Crear Cuenta</h4>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="register">

                    <!-- Tipo de Registro -->
                    <div class="mb-3">
                      <label class="form-label">Tipo de cuenta</label>
                      <select v-model="tipoRegistro" class="form-control">
                        <option value="beneficiario">Registrarse como Beneficiario</option>
                        <option value="empresa">Registrar una Empresa</option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <argon-input id="nombre" type="text" placeholder="Nombre Completo" name="nombre" v-model="nombre" size="lg" />
                    </div>

                 
                    <div class="mb-3">
                      <argon-input id="email" type="email" placeholder="Correo Electrónico" name="email" v-model="email" size="lg" />
                    </div>

                    
                    <template v-if="tipoRegistro === 'empresa'">
                      <div class="mb-3">
                        <argon-input id="razonSocial" type="text" placeholder="Razón Social" name="razonSocial" v-model="razonSocial" size="lg" />
                      </div>
                      <div class="mb-3">
                        <argon-input id="ruc" type="text" placeholder="RUC" name="ruc" v-model="ruc" size="lg" />
                      </div>
                    </template>

                   
                    <div class="mb-3">
                      <argon-input id="password" type="password" placeholder="Contraseña" name="password" v-model="password" size="lg" />
                    </div>

                
                    <div class="mb-3">
                      <argon-input id="confirmPassword" type="password" placeholder="Repetir Contraseña" name="confirmPassword" v-model="confirmPassword" size="lg" />
                    </div>

                    <!-- Mensajes -->
                    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
                    <p v-if="successMessage" class="text-success" v-html="successMessage"></p>
                    

                    <!-- Botón -->
                    <div class="text-center">
                      <argon-button class="mt-4" variant="gradient" color="primary" fullWidth size="lg" type="submit">
                        Crear Cuenta
                      </argon-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Ya tengo una cuenta.
                    <a href="/signin" class="text-primary text-gradient font-weight-bold">Iniciar Sesión</a>
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
