<template>
  <div class="flex gap-2 mb-6">
    <input
      v-model="newTask"
      :disabled="isEditing || isAdding"
      class="flex-1 border rounded px-3 py-2 bg-white cursor-caret disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
      placeholder="Dodaj zadanie..."
      @keyup.enter="addTask"
    >

    <input
      v-model="newTaskDate"
      :disabled="isEditing || isAdding"
      type="date"
      class="border rounded px-3 py-2 bg-white disabled:bg-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
    >

    <button
      :disabled="isEditing || isAdding"
      class="bg-green-500 text-white px-4 rounded cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
      @click="addTask"
    >
      Dodaj
    </button>
  </div>
</template>

<script setup>
const newTask = ref('')
const newTaskDate = ref('')

const {
  addTask: addTaskToList,
  isAdding,
  isEditing
} = useTasks()

async function addTask() {
  if (!newTask.value.trim()) return

  await addTaskToList({
    title: newTask.value.trim(),
    dueDate: newTaskDate.value || null
  })

  newTask.value = ''
  newTaskDate.value = ''
}
</script>
