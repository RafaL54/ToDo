<template>
  <div class="min-h-screen p-6">
    <div class="mx-auto max-w-3xl">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <TasksHeader
          :remaining-count="remainingCount"
          :badge-class="badgeClass"
        />

        <TaskInput
          :editing="hasEditingState"
          @added="handleAdded"
        />

        <TasksFilters
          v-model:filter="filter"
          v-model:search-query="searchQuery"
        />

        <TaskList
          :tasks="filteredTasks"
          :loading="loading"
          @removed="handleRemoved"
          @edit-change="handleEditChange"
        />

        <TasksFooter
          :tasks-count="tasks.length"
          :completed-count="completedCount"
          @remove-all="removeAll"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import TasksHeader from '~/components/TasksHeader.vue'

const loading = ref(false)
const error = ref(null)
const tasks = ref([])

async function fetchTasks() {
  loading.value = true
  error.value = null

  try {
    const data = await $fetch(
      'https://dummyjson.com/todos?limit=10'
    )

    tasks.value = data.todos.map(todo => ({
      id: todo.id,
      title: todo.todo,
      completed: todo.completed,
      editing: false,
      saving: false
    }))
  } catch (err) {
    console.log(err)
    error.value = 'Nie udało się pobrać zadań.'
  } finally {
    loading.value = false
  }
}

fetchTasks()

const filter = ref('all')
const searchQuery = ref('')

function handleRemoved(id) {
  tasks.value = tasks.value.filter(task => task.id !== id)
}

const toast = useToast()

async function removeAll() {
  try {
    await Promise.all(
      tasks.value.map(task =>
        $fetch(`https://dummyjson.com/todos/${task.id}`, {
          method: 'DELETE'
        })
      )
    )

    tasks.value = []
    toast.add({
      title: 'Pomyślnie usunięto wszystkie zadania',
      color: 'success'
    })
  } catch (err) {
    console.log(err)
    toast.add({
      title: 'Nie udało się usunąć zadań',
      color: 'error'
    })
  }
}

function handleEditChange(id) {
  const task = tasks.value.find(t => t.id === id)
  task.editing = !task.editing
}

function handleAdded(newTodo) {
  tasks.value.push({
    id: newTodo.id,
    title: newTodo.todo,
    completed: newTodo.completed,
    editing: false,
    saving: false
  })
}

const hasEditingState = computed(() => tasks.value.some(t => t.editing))

const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
const remainingCount = computed(() => tasks.value.filter(t => !t.completed).length)

const badgeClass = computed(() => {
  const count = remainingCount.value

  if (count <= 2) return 'bg-green-500'
  if (count <= 5) return 'bg-yellow-500'

  return 'bg-red-500 animate-pulse'
})

const filteredTasks = computed(() => {
  let result = tasks.value

  if (filter.value === 'active') {
    result = result.filter(task => !task.completed)
  }

  if (filter.value === 'completed') {
    result = result.filter(task => task.completed)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()

    result = result.filter(task =>
      task.title.toLowerCase().includes(query)
    )
  }

  return result
})
</script>
