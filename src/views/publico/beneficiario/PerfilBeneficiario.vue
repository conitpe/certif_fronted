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
    <div class="profile-container container">
        <!-- Información del usuario -->
        <div class="profile-header">
            <img src="@/assets/imagenes/perfil.png" alt="Foto de perfil" class="profile-image" />
            <h2>{{ usuario.nombre }} {{ usuario.apellido }}</h2>
            <div>
                <a :href="usuario.perfil_url" target="_blank" class="profile-url">{{ usuario.linkedin_url }}
                    LinkedIn</a>
            </div>
            <Spinner :loading="cargando" message="Cargando" />

        </div>

        
        <button v-if="btneditar" class="btn btn-outline-primary" @click="editar==true ? editar=false : editar=true">
           
           Editar Perfil
        </button>
        <div v-show='editar' class="card p-4">
          
        
        <form @submit.prevent="handleSubmit">
                <!-- Nombre -->
                <div class="mb-3">
                  <label for="nombre" class="form-label">Nombre</label>
                  <input
                    v-model="usuario.nombre"
                    type="text"
                    class="form-control"
                    id="nombre"
                    placeholder="Ingrese el nombre"
                  
                    required
                  />
                </div>
  
                <!-- Apellido -->
                <div class="mb-3">
                  <label for="apellido" class="form-label">Apellido</label>
                  <input
                    v-model="usuario.apellido"
                    type="text"
                    class="form-control"
                    id="apellido"
                    placeholder="Ingrese el apellido"
                  
                    required
                  />
                </div>
  
                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    v-model="usuario.email"
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="Ingrese el correo electrónico"
                    
                    required disabled
                  />
                </div>
  
                <!-- DNI -->
                <div class="mb-3">
                  <label for="dni" class="form-label">DNI</label>
                  <input
                    v-model="usuario.dni"
                    type="text"
                    class="form-control"
                    id="dni"
                    placeholder="Ingrese el DNI (opcional)"
                  
                  />
                </div>
  
                <!-- Fecha de Nacimiento -->
                <div class="mb-3">
                  <label for="fechaNacimiento" class="form-label">
                    Fecha de Nacimiento
                  </label>
                  <input
                    v-model="usuario.fecha_de_nacimiento"
                    type="date"
                    class="form-control"
                    id="fechaNacimiento"
                  />
                </div>
  
               
  
                <!-- Contraseña -->
                <div class="mb-3" >
                  <label for="contrasena" class="form-label">Actualizar Contraseña</label>
                  <input
                    v-model="usuario.contrasena"
                    type="password"
                    class="form-control"
                    id="contrasena"
                    placeholder="Ingrese la contraseña"
                  />
                </div>
  
                <!-- Botones -->
                <div class="text-center">
                  <button
                    type="submit"
                    class="btn btn-primary me-2"
                  >
                    Actualizar
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="editar=false"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
        <!-- Insignias obtenidas -->
        <div class="badges-section">
            <h3>Insignias Obtenidas</h3>
            <div v-if="certificados.length > 0" class="p-4">
                <div  class="row g-5">
                    <div class="col-md-3 card" v-for="certificado in certificados" :key="certificado.id">
                        <router-link :to="`/beneficiario/certificado/${certificado.id}`" class="badge-link">
                            <img :src="certificado.badge.ruta_imagen" alt="Insignia" class="img-fluid p-4" />
                            <div class="">
                                <h6>{{ certificado.badge.nombre }}</h6>
                                <p>{{ certificado.badge.issuer.razon_social }}</p>
                            </div>
                        </router-link>
                    </div>

                </div>
            </div>
            <p v-else>No has obtenido insignias aún.</p>
        </div>

        <!-- Habilidades obtenidas -->
        <div class="card p-4">
            <h3>Habilidades Adquiridas</h3>

            <!-- Lista de habilidades -->
            <div v-if="habilidades.length > 0" class="skills-list">
                <div class="skill-item" v-for="habilidad in habilidades" :key="habilidad">
                    <span class="skill-name">{{ habilidad }} <span class="check-icon">✔</span>
                    </span>

                </div>
            </div>

            <p v-else>No has adquirido habilidades aún.</p>


        </div>



    </div>
    <FooterPrincipal></FooterPrincipal>
</template>

