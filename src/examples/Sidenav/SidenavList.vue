<script setup>
import { useRoute } from "vue-router";

import SidenavItem from "./SidenavItem.vue";

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/badges"
          :class="getRoute() === 'badges' ? 'active' : ''"
          navText="Badges"
        >
          <template v-slot:icon>
            <i :class="[
              'fas fa-award text-lg', 
              getRoute() === 'badges' ? 'text-white' : 'text-dark'
            ]"></i>

          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/plantillas"
          :class="getRoute() === 'plantillas' ? 'active' : ''"
          navText="Template"
        >
          <template v-slot:icon>            
            <i :class="[
              'ni ni-folder-17 text-lg', 
              getRoute() === 'certificados' ? 'text-white' : 'text-dark'
            ]"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/certificadostodos"
          :class="getRoute() === 'certificados' ? 'active' : ''"
          navText="Certificados"
        >
          <template v-slot:icon>            
            <i :class="[
              'ni ni-folder-17 text-lg', 
              getRoute() === 'certificados' ? 'text-white' : 'text-dark'
            ]"></i>
          </template>
        </sidenav-item>
      </li>
      
      <li class="nav-item">
        <sidenav-item
          to="/beneficiarios"
          :class="getRoute() === 'beneficiarios' ? 'active' : ''"
          navText="Beneficiarios"
        >
          <template v-slot:icon>
            <i :class="[
              'ni ni-hat-3 text-lg', 
              getRoute() === 'beneficiarios' ? 'text-white' : 'text-dark'
            ]"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/usuarios"
          :class="getRoute() === 'usuarios' ? 'active' : ''"
          navText="Usuarios"
        >
          <template v-slot:icon>
           <i :class="[
            'ni ni-circle-08 text-lg', 
            getRoute() === 'usuarios' ? 'text-white' : 'text-dark'
          ]"></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/organizaciones"
          :class="getRoute() === 'Organizaciones' ? 'active' : ''"
          navText="Organizaciones"
        >
          <template v-slot:icon>
            <i :class="[
              'ni ni-building text-lg', 
              getRoute() === 'organizaciones' ? 'text-white' : 'text-dark'
            ]"></i>           

          </template>
        </sidenav-item>
      </li>

   
    </ul>
  </div>

</template>
