<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="mx-auto max-w-3xl w-full">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <TasksHeader
          :remaining-count="remainingCount"
          :badge-color="badgeColor"
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
          :loading="pending"
        >
          <template #loading>
            <div class="text-center py-5 text-gray-500">
              Ładowanie...
            </div>
          </template>

          <template #empty>
            <div class="text-center text-gray-500 py-5">
              Brak zadań
            </div>
          </template>

          <template #item="{ task }">
            <TaskItem
              :task="task"
              show-details
              @removed="handleRemoved"
              @edit-change="handleEditChange"
            />
          </template>
        </TaskList>

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

const tasks = useState('tasks', () => [])

const { data, pending, error } = await useFetch(
  'https://dummyjson.com/todos?limit=10'
)

if (error.value) {
  console.log(error.value)
}

if (!tasks.value.length && data.value) {
  tasks.value = data.value.todos.map(todo => ({
    id: todo.id,
    title: todo.todo,
    completed: todo.completed,
    editing: false,
    saving: false,
    fromApi: true
  }))
}

const filter = ref('all')
const searchQuery = ref('')

function handleRemoved(id) {
  tasks.value = tasks.value.filter(task => task.id !== id)
}

const toast = useToast()

async function removeAll() {
  try {
    await Promise.all(
      tasks.value
        .filter(task => task.fromApi)
        .map(task =>
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
    saving: false,
    fromApi: false
  })
}

const hasEditingState = computed(() => tasks.value.some(t => t.editing))

const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
const remainingCount = computed(() => tasks.value.filter(t => !t.completed).length)

const badgeColor = computed(() => {
  const count = remainingCount.value

  if (count <= 2) return 'success'
  if (count <= 5) return 'warning'

  return 'error'
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
