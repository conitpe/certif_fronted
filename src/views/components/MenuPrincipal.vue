<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <!-- Logo -->
            <a href="/">
                <img src="@/assets/imagenes/logo-azul.webp" width="100px" alt="Logo" class="logo" />
            </a>

            <!-- Botón de menú solo en móvil -->
            <button class="navbar-toggler d-lg-none" type="button" @click="toggleMenu">
                <MenuIcon class="menu-icon" />
            </button>

            <!-- Menú de navegación en pantallas grandes -->
            <div class="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
                <ul class="navbar-nav me-auto mt-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/soluciones">Soluciones</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/verificacion">Verificación</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/funciona">Cómo funciona</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/nosotros">Nosotros</router-link>
                    </li>
                </ul>

                <!-- Opciones de usuario en desktop -->
                <div class="d-flex align-items-center">
                    <div v-if="isAuthenticated" class="dropdown">
                        <button 
                            class="btn btn-outline-primary dropdown-toggle" 
                            type="button"
                            id="userDropdown" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                        >
                            <UserIcon class="user-icon" />
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                            <li><router-link class="dropdown-item" :to="dashboardRoute">Dashboard</router-link></li>
                            <li><router-link class="dropdown-item" :to="`/beneficiario/perfil/${userId}`">Perfil</router-link></li>
                            <li><button class="dropdown-item text-danger" @click="logout">Salir</button></li>
                        </ul>
                    </div>

                    <!-- Botón de inicio de sesión en desktop -->
                    <a v-else class="btn btn-primary mt-2" href="/signin">Iniciar Sesión</a>
                </div>
            </div>

            <!-- Menú Offcanvas en móvil -->
            <div :class="['offcanvas-menu', { 'show': isMenuOpen }]" @click.self="toggleMenu">
                <div class="offcanvas-content">
                    <button class="close-btn" @click="toggleMenu">
                        <XIcon />
                    </button>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/soluciones">Soluciones</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/verificacion">Verificación</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/funciona">Cómo funciona</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/nosotros">Nosotros</router-link>
                        </li>
                    </ul>

                    <div class="menu-footer">
                        <a v-if="!isAuthenticated" class="btn btn-primary w-100" href="/signin">Iniciar Sesión</a>
                        <div v-else>
                            <router-link class="btn btn-outline-primary w-100" :to="dashboardRoute">Dashboard</router-link>
                            <button class="btn btn-danger w-100 mt-2" @click="logout">Salir</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { Menu as MenuIcon, X as XIcon, User as UserIcon } from 'lucide-vue-next';
import { showWarning} from "@/utils/alertService";
export default {
    name: "MenuPrincipal",
    components: {
        MenuIcon,
        XIcon,
        UserIcon
    },
    data() {
        return {
            isAuthenticated: false,
            userId: null,
            isMenuOpen: false,
            userRole: localStorage.getItem('role'),
      
        };
    },
    mounted() {
        const token = localStorage.getItem("token");
        this.userId = localStorage.getItem("user_id");

        if (token) {
            this.isAuthenticated = true;
        }
    },
    computed: {
        dashboardRoute() {
            if (this.userRole === "administrador" || this.userRole === "superadministrador") {
                return "/badges"; 
            } else if (this.userRole === "beneficiario") {
                return "/beneficiario/dashboard"; 
            }
            return "/dashboard-default"; 
        },
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        async logout() {
  const result = await showWarning("confirmCerrarSesion");

  if (result.isConfirmed) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    localStorage.removeItem("organizacion_id");
    this.$router.push("/signin");
  }
}

    },
};
</script>

<style scoped>


.navbar-nav {
    display: flex;
    align-items: center;
    gap: 20px; 
}

.navbar .btn {
    align-self: center; 
    margin-left: auto; 
}


/* Navbar */
.logo {
    margin-right: 20px;
}

/* Iconos */
.menu-icon,
.user-icon {
    width: 32px;
    height: 32px;
    color: #000;
}

/* Botón de cerrar */
.close-btn {
    background: none;
    border: none;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 15px;
    color: #000;
}

/* Menú Offcanvas en móvil */
.offcanvas-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100%;
    background: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
    transition: right 0.3s ease-in-out;
    z-index: 1050;
}

.offcanvas-menu.show {
    right: 0;
}

/* Contenedor del menú */
.offcanvas-content {
    position: relative;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

/* Links del menú */
.nav-item {
    margin-bottom: 15px;
}

/* Pie del menú con botones */
.menu-footer {
    margin-top: auto;
}

/* Responsividad */
@media (max-width: 991px) {
    .navbar-toggler {
        display: block;
    }
}
</style>
