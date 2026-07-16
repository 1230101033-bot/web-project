<template>
  <div class="navbar">
    <h3>Local Store Inventory</h3>
    <div>
      <input placeholder="Search..." />
      <span style="margin-left:15px;">{{ userName }}</span>
      <button class="btn" style="margin-left:15px;" @click="$emit('logout')">Logout</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userName: {
    type: String,
    default: "Admin",
  },
});
defineEmits(["logout"]);
</script>
