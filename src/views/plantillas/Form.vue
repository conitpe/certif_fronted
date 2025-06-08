<template>
  <div class="container-fluid mt-4">
    <h2>{{ titulo }}</h2>
    <p>Configura el diseño de la plantilla, ajusta posiciones y estilos, y guarda los datos en el sistema.</p>

    <div class="d-flex justify-content-end" v-if="!isCreating">
      <div class="dropdown d-inline-block">
        <button class="btn btn-outline-secondary dropdown-toggle m-2" type="button" id="dropdownMenuButton"
          data-bs-toggle="dropdown" aria-expanded="false">
          Opciones
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
          <li>
            <a class="dropdown-item text-danger" href="#" @click="deletePlantilla">
              Eliminar
            </a>
          </li>
          <li>
            <a class="dropdown-item" href="#" @click="editPlantilla">
              Editar
            </a>
          </li>
        </ul>
      </div>
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <div class="col-md-6">
          <label for="backgroundUpload" class="form-label">Subir Fondo <span class="text-danger">(*)</span></label>
          <input type="file" id="backgroundUpload" class="form-control" @change="uploadBackground" :disabled="isViewing"
            accept="image/png" :required="!plantilla.ruta_fondo"
            oninvalid="this.setCustomValidity('Por favor sube una imagen de fondo (PNG), máximo 2 MB')"
            oninput="this.setCustomValidity('')" />
          <p v-if="subiendoImagen">Subiendo imagen...</p>
        </div>
        <div class="col-md-6">
          <label for="titulo">Título <span class="text-danger">(*)</span>:</label>
          <input type="text" id="titulo" v-model="titulo" class="form-control mb-2" :disabled="isViewing" required
            oninvalid="this.setCustomValidity('Por favor ingresa el título de la plantilla')"
            oninput="this.setCustomValidity('')" />
        </div>
      </div>


      <div class="row mb-3">
        <div class="col-md-6">
          <label for="badge">Badge <span class="text-danger">(*)</span>:</label>
          {{ badge_id }}
          <v-select v-model="badge_id" :options="badges" label="nombre" :track-by="'id'" :disabled="isViewing"
            :reduce="badge => badge.id" placeholder="Escribe para buscar un badge..." class="" required />
        </div>
        <div class="col-md-6">
          <label for="estado">Estado <span class="text-danger">(*)</span>:</label>
          <select id="estado" v-model="es_predeterminada" class="form-select" :disabled="isViewing" required>
            <option value="true">Predeterminado</option>
            <option value="false">Desactivado</option>
          </select>
        </div>
      </div>

      <div class="mb-3">
        <div class="row">
          <div class="col-md-4 border p-2 ">
            <label for="titulo">Nombres <span class="text-danger">(*)</span></label>
            <div class="editor-toolbar">
              <select v-model="nombre.font" class="form-select me-2" :disabled="isViewing" required
                oninvalid="this.setCustomValidity('El campo es obligatorio')" oninput="this.setCustomValidity('')">
                <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
              </select>
              <select v-model="nombre.fontSize" class="form-select me-2" :disabled="isViewing" required
                oninvalid="this.setCustomValidity('Elige una tipografía para el nombre')"
                oninput="this.setCustomValidity('')">
                <option v-for="size in fontSizes" :key="size" :value="size">{{ size }} px</option>
              </select>
              <input type="color" v-model="nombre.color" class="form-control-color me-2" :disabled="isViewing"
                required />
            </div>
            <div class="mt-2 row">
              <div class="col-auto">
                <label for="nombreX" class="form-label">Posición X <span class="text-danger">(*)</span></label>
                <input type="number" id="nombreX" v-model.number="nombre.x" class="form-control" :disabled="isViewing"
                  required oninvalid="this.setCustomValidity('Ingresa la posición X )"
                  oninput="this.setCustomValidity('')" />
              </div>
              <div class="col-auto">
                <label for="nombreY" class="form-label">Posición Y</label>
                <input type="number" id="nombreY" v-model.number="nombre.y" class="form-control" :disabled="isViewing"
                  required oninvalid="this.setCustomValidity('Ingresa la posición y')"
                  oninput="this.setCustomValidity('')" />
              </div>
            </div>

          </div>
          <div class="col-md-4 border p-2">
            <div class="mb-3">
              <label for="titulo">Fecha de Emisión> <span class="text-danger">(*)</span></label>
              <div class="editor-toolbar">
                <select v-model="fecha.font" class="form-select me-2" :disabled="isViewing" required>
                  <option v-for="font in fonts" :key="font" :value="font">{{ font }}</option>
                </select>
                <select v-model="fecha.fontSize" class="form-select me-2" :disabled="isViewing" required>
                  <option v-for="size in fontSizes" :key="size" :value="size">{{ size }} px</option>
                </select>
                <input type="color" v-model="fecha.color" class="form-control-color me-2" :disabled="isViewing"
                  required />
              </div>
              <div class="mt-2 row">
                <div class="col-auto">
                  <label for="fechaX">Posición X:</label>
                  <input type="number" id="fechaX" v-model.number="fecha.x" class="form-control" :disabled="isViewing"
                    required oninvalid="this.setCustomValidity('Ingresa la posición X ')"
                    oninput="this.setCustomValidity('')" />
                </div>
                <div class="col-auto">
                  <label for="fechaY">Posición Y:</label>
                  <input type="number" id="fechaY" v-model.number="fecha.y" class="form-control" :disabled="isViewing"
                    required oninvalid="this.setCustomValidity('Ingresa la posición y ')"
                    oninput="this.setCustomValidity('')" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 border p-2">
            <div class="mb-3">
              <label for="Certificado">Id Certificado<span class="text-danger">(*)</span></label>
              <div class="mt-2 row">
                <div class="col-auto">
                  <label for="idcertificadoX">Posición X:</label>
                  <input type="number" id="idcertificadoX" v-model.number="idcertificado.x" class="form-control "
                    :disabled="isViewing" required />
                </div>
                <div class="col-auto">
                  <label for="idcertificadoY">Posición Y:</label>
                  <input type="number" id="idcertificadoY" v-model.number="idcertificado.y" class="form-control "
                    :disabled="isViewing" required />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 border p-2">
            <div class="mb-3 ">
              <label for="qr">QR <span class="text-danger">(*)</span></label>
              <div class="mt-2 row">
                <div class="col-auto">
                  <label for="qrX">Posición X:</label>
                  <input type="number" id="qrX" v-model.number="qr.x" class="form-control" :disabled="isViewing"
                    required oninvalid="this.setCustomValidity('Ingresa la posición X ')"
                    oninput="this.setCustomValidity('')" />
                </div>
                <div class="col-auto">
                  <label for="qrY">Posición Y:</label>
                  <input type="number" id="qrY" v-model.number="qr.y" class="form-control" :disabled="isViewing"
                    required oninvalid="this.setCustomValidity('Ingresa la posición y')"
                    oninput="this.setCustomValidity('')" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4 border p-2">
            <div class="mb-3">
              <label for="imagenbadge">Badge Imagen<span class="text-danger">(*)</span></label>
              <div class="mt-2 row">
                <div class="col-auto">
                  <label for="imagenbadgeX">Posición X:</label>
                  <input type="number" id="imagenbadgeX" v-model.number="imagenbadge.x" class="form-control"
                    :disabled="isViewing" required oninvalid="this.setCustomValidity('Ingresa la posición x')"
                    oninput="this.setCustomValidity('')" />
                </div>
                <div class="col-auto">
                  <label for="imagenbadgeY">Posición Y:</label>
                  <input type="number" id="imagenbadgeY" v-model.number="imagenbadge.y" class="form-control "
                    :disabled="isViewing" required oninvalid="this.setCustomValidity('Ingresa la posición y')"
                    oninput="this.setCustomValidity('')" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Canvas -->
      <div class="canvas-container" ref="canvas">
        <img v-if="plantilla.ruta_fondo" :src="plantilla.ruta_fondo" alt="Fondo de la Plantilla" class="background" />

        <!-- Nombre -->
        <div class="draggable-element"
          :style="{ left: `${nombre.x}px`, top: `${nombre.y}px`, fontSize: `${nombre.fontSize}px`, color: nombre.color, fontFamily: nombre.font }"
          @mousedown="startDrag('nombre', $event)">
          Nombre
        </div>

        <!-- Fecha de Emisión -->
        <div class="draggable-element"
          :style="{ left: `${fecha.x}px`, top: `${fecha.y}px`, fontSize: `${fecha.fontSize}px`, color: fecha.color, fontFamily: fecha.font }"
          @mousedown="startDrag('fecha', $event)">
          Fecha de Emisión
        </div>

        <!-- idcertificado -->
        <div class="draggable-element" :style="{ left: `${idcertificado.x}px`, top: `${idcertificado.y}px` }"
          @mousedown="startDrag('idcertificado', $event)">
          idcertificado
        </div>

        <!-- QR -->
        <div class="draggable-element" :style="{ left: `${qr.x}px`, top: `${qr.y}px` }"
          @mousedown="startDrag('qr', $event)">
          <img src="@/assets/imagenes/qr_example.png" width="100px" alt="qr" class="logo" />

        </div>
        <div class="draggable-element" :style="{ left: `${imagenbadge.x}px`, top: `${imagenbadge.y}px` }"
          @mousedown="startDrag('imagenbadge', $event)">
          <img src="@/assets/imagenes/badge.png" width="100px" alt="Logo" class="logo" />

        </div>

      </div>

      <div class="mt-4 text-center">
        <button type="submit" class="btn btn-success me-2">
          {{ isEditing ? "Actualizar Plantilla" : "Guardar Plantilla" }}
        </button>
        <button class="btn btn-secondary" @click="cancel">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "@/axios";
