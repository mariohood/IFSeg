import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "vuefire";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/usuarios/:id",
      name: "usuario",
      component: () => import("../views/UsuarioView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/admin/AdminLayout.vue"),
      children: [
        {
          path: "/admin/usuarios",
          name: "admin-usuarios",
          component: () => import("../views/admin/AdminView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/admin/novo",
          name: "novo-usuario",
          component: () => import("../views/admin/NovoUsuarioView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/admin/editar/:id",
          name: "editar-usuario",
          component: () => import("../views/admin/EditarUsuarioView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/admin/conectar",
          name: "mqtt-conectar",
          component: () => import("../views/admin/ConectarMqttView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "/admin/salas/:sala",
          name: "admin-sala",
          component: () => import("../views/admin/SalaView.vue"),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});

router.beforeEach(async (to) => {
  if (to.name === "usuario") {
    const user = await getCurrentUser();
    if (!user) {
      return { name: "login" };
    }
  }
});

export default router;
