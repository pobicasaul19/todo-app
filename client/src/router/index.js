import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "",
    component: HomeView,
    meta: {
      authRequired: true,
    },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "\u2015 Log-in",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "\u2015 Register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/RegisterView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = "To Do App " + to.name;
  const authRequired = to.matched.some((route) => route.meta.authRequired);
  if (!authRequired) return next();
  if (store.getters["isLoggedIn"]) {
    next();
  } else {
    next("/login");
  }
});

export default router;
