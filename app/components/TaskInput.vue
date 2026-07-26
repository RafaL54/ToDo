<template>
  <div class="flex gap-2 mb-6">
    <input
      v-model="newTask"
      class="flex-1 border rounded px-3 py-2 bg-white"
      placeholder="Dodaj zadanie..."
      @keyup.enter="addTask"
    >

    <input
      v-model="newTaskDate"
      type="date"
      class="border rounded px-3 py-2 bg-white"
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
const newTaskDate = ref('')
const emit = defineEmits(['add'])

function addTask() {
  if (newTask.value.trim() === '') return

  console.log({
    title: newTask.value.trim(),
    dueDate: newTaskDate.value
  })

  emit('add', {
    title: newTask.value.trim(),
    dueDate: newTaskDate.value || null
  })

  newTask.value = ''
  newTaskDate.value = ''
}
</script>
