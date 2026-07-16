<template>
  <div>
    <h1 class="page-title">Dashboard</h1>
    <p class="mb-2">Welcome, {{ userName }}</p>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="grid grid-4">
      <div class="card">Total Products: {{ stats.totalProducts }}</div>
      <div class="card">Low Stock: {{ stats.lowStock }}</div>
      <div class="card">Today Sales: {{ stats.todaySales }}</div>
      <div class="card">Profit: {{ stats.profit }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

defineProps({
  userName: {
    type: String,
    default: "Admin",
  },
  userEmail: {
    type: String,
    default: "",
  },
});

const stats = ref({ totalProducts: 0, lowStock: 0, todaySales: 0, profit: 0 });
const error = ref("");

const loadStats = async () => {
  error.value = "";
  try {
    const { data } = await api.get("/dashboard");
    stats.value = data;
  } catch (err) {
    error.value = getErrorMessage(err, "Failed to load dashboard data");
  }
};

onMounted(loadStats);
</script>
