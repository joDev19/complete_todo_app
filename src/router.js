import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/inscription",
    name: "Inscription",
    component: () => import("@/views/InscriptionComponent.vue"),
  },
  {
    path: "/connexion",
    name: "Connexion",
    component: () => import("@/views/ConnexionComponent.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/DashboardComponent.vue"),
  },
  {
    path: "/newTask",
    name: "NewTask",
    component: () => import("@/views/NewTaskComponent.vue"),
  },

  {
    path: "/task/:id/:intitule",
    name: "ShowTask",
    component: () => import("@/views/ShowTaskComponent"),
  },
];
const router = createRouter({ history: createWebHashHistory(), routes });

export default router;
