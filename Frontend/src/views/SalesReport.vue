<template>
  <div>
    <h1 class="page-title">Sales Report</h1>
    <div v-if="loadError" class="error">{{ loadError }}</div>
    <table>
      <thead><tr><th>Date</th><th>Total</th><th>Profit</th></tr></thead>
      <tbody>
        <tr v-for="(row, i) in report" :key="i">
          <td>{{ row.date }}</td><td>{{ row.total }}</td><td>{{ row.profit }}</td>
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
    const { data } = await api.get("/reports/sales");
    report.value = data;
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load sales report");
  }
});
</script>
