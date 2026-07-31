<template>
  <div class="flex gap-3 mb-5">
    <select
      v-model="filter"
      class="border rounded px-2 py-2 bg-white cursor-pointer"
    >
      <option value="all">
        Wszystkie
      </option>

      <option value="active">
        Aktywne
      </option>

      <option value="completed">
        Ukończone
      </option>
    </select>

    <input
      v-model="searchQuery"
      placeholder="Szukaj zadania..."
      class="flex-1 border rounded px-3 py-2 bg-white"
    >
  </div>
</template>

<script setup>
const filter = defineModel('filter', {
  type: String,
  default: 'all'
})

const searchQuery = defineModel('searchQuery', {
  type: String,
  default: ''
})
</script>
