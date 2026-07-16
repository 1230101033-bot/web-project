<template>
  <div>
    <h1 class="page-title">Stock In (Purchase)</h1>
    <div class="card">
      <div class="grid grid-4">
        <div>
          <select class="input" v-model="form.supplier">
            <option value="">Select Supplier</option>
            <option v-for="s in suppliers" :key="s._id" :value="s._id">{{ s.name }}</option>
          </select>
          <div v-if="errors.supplier" class="error">{{ errors.supplier }}</div>
        </div>
        <div>
          <select class="input" v-model="form.product">
            <option value="">Select Product</option>
            <option v-for="p in products" :key="p._id" :value="p._id">{{ p.name }} ({{ p.sku }})</option>
          </select>
          <div v-if="errors.product" class="error">{{ errors.product }}</div>
        </div>
        <div>
          <input class="input" v-model="form.qty" placeholder="Quantity" />
          <div v-if="errors.qty" class="error">{{ errors.qty }}</div>
        </div>
        <div>
          <input class="input" v-model="form.costPrice" placeholder="Cost Price" />
        </div>
        <button class="btn" @click="add" :disabled="loading">Add Stock</button>
      </div>
      <div v-if="errors.form" class="error">{{ errors.form }}</div>
      <div v-if="success" style="color:#4ade80; margin-top:8px;">{{ success }}</div>
    </div>

    <div v-if="loadError" class="error">{{ loadError }}</div>
    <table>
      <thead><tr><th>Date</th><th>Supplier</th><th>Product</th><th>Qty</th><th>Total Cost</th></tr></thead>
      <tbody>
        <tr v-for="pu in purchases" :key="pu._id">
          <td>{{ new Date(pu.createdAt).toLocaleDateString() }}</td>
          <td>{{ pu.supplier?.name }}</td>
          <td>{{ pu.product?.name }}</td>
          <td>{{ pu.qty }}</td>
          <td>{{ pu.totalCost }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const form = ref({ supplier: "", product: "", qty: "", costPrice: "" });
const errors = ref({});
const loading = ref(false);
const loadError = ref("");
const success = ref("");

const suppliers = ref([]);
const products = ref([]);
const purchases = ref([]);

const loadAll = async () => {
  loadError.value = "";
  try {
    const [supRes, prodRes, purRes] = await Promise.all([
      api.get("/suppliers"),
      api.get("/products"),
      api.get("/purchases"),
    ]);
    suppliers.value = supRes.data;
    products.value = prodRes.data;
    purchases.value = purRes.data;
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load stock-in data");
  }
};

const add = async () => {
  errors.value = {};
  success.value = "";
  if (!form.value.supplier) errors.value.supplier = "Supplier required";
  if (!form.value.product) errors.value.product = "Product required";
  if (!form.value.qty) errors.value.qty = "Qty required";
  else if (isNaN(form.value.qty) || form.value.qty <= 0) errors.value.qty = "Invalid qty";

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    const { data } = await api.post("/purchases", {
      supplier: form.value.supplier,
      product: form.value.product,
      qty: Number(form.value.qty),
      costPrice: Number(form.value.costPrice) || 0,
    });
    purchases.value.unshift(data.purchase);
    success.value = data.message;
    form.value = { supplier: "", product: "", qty: "", costPrice: "" };
    await loadAll(); // refresh product stock numbers too
  } catch (err) {
    errors.value.form = getErrorMessage(err, "Failed to add stock");
  } finally {
    loading.value = false;
  }
};

onMounted(loadAll);
</script>
