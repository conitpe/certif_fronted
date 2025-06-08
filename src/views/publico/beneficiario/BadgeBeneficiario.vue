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

    <div class="container" v-if="vistabadge">
        <div class="bg bg-gray-100 p-4">
            <div class="row">
                <div class="col-md-2">
                    <img src="@/assets/imagenes/perfil.png" width="40px" alt="" srcset="">
                </div>
                <div class="col-md-6">
                    <p>Esta insignia fue emitida a {{ certificado.propietario?.nombre }} {{
                        certificado.propietario?.apellido }} el {{ certificado.fecha_emision }}.
                    </p>


                </div>
            </div>

        </div>
        <div v-if="loading">Cargando...</div>
        <div v-else class="mt-4">
            <div class="card p-4">
                <div class="row g-8">
                    <div class="col-md-4">
                        <img :src="certificado.badge?.ruta_imagen" alt="Badge" class="img-fluid" />

                    </div>
                    <div class="col-md-8">

                        <h2>{{ certificado.badge?.nombre }}</h2>
                        <button class="btn btn-primary m-2" @click="compartirLinkedin">Compartir en linkedin</button>
                        <button @click.stop="descargarCertificado(certificado.id)" class="m-2 btn btn-outline-primary">
                            Descargar PDF
                        </button>
                        <p><strong>Emisor:</strong> {{ certificado.badge?.issuer?.razon_social }}</p>
                        <p>La persona merecedora de esta insignia ha tenido una participación activa desde el comienzo
                            en el desarrollo del proyecto de insignias digitales en su organización.</p>
                        <div>
                            <h6>Habilidades</h6>
                            <ul>
                                <li v-for="habilidad in certificado.badge?.habilidades" :key="habilidad">{{
                                    habilidad.habilidad.nombre }}</li>
                            </ul>
                        </div>
                        <div>
                            <h6>Criterios</h6>
                            <ul>
                                <li v-for="criterio in certificado.badge?.criterios" :key="criterio">{{
                                    criterio.descripcion }}</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="container text-center" >
            <h1 class="title">Certificado no encontrado</h1>
            <p>El certificado solicitado no existe o no se encuentra disponible.</p>
        </div>
       
    </div>
    <FooterPrincipal></FooterPrincipal>
</template>

<script>
import axios from "@/axios";
import { useRoute } from "vue-router";
import MenuPrincipal from "../../components/MenuPrincipal.vue";
import FooterPrincipal from "../../components/FooterPrincipal.vue";

export default {
    name: "BadgeBeneficiario",
    components: {
        MenuPrincipal,
        FooterPrincipal,
    },
    data() {
        return {
            certificado: {},
            loading: true,
            vistabadge: false,
        };
    },
    mounted() {
        this.fetchCertificado();
    },
    methods: {
        async fetchCertificado() {
            const route = useRoute();
            const idCertificado = route.params.idcertificado;
            try {
            const response = await axios.get(`/certificados/${idCertificado}`);
            this.certificado = response.data;
            this.vistabadge = true;
            } catch (error) {
            console.error("Error al obtener el certificado:", error);
            this.vistabadge = false;
            } finally {
            this.loading = false;
            }
        },

        compartirLinkedin() {
            if (!this.certificado || !this.certificado.badge) {
                console.error("No se pudo compartir: certificado o badge es undefined");
                alert("Error: No se puede compartir este certificado.");
                return;
            }

            // Extraer los datos del certificado
            const certId = this.certificado.id; // Generar un ID único para LinkedIn
            const nombreCertificado = this.certificado.badge?.nombre;
            const organizacion = "Global Tecnologías Academy"; // Nombre de la empresa en LinkedIn
            const issueYear = this.certificado.fecha_emision.substring(0, 4); // Año de emisión
            const issueMonth = this.certificado.fecha_emision.substring(5, 7); // Mes de emisión
            const urlCertificado = "http://certif.digital/beneficiario/certificado/02e58c487411c0b42fa6c495e39f75f7"; // URL pública del certificado
            //const organizationId = "19218599"; // ID de la empresa en LinkedIn (si está disponible)

            // Construcción de la URL para agregar el certificado en LinkedIn
            const link = `https://www.linkedin.com/in/me/edit/forms/certification/new/?certId=${certId}&certUrl=${encodeURIComponent(urlCertificado)}&isFromA2p=true&issueMonth=${issueMonth}&issueYear=${issueYear}&name=${encodeURIComponent(nombreCertificado)}&organizationName=${encodeURIComponent(organizacion)}`;

            // Abrir LinkedIn con los datos prellenados
            window.open(link, "_blank");
        }
        ,
        async descargarCertificado(id) {
            try {
                this.cargando = true; // Mostrar el indicador de carga

                const response = await axios.get(`/certificados/descargar/${id}/pdf`, {
                    responseType: 'blob', // 📌 Importante: Indica que esperamos un archivo binario (PDF)
                });

                // Crear un Blob con la respuesta del servidor
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);

                // Crear un enlace y simular un clic para descargar el archivo
                const a = document.createElement('a');
                a.href = url;
                a.download = `certificado-${this.$route.params.idcertificado}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                // Liberar la memoria del navegador
                window.URL.revokeObjectURL(url);

                alert("Certificado descargado con éxito.");
            } catch (error) {
                console.error("Error al descargar el certificado:", error);
                alert("Ocurrió un error al descargar el certificado.");
            } finally {
                this.cargando = false; // Ocultar el indicador de carga
            }
        },





    },
};
</script>

<style scoped>
.container {
    padding: 2rem;
}

.title {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1rem;
}



.certificado-card {
    display: flex;
    background: white;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    align-items: center;
}

.badge-image {
    width: 150px;
    height: 150px;
    margin-right: 1rem;
}

.certificado-info {
    flex: 1;
}

.btn-download {
    background: #0d6efd;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
}
</style>
