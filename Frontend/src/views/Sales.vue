<template>
  <div>
    <h1 class="page-title">Sales</h1>
    <div class="card">
      <div class="grid grid-4">
        <div>
          <select class="input" v-model="form.product">
            <option value="">Select Product</option>
            <option v-for="p in products" :key="p._id" :value="p._id">{{ p.name }} (stock: {{ p.stock }})</option>
          </select>
          <div v-if="errors.product" class="error">{{ errors.product }}</div>
        </div>
        <div>
          <input class="input" v-model="form.qty" placeholder="Quantity" />
          <div v-if="errors.qty" class="error">{{ errors.qty }}</div>
        </div>
        <div>
          <input class="input" v-model="form.price" placeholder="Price" />
          <div v-if="errors.price" class="error">{{ errors.price }}</div>
        </div>
        <button class="btn btn-green" @click="add" :disabled="loading">Complete Sale</button>
      </div>
      <div v-if="errors.form" class="error">{{ errors.form }}</div>
      <div v-if="success" style="color:#4ade80; margin-top:8px;">{{ success }}</div>
    </div>

    <div v-if="loadError" class="error">{{ loadError }}</div>
    <table>
      <thead><tr><th>Date</th><th>Product</th><th>Qty</th><th>Price</th><th>Total</th><th>Profit</th></tr></thead>
      <tbody>
        <tr v-for="s in sales" :key="s._id">
          <td>{{ new Date(s.createdAt).toLocaleDateString() }}</td>
          <td>{{ s.product?.name }}</td>
          <td>{{ s.qty }}</td>
          <td>{{ s.price }}</td>
          <td>{{ s.total }}</td>
          <td>{{ s.profit }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const form = ref({ product: "", qty: "", price: "" });
const errors = ref({});
const loading = ref(false);
const loadError = ref("");
const success = ref("");

const products = ref([]);
const sales = ref([]);

const loadAll = async () => {
  loadError.value = "";
  try {
    const [prodRes, saleRes] = await Promise.all([api.get("/products"), api.get("/sales")]);
    products.value = prodRes.data;
    sales.value = saleRes.data;
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load sales data");
  }
};

const add = async () => {
  errors.value = {};
  success.value = "";
  if (!form.value.product) errors.value.product = "Product required";
  if (!form.value.qty || form.value.qty <= 0) errors.value.qty = "Invalid qty";
  if (!form.value.price || form.value.price <= 0) errors.value.price = "Invalid price";

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    const { data } = await api.post("/sales", {
      product: form.value.product,
      qty: Number(form.value.qty),
      price: Number(form.value.price),
    });
    sales.value.unshift(data.sale);
    success.value = data.message;
    form.value = { product: "", qty: "", price: "" };
    await loadAll(); // refresh product stock numbers too
  } catch (err) {
    errors.value.form = getErrorMessage(err, "Failed to complete sale");
  } finally {
    loading.value = false;
  }
};

onMounted(loadAll);
</script>
