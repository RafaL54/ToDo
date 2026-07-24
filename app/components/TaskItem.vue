<template>
  <div class="flex items-center justify-between w-full gap-3 border-b py-3">
    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        :checked="task.completed"
        class="accent-green-500 w-3 h-3 cursor-pointer"
        @change="$emit('toggle', task)"
      >

      <input
        v-if="editing"
        v-model="editTitle"
        class="border rounded px-2 py-1 w-full bg-white"
        @keyup.enter="saveEdit(task)"
        @blur="saveEdit(task)"
        @keyup.esc="cancelEdit"
      >

      <span
        v-else
        :class="{
          'line-through text-gray-400': task.completed
        }"
        @dblclick="edit(task)"
      >
        {{ task.title }}
      </span>
    </div>
    <div v-if="task.completed">
      <button
        class="bg-red-500 text-white px-2 py-1 rounded cursor-pointer"
        @click="$emit('remove', task)"
      >
        Usuń
      </button>
    </div>
  </div>
</template>

<script setup>
const editing = ref(false)
const editTitle = ref('')
const cancelingEdit = ref(false)

defineEmits([
  'toggle',
  'remove'
])

defineProps({
  task: Object
})

function edit(task) {
  editing.value = true
  editTitle.value = task.title
}

function saveEdit(task) {
  if (cancelingEdit.value) {
    cancelingEdit.value = false
    return
  }
  task.title = editTitle.value
  editing.value = false
}

function cancelEdit() {
  cancelingEdit.value = true
  editing.value = false
}
</script>
