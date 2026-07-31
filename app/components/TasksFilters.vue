<template>
  <div class="flex gap-3 mb-5">
    <USelect
      v-model="filter"
      :items="[
        {
          label: 'Wszystkie',
          value: 'all'
        },
        {
          label: 'Aktywne',
          value: 'active'
        },
        {
          label: 'Ukończone',
          value: 'completed'
        }
      ]"
    />

    <UInput
      v-model="searchQuery"
      placeholder="Szukaj zadania..."
      class="flex-1"
    />
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
