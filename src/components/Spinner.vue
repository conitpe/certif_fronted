<template>
    <div class="spinner-overlay" v-if="loading">
      <div class="spinner-container">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">{{ message }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      loading: {
        type: Boolean,
        required: true,
      },
      message: {
        type: String,
        default: "Cargando...", 
      }
    },
  };
  </script>
  
  <style scoped>
  .spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 18, 56, 0.466);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .spinner-container {
    text-align: center;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
  }
  </style>
  