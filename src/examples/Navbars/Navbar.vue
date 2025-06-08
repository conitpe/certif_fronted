<script setup>
import { computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import axios from "@/axios";
import Breadcrumbs from "../Breadcrumbs.vue";
import { showWarning } from "@/utils/alertService";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const route = useRoute();
const router = useRouter();

const currentRouteName = computed(() => route.name);
const currentDirectory = computed(() => {
  const dir = route.path.split("/")[1];
  return dir.charAt(0).toUpperCase() + dir.slice(1);
});

const userName = ref("");
const userId   = localStorage.getItem("user_id");

async function fetchUserName() {
  if (!userId) return;
  try {
    const { data } = await axios.get(`/usuarios/${userId}`);
    userName.value = `${data.nombre}`;
  } catch (e) {
    console.error("Error cargando nombre:", e);
  }
}

onMounted(fetchUserName);

const minimizeSidebar = () => store.commit("sidebarMinimize");

const logout = async () => {
  const result = await showWarning("confirmCerrarSesion");
  if (result.isConfirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("organizacion_id");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    router.push({ name: "Signin" });
  }
};
</script>

<template>
  <nav
    class="mt-2 navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
    style="background-color: white; color: #252525;"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs
        :current-page="currentRouteName"
        :current-directory="currentDirectory"
      />

      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >
        <div
          class="pe-md-3 d-flex align-items-center"
          :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"
        ></div>

        <ul class="navbar-nav justify-content-end">
          <!-- Usuario con dropdown -->
          <li class="nav-item dropdown d-flex align-items-center">
            <a
              class="nav-link dropdown-toggle px-0 font-weight-bold"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fa fa-user" :class="isRTL ? 'ms-sm-2' : 'me-sm-2'"></i>
              <span class="d-sm-inline d-none">{{ userName }}</span>
            </a>
            <ul
              class="dropdown-menu dropdown-menu-end"
              aria-labelledby="userDropdown"
            >
              <li>
                <router-link
                  class="dropdown-item"
                  :to="{ name: 'UsuariosVer', params: { idusuario: userId } }"
                >
                  Ver perfil
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a
                  class="dropdown-item text-danger"
                  href="#"
                  @click.prevent="logout"
                >
                  Cerrar sesión
                </a>
              </li>
            </ul>
          </li>

          <!-- Toggle sidebar (móvil) -->
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a
              href="#"
              @click="minimizeSidebar"
              class="p-0 nav-link"
              id="iconNavbarSidenav"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

