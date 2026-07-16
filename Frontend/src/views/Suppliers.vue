<template>
  <div>
    <h1 class="page-title">Suppliers</h1>
    <div class="card">
      <div class="grid grid-4">
        <div>
          <input class="input" v-model="form.name" placeholder="Name" />
          <div v-if="errors.name" class="error">{{ errors.name }}</div>
        </div>
        <div>
          <input class="input" v-model="form.phone" placeholder="Phone" />
          <div v-if="errors.phone" class="error">{{ errors.phone }}</div>
        </div>
        <div>
          <input class="input" v-model="form.address" placeholder="Address" />
        </div>
        <button class="btn" @click="add" :disabled="loading">Add Supplier</button>
      </div>
      <div v-if="errors.form" class="error">{{ errors.form }}</div>
    </div>

    <div v-if="loadError" class="error">{{ loadError }}</div>
    <table>
      <thead><tr><th>Name</th><th>Phone</th><th>Address</th><th></th></tr></thead>
      <tbody>
        <tr v-for="s in list" :key="s._id">
          <td>{{ s.name }}</td><td>{{ s.phone }}</td><td>{{ s.address }}</td>
          <td><button class="btn btn-red" @click="remove(s._id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const form = ref({ name: "", phone: "", address: "" });
const errors = ref({});
const loading = ref(false);
const loadError = ref("");
const list = ref([]);

const loadSuppliers = async () => {
  loadError.value = "";
  try {
    const { data } = await api.get("/suppliers");
    list.value = data;
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load suppliers");
  }
};

const add = async () => {
  errors.value = {};
  if (!form.value.name) errors.value.name = "Name required";
  if (!form.value.phone) errors.value.phone = "Phone required";
  else if (!/^\d{10,12}$/.test(form.value.phone)) errors.value.phone = "Invalid phone";

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    const { data } = await api.post("/suppliers", { ...form.value });
    list.value.unshift(data);
    form.value = { name: "", phone: "", address: "" };
  } catch (err) {
    errors.value.form = getErrorMessage(err, "Failed to add supplier");
  } finally {
    loading.value = false;
  }
};

const remove = async (id) => {
  try {
    await api.delete(`/suppliers/${id}`);
    list.value = list.value.filter((s) => s._id !== id);
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to delete supplier");
  }
};

onMounted(loadSuppliers);
</script>
