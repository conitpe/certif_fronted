<script setup>
import { useStore } from "vuex";
const store = useStore();
</script>
<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div
            class="text-sm text-center copyright text-muted"
            :class="store.state.isRTL ? 'text-lg-end' : 'text-lg-start'"
          >
            ©
            {{ new Date().getFullYear() }}, 
           
            <a
              href="#"
              class="font-weight-bold"
              target="_blank"
              >Global Tecnologías Academy</a
            >
           
          </div>
        </div>
       
      </div>
    </div>
  </footer>
</template>
