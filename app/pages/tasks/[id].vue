<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="mx-auto max-w-3xl w-full">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <UButton
          to="/tasks"
          icon="i-lucide-arrow-left"
          color="success"
          variant="solid"
          class="mb-6"
        >
          Wróć do listy
        </UButton>

        <div v-if="loading">
          <div class="text-center py-10 text-gray-500">
            Ładowanie...
          </div>
        </div>

        <template v-else>
          <div v-if="task">
            <h1 class="text-2xl font-semibold mb-6">
              Szczegóły zadania
            </h1>

            <div class="border rounded-lg p-4 bg-white">
              <TaskItem
                :task="task"
                @removed="handleRemoved"
                @edit-change="handleEditChange"
              />

              <p class="text-sm flex items-center gap-2 mt-4">
                Status:
                <UBadge
                  :color="task.completed ? 'success' : 'error'"
                >
                  {{ task.completed ? 'Wykonane' : 'Do wykonania' }}
                </UBadge>
              </p>
            </div>
          </div>

          <template v-else>
            <div class="text-center py-10 text-gray-500">
              Nie znaleziono zadania.
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})
const route = useRoute()

const loading = ref(true)
const tasks = useState('tasks', () => [])
const task = ref(null)

async function fetchTask() {
  try {
    const existingTask = tasks.value.find(
      task => task.id === Number(route.params.id)
    )

    if (existingTask) {
      task.value = existingTask
      return
    }

    const data = await $fetch(
      `https://dummyjson.com/todos/${route.params.id}`
    )

    task.value = {
      id: data.id,
      title: data.todo,
      completed: data.completed,
      editing: false,
      saving: false,
      fromApi: true
    }

    tasks.value.push(task.value)
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

fetchTask()

function handleRemoved(id) {
  tasks.value = tasks.value.filter(task => task.id !== id)

  navigateTo('/tasks')
}

function handleEditChange(id) {
  if (task.value && task.value.id === id) {
    task.value.editing = !task.value.editing
  }
}
</script>
