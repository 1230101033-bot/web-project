<template>
  <div>
    <h1 class="page-title">Users / Staff</h1>
    <div class="card">
      <div class="grid grid-4">
        <div>
          <input class="input" v-model="form.name" placeholder="Name" />
          <div v-if="errors.name" class="error">{{ errors.name }}</div>
        </div>
        <div>
          <input class="input" v-model="form.email" placeholder="Email" />
          <div v-if="errors.email" class="error">{{ errors.email }}</div>
        </div>
        <div>
          <select class="input" v-model="form.role">
            <option value="">Select Role</option>
            <option>Admin</option>
            <option>Staff</option>
          </select>
          <div v-if="errors.role" class="error">{{ errors.role }}</div>
        </div>
        <button class="btn" @click="add" :disabled="loading">Add User</button>
      </div>
      <div v-if="errors.form" class="error">{{ errors.form }}</div>
    </div>

    <div v-if="loadError" class="error">{{ loadError }}</div>
    <table>
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr></thead>
      <tbody>
        <tr v-for="u in users" :key="u._id">
          <td>{{ u.name }}</td><td>{{ u.email }}</td><td>{{ u.role }}</td>
          <td><button class="btn btn-red" @click="remove(u._id)">Delete</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api, { getErrorMessage } from "../api/axios";

const form = ref({ name: "", email: "", role: "" });
const errors = ref({});
const loading = ref(false);
const loadError = ref("");
const users = ref([]);

const loadUsers = async () => {
  loadError.value = "";
  try {
    const { data } = await api.get("/users");
    users.value = data;
  } catch (err) {
    // Non-admins will get a 403 here since this route is admin-only
    loadError.value = getErrorMessage(err, "Failed to load users");
  }
};

const add = async () => {
  errors.value = {};
  if (!form.value.name) errors.value.name = "Name required";
  if (!form.value.email) errors.value.email = "Email required";
  else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) errors.value.email = "Invalid email";
  if (!form.value.role) errors.value.role = "Role required";

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    const { data } = await api.post("/users", { ...form.value });
    users.value.unshift(data);
    form.value = { name: "", email: "", role: "" };
  } catch (err) {
    errors.value.form = getErrorMessage(err, "Failed to add user");
  } finally {
    loading.value = false;
  }
};

const remove = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    users.value = users.value.filter((u) => u._id !== id);
  } catch (err) {
    loadError.value = getErrorMessage(err, "Failed to delete user");
  }
};

onMounted(loadUsers);
</script>
