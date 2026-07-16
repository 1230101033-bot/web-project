<template>
  <div>
    <div v-if="showAppLayout" class="app">
      <Sidebar />
      <div class="main">
        <Navbar :user-name="currentUser.name" @logout="handleLogout" />
        <div class="content">
          <router-view v-slot="{ Component }">
            <component
              :is="Component"
              :user-name="currentUser.name"
              :user-email="currentUser.email"
              :user-role="currentUser.role"
              @login-success="handleLoginSuccess"
            />
          </router-view>
        </div>
      </div>
    </div>
    <div v-else>
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          :user-name="currentUser.name"
          :user-email="currentUser.email"
          :user-role="currentUser.role"
          @login-success="handleLoginSuccess"
        />
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";

const route = useRoute();
const router = useRouter();

const storedUser = (() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
})();

const currentUser = ref({
  name: storedUser?.name || "Admin",
  email: storedUser?.email || "",
  role: storedUser?.role || "Staff",
});

const isAuthenticated = ref(typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true");
const showAppLayout = computed(() => isAuthenticated.value && route.meta.layout !== "auth");

const handleLoginSuccess = (user = {}) => {
  currentUser.value = {
    name: user.name || "Admin",
    email: user.email || "",
    role: user.role || "Staff",
  };
  isAuthenticated.value = true;
  router.push("/dashboard");
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("isAuthenticated");
  isAuthenticated.value = false;
  router.push("/");
};
</script>
