<template>
  <div>
    <h1 class="page-title">{{ pageTitle }}</h1>
    <p class="mb-2">Viewing products for {{ userName }}</p>

    <AddProductForm @add-product="handleAddProduct" />

    <div v-if="loadError" class="error">{{ loadError }}</div>
    <table>
      <thead><tr><th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Category</th><th></th></tr></thead>
      <tbody>
        <ProductRow
          v-for="p in products"
          :key="p._id"
          :name="p.name"
          :sku="p.sku"
          :price="p.price"
          :stock="p.stock"
          :category="p.category ? p.category.name : '-'"
          @delete="removeProduct(p._id)"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import ProductRow from "../components/ProductRow.vue";
import AddProductForm from "../components/AddProductForm.vue";
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
  pageTitle: {
    type: String,
    default: "Products",
  },
});

const products = ref([]);
const loadError = ref("");

const loadProducts = async () => {
  loadError.value = "";
  try {
    const { data } = await api.get("/products");
    products.value = data;
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to load products");
  }
};

const handleAddProduct = (newProduct) => {
  products.value.unshift(newProduct);
};

const removeProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
    products.value = products.value.filter((p) => p._id !== id);
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to delete product");
  }
};

onMounted(loadProducts);
</script>
