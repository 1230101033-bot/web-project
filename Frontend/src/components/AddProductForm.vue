<template>
  <div class="card">
    <form class="grid grid-4" @submit.prevent="submitForm">
      <div>
        <input class="input" v-model="form.name" placeholder="Name" />
        <div v-if="errors.name" class="error">{{ errors.name }}</div>
      </div>
      <div>
        <input class="input" v-model="form.sku" placeholder="SKU" />
        <div v-if="errors.sku" class="error">{{ errors.sku }}</div>
      </div>
      <div>
        <input class="input" v-model="form.price" type="number" min="1" placeholder="Price" />
        <div v-if="errors.price" class="error">{{ errors.price }}</div>
      </div>
      <div>
        <input class="input" v-model="form.stock" type="number" min="0" placeholder="Stock" />
        <div v-if="errors.stock" class="error">{{ errors.stock }}</div>
      </div>
      <div>
        <select class="input" v-model="form.category">
          <option value="">No Category</option>
          <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
        </select>
      </div>
      <button class="btn" type="submit" :disabled="submitting">Add Product</button>
    </form>
    <div v-if="errors.form" class="error">{{ errors.form }}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const emit = defineEmits(["add-product"]);

const form = ref({ name: "", sku: "", price: "", stock: "", category: "" });
const errors = ref({});
const categories = ref([]);
const submitting = ref(false);

const loadCategories = async () => {
  try {
    const { data } = await api.get("/categories");
    categories.value = data;
  } catch {
    // categories are optional for a product, so fail silently here
  }
};

const submitForm = async () => {
  errors.value = {};

  if (!form.value.name) errors.value.name = "Name required";
  if (!form.value.sku) errors.value.sku = "SKU required";
  if (!form.value.price) errors.value.price = "Price required";
  else if (isNaN(form.value.price) || Number(form.value.price) <= 0) errors.value.price = "Invalid price";
  if (form.value.stock === "" || form.value.stock === null) errors.value.stock = "Stock required";
  else if (isNaN(form.value.stock) || Number(form.value.stock) < 0) errors.value.stock = "Invalid stock";

  if (Object.keys(errors.value).length > 0) return;

  submitting.value = true;
  try {
    const { data } = await api.post("/products", {
      name: form.value.name,
      sku: form.value.sku,
      price: Number(form.value.price),
      stock: Number(form.value.stock),
      category: form.value.category || undefined,
    });
    emit("add-product", data);
    form.value = { name: "", sku: "", price: "", stock: "", category: "" };
  } catch (err) {
    errors.value.form = getErrorMessage(err, "Failed to add product");
  } finally {
    submitting.value = false;
  }
};

onMounted(loadCategories);
</script>
