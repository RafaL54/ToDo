<template>
  <div class="grow flex justify-between gap-2 items-center">
    <div class="flex items-center gap-2 flex-1">
      <UCheckbox
        :model-value="task.completed"
        size="lg"
        :disabled="task.saving"
        @update:model-value="toggleTask(task, $event)"
      />

      <div class="flex-1">
        <template v-if="task.editing">
          <UInput
            v-model="newTitle"
            class="w-full"
            @keyup.enter="handleSave(task)"
          />
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
  if (!newTitle.value.trim()) return

  if (!task.fromApi) {
    task.title = newTitle.value.trim()
    handleEdit(task)

    toast.add({
      title: 'Pomyślnie zapisano',
      color: 'success'
    })

    return
  }

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
  } catch {
    toast.add({
      title: 'Nie udało się zapisac',
      color: 'error'
    })
  }
}

async function toggleTask(task, completed) {
  task.saving = true

  try {
    const data = await $fetch(
      `https://dummyjson.com/todos/${task.id}`,
      {
        method: 'PATCH',
        body: {
          completed
        }
      }
    )

    task.completed = data.completed
  } catch (err) {
    console.log(err)
    task.completed = completed
  } finally {
    task.saving = false
  }
}

async function removeTask(task) {
  if (!task.fromApi) {
    emit('removed', task.id)

    toast.add({
      title: 'Pomyślnie usunięto zadanie',
      color: 'success'
    })

    return
  }

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