<script>
import FooterPrincipal from "../../components/FooterPrincipal.vue";
import MenuPrincipal from "../../components/MenuPrincipal.vue";
import Spinner from "../../../components/Spinner.vue";
import { showSuccess, showError } from "@/utils/alertService";
import axios from "@/axios";

export default {
    
    name: "PerfilBeneficiario",
    components: {
        MenuPrincipal,
        FooterPrincipal,
        Spinner
    },
    data() {
        return {
            usuario: {
                nombre: "",
                foto: "",
                perfil_publico: false,
                resumen: "",
                perfil_url: "",
            },
            certificados: [],
            habilidades: [],
            totalBadges: 0,
            totalHabilidades: 0,
            totalCriterios: 0,
            cargando:false,
            idUsuario: this.$route.params.idusuario,
            idUsuarioLogueado: localStorage.getItem('user_id'),
            btneditar:false,
            editar:false
        };
    },
    mounted() {
        this.fetchUsuario();
        this.fetchCertificados();
        if(this.idUsuarioLogueado == this.idUsuario){
            this.btneditar=true;
        }
    },
    methods: {
        async fetchUsuario() {
      
            try {
                const response = await axios.get(`/usuarios/${this.idUsuario}`);
                this.usuario = response.data;
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            }
        },
        async handleSubmit() {
        try {
            this.cargando=true;
            await axios.put(`/usuarios/${this.usuario.id}`, this.usuario);
            showSuccess("create");
          this.editar=false;
          
        } catch (error) {
          showError("general");
        }
        finally {
            this.cargando = false;
        }
      },
        async fetchCertificados() {
            try {
                const response = await axios.get(`/certificados/usuario/${this.idUsuario}`);
                this.certificados = response.data;

                let badgesSet = new Set();
                let habilidadesSet = new Set();
                let criteriosSet = new Set();
                let listaHabilidades = []; // Guardará la lista de nombres de habilidades

                this.certificados.forEach(certificado => {
                    if (certificado.badge) {
                        badgesSet.add(certificado.badge.id);

                        // Agregar habilidades asociadas al badge
                        if (certificado.badge.habilidades) {
                            certificado.badge.habilidades.forEach(habilidadBadge => {
                                if (habilidadBadge.habilidad) {
                                    habilidadesSet.add(habilidadBadge.habilidad.nombre);
                                    listaHabilidades.push(habilidadBadge.habilidad.nombre);
                                }
                            });
                        }

                        // Agregar criterios asociados al badge
                        if (certificado.badge.criterios) {
                            certificado.badge.criterios.forEach(criterioBadge => {
                                if (criterioBadge.criterio) {
                                    criteriosSet.add(criterioBadge.criterio.nombre);
                                }
                            });
                        }
                    }
                });

                // Guardar los valores en el estado
                this.totalBadges = badgesSet.size;
                this.totalHabilidades = habilidadesSet.size;
                this.totalCriterios = criteriosSet.size;
                this.habilidades = Array.from(habilidadesSet); // Convertir Set a Array para mostrar en la UI
                this.listaHabilidades = listaHabilidades; // Almacenar lista completa de habilidades

            } catch (error) {
                console.error("Error al obtener certificados:", error);
            }
        },
        async togglePerfilPublico() {
            this.usuario.perfil_publico = !this.usuario.perfil_publico;
            try {
                await axios.put(`/usuarios/${this.idUsuario}`, {
                    perfil_publico: this.usuario.perfil_publico,
                });
            } catch (error) {
                console.error("Error al actualizar perfil:", error);
            }
        }
    }
};
</script>

<style scoped>
.profile-container {
    padding: 2rem;
    font-family: "Arial", sans-serif;
    color: #1d3b30;
    background: #f8f9f8;
}

.profile-header {
    text-align: center;
    margin-bottom: 2rem;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
}

.profile-url {
    display: block;
    color: #007bff;
    text-decoration: none;
    margin-top: 5px;
}

.edit-btn {
    background: #0d6efd;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.badges-section,
.skills-section,
.activity-snapshot {
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
}

.badge-card {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 10px;
    text-align: center;
    width: 250px;
}

.badge-image {
    width: 100%;
    height: 80px;
    object-fit: contain;
}

.skill-badge {
    display: inline-block;
    background: #e3f3e6;
    padding: 5px 10px;
    border-radius: 15px;
    margin: 5px;
    font-size: 0.9rem;
    color: #1d3b30;
}
</style>