import { showSuccess, showError, showWarning } from "@/utils/alertService";
export default {
  data() {
    return {
      subiendoImagen: false,
      titulo: "",
      descripcion: "--",
      estado: "publicado",
      organizacion_id: localStorage.getItem('organizacion_id'),
      badge_id: null,
      badges: [],

      plantilla: {
        ruta_fondo: "",
      },
      nombre: {
        x: 410,
        y: 260,
        font: "Arial",
        fontSize: "48",
        color: "#000000",
      },
      fecha: {
        x: 430,
        y: 460,
        font: "Arial",
        fontSize: "16",
        color: "#000000",
      },
      idcertificado: {
        x: 80,
        y: 600,
      },
      qr: {
        x: 80,
        y: 500,
      },
      imagenbadge: {
        x: 800,
        y: 50,
      },
      es_predeterminada: true,
      dragging: null,
      dragStart: { x: 0, y: 0 },
      fonts: ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"],
      fontSizes: ["12", "14", "16", "18", "24", "32", "48"],
      fileInput: null,
      provicional: {}
    };
  },
  watch: {
    badge_id(newValue) {
      if (typeof newValue === "object" && newValue !== null) {
        this.badge_id = newValue.id; // 🔹 Guarda solo el ID en lugar del objeto completo
      }
    }
  },

  computed: {
    isViewing() {
      return this.$route.name === "PlantillasVer";
    },
    isEditing() {
      return this.$route.name === "PlantillasEditar";
    },
    isCreating() {
      return this.$route.name === "PlantillasForm";
    },
  },
  methods: {
    uploadBackground(event) {
      this.fileInput = event.target.files[0];
      if (this.fileInput) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.plantilla.ruta_fondo = e.target.result;
        };
        reader.readAsDataURL(this.fileInput);
      }
    },
    handleSubmit() {
      if (this.isEditing) {
        this.updatePlantilla();
      } else {
        this.uploadImageAndSaveTemplate();
      }
    }
    ,
    uploadImageAndSaveTemplate() {
      if (!this.fileInput) {
        showError("create", "Por favor, selecciona una imagen.");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.fileInput);

      this.subiendoImagen = true;

      axios
        .post("/upload", formData)
        .then((response) => {
          const rutaFondo = response.data.url;
          this.plantilla.ruta_fondo = rutaFondo;

          const payload = {
            titulo: this.titulo,
            descripcion: this.descripcion,
            estado: this.estado,
            badge_id: this.badge_id,
            ruta_fondo: rutaFondo,
            ubicacion_nombre_x: this.nombre.x,
            ubicacion_nombre_y: this.nombre.y,

            contenido_nombre: `<span style="font-family: ${this.nombre.font}; font-size: ${this.nombre.fontSize}px; color: ${this.nombre.color};">Nombre</span>`,
            ubicacion_qr_x: this.qr.x,
            ubicacion_qr_y: this.qr.y,

            fecha_emision_x: this.fecha.x,
            fecha_emision_y: this.fecha.y,
            contenido_fecha_emision: `<span style="font-family: ${this.fecha.font}; font-size: ${this.fecha.fontSize}px; color: ${this.fecha.color};">Fecha de Emisión</span>`,

            id_certificado_x: this.idcertificado.x,
            id_certificado_y: this.idcertificado.y,

            badge_x: this.imagenbadge.x,
            badge_y: this.imagenbadge.y,

            es_predeterminada: this.es_predeterminada,
            organizacion_id: this.organizacion_id
          };



          return axios.post("/plantillas-certificados", payload);
        })
        .then(() => {
          showSuccess("create");
          this.subiendoImagen = false;
          this.$router.push({ path: "/plantillas", name: "Plantillas" });
        })
        .catch((error) => {
          showError("create");
          console.error("Error:", error.response?.data || error.message);
          this.subiendoImagen = false;
        });
    },
    async updatePlantilla() {
      if (this.fileInput) {
        const formData = new FormData();
        formData.append("file", this.fileInput);

        try {
          const response = await axios.post("/upload", formData);
          this.plantilla.ruta_fondo = response.data.url;
        } catch (error) {
          showError("update");
          return;
        }
      }
      const payload = {
        titulo: this.titulo,
        estado: this.estado,
        badge_id: this.badge_id,
        ruta_fondo: this.plantilla.ruta_fondo,
        ubicacion_nombre_x: this.nombre.x,
        ubicacion_nombre_y: this.nombre.y,
        ubicacion_qr_x: this.qr.x,
        ubicacion_qr_y: this.qr.y,

        id_certificado_x: this.idcertificado.x,
        id_certificado_y: this.idcertificado.y,

        badge_x: this.imagenbadge.x,
        badge_y: this.imagenbadge.y,

        fecha_emision_x: this.fecha.x,
        fecha_emision_y: this.fecha.y,

        organizacion_id: this.organizacion_id,

        contenido_nombre: `<span style="font-family: ${this.nombre.font}; font-size: ${this.nombre.fontSize}px; color: ${this.nombre.color};">Nombre</span>`,
        contenido_fecha_emision: `<span style="font-family: ${this.fecha.font}; font-size: ${this.fecha.fontSize}px; color: ${this.fecha.color};">Fecha de Emisión</span>`,
      };

      try {
        await axios.put(`/plantillas-certificados/${this.$route.params.idplantilla}`, payload);
        showSuccess("update");
        this.$router.push("/plantillas");
      } catch (error) {
        showError("update");
      }
    }
    ,
    startDrag(elementType, event) {
      if (this.isViewing) return;
      this.dragging = elementType;
      this.dragStart.x = event.clientX - this[elementType].x;
      this.dragStart.y = event.clientY - this[elementType].y;

      window.addEventListener("mousemove", this.onDrag);
      window.addEventListener("mouseup", this.stopDrag);
    },
    onDrag(event) {
      if (!this.dragging) return;

      const element = this[this.dragging];
      element.x = event.clientX - this.dragStart.x;
      element.y = event.clientY - this.dragStart.y;
    },
    stopDrag() {
      this.dragging = null;
      window.removeEventListener("mousemove", this.onDrag);
      window.removeEventListener("mouseup", this.stopDrag);
    },
    async fetchPlantilla(id) {
      try {
        this.cargando = true;
        const response = await axios.get(`/plantillas-certificados/${id}`);
        const data = response.data;
        this.provicional = response.data
        this.titulo = data.titulo;
        this.descripcion = data.descripcion;
        this.estado = data.estado;
        this.badge_id = data.badge.id;
        this.plantilla.ruta_fondo = data.ruta_fondo;
        this.nombre.x = data.ubicacion_nombre_x;
        this.nombre.y = data.ubicacion_nombre_y;

        this.idcertificado.x = data.id_certificado_x;
        this.idcertificado.y = data.id_certificado_y;

        this.imagenbadge.x = data.badge_x;
        this.imagenbadge.y = data.badge_y;


        this.qr.x = data.ubicacion_qr_x;
        this.qr.y = data.ubicacion_qr_y;
        this.fecha.x = data.fecha_emision_x;
        this.fecha.y = data.fecha_emision_y;

        this.es_predeterminada = data.es_predeterminada;
        this.organizacion_id = data.organizacion_id;



        const docNom = new DOMParser()
          .parseFromString(data.contenido_nombre, "text/html");
        const spanNom = docNom.body.querySelector("span");
        if (spanNom) {

          let rawFontNom = spanNom.style.fontFamily
            .replace(/['"]/g, "")
            .trim()
            .replace(/\s+/g, " ");

          const matchNom = this.fonts.find(
            f => f.toLowerCase() === rawFontNom.toLowerCase()
          );

          this.nombre.font = matchNom || this.fonts[0];
          this.nombre.fontSize = spanNom.style.fontSize.replace("px", "");
          this.nombre.color = spanNom.style.color;
        }


        const docFec = new DOMParser()
          .parseFromString(data.contenido_fecha_emision, "text/html");
        const spanFec = docFec.body.querySelector("span");
        if (spanFec) {
          let rawFontFec = spanFec.style.fontFamily
            .replace(/['"]/g, "")
            .trim()
            .replace(/\s+/g, " ");
          const matchFec = this.fonts.find(
            f => f.toLowerCase() === rawFontFec.toLowerCase()
          );
          this.fecha.font = matchFec || this.fonts[0];
          this.fecha.fontSize = spanFec.style.fontSize.replace("px", "");
          this.fecha.color = spanFec.style.color;
        }



      } catch (error) {
        showError("fetch");
      } finally {
        this.cargando = false;
      }
    },
    async fetchBadges() {
      this.cargando = true;
      try {
        const { data } = await axios.get("/badges", {
          params: {
            page: 1,
            limit: 100000000,          
          },
        });
      
        if (Array.isArray(data)) {
          this.badges = data;
        } else if (Array.isArray(data.items)) {
          this.badges = data.items;
        } else {
          this.badges = [];
        }
      } catch (error) {
        showError("fetch");
      } finally {
        this.cargando = false;
      }
    }
    ,
    async deletePlantilla() {
      try {
        const result = await showWarning("confirmDelete");
        if (result.isConfirmed) {
          this.cargando = true;
          await axios.delete(`/plantillas-certificados/${this.$route.params.idplantilla}`);
          showSuccess("delete");
          this.$router.push("/plantillas");
        }

      } catch (error) {
        showError("delete");
      } finally {
        this.cargando = false;
      }
    },
    editPlantilla() {
      this.$router.push(`/plantillas/editar/${this.$route.params.idplantilla}`);
    },
    cancel() {
      this.$router.push("/plantillas");
    },
  },
  mounted() {
    const id = this.$route.params.idplantilla;
    if (this.isEditing || this.isViewing) {
      this.fetchPlantilla(id);
      this.titulo = this.isEditing ? "Editar Plantilla" : "Ver Plantilla";
    } else {
      this.titulo = "Crear Plantilla de Certificado";
    }
    this.fetchBadges();
  },
};
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 1000px;
  height: 707px;
  min-width: 1000px;
  border: 1px solid #ddd;
  background-color: #f8f9fa;
  margin: 1rem auto;
  /* centra horizontalmente */
}

.background {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}


.draggable-element {
  position: absolute;
  cursor: move;
  z-index: 10;
}

.editor-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
</style>