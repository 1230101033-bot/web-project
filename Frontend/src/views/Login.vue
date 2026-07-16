<template>
  <div class="auth">
    <div class="auth-box">
      <h1>Login</h1>
      <input class="input" v-model="email" placeholder="Email" />
      <div v-if="errors.email" class="error">{{ errors.email }}</div>

      <input class="input" v-model="password" type="password" placeholder="Password" @keyup.enter="login" />
      <div v-if="errors.password" class="error">{{ errors.password }}</div>

      <div v-if="errors.form" class="error">{{ errors.form }}</div>

      <button class="btn" style="width:100%; margin-top:10px;" @click="login" :disabled="loading">
        {{ loading ? "Signing in..." : "Sign In" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const emit = defineEmits(["login-success"]);

const email = ref("");
const password = ref("");
const errors = ref({});
const loading = ref(false);

const login = async () => {
  errors.value = {};
  if (!email.value) errors.value.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(email.value)) errors.value.email = "Invalid email";
  if (!password.value) errors.value.password = "Password is required";
  else if (password.value.length < 6) errors.value.password = "Min 6 characters";

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    const { data } = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    // Persist auth so refresh keeps the session and axios can attach the token
    localStorage.setItem("token", data.token);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem(
      "user",
      JSON.stringify({ name: data.name, email: data.email, role: data.role, id: data._id })
    );

    emit("login-success", { name: data.name, email: data.email, role: data.role });
  } catch (err) {
    errors.value.form = getErrorMessage(err, "Invalid email or password");
  } finally {
    loading.value = false;
  }
};
</script>
