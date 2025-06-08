import { createRouter, createWebHistory } from "vue-router";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";

import Badges from "../views/badges/Index.vue";
import BadgesForm from "../views/badges/Form.vue";
import BadgePublico from "../views/publico/Badge.vue";

import Usuarios from "../views/usuarios/Index.vue";
import UsuariosForm from "../views/usuarios/Form.vue";
import UsuariosPerfil from "../views/publico/Perfil.vue";

import Organizaciones from "../views/organizaciones/Index.vue";
import OrganizacionesForm from "../views/organizaciones/Form.vue";

import Plantillas from "../views/plantillas/Index.vue";
import PlantillasForm from "../views/plantillas/Form.vue";

import Certificados from "../views/certificados/Index.vue";
import CertificadosTodos from "../views/certificados/Todos.vue";
import CertificadosForm from "../views/certificados/Form.vue";

import Organizacion from "../views/publico/Organizacion.vue";
import Pdf from "../views/certificados/Pdf.vue";

/**Beneficiario Público */
import DashboardBeneficiario from "../views/publico/beneficiario/DashboardBeneficiario.vue";
import PerfilBeneficiario from "../views/publico/beneficiario/PerfilBeneficiario.vue";
import BadgeBeneficiario from "../views/publico/beneficiario/BadgeBeneficiario.vue";





const routes = [
  /*{
    path: "/",
    name: "/",
    redirect: "/beneficiarios",
    meta: { requiresAuth: true }, 
  },*/
  {
    path: "/",
    name: "Inicio",
    component: () => import("../views/publico/Index.vue"),
    meta: { requiresAuth: false }, 
  },
  
  { path: '/empresas', 
    name: 'Empresas',
    component: () => import("../views/publico/organizaciones/Empresas.vue"),
    meta: { requiresAuth: false },
  },
  { path: '/recuperar', 
    name: 'Recuperar',
    component: () => import("../views/Recuperar.vue"),
    meta: { requiresAuth: false },
  },

  { path: '/recuperar/:token',
    name: 'Restablecer',
    component: () => import("../views/Restablecer.vue"),
     meta: { requiresAuth: false },
  },

  {
    path: "/soluciones",
    name: "Soluciones",
    component: () => import("../views/publico/Soluciones.vue"),
    meta: { requiresAuth: false }, 
  },
  {
    path: "/legal",
    name: "Legal",
    component: () => import("../views/publico/Legal.vue"),
    meta: { requiresAuth: false }, 
  },
  {
    path: "/funciona",
    name: "Funciona",
    component: () => import("../views/publico/Funciona.vue"),
    meta: { requiresAuth: false }, 
  },
  {
    path: "/nosotros",
    name: "Nosotros",
    component: () => import("../views/publico/Nosotros.vue"),
    meta: { requiresAuth: false }, 
  },
  {
    path: "/verificacion",
    name: "Verificacion",
    component: () => import("../views/publico/Verificacion.vue"),
    meta: { requiresAuth: false }, 
  },
  

  {
    path: "/beneficiarios",
    name: "Beneficiarios",
    component: () => import("../views/beneficiarios/Index.vue"),
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  //organizaciones
  {
    path: "/organizacion/crear",
    name: "OrganizacionesCrear",
    component: OrganizacionesForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/organizacion/ver/:idorganizacion?",
    name: "OrganizacionesVer",
    component: OrganizacionesForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/organizacion/editar/:idorganizacion?",
    name: "OrganizacionesEditar",
    component: OrganizacionesForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/organizacion/:idorganizacion?",
    name: "Organizacion",
    component: Organizacion,
    meta: { requiresAuth: false }, 
  },
  //usuarios
  {
    path: "/usuarios",
    name: "Usuarios",
    component: Usuarios,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/usuarios/crear",
    name: "UsuariosCrear",
    component: UsuariosForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/usuarios/perfil/:idusuario?",
    name: "UsuariosPerfil",
    component: UsuariosPerfil,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/usuarios/ver/:idusuario?",
    name: "UsuariosVer",
    component: UsuariosForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/usuarios/editar/:idusuario?",
    name: "UsuariosEditar",
    component: UsuariosForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
//templates
  {
    path: "/plantillas",
    name: "Plantillas",
    component: Plantillas,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/plantillas/crear",
    name: "PlantillasForm",
    component: PlantillasForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/plantillas/ver/:idplantilla?",
    name: "PlantillasVer",
    component: PlantillasForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/plantillas/editar/:idplantilla?",
    name: "PlantillasEditar",
    component: PlantillasForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  //certificados
  {
    path: "/certificados/:idbadge?",
    name: "Certificados",
    component: Certificados,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/certificados/pdf",
    name: "Pdf",
    component: Pdf,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/certificadostodos",
    name: "CertificadosTodos",
    component: CertificadosTodos,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/certificados/crear/:idbadge?",
    name: "CertificadosCrear",
    component: CertificadosForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/certificados/:idbadge/ver/:idcertificado?",
    name: "CertificadosVer",
    component: CertificadosForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/certificados/:idbadge/editar/:idcertificado?",
    name: "CertificadosEditar",
    component: CertificadosForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  //badges
  {
    path: "/badges",
    name: "Badges",
    component: Badges,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/badges/crear",
    name: "BadgesCrear",
    component: BadgesForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  {
    path: "/badges/ver/:idbadge?",
    name: "BadgesVer",
    component: BadgesForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 

  },
  {
    path: "/badges/publico/:idbadge?",
    name: "BadgePublico",
    component: BadgePublico,
    meta: { requiresAuth: false }, 
  },
  {
    path: "/badges/editar/:idbadge?",
    name: "BadgesEditar",
    component: BadgesForm,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },

  {
    path: "/organizaciones",
    name: "Organizaciones",
    component: Organizaciones,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador"]  }, 
  },
  
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: { requiresAuth: false }, 
  },
  {
    path: '/verificar',
    name: 'VerificarCuenta',
    component: () => import('../views/VerificarCuenta.vue'),
  },
  
  /*Vistas públicas de beneficiarios */
  {
    path: "/beneficiario/dashboard",
    name: "DashboardBeneficiario",
    component: DashboardBeneficiario,
    meta: { requiresAuth: true,roles: ["administrador","superadministrador","beneficiario"]  }, 
  },
  {
    path: "/beneficiario/perfil/:idusuario?",
    name: "PerfilBeneficiario",
    component: PerfilBeneficiario,
    meta: { requiresAuth: false}, 
  },
  {
    path: "/beneficiario/certificado/:idcertificado",
    name: "BadgeBeneficiario",
    component: BadgeBeneficiario,
    meta: { requiresAuth: false}, 
  },
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});


router.beforeEach((to, from, next) => {
  document.documentElement.scrollTop = 0; 
  document.body.scrollTop = 0; 

  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

 if (to.meta.requiresAuth && !isAuthenticated) {
    next('/signin'); 
  } else if (isAuthenticated && to.path === '/signin') {
    next('/badges'); 
  } else {    
    if (to.meta.roles && !to.meta.roles.includes(userRole)) {    
      next("/"); 
    } else {
      next();
    }
  }
});

export default router;
