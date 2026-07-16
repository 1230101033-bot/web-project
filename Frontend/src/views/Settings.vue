<template>
  <div>
    <h1 class="page-title">Settings</h1>
    <div class="card">
      <div v-if="loadError" class="error">{{ loadError }}</div>
      <div class="grid grid-2">
        <input class="input" v-model="form.storeName" placeholder="Store Name" />
        <input class="input" v-model="form.currency" placeholder="Currency (e.g. PKR)" />
        <input class="input" v-model="form.phone" placeholder="Phone" />
        <input class="input" v-model="form.address" placeholder="Address" />
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" style="color:#4ade80; margin-top:8px;">{{ success }}</div>
      <button class="btn" style="margin-top:10px;" @click="save" :disabled="loading">Save Settings</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const form = ref({ storeName: "", currency: "", phone: "", address: "" });
const loading = ref(false);
const error = ref("");
const success = ref("");
const loadError = ref("");

const loadSettings = async () => {
  loadError.value = "";
  try {
    const { data } = await api.get("/settings");
    form.value = {
      storeName: data.storeName,
      currency: data.currency,
      phone: data.phone,
      address: data.address,
    };
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load settings");
  }
};

const save = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;
  try {
    await api.put("/settings", { ...form.value });
    success.value = "Settings saved!";
  } catch (err) {
    error.value = getErrorMessage(err, "Failed to save settings (Admin only)");
  } finally {
    loading.value = false;
  }
};

onMounted(loadSettings);
</script>
