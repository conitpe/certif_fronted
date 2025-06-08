<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
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
</script>
<template>
    <MenuPrincipal></MenuPrincipal>
    <div class="dashboard-container ">
        <div class="container">
  <!-- Mensaje de bienvenida -->
  <h1 class="welcome-text">Bienvenido,{{ usuario.nombre }} </h1>
        <p class="subtext" v-if="certificados.length > 0">
            ¡Felicitaciones por tu insignia más reciente! 🎉
        </p>
        <p class="subtext" v-else>
            ¡Es momento de obtener tu primer certificado!
        </p>
        <!-- Tarjeta del último badge obtenido -->
        <div class="badge-card" v-for="c in certificados" :key="c.id">
            <img :src="c.badge.ruta_imagen" alt="Insignia" class="badge-image" />
            <div class="badge-info p-4">
                <h3>{{ c.badge.nombre }}</h3>
                <p>{{ c.badge.issuer.razon_social }}</p>
                <div class="buttons">
                    <button class="btn share-btn">Ver</button>
                </div>
            </div>
        </div>


        <!-- Resumen de actividad -->
        <div class="activity-snapshot">
            <h2>Resumen de Actividad</h2>
            <div class="activity-grid">
                <div class="activity-item">
                    <span class="number">{{ Badges }}</span>
                    <span class="label">Insignias Obtenidas</span>
                </div>
                <div class="activity-item">
                    <span class="number">{{ Habildiades }}</span>
                    <span class="label">Habilidades Obtenidas</span>
                </div>
                <div class="activity-item">
                    <span class="number">{{ Criterios }}</span>
                    <span class="label">Criterios Obtenidos</span>
                </div>

            </div>
        </div>
        </div>
      
    </div>
    <FooterPrincipal></FooterPrincipal>


</template>

<script>
import FooterPrincipal from "../../components/FooterPrincipal.vue";
import MenuPrincipal from "../../components/MenuPrincipal.vue";
import axios from "@/axios";
export default {
    name: "DashboardBeneficiario",
    data() {
        return {
            usuario: {
                nombre: "Nombre",
            },
            certificados: [],

            Badges: 0,
            Habildiades: 0,
            Criterios: 0,
            idUsuario: localStorage.getItem('user_id'),
        };

    },
    mounted() {
        this.fetchUsuario(this.idUsuario);
        this.fetchCertificados(this.idUsuario);
    },
    components: {
        MenuPrincipal,
        FooterPrincipal,
    },
    methods: {
        async fetchUsuario(idUsuario) {
            try {
                const response = await axios.get(`/usuarios/${idUsuario}`);
                console.log('data', response.data);

                this.usuario = response.data;
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            }
        },
        async fetchCertificados(idUsuario) {
            try {
                const response = await axios.get(`/certificados/usuario/${idUsuario}`);
                this.certificados = response.data;
                // Inicializar contadores
                let totalBadges = 0;
                let totalHabilidades = new Set(); 
                let totalCriterios = new Set();

                this.certificados.forEach(certificado => {
                    if (certificado.badge) {
                        totalBadges++;

                        if (certificado.badge.habilidades) {
                            certificado.badge.habilidades.forEach(habilidadBadge => {
                                if (habilidadBadge.habilidad) {
                                    totalHabilidades.add(habilidadBadge.habilidad.nombre);
                                }
                            });
                        }

                        if (certificado.badge.criterios) {
                            certificado.badge.criterios.forEach(criterioBadge => {
                                if (criterioBadge.criterio) {
                                    totalCriterios.add(criterioBadge.criterio.nombre);
                                }
                            });
                        }
                    }
                });

                // Asignar los valores al estado
                this.Badges = totalBadges;
                this.Habildiades = totalHabilidades.size;
                this.Criterios = totalCriterios.size;

            } catch (error) {
                console.error("Error al obtener certificados:", error);
            }
        },
    },
};
</script>

<style scoped>.dashboard-container {
    font-family: "Arial", sans-serif;
    color: #1d3b30;
    background: #f8f9f8;
}

/* Badge Card */
.badge-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 1.5rem;
    text-align: center;
}

.badge-image {
    width: 80px;
    height: 80px;
    margin-bottom: 0.5rem;
}

.badge-info {
    width: 100%;
}

/* Activity Snapshot */
.activity-snapshot {
    background: #d4e7dc;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    margin-top: 2rem;
}

.number {
    font-size: clamp(1.5rem, 2vw, 2rem);
    font-weight: bold;
}

.label {
    display: block;
    font-size: clamp(0.8rem, 1vw, 0.9rem);
    color: #555;
}

/* Responsive Design */
@media (min-width: 768px) {
    .badge-card {
        flex-direction: row;
        text-align: left;
        align-items: center;
    }

    .badge-image {
        width: 100px;
        height: 100px;
        margin-right: 1rem;
    }
}

@media (max-width: 375px) {
    .dashboard-container {
        padding: 1rem;
    }

    .activity-grid {
        display: flex;
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}
</style>