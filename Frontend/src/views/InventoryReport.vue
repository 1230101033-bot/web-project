<template>
  <div>
    <h1 class="page-title">Inventory Report</h1>
    <div v-if="loadError" class="error">{{ loadError }}</div>
    <table>
      <thead><tr><th>Product</th><th>Stock</th><th>Status</th></tr></thead>
      <tbody>
        <tr v-for="(row, i) in report" :key="i">
          <td>{{ row.product }}</td>
          <td>{{ row.stock }}</td>
          <td :style="row.status === 'Low' ? 'color:#f87171;' : ''">{{ row.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const report = ref([]);
const loadError = ref("");

onMounted(async () => {
  try {
    const { data } = await api.get("/reports/inventory");
    report.value = data;
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load inventory report");
  }
});
</script>
