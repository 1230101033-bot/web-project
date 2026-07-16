<template>
  <tr>
    <td>{{ name }}</td>
    <td>{{ sku }}</td>
    <td>{{ price }}</td>
    <td>{{ stock }}</td>
    <td>{{ category }}</td>
    <td><button class="btn btn-red" @click="$emit('delete')">Delete</button></td>
  </tr>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  price: {
    type: [String, Number],
    required: true
  },
  stock: {
    type: [String, Number],
    required: true
  },
  category: {
    type: String,
    default: "-"
  }
})
defineEmits(["delete"]);
</script>
