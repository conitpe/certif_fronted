<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-md-10 mx-auto">
        <div class="card">
          <div class="card-header pb-0">
            <h3>{{ titulo }}</h3>
            <p v-if="!isCreating">ID : {{ subtitulo }}</p>
            <Spinner :loading="cargando" message="Cargando" />
          </div>
          <div class="d-flex justify-content-end" v-if="!isCreating">
            <div class="dropdown d-inline-block ">
              <button class="btn btn-success m-2" @click="createCertificado"> + Certificado</button>
              <button class="btn btn-outline-secondary dropdown-toggle m-2" type="button" id="dropdownMenuButton"
                data-bs-toggle="dropdown" aria-expanded="false">
                Opciones
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton ">
                <li>
                  <a class="dropdown-item text-danger" href="#" @click="deleteBadge">Eliminar</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="editBadge">Editar</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#" @click="listarCertificados">Listar Certificados</a>
                </li>
              </ul>
            </div>
          </div>

          <div class="card-body">


            <form @submit.prevent="handleSubmit">
              <!-- Nombre -->
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre<span class="text-danger">(*)</span></label>
                <input v-model="badge.nombre" type="text" class="form-control" id="nombre"
                  placeholder="Ingrese el nombre del badge" :disabled="isViewing" required
                  oninvalid="this.setCustomValidity('Por favor ingresa el nombre del badge')"
                  oninput="this.setCustomValidity('')" />
              </div>

              <!-- Imagen -->
              <!-- Imagen -->
              <div class="mb-3">
                <label for="rutaImagen" class="form-label">
                  Agregar Imagen<span class="text-danger">(*)</span>
                </label>
                <input type="file" class="form-control" id="rutaImagen" accept="image/png" @change="handleFileUpload"
                  :disabled="isViewing" :required="!badge.ruta_imagen"
                  oninvalid="this.setCustomValidity('Por favor carga una imagen para el badge (PNG, máx. 2 MB)')"
                  oninput="this.setCustomValidity('')" />
                <small class="form-text text-muted">
                  Formatos: PNG. Tamaño máximo: 2 MB.
                </small>
                <div v-if="badge.ruta_imagen" class="mt-3">
                  <img :src="badge.ruta_imagen" alt="Previsualización de la imagen" class="img-thumbnail"
                    style="max-height: 200px" />
                </div>
              </div>


              <!-- Descripción -->
              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción<span class="text-danger">(*)</span></label>
                <textarea v-model="badge.descripcion" class="form-control" id="descripcion" rows="3"
                  placeholder="Ingrese la descripción del badge" :disabled="isViewing" required
                  oninvalid="this.setCustomValidity('Por favor ingresa la descripción del badge')"
                  oninput="this.setCustomValidity('')"></textarea>
              </div>

              <!-- Enlace Web -->
              <div class="mb-3">
                <label for="enlace_web" class="form-label">Enlace Web</label>
                <input v-model="badge.enlace_web" type="url" class="form-control" id="enlace_web"
                  placeholder="https://example.com" :disabled="isViewing" />
              </div>

              <!-- Atributos -->
              <div class="mb-3">
                <h6>Atributos</h6>
                <label for="tipo" class="form-label">Tipo</label>
                <select v-model="badge.tipo" class="form-select mb-2" :disabled="isViewing" required
                  oninvalid="this.setCustomValidity('Por favor selecciona un tipo de badge')"
                  oninput="this.setCustomValidity('')">
                  <option value="Certificación">Certificación</option>
                  <option value="Logro">Logro</option>
                  <option value="Competencia">Competencia</option>
                  :disabled="isViewing"
                </select>

                <label for="nivel" class="form-label">Nivel</label>
                <select v-model="badge.nivel" class="form-select mb-2" :disabled="isViewing">
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                  :disabled="isViewing"
                </select>

                <label for="tiempoDuracion" class="form-label">Duración (en días)</label>
                <input v-model="badge.tiempo_duracion" type="number" class="form-control mb-2" id="tiempoDuracion"
                  min="1" placeholder="Ingrese duración en días" :disabled="isViewing" />

                <label for="costo" class="form-label">Costo</label>
                <select v-model="badge.costo" class="form-select mb-2" :disabled="isViewing">
                  <option value="Gratis">Gratis</option>
                  <option value="Pago">Pago</option>
                </select>

                <div class="form-check">
                  <input v-model="badge.publico" class="form-check-input" type="checkbox" id="publico"
                    :disabled="isViewing" />
                  <label class="form-check-label" for="publico">
                    Mostrar en vista pública
                  </label>
                </div>
              </div>

              <!-- Criterios -->
              <div class="mb-3">
                <h6>Criterios<span class="text-danger">(*)</span></h6>
                <div class="mb-3">
                  <select v-model="selectedCriterioId" class="form-select" :disabled="isViewing">
                    <option disabled value="">Seleccione un criterio</option>
                    <option v-for="criterio in criterios" :key="criterio.id" :value="criterio.id">
                      {{ criterio.description }}
                    </option>
                  </select>
                  <textarea v-model="criterioDescripcion" class="form-control mt-2"
                    placeholder="Descripción específica del criterio" :disabled="isViewing"></textarea>
                  <button class="btn btn-outline-success mt-2" type="button" @click="addCriterio" :disabled="isViewing">
                    Agregar Criterio
                  </button>
                </div>
                <ul class="list-group">
                  <li v-for="(criterio, index) in badgeCriterios" :key="criterio.id"
                    class="list-group-item d-flex justify-content-between">
                    <span>{{ criterio.description }} – {{ criterio.descripcion }}</span>
                    <button :disabled="isViewing" class="btn btn-outline-danger btn-sm" @click="removeCriterio(index)">
                      Eliminar
                    </button>
                  </li>
                </ul>
                <!-- Mensaje de error si no hay criterios -->
                <p v-if="!isViewing && badgeCriterios.length === 0" class="text-danger mt-2">
                  Por favor agrega al menos un criterio.
                </p>
              </div>

              <!-- Skills -->
              <div class="mb-3">
                <h6>Habilidades<span class="text-danger">(*)</span></h6>
                <div class="position-relative">
                  <input v-model="skillInput" class="form-control"
                    placeholder="Escriba para buscar o agregar una habilidad" @input="filterHabilidades"
                    @keydown.enter.prevent="addSkill" @blur="resetSuggestions" :disabled="isViewing" />
                  <ul v-if="filteredHabilidades.length" class="list-group position-absolute w-100">
                    <li v-for="habilidad in filteredHabilidades" :key="habilidad.id" class="list-group-item"
                      style="cursor: pointer" @click="selectHabilidad(habilidad)">
                      {{ habilidad.nombre }}
                    </li>
                  </ul>
                </div>
                <p v-if="skillError" class="text-danger mt-2">{{ skillError }}</p>
                <div class="d-flex flex-wrap mt-2">
                  <span v-for="(skill, index) in badge.habilidades" :key="skill.id" class="badge bg-primary me-2">
                    {{ skill.nombre }}
                    <i class="fa fa-times ms-1" style="cursor: pointer" @click="removeSkill(index)"></i>
                  </span>
                </div>
                <!-- Mensaje de error si no hay habilidades -->
                <p v-if="!isViewing && badge.habilidades.length === 0" class="text-danger mt-2">
                  Por favor agrega al menos una habilidad.
                </p>
              </div>


              <!-- Botones -->
              <div class="text-center">
                <button v-if="!isViewing" type="submit" class="btn btn-primary me-2" :disabled="badgeCriterios.length === 0 ||
                  badge.habilidades.length === 0
                  ">
                  {{ isEditing ? "Actualizar" : "Crear" }}
                </button>
                <button type="button" class="btn btn-secondary" @click="handleCancel">
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
import { showSuccess, showError, showWarning } from "@/utils/alertService";
export default {
  props: {
    editingBadge: {
      type: Object,
      default: () => null,
    },
  },
  components: { Spinner },
  data() {
    return {
      habilidades: [],
      selectedSkillId: '',
      filteredHabilidades: [],
      skillInput: "",
      skillError: "",
      criterios: [],
      selectedCriterioId: "",
      criterioDescripcion: "",
      badgeCriterios: [],
      titulo: '',
      subtitulo: '',
      idbadge: 0,
      badge: {
        nombre: "",
        descripcion: "",
        ruta_imagen: "",
        tipo: "Certificación",
        nivel: "Principiante",
        tiempo_duracion: null,
        costo: "Gratis",
        publico: false,
        criteria: "",
        habilidades: [],
        enlace_web: "",
        issuer_id: localStorage.getItem('organizacion_id')
      },
      cargando: false,
      //
      plantilla: {
        ruta_fondo: "",
        ubicacion_qr_x: null,
        ubicacion_qr_y: null,
        ubicacion_nombre_x: null,
        ubicacion_nombre_y: null,
        fecha_emision_x: null,
        fecha_emision_y: null,
      },
      elementosDisponibles: [
        { id: "qr", nombre: "QR", x: 0, y: 0, contenido: "Código QR", activo: true },
        { id: "nombre", nombre: "Nombre", x: 50, y: 50, contenido: "Nombre del Usuario", activo: true },
        { id: "fecha_emision", nombre: "Fecha", x: 100, y: 100, contenido: "Fecha de Emisión", activo: true },
      ],
      draggingIndex: null,
      showTemplateDesigner: false,
    }
  },
  computed: {
    isViewing() {
      return this.$route.name === "BadgesVer";

    },
    isEditing() {
      return this.$route.name === "BadgesEditar";
    },
    isCreating() {
      return this.$route.name === "BadgesCrear";
    },
    activeElements() {
      return this.elementosDisponibles.filter((el) => el.activo);
    },
  },

  mounted() {
    this.fetchCriterios();
    this.fetchHabilidades();
    const id = this.$route.params.idbadge;
    if (this.isEditing && id) {
      this.fetchBadge(id);
      this.titulo = 'Editar Badge';
    } else if (this.isViewing && id) {
      this.fetchBadge(id);
      this.titulo = 'Ver Badge';
    } else {
      this.titulo = 'Crear Badge';
    }
    this.subtitulo = id || '';
  },
  methods: {
    editBadge() {
      this.$router.push(`/badges/editar/${this.idbadge}`);
    },
    listarCertificados() {
      this.$router.push(`/certificados/${this.idbadge}`);
    },
    createCertificado() {
      this.$router.push(`/certificados/crear/${this.idbadge}`);
    },
    async fetchHabilidades() {
      try {
        const response = await axios.get('/habilidades');
        this.habilidades = response.data;
      } catch (error) {
        console.error('Error al cargar las habilidades:', error);
      }
    },
    filterHabilidades() {
      if (this.skillInput.trim()) {
        const input = this.skillInput.toLowerCase();
        this.filteredHabilidades = this.habilidades.filter((h) =>
          h.nombre.toLowerCase().includes(input)
        );
      } else {
        this.filteredHabilidades = [];
      }
    },


    selectHabilidad(habilidad) {
      if (
        !this.badge.habilidades.find((h) => h.id === habilidad.id)
      ) {
        this.badge.habilidades.push({ id: habilidad.id, nombre: habilidad.nombre });
      }
      this.skillInput = "";
      this.filteredHabilidades = [];
    },


    async addSkill() {
      const input = this.skillInput.trim();
      if (!input) {
        this.skillError = "Debe ingresar una habilidad.";
        return;
      }
      let habilidad = this.habilidades.find(
        (h) => h.nombre.toLowerCase() === input.toLowerCase()
      );
      if (!habilidad) {
        try {
          const response = await axios.post("/habilidades", { nombre: input });
          habilidad = response.data;
          this.habilidades.push(habilidad);
        } catch (error) {
          showError("fetch");
          this.skillError = "No se pudo agregar la habilidad. Inténtelo nuevamente.";
          return;
        }
      }
      if (
        !this.badge.habilidades.find((h) => h.id === habilidad.id)
      ) {
        this.badge.habilidades.push({ id: habilidad.id, nombre: habilidad.nombre });
      }
      this.skillInput = "";
      this.filteredHabilidades = [];
    },

    removeSkill(index) {
      this.badge.habilidades.splice(index, 1);
    },
    resetSuggestions() {
      setTimeout(() => {
        this.filteredHabilidades = [];
      }, 200);
    },

    async fetchCriterios() {
      try {
        const response = await axios.get("/criterios");
        this.criterios = response.data;
      } catch (error) {
        console.error("Error al cargar los criterios:", error);
        alert("No se pudieron cargar los criterios.");
      }
    },

    addCriterio() {
      if (!this.selectedCriterioId || !this.criterioDescripcion) return;
      const criterio = this.criterios.find((c) => c.id === this.selectedCriterioId);
      this.badgeCriterios.push({ ...criterio, descripcion: this.criterioDescripcion });
      this.selectedCriterioId = "";
      this.criterioDescripcion = "";
    },
    removeCriterio(index) {
      this.badgeCriterios.splice(index, 1);
    },
    async handleSubmit() {
      try {
        this.cargando = true;

        const payload = {
          ...this.badge,
          habilidades: this.badge.habilidades.map((h) => h.id),
          criterios: this.badgeCriterios.map((c) => ({
            criterio_id: c.id,
            descripcion: c.descripcion,
          })),
        };

        if (this.isEditing) {
          await axios.put(`/badges/${this.idbadge}`, payload);
          showSuccess("update");
        } else {
          await axios.post("/badges", payload);
          showSuccess("create");
        }
        this.$router.push('/badges');

        this.handleCancel();
      } catch (error) {
        showError("create");
      }
      finally {
        this.cargando = false;
      }
    },
    async deleteBadge() {
      const result = await showWarning("confirmDelete");
      if (result.isConfirmed) {
        try {
          await axios.delete(`/badges/${this.idbadge}`);
          showSuccess("delete");
          this.$router.push('/badges');
        } catch (error) {
          showError("delete");
        }
      }
    },

    async fetchBadge(id) {
      try {
        this.cargando = true;
        const response = await axios.get(`/badges/${id}`);
        this.badge = response.data;
        this.titulo = this.badge.nombre
        this.subtitulo = this.badge.id
        this.idbadge = id;

        if (this.badge.criterios) {
          this.badgeCriterios = this.badge.criterios.map((c) => ({
            id: c.criterio.id,
            description: c.criterio.description,
            descripcion: c.descripcion,
          }));

          if (this.badge.habilidades) {
            this.badge.habilidades = this.badge.habilidades.map((h) => ({
              id: h.habilidad?.id || h.habilidad_id,
              nombre: h.habilidad?.nombre || '',
            }));
          }
        }

      } catch (error) {
        showError("fetch");
      } finally {
        this.cargando = false;
      }
    },

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post("/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          this.badge.ruta_imagen = response.data.url;
        } catch (error) {
          showError("fetch");
        }
      }
    },
    handleCancel() {
      this.$router.push('/badges');
    },
    toggleTemplateDesigner() {
      this.showTemplateDesigner = !this.showTemplateDesigner;
    },
    uploadBackground(event) {
      const file = event.target.files[0];
      if (file) {
        this.plantilla.ruta_fondo = URL.createObjectURL(file);
      }
    },
    startDrag(index) {
      this.draggingIndex = index;
    },
    endDrag(index, event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      this.elementosDisponibles[index].x = event.clientX - rect.left;
      this.elementosDisponibles[index].y = event.clientY - rect.top;
      this.draggingIndex = null;
    },
    saveTemplate() {
      const payload = {
        ruta_fondo: this.plantilla.ruta_fondo,
        elementos: this.activeElements.map((el) => ({
          id: el.id,
          x: el.x,
          y: el.y,
          contenido: el.contenido,
        })),
      };
      this.$axios.post("/plantillas", payload).then(() => {
        alert("Plantilla guardada con éxito");
      });
    },
    loadTemplate(templateId) {
      axios
        .get(`/plantillas/${templateId}`)
        .then((response) => {
          const plantilla = response.data;
          this.plantilla = {
            ruta_fondo: plantilla.ruta_fondo,
            ubicacion_qr_x: plantilla.ubicacion_qr_x,
            ubicacion_qr_y: plantilla.ubicacion_qr_y,
            ubicacion_nombre_x: plantilla.ubicacion_nombre_x,
            ubicacion_nombre_y: plantilla.ubicacion_nombre_y,
            fecha_emision_x: plantilla.fecha_emision_x,
            fecha_emision_y: plantilla.fecha_emision_y,
          };

          this.elementosDisponibles = [
            {
              id: "qr",
              nombre: "QR",
              activo: true,
              x: plantilla.ubicacion_qr_x,
              y: plantilla.ubicacion_qr_y,
              contenido: plantilla.contenido_qr,
            },
            {
              id: "nombre",
              nombre: "Nombre",
              activo: true,
              x: plantilla.ubicacion_nombre_x,
              y: plantilla.ubicacion_nombre_y,
              contenido: plantilla.contenido_nombre,
            },
            {
              id: "fecha_emision",
              nombre: "Fecha de Emisión",
              activo: true,
              x: plantilla.fecha_emision_x,
              y: plantilla.fecha_emision_y,
              contenido: plantilla.contenido_fecha_emision,
            },
          ];
        })
        .catch((err) => console.error("Error al cargar plantilla", err));
    },
  },

};
</script>

<style scoped>
.list-group-item {
  z-index: 1000;
}

.img-thumbnail {
  max-width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5em 0.75em;
  font-size: 0.9em;
}

.canvas-container {
  position: relative;
  width: 800px;
  height: 600px;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
}

.background {
  width: 100%;
  height: 100%;
  position: absolute;
}

.draggable-element {
  position: absolute;
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px dashed #000;
  cursor: move;
  z-index: 10;
}
</style>