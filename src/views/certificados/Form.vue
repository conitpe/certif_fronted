<template>
  <div class="container mt-4">
    <h2>Certificador: {{ badgeNombre }}</h2>
    <p>Ingrese la información requerida para emitir una insignia a un individuo.</p>

    <Spinner :loading="cargando" />

    <div class="d-flex justify-content-end" v-if="!isCreating">
      <div class="dropdown d-inline-block">
        <button class="btn btn-secondary m-2" @click="cancelar">
          {{ isViewing ? "Regresar" : "Cancelar" }}
        </button>
        <button
          class="btn btn-outline-secondary dropdown-toggle m-2"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Opciones
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
          <li>
            <a class="dropdown-item text-danger" href="#" @click="deleteCertificado">
              Eliminar
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click="editCertificado">
              Editar
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Beneficiario -->
    <div class="card mb-4">
      <div class="card-header">
        <h5>Beneficiario</h5>
      </div>
      <div class="card-body">
        <form ref="form" @submit.prevent="handleSubmit">
          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email<span class="text-danger">(*)</span></label>
            <input
              type="email"
              id="email"
              v-model="propietario.email"
              class="form-control"
              placeholder="Ingrese el correo electrónico"
               :disabled="isViewing || isEditing"
              required
              oninvalid="this.setCustomValidity('Por favor ingrese correo')"
              oninput="this.setCustomValidity('')"
            />
          </div>

          <!-- DNI -->
          <div class="mb-3">
            <label for="dni" class="form-label">Número de Documento de Identidad <span class="text-danger">(*)</span></label>
            <input
              type="text"
              id="dni"
              v-model="propietario.dni"
              class="form-control"
              placeholder="Ingrese el DNI"
              :disabled="isViewing || isEditing"
              required
              oninvalid="this.setCustomValidity('Por favor ingresa Documento de Identidad')"
              oninput="this.setCustomValidity('')"
            />
          </div>

          <!-- Nombre -->
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombres<span class="text-danger">(*)</span></label>
            <input
              type="text"
              id="nombre"
              v-model="propietario.nombre"
              class="form-control"
              placeholder="Ingrese los nombres"
              :disabled="isViewing || isEditing"
              required
              oninvalid="this.setCustomValidity('Por favor ingresa nombres')"
              oninput="this.setCustomValidity('')"
            />
          </div>

          <!-- Apellido -->
          <div class="mb-3">
            <label for="apellido" class="form-label">Apellidos<span class="text-danger">(*)</span></label>
            <input
              type="text"
              id="apellido"
              v-model="propietario.apellido"
              class="form-control"
              placeholder="Ingrese los apellidos"
               :disabled="isViewing || isEditing"
              required
              oninvalid="this.setCustomValidity('Por favor ingresa apellidos')"
              oninput="this.setCustomValidity('')"
            />
          </div>

          <!-- País -->
          <div class="mb-3">
            <label for="pais" class="form-label">País</label>
            <select id="pais" v-model="propietario.pais" class="form-select"  :disabled="isViewing || isEditing">
              <option value="Perú">Perú</option>
              <option value="Chile">Chile</option>
              <option value="Colombia">Colombia</option>
            </select>
          </div>

          <!-- Fecha de Vencimiento -->
          <div class="mb-3">
            <h5>Vencimiento</h5>
            <label>
              <input type="radio" value="sin_vencimiento" v-model="vencimiento" :disabled="isViewing" />
              Sin Vencimiento
            </label>
            <label class="ms-3">
              <input type="radio" value="expira_en" v-model="vencimiento" :disabled="isViewing" />
              Expira En
            </label>
            <input
              v-if="vencimiento === 'expira_en'"
              type="date"
              v-model="fechaVencimiento"
              class="form-control mt-2"
              :disabled="isViewing"
              required
            />
          </div>

          <!-- Notificación -->
          <div class="mb-3">
            <h5>Notificación</h5>
            <label for="idioma" class="form-label">Idioma de Correo Electrónico</label>
            <select id="idioma" v-model="idioma" class="form-select" :disabled="isViewing">
              <option value="Español">Español</option>
              <option value="Inglés">Inglés</option>
            </select>
          </div>

          <!-- Botón de Envío -->
          <button v-if="!isViewing" type="submit" class="btn btn-primary me-2">
            {{ isEditing ? "Actualizar" : "Emitir" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
import Spinner from "../../components/Spinner.vue";
import { showSuccess, showError, showWarning } from "@/utils/alertService";

export default {
  name: "Certificador",
  components: { Spinner },
  data() {
    return {
      propietario: {
        dni: "",
        facebook_url: "Perú",
        nombre: "",
        apellido: "",
        email: "",
        fecha_de_nacimiento: null,
        organizacion_id: localStorage.getItem("organizacion_id"),
      },
      vencimiento: "sin_vencimiento",
      fechaVencimiento: "",
      idioma: "Español",
      idcertificado: "",
      idBadge: "",
      badgeNombre: "",
      cargando: false,
    };
  },
  computed: {
    isViewing() {
      return this.$route.name === "CertificadosVer";
    },
    isEditing() {
      return this.$route.name === "CertificadosEditar";
    },
    isCreating() {
      return this.$route.name === "CertificadosCrear";
    },
  },
  watch: {
    "propietario.email"(nuevoValor) {
      if (nuevoValor) {
        this.buscarParticipantePorCorreo();
      }
    },
  },
  methods: {
    handleSubmit() {
      const form = this.$refs.form;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      this.isEditing ? this.actualizarCertificado() : this.emitirCertificado();
    },

    async buscarParticipantePorCorreo() {
      if (!this.propietario.email) return;
      try {
        const response = await axios.get(
          `/usuarios/buscar?email=${encodeURIComponent(this.propietario.email)}`
        );
        if (response.data) {
          this.propietario.dni = response.data.dni || "";
          this.propietario.nombre = response.data.nombre || "";
          this.propietario.apellido = response.data.apellido || "";
          this.propietario.pais = response.data.pais || "Perú";
        }
      } catch (error) {
        console.error("Error al buscar participante:", error.response?.data || error.message);
      }
    },

    async emitirCertificado() {
      try {
        this.cargando = true;
        const payload = {
          propietario: this.propietario,
          fecha_expiracion:
            this.vencimiento === "sin_vencimiento" ? null : this.fechaVencimiento,
          idioma: this.idioma,
          badge_id: this.idBadge,
        };
        const response = await axios.post(`/certificados/emitir`, payload);
        console.log(response);
        
        showSuccess("create");
        this.$router.push(`/certificados/${this.idBadge}`);
      } catch (error) {
        const errMsg = error.response?.data?.message || error.message;
        if (errMsg.includes("plantilla predeterminada")) {
          showWarning(errMsg);
        } else {
          showError("create");
        }
      } finally {
        this.cargando = false;
      }
    },

    async actualizarCertificado() {
      try {
        this.cargando = true;
        const usuarioPayload = {
          nombre: this.propietario.nombre,
          apellido: this.propietario.apellido,
          email: this.propietario.email,
          dni: this.propietario.dni,
          pais: this.propietario.pais,
          fecha_de_nacimiento: this.propietario.fecha_de_nacimiento,
        };
        await axios.put(`/usuarios/${this.propietario.id}`, usuarioPayload);

        const certificadoPayload = {
          propietario: this.propietario.id,
          fecha_expiracion:
            this.vencimiento === "sin_vencimiento" ? null : this.fechaVencimiento,
          idioma: this.idioma,
          badge_id: this.idBadge,
        };
        await axios.put(`/certificados/${this.idcertificado}`, certificadoPayload);

        showSuccess("update");
        this.$router.push(`/certificados/${this.idBadge}`);
      } catch (error) {
        showError("update");
      } finally {
        this.cargando = false;
      }
    },

    cancelar() {
      this.$router.push(`/certificados/${this.idBadge}`);
    },

    async fetchCertificado(id) {
      try {
        this.cargando = true;
        const response = await axios.get(`/certificados/${id}`);
        this.propietario = response.data.propietario;
        this.vencimiento = response.data.fecha_expiracion
          ? "expira_en"
          : "sin_vencimiento";
        this.fechaVencimiento = response.data.fecha_expiracion;
        this.idioma = response.data.idioma;
        
        
      } catch (error) {
        showError("fetch");
      } finally {
        this.cargando = false;
      }
    },

    async deleteCertificado() {
      try {
        const result = await showWarning("confirmDelete");
        if (result.isConfirmed) {
          this.cargando = true;
          await axios.delete(`/certificados/${this.idcertificado}`);
          showSuccess("delete");
          this.$router.push(`/certificados/${this.idBadge}`);
        }
      } catch (error) {
        showError("delete");
      } finally {
        this.cargando = false;
      }
    },

    editCertificado() {
      this.$router.push(
        `/certificados/${this.idBadge}/editar/${this.idcertificado}`
      );
    },
  },
  mounted() {
    this.idcertificado = this.$route.params.idcertificado;
    this.idBadge = this.$route.params.idbadge;
    if (this.isEditing || this.isViewing) {
      this.fetchCertificado(this.idcertificado);
    }
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-top: 1rem;
}

.card-header {
  background-color: #f8f9fa;
  font-weight: bold;
}
</style>
