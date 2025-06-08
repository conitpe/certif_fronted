<template>
  <div class="container py-4">
    <div class="row">
      <div class="col-md-8 mx-auto">
        <div class="card">
          <div class="card-header pb-0">
            <h5>{{ titulo }}</h5>
            <Spinner :loading="cargando" message="Cargando" />
          </div>
          <div class="d-flex justify-content-end" v-if="!isCreating">
            <div class="dropdown d-inline-block">
              <button class="btn btn-outline-secondary dropdown-toggle m-2" type="button" id="dropdownMenuButton"
                data-bs-toggle="dropdown" aria-expanded="false">
                Opciones
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton ">
                <li>
                  <a class="dropdown-item text-danger" href="#" @click="deleteUsuario">
                    Eliminar
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="editUsuario">
                    Editar
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <!-- Nombre -->
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre<span class="text-danger">(*)</span></label>
                <input v-model="usuario.nombre" type="text" class="form-control" id="nombre"
                  placeholder="Ingrese el nombre" :disabled="isViewing" required
                  oninvalid="this.setCustomValidity('Por favor ingresa el nombre')"
                  oninput="this.setCustomValidity('')" />
              </div>

              <!-- Apellido -->
              <div class="mb-3">
                <label for="apellido" class="form-label">Apellido<span class="text-danger">(*)</span></label>
                <input v-model="usuario.apellido" type="text" class="form-control" id="apellido"
                  placeholder="Ingrese el apellido" :disabled="isViewing" required
                  oninvalid="this.setCustomValidity('Por favor ingresa el apellido')"
                  oninput="this.setCustomValidity('')" />
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email<span class="text-danger">(*)</span></label>
                <input v-model="usuario.email" type="email" class="form-control" id="email"
                  placeholder="Ingrese el correo electrónico" :disabled="isViewing" required
                  oninvalid="this.setCustomValidity('Por favor ingresa un correo válido')"
                  oninput="this.setCustomValidity('')" />
              </div>

              <!-- DNI -->
              <div class="mb-3">
                <label for="dni" class="form-label">DNI</label>
                <input v-model="usuario.dni" type="text" class="form-control" id="dni"
                  placeholder="Ingrese el DNI (opcional)" :disabled="isViewing" />
              </div>

              <!-- Fecha de Nacimiento -->
              <div class="mb-3">
                <label for="fechaNacimiento" class="form-label">
                  Fecha de Nacimiento
                </label>
                <input v-model="usuario.fecha_de_nacimiento" type="date" class="form-control" id="fechaNacimiento"
                  :disabled="isViewing" :max="maxFechaNacimiento" :min="minFechaNacimiento" />
              </div>

              <!-- Rol -->
              <div class="mb-3">
                <label for="rol" class="form-label">Rol<span class="text-danger">(*)</span></label>
                <select v-model="usuario.rol" class="form-select" id="rol" :disabled="isViewing" required
                  oninvalid="this.setCustomValidity('Por favor selecciona un rol')"
                  oninput="this.setCustomValidity('')">
                  <option value="" disabled>Seleccion rol</option>
                  <option value="administrador">Administrador</option>
                  <option v-show="rol_logueado=='superadministrador'" value="superadministrador">Superadministrador</option>
                  <option value="beneficiario">Beneficiario</option>
                </select>
              </div>

              <!-- Contraseña -->
              <div class="mb-3" v-if="isCreating || isEditing">
                <label for="contrasena" class="form-label">Contraseña<span class="text-danger">(*)</span></label>
                <input v-model="usuario.contrasena" type="password" class="form-control" id="contrasena"
                  placeholder="Ingrese la contraseña" :disabled="isViewing" required
                  oninvalid="this.setCustomValidity('Por favor ingresa la contraseña')"
                  oninput="this.setCustomValidity('')" />
              </div>

              <!-- Botones -->
              <div class="text-center">
                <button v-if="!isViewing" type="submit" class="btn btn-primary me-2">
                  {{ isEditing ? "Actualizar" : "Registrar" }}
                </button>
                <button type="button" class="btn btn-secondary" @click="cancel">
                  {{ isViewing ? "Regresar" : "Cancelar" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/axios";
import Spinner from "../../components/Spinner.vue";
import { showSuccess, showError, showWarning, showAlert } from "@/utils/alertService";
export default {
  components: { Spinner },
  data() {
    return {
      titulo: "",
      subtitulo: "",
      rol_logueado: localStorage.getItem('rol'),
      usuario: {
        nombre: "",
        apellido: "",
        email: "",
        dni: "",
        fecha_de_nacimiento: null,
        rol: "administrador",
        contrasena: "",
        facebook_url: "Perú",
        organizacion_id: localStorage.getItem('organizacion_id'),
        
      },
      cargando: false,
      maxFechaNacimiento: new Date().toISOString().split("T")[0], // Fecha actual
      minFechaNacimiento: new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split("T")[0], // 120 años atrás
    };
  },
  computed: {
    isViewing() {
      return this.$route.name === "UsuariosVer";
    },
    isEditing() {
      return this.$route.name === "UsuariosEditar";
    },
    isCreating() {
      return this.$route.name === "UsuariosCrear";
    },
  },
  methods: {
    async fetchUsuario(id) {

      try {
        this.cargando = true;
        const response = await axios.get(`/usuarios/${id}`);
        this.usuario = response.data;
      } catch (error) {
        showError("fetch");
      } finally {
        this.cargando = false;
      }
    },
    async handleSubmit() {
      const campos = [
        { key: 'nombre', msg: 'El nombre no puede estar vacío ni sólo espacios' },
        { key: 'apellido', msg: 'El apellido no puede estar vacío ni sólo espacios' },
        { key: 'email', msg: 'El email no puede estar vacío ni sólo espacios' },
        { key: 'dni', msg: 'El DNI no puede estar vacío ni sólo espacios' },
        { key: 'contrasena', msg: 'La contraseña no puede estar vacía ni sólo espacios', condition: () => this.isCreating || this.isEditing },
      ];

      for (const { key, msg, condition = () => true } of campos) {
        if (!condition()) continue;
        const valor = this.usuario[key] ?? '';
        if (!valor.trim()) {
          showAlert('error', msg);
          return;
        }
      }
      try {

        this.cargando = true;
        if (this.isEditing) {
          await axios.put(`/usuarios/${this.usuario.id}`, this.usuario);
          showSuccess("update");
        } else {
          await axios.post("/usuarios", this.usuario);
          showSuccess("create");
        }
        this.$router.push("/usuarios");
      } catch (error) {
        const msg =
          error.response?.data?.message ||
          "Ocurrió un error inesperado. Intenta de nuevo.";
        showAlert("error", msg);
      } finally {
        this.cargando = false;
      }
    },
    async deleteUsuario() {
      try {

        const result = await showWarning("confirmDelete");
        if (result.isConfirmed) {

          await axios.delete(`/usuarios/${this.usuario.id}`);
          showSuccess("delete");

          this.$router.push("/usuarios");

        }
      } catch (error) {
        showError("delete");
      } finally {
        this.cargando = false;
      }
    },
    editUsuario() {
      this.$router.push(`/usuarios/editar/${this.usuario.id}`);
    },
    cancel() {
      this.$router.push("/usuarios");
    },
  },
  mounted() {
    const id = this.$route.params.idusuario;
    if (this.isEditing || this.isViewing) {
      this.fetchUsuario(id);
      this.titulo = this.isEditing ? "Editar Usuario" : "Ver Usuario";
    } else {
      this.titulo = "Registrar Usuario";
    }
  },
};
</script>