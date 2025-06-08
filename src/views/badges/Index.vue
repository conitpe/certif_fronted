<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">

                    <!-- Header -->
                    <div class="card-header pb-0 d-flex align-items-center">
                        <h6 class="me-auto">Lista de Badges</h6>
                        <button @click="goToCreateBadge()" class="btn btn-primary me-3">
                            + Nuevo Badge
                        </button>

                    </div>
                    <div class="p-4">
                        <input v-model="filtroGlobal" placeholder="Buscar badges" class="search-input form-control " />
                    </div>

                    <!-- Loader -->
                    <div v-if="cargando" class="preloader text-center p-4">
                        <div class="spinner"></div>
                        <p>Cargando badges...</p>
                    </div>

                    <!-- Tabla -->
                    <div v-else class="card-body">
                        <div class="table-responsive p-4">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th class="text-sm">#</th>
                                        <th class="text-sm">NOMBRE</th>
                                        <th class="text-sm">ORGANIZACION</th>
                                        <th class="text-sm">ESTADO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Cambiado a badges -->
                                    <tr v-if="!badges.length">
                                        <td colspan="4" class="text-center text-secondary py-4">
                                            Sin registros
                                        </td>
                                    </tr>
                                    <tr v-for="(badge, i) in badges" :key="badge.id" class="row-hover cursor-pointer"
                                        @click="goToVerBadge(badge.id)">
                                        <td class="text-sm">{{ (paginaActual - 1) * elementosPorPagina + i + 1 }}</td>
                                        <td class=" text-sm">
                                            <img :src="badge.ruta_imagen" width="40" class="me-2" alt="" />
                                            {{ badge.nombre.length > 40 ? badge.nombre.slice(0, 40) + '...' :
                                                badge.nombre }}
                                        </td>
                                        <td class="text-sm">{{ badge.issuer?.razon_social || 'Sin organización' }}</td>
                                        <td :class="{
                                            'text-success': badge.estado === 'activo',
                                            'text-danger': badge.estado === 'borrador'
                                        }">
                                            {{ badge.estado.charAt(0).toUpperCase() + badge.estado.slice(1) }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Paginación -->
                        <div v-if="totalPaginas > 1" class="pagination d-flex justify-content-center p-4">
                            <button class="btn btn-link" :disabled="paginaActual === 1" @click="paginaActual--">
                                ‹ Anterior
                            </button>
                            <span class="align-self-center mx-3">
                                {{ paginaActual }} de {{ totalPaginas }}
                            </span>
                            <button class="btn btn-link" :disabled="paginaActual === totalPaginas"
                                @click="paginaActual++">
                                Siguiente ›
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";

export default {
    data() {
        return {
            badges: [],            // puede venir de data.items o directamente del array
            totalItems: 0,         // total de registros
            filtroGlobal: "",
            paginaActual: 1,
            elementosPorPagina: 20,
            cargando: false,
        };
    },
    computed: {
        totalPaginas() {
            return Math.ceil(this.totalItems / this.elementosPorPagina);
        },
    },
    watch: {
        // cuando cambia página, actualiza URL y datos
        paginaActual() {
            this.updateRoute();
            this.fetchBadges();
        },
        // cuando cambia búsqueda, reinicia página, actualiza URL y datos
        filtroGlobal() {
            this.paginaActual = 1;
            this.updateRoute();
            this.fetchBadges();
        },
    },
    methods: {
        goToCreateBadge() {
            this.$router.push("/badges/crear");
        },
        goToVerBadge(idbadge) {
            this.$router.push(`/badges/ver/${idbadge}`);
        },
        updateRoute() {
            this.$router.replace({
                path: this.$route.path,
                query: {
                    page: this.paginaActual,
                    limit: this.elementosPorPagina,
                    ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
                },
            });
        },

        async fetchBadges() {
            this.cargando = true;
            try {
                const params = {
                    page: this.paginaActual,
                    limit: this.elementosPorPagina,
                    ...(this.filtroGlobal ? { search: this.filtroGlobal } : {}),
                };
                const { data } = await axios.get("/badges", { params });
                if (Array.isArray(data)) {
                    this.badges = data;
                    this.totalItems = data.length;
                } else {
                    this.badges = data.items;
                    this.totalItems = data.total;
                }
            } catch (error) {
                console.error("Error al obtener badges:", error);
            } finally {
                this.cargando = false;
            }
        },
    },
    mounted() {
        // al montar, leemos page/search de la URL
        const q = this.$route.query;
        if (q.page) this.paginaActual = parseInt(q.page, 10);
        if (q.search) this.filtroGlobal = q.search;
        this.fetchBadges();
    },
};
</script>

<style>
/* tus estilos aquí */
</style>