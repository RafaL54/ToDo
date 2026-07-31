<template>
  <div class="flex grow items-center justify-between">
    <div class="flex items-center gap-2 grow flex-1">
      <input
        type="checkbox"
        :checked="task.completed"
        class="accent-green-500 w-3 h-3 cursor-pointer"
        @change="toggleTask(task)"
      >

      <div class="flex-1">
        <template v-if="editingId === task.id">
          <input
            v-model="editTitle"
            class="border rounded px-2 py-1 w-full bg-white"
            @keyup.enter="saveEdit(task)"
            @keyup.esc="cancelEdit"
          >

          <input
            v-model="editDate"
            type="date"
            class="border rounded px-2 py-1 bg-white mt-1 cursor-pointer"
            @keyup.enter="saveEdit(task)"
          >
        </template>

        <template v-else>
          <span
            :class="{
              'line-through text-gray-400': task.completed
            }"
            @dblclick="startEdit(task)"
          >
            {{ task.title }}
          </span>

          <div
            v-if="task.dueDate"
            class="text-xs"
            :class="{
              'text-red-500': isOverdue(task),
              'text-gray-500': !isOverdue(task)
            }"
          >
            Termin: {{ task.dueDate }}
          </div>
        </template>
      </div>
    </div>

    <div v-if="task.completed">
      <UButton
        icon="i-lucide-trash-2"
        class="bg-red-500 text-white p-2 rounded-full cursor-pointer"
        @click="removeTask(task)"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useTasksStore } from '~/stores/tasks'

defineProps({
  task: Object
})

const {
  toggleTask,
  removeTask,
  editTask
} = useTasksStore()

const { isEditing } = storeToRefs(useTasksStore())

const editingId = ref(null)
const editTitle = ref('')
const editDate = ref('')

function startEdit(task) {
  editingId.value = task.id
  editTitle.value = task.title
  editDate.value = task.dueDate || ''

  isEditing.value = true
}

async function saveEdit(task) {
  if (!editTitle.value.trim()) return

  await editTask({
    id: task.id,
    newTitle: editTitle.value,
    newDate: editDate.value || null
  })

  editingId.value = null
  editTitle.value = ''
  editDate.value = ''
  isEditing.value = false
}

function cancelEdit() {
  editingId.value = null
  editTitle.value = ''
  editDate.value = ''
  isEditing.value = false
}

function isOverdue(task) {
  if (!task.dueDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate < today
}
</script>
