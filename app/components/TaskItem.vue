<template>
  <div class="grow flex justify-between gap-2 items-center">
    <div class="flex items-center gap-2 flex-1">
      <input
        type="checkbox"
        :checked="task.completed"
        class="accent-green-500 size-5 cursor-pointer"
        :disabled="task.saving"
        @change="toggleTask(task, $event)"
      >

      <div class="flex-1">
        <template v-if="task.editing">
          <input
            v-model="newTitle"
            class="border rounded px-2 py-1 w-full bg-white"
            @keyup.enter="saveEdit(task)"
          >
        </template>

        <template v-else>
          <span
            :class="{
              'line-through text-gray-400': task.completed
            }"
          >
            {{ task.title }}
          </span>
        </template>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <UButton
        v-if="task.title !== newTitle"
        icon="i-lucide-check"
        @click="handleSave(task)"
      />
      <UButton
        :icon="task.editing ? 'i-lucide-x' : 'i-lucide-square-pen'"
        :color="task.editing ? 'error' : 'neutral'"
        variant="outline"
        :disabled="task.saving"
        @click="handleEdit(task)"
      />
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="solid"
        :disabled="task.saving"
        @click="removeTask(task)"
      />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['removed', 'edit-change'])
const props = defineProps({
  task: Object
})

const newTitle = ref(props.task.title)

function handleEdit(task) {
  emit('edit-change', task.id)
}

const toast = useToast()

async function handleSave(task) {
  try {
    const data = await $fetch(
      `https://dummyjson.com/todos/${task.id}`,
      {
        method: 'PATCH',
        body: {
          todo: newTitle.value.trim()
        }
      }
    )

    task.title = data.todo

    handleEdit(task)
    toast.add({
      title: 'Pomyślnie zapisano',
      color: 'success'
    })
  } catch (e) {
    toast.add({
      title: 'Nie udało się zapisac',
      color: 'error'
    })
  }
}

async function toggleTask(task, event) {
  task.saving = true
  try {
    const data = await $fetch(
      `https://dummyjson.com/todos/${task.id}`,
      {
        method: 'PATCH',
        body: {
          completed: event.target.checked
        }
      }
    )

    task.completed = data.completed
    task.saving = false
    toast.add({
      title: 'Pomyślnie zapisano',
      color: 'success'
    })
  } catch (err) {
    console.log(err)
    toast.add({
      title: 'Nie udało się zapisac',
      color: 'error'
    })
  }
}

async function removeTask(task) {
  try {
    await $fetch(
      `https://dummyjson.com/todos/${task.id}`,
      {
        method: 'DELETE'
      }
    )

    emit('removed', task.id)
    toast.add({
      title: 'Pomyślnie usunięto zadanie',
      color: 'success'
    })
  } catch (err) {
    console.log(err)
    toast.add({
      title: 'Nie udało się usunąć zadania',
      color: 'error'
    })
  }
}
</script>
