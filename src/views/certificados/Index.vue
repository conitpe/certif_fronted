<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header pb-0">
            <h6 v-if="badgeNombre">Lista de Certificados para el Badge: {{ badgeNombre }}</h6>
            <button @click="goToCrearCertificado()" class="btn btn-primary"> + Nuevo Certificado</button>
            <div v-if="cargando" class="preloader">
              <div class="spinner"></div>
              <p>Cargando certificados...</p>
            </div>
            <input v-model="filtroGlobal" placeholder="Buscar certificados" class="search-input form-control" />
          </div>
          <div class="card-body">
            <div class="table-responsive p-4">
              <table class="table table-sm p-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder opacity-7">
                      Nombre del Propietario
                    </th>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder opacity-7">
                      ID del Certificado
                    </th>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder opacity-7">
                      Fecha de Emisión
                    </th>
                    <th class="text-uppercase text-secondary text-sm font-weight-bolder opacity-7">
                      Fecha de Expiración
                    </th>
                    <th>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!certificadosPaginados.length">
                    <td colspan="4" class="text-center text-secondary py-4">
                      Sin registros
                    </td>
                  </tr>
                  <tr class="row-hover cursor-pointer" v-for="certificado in certificadosPaginados"
                    :key="certificado.id" @click="goToVerCertificado(certificado.id)">
                    <td>
                      <p class="text-sm text-secondary mb-0">
                        {{ certificado.propietario.nombre }} {{ certificado.propietario.apellido }}
                      </p>
                    </td>
                    <td>
                      <p class="text-sm text-secondary mb-0 pt-2">{{ certificado.id }}</p>
                    </td>
                    <td>
                      <p class="text-sm text-secondary mb-0 pt-2">{{ certificado.fecha_emision }}</p>
                    </td>
                    <td>
                      <p class="text-sm text-secondary mb-0 pt-2">
                        {{ certificado.fecha_expiracion || "Sin vencimiento" }}
                      </p>
                    </td>
                    <td>
                      <button @click.stop="descargarCertificado(certificado.id)" class="btn btn-primary">
                        Descargar PDF
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-if="certificados.length" class="pagination p-4">
            <span class="me-2 row-hover"
              :class="{ 'text-muted': paginaActual === 1, 'text-primary cursor-pointer': paginaActual > 1 }"
              :disabled="paginaActual === 1" @click="paginaActual > 1 ? paginaActual-- : null">
              <i class="fas fa-chevron-left"></i> Anterior
            </span>
            <span class="me-2"> {{ paginaActual }} de {{ totalPaginas }}</span>
            <span class="me-2 row-hover"
              :class="{ 'text-muted': paginaActual >= totalPaginas, 'text-primary cursor-pointer': paginaActual < totalPaginas }"
              :disabled="paginaActual >= totalPaginas" @click="paginaActual < totalPaginas ? paginaActual++ : null">
              Siguiente <i class="fas fa-chevron-right"></i>
            </span>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios";
import { showError } from "@/utils/alertService";
export default {
  data() {
    return {
      certificados: [],
      filtroGlobal: "",
      paginaActual: 1,
      elementosPorPagina: 20,
      cargando: false,
      idBadge: null,
      badgeNombre: null,
    };
  },
  computed: {

    certificadosFiltrados() {
  if (!this.filtroGlobal) return this.certificados;

  const normalizar = (texto) =>
    (texto || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();

  const filtro = normalizar(this.filtroGlobal);

  return this.certificados.filter((certificado) => {
    const textoCompleto = `
      ${certificado.id}
      ${certificado.estado}
      ${certificado.fecha_emision}
      ${certificado.badge?.nombre}
      ${certificado.propietario?.nombre}
      ${certificado.propietario?.apellido}
      ${certificado.propietario?.email}
    `;

    return normalizar(textoCompleto).includes(filtro);
  });
}

,
    totalPaginas() {
      return Math.ceil(this.certificadosFiltrados.length / this.elementosPorPagina);
    },
    certificadosPaginados() {
      const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
      const fin = inicio + this.elementosPorPagina;
      return this.certificadosFiltrados.slice(inicio, fin);
    },
  },
  methods: {
    async descargarCertificado(id) {
      try {
        this.cargando = true;
        const response = await axios.get(`/certificados/descargar/${id}/pdf`, {
          responseType: 'blob',
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `certificado-${this.$route.params.idcertificado}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error("Error al descargar el certificado:", error);
        showError("download");
      } finally {
        this.cargando = false;
      }
    },



    goToCrearCertificado() {
      this.$router.push(`/certificados/crear/${this.idBadge}`);
    },
    goToVerCertificado(idCertificado) {
      this.$router.push({
        name: "CertificadosVer",
        params: {
          idcertificado: idCertificado,
          idBadge: this.idbadge
        }
      });
    },
    async fetchCertificados() {
      try {
        this.cargando = true;
        const response = await axios.get(`/certificados?badge_id=${this.idBadge}`);
        this.certificados = response.data;
      } catch (error) {
        console.error("Error al obtener certificados:", error);
      } finally {
        this.cargando = false;
      }
    },
    async fetchBadgeNombre() {
      if (!this.idBadge) return;

      try {
        const response = await axios.get(`/badges/${this.idBadge}`);
        this.badgeNombre = response.data.nombre; 
      } catch (error) {
        console.error("Error al obtener el nombre del badge:", error);
        this.badgeNombre = "Badge desconocido"; 
      }
    },

  },
  mounted() {
    this.idBadge = this.$route.params.idbadge || null;
    if (this.idBadge) {
      this.fetchBadgeNombre(); 
    }
    this.fetchCertificados();
  },
};
</script>

<style></style>