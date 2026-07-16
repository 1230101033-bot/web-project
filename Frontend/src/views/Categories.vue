<template>
  <div>
    <h1 class="page-title">Categories</h1>
    <div class="card">
      <div class="grid grid-3">
        <div>
          <input class="input" v-model="name" placeholder="Category Name" @keyup.enter="add" />
          <div v-if="error" class="error">{{ error }}</div>
        </div>
        <button class="btn" @click="add" :disabled="loading">Add</button>
      </div>
    </div>
    <div v-if="loadError" class="error">{{ loadError }}</div>
    <table>
      <thead><tr><th>#</th><th>Category</th><th></th></tr></thead>
      <tbody>
        <tr v-for="(c,i) in list" :key="c._id">
          <td>{{ i+1 }}</td>
          <td>{{ c.name }}</td>
          <td><button class="btn btn-red" @click="remove(c._id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const name = ref("");
const error = ref("");
const loadError = ref("");
const loading = ref(false);
const list = ref([]);

const loadCategories = async () => {
  loadError.value = "";
  try {
    const { data } = await api.get("/categories");
    list.value = data;
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load categories");
  }
};

const add = async () => {
  error.value = "";
  if (!name.value.trim()) { error.value = "Category required"; return; }

  loading.value = true;
  try {
    const { data } = await api.post("/categories", { name: name.value.trim() });
    list.value.unshift(data);
    name.value = "";
  } catch (err) {
    error.value = getErrorMessage(err, "Failed to add category");
  } finally {
    loading.value = false;
  }
};

const remove = async (id) => {
  try {
    await api.delete(`/categories/${id}`);
    list.value = list.value.filter((c) => c._id !== id);
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to delete category");
  }
};

onMounted(loadCategories);
</script>
