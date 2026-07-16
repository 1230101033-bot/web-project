import { createRouter, createWebHistory } from "vue-router";

const isAuthenticated = () => typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true";

const routes = [
  { path: "/", component: () => import("../views/Login.vue"), meta: { layout: "auth", guestOnly: true } },
  { path: "/dashboard", component: () => import("../views/Dashboard.vue"), meta: { requiresAuth: true } },
  { path: "/products", component: () => import("../views/Products.vue"), meta: { requiresAuth: true } },
  { path: "/categories", component: () => import("../views/Categories.vue"), meta: { requiresAuth: true } },
  { path: "/suppliers", component: () => import("../views/Suppliers.vue"), meta: { requiresAuth: true } },
  { path: "/stock-in", component: () => import("../views/StockIn.vue"), meta: { requiresAuth: true } },
  { path: "/sales", component: () => import("../views/Sales.vue"), meta: { requiresAuth: true } },
  { path: "/inventory-report", component: () => import("../views/InventoryReport.vue"), meta: { requiresAuth: true } },
  { path: "/sales-report", component: () => import("../views/SalesReport.vue"), meta: { requiresAuth: true } },
  { path: "/purchase-report", component: () => import("../views/PurchaseReport.vue"), meta: { requiresAuth: true } },
  { path: "/users", component: () => import("../views/Users.vue"), meta: { requiresAuth: true } },
  { path: "/settings", component: () => import("../views/Settings.vue"), meta: { requiresAuth: true } },
  { path: "/profile", component: () => import("../views/Profile.vue"), meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ path: "/", replace: true });
    return;
  }

  if (to.meta.guestOnly && isAuthenticated()) {
    next({ path: "/dashboard", replace: true });
    return;
  }

  next();
});

export default router;