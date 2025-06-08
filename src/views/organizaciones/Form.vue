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
                            <button
                                class="btn btn-outline-secondary dropdown-toggle m-2"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Opciones
                            </button>
                            <ul
                                class="dropdown-menu dropdown-menu-end"
                                aria-labelledby="dropdownMenuButton"
                            >
                                <li>
                                    <a
                                        class="dropdown-item text-danger"
                                        href="#"
                                        @click="deleteOrganizacion"
                                    >
                                        Eliminar
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#" @click="editOrganizacion">
                                        Editar
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#" @click="verPerfil">
                                        Perfil Público
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="handleSubmit">
                            <!-- RUC -->
                            <div class="mb-3">
                                <label for="ruc" class="form-label">RUC</label>
                                <input
                                    v-model="organizacion.ruc"
                                    type="text"
                                    class="form-control"
                                    id="ruc"
                                    placeholder="Ingrese el RUC"
                                    :disabled="isViewing"
                                    required
                                />
                            </div>

                            <!-- Razón Social -->
                            <div class="mb-3">
                                <label for="razon_social" class="form-label">Razón Social</label>
                                <input
                                    v-model="organizacion.razon_social"
                                    type="text"
                                    class="form-control"
                                    id="razon_social"
                                    placeholder="Ingrese la razón social"
                                    :disabled="isViewing"
                                    required
                                />
                            </div>

                            <!-- URL Web -->
                            <div class="mb-3">
                                <label for="url_web" class="form-label">URL Web</label>
                                <input
                                    v-model="organizacion.url_web"
                                    type="url"
                                    class="form-control"
                                    id="url_web"
                                    placeholder="Ingrese la URL del sitio web"
                                    :disabled="isViewing"
                                />
                            </div>

                            <!-- Tipo -->
                            <div class="mb-3">
                                <label for="tipo" class="form-label">Tipo</label>
                                <input
                                    v-model="organizacion.tipo"
                                    type="text"
                                    class="form-control"
                                    id="tipo"
                                    placeholder="Ingrese el tipo de organización"
                                    :disabled="isViewing"
                                />
                            </div>

                            <!-- Descripción -->
                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripción</label>
                                <textarea
                                    v-model="organizacion.descripcion"
                                    class="form-control"
                                    id="descripcion"
                                    placeholder="Ingrese una descripción"
                                    :disabled="isViewing"
                                ></textarea>
                            </div>

                            <!-- País -->
                            <div class="mb-3">
                                <label for="pais" class="form-label">País</label>
                                <input
                                    v-model="organizacion.pais"
                                    type="text"
                                    class="form-control"
                                    id="pais"
                                    placeholder="Ingrese el país"
                                    :disabled="isViewing"
                                />
                            </div>

                            <!-- URL Imagen -->
                            <div class="mb-3">
                                <label for="url_imagen" class="form-label">URL Imagen</label>
                                <input
                                    v-model="organizacion.url_imagen"
                                    type="url"
                                    class="form-control"
                                    id="url_imagen"
                                    placeholder="Ingrese la URL de la imagen"
                                    :disabled="isViewing"
                                />
                            </div>

                            <!-- Email Contacto -->
                            <div class="mb-3">
                                <label for="email_contacto" class="form-label">Email Contacto</label>
                                <input
                                    v-model="organizacion.email_contacto"
                                    type="email"
                                    class="form-control"
                                    id="email_contacto"
                                    placeholder="Ingrese el email de contacto"
                                    :disabled="isViewing"
                                    required
                                />
                            </div>

                            <!-- Email Soporte -->
                            <div class="mb-3">
                                <label for="email_soporte" class="form-label">Email Soporte</label>
                                <input
                                    v-model="organizacion.email_soporte"
                                    type="email"
                                    class="form-control"
                                    id="email_soporte"
                                    placeholder="Ingrese el email de soporte"
                                    :disabled="isViewing"
                                />
                            </div>

                            <!-- Botones -->
                            <div class="text-center">
                                <button
                                    v-if="!isViewing"
                                    type="submit"
                                    class="btn btn-primary me-2"
                                >
                                    {{ isEditing ? "Actualizar" : "Registrar" }}
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                    @click="cancel"
                                >
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
    components: { Spinner },
    data() {
        return {
            titulo: "",
            organizacion: {
                ruc: "",
                razon_social: "",
                url_web: "",
                tipo: "",
                descripcion: "",
                pais: "",
                url_imagen: "",
                email_contacto: "",
                email_soporte: "",
            },
            cargando: false,
        };
    },
    computed: {
        isViewing() {
            return this.$route.name === "OrganizacionesVer";
        },
        isEditing() {
            return this.$route.name === "OrganizacionesEditar";
        },
        isCreating() {
            return this.$route.name === "OrganizacionesCrear";
        },
    },
    methods: {
        async fetchOrganizacion(id) {
            try {
                this.cargando = true;
                const response = await axios.get(`/organizaciones/${id}`);
                this.organizacion = response.data;
            } catch (error) {
                showError("fetch");
            } finally {
                this.cargando = false;
            }
        },
        async handleSubmit() {
            try {
                if (this.isEditing) {
                    await axios.put(`/organizaciones/${this.organizacion.id}`, this.organizacion);
                    showSuccess("update");
                } else {
                    await axios.post("/organizaciones", this.organizacion);
                    showSuccess("create");
                }
                this.$router.push("/organizaciones");
            } catch (error) {
                showError("general");
            }
        },
        async deleteOrganizacion() {
            try {
                const result = await showWarning("confirmDelete");
                if (result.isConfirmed) {
                    this.cargando = true;
                    await axios.delete(`/organizaciones/${this.organizacion.id}`);
                    showSuccess("delete");
                    this.$router.push("/organizaciones");
                }
            } catch (error) {
                showError("delete");
            } finally {
                this.cargando = false;
            }
        },
        editOrganizacion() {
            this.$router.push(`/organizacion/editar/${this.organizacion.id}`);
        },
        cancel() {
            this.$router.push("/organizaciones");
        },
        verPerfil() {
            const id = this.$route.params.idorganizacion;
            this.$router.push({ name: 'Organizacion', params: { idorganizacion: id } });
        }
    },
    mounted() {
        const id = this.$route.params.idorganizacion;
        if (this.isEditing || this.isViewing) {
            this.fetchOrganizacion(id);
            this.titulo = this.isEditing ? "Editar Organización" : "Ver Organización";
        } else {
            this.titulo = "Registrar Organización";
        }
    },
};
</script>