<template>
  <div>
    <h1 class="page-title">Profile</h1>
    <div class="card" style="max-width:500px;">
      <div v-if="loadError" class="error">{{ loadError }}</div>
      <input class="input" v-model="form.name" placeholder="Full Name" style="margin-bottom:10px;" />
      <div v-if="errors.name" class="error">{{ errors.name }}</div>

      <input class="input" v-model="form.email" placeholder="Email" style="margin:10px 0;" />
      <div v-if="errors.email" class="error">{{ errors.email }}</div>

      <input class="input" v-model="form.password" type="password" placeholder="New Password" style="margin:10px 0;" />
      <div v-if="errors.password" class="error">{{ errors.password }}</div>

      <div v-if="success" style="color:#4ade80; margin:8px 0;">{{ success }}</div>
      <button class="btn" @click="save" style="margin-top:10px;" :disabled="loading">Save</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const form = ref({ name: "", email: "", password: "" });
const errors = ref({});
const loading = ref(false);
const success = ref("");
const loadError = ref("");

const loadProfile = async () => {
  loadError.value = "";
  try {
    const { data } = await api.get("/auth/profile");
    form.value = { name: data.name, email: data.email, password: "" };
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load profile");
  }
};

const save = async () => {
  errors.value = {};
  success.value = "";
  if (!form.value.name) errors.value.name = "Name required";
  if (!form.value.email) errors.value.email = "Email required";
  else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) errors.value.email = "Invalid email";
  if (form.value.password && form.value.password.length < 6) errors.value.password = "Min 6 chars";

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    const payload = { name: form.value.name, email: form.value.email };
    if (form.value.password) payload.password = form.value.password;

    const { data } = await api.put("/auth/profile", payload);

    // Keep the locally stored user in sync so the navbar/greeting stay correct
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...stored, name: data.name, email: data.email }));

    form.value.password = "";
    success.value = "Profile updated!";
  } catch (err) {
    errors.value.password = getErrorMessage(err, "Failed to update profile");
  } finally {
    loading.value = false;
  }
};

onMounted(loadProfile);
</script>
