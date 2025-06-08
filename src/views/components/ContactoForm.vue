<template>
    <form @submit.prevent="enviarConsulta" class="p-4 border rounded bg-white shadow-sm">
      <div class="mb-3">
        <label for="nombre" class="form-label">Nombre</label>
        <input type="text" id="nombre" v-model="form.nombre" class="form-control" />
        <span v-if="errores.nombre" class="text-danger">{{ errores.nombre }}</span>
      </div>
  
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="text" id="email" v-model="form.email" class="form-control" />
        <span v-if="errores.email" class="text-danger">{{ errores.email }}</span>
      </div>
  
      <div class="mb-3">
        <label for="mensaje" class="form-label">Mensaje</label>
        <textarea id="mensaje" v-model="form.mensaje" class="form-control" rows="4"></textarea>
        <span v-if="errores.mensaje" class="text-danger">{{ errores.mensaje }}</span>
      </div>
  
      <button type="submit" class="btn btn-gold w-100 py-2" aria-label="Enviar Consulta" :disabled="enviando">
        {{ enviando ? "Enviando..." : "Enviar Consulta" }}
      </button>
    </form>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "@/axios";
  import { showError, showSuccess } from "@/utils/alertService";
  
  const form = ref({
    nombre: '',
    email: '',
    mensaje: ''
  });
  
  const errores = ref({
    nombre: '',
    email: '',
    mensaje: ''
  });
  
  const enviando = ref(false);
  
  const validarFormulario = () => {
    errores.value = {
      nombre: '',
      email: '',
      mensaje: ''
    };
  
    let valido = true;
  
    if (!form.value.nombre.trim()) {
      errores.value.nombre = "El nombre es obligatorio.";
      valido = false;
    }
  
    if (!form.value.email.trim()) {
      errores.value.email = "El correo electrónico es obligatorio.";
      valido = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
      errores.value.email = "El correo electrónico no es válido.";
      valido = false;
    }
  
    if (!form.value.mensaje.trim()) {
      errores.value.mensaje = "El mensaje es obligatorio.";
      valido = false;
    }
  
    return valido;
  };
  
  const enviarConsulta = async () => {
    if (!validarFormulario()) return;
  
    enviando.value = true;
  
    try {
      const response = await axios.post("/mail/contacto", form.value);
      if (response.data.success) {
        showSuccess("mail");
        form.value = { nombre: "", email: "", mensaje: "" };
      } else {
        showError(response.data.message);
      }
    } catch (error) {
      showError("Ocurrió un error al enviar la consulta.");
    } finally {
      enviando.value = false;
    }
  };
  </script>
  