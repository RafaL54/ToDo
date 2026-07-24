<template>
  <div class="flex gap-2 mb-6">
    <input
      v-model="newTask"
      class="flex-1 border rounded px-3 py-2 bg-white"
      placeholder="Dodaj zadanie..."
      @keyup.enter="addTask"
    >

    <button
      class="bg-green-500 text-white px-4 rounded cursor-pointer"
      @click="addTask"
    >
      Dodaj
    </button>
  </div>
</template>

<script setup>
const newTask = ref('')
const emit = defineEmits(['add'])

function addTask() {
  if (newTask.value.trim() === '') return

  emit('add', newTask.value.trim())

  newTask.value = ''
}
</script>
