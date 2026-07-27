<template>
  <div class="flex items-center justify-between w-full gap-3 border-b py-3">
    <div class="flex items-center gap-2">
      <input
        type="checkbox"
        :checked="task.completed"
        class="accent-green-500 w-3 h-3 cursor-pointer"
        @change="$emit('toggle', task)"
      >

      <div>
        <input
          v-if="editing"
          v-model="editTitle"
          class="border rounded px-2 py-1 w-full bg-white"
          @keyup.enter="saveEdit(task)"
          @blur="saveEdit(task)"
          @keyup.esc="cancelEdit"
        >

        <input
          v-if="editing"
          v-model="editDate"
          type="date"
          class="border rounded px-2 py-1 bg-white mt-1"
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

        <div
          v-if="task.dueDate"
          class="text-xs text-gray-500"
          :class="{
            'text-red-500': isOverdue,
            'text-gray-500': !isOverdue
          }"
        >
          Termin: {{ task.dueDate }}
        </div>
      </div>
    </div>

    <div v-if="task.completed">
      <UButton
        icon="i-lucide-trash-2"
        class="bg-red-500 text-white p-2 rounded-full cursor-pointer"
        @click="$emit('remove', task)"
      />
    </div>
  </div>
</template>

<script setup>
const editing = ref(false)
const editTitle = ref('')
const editDate = ref('')
const cancelingEdit = ref(false)

const emit = defineEmits([
  'toggle',
  'remove',
  'edit'
])

const props = defineProps({
  task: Object
})

const isOverdue = computed(() => {
  if (!props.task.dueDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(props.task.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate < today
})

function edit(task) {
  editing.value = true
  editTitle.value = task.title
  editDate.value = task.dueDate || ''
}

function saveEdit(task) {
  if (cancelingEdit.value) {
    cancelingEdit.value = false
    return
  }

  emit('edit', {
    id: task.id,
    newTitle: editTitle.value,
    newDate: editDate.value || null
  })

  editing.value = false
}

function cancelEdit() {
  cancelingEdit.value = true
  editing.value = false
}
</script>
