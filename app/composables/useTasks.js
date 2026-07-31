const tasks = ref([])
const isLoading = ref(false)
const isAdding = ref(false)
const error = ref(null)
const isEditing = ref(false)

const filter = ref('all')
const searchQuery = ref('')
const sort = ref('none')

export function useTasks() {
  async function fetchTasks() {
    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch(
        'https://dummyjson.com/todos?limit=10'
      )

      tasks.value = data.todos.map(todo => ({
        id: todo.id,
        title: todo.todo,
        completed: todo.completed,
        dueDate: null,
        fromApi: true
      }))
    } catch (err) {
      console.log(err)
      error.value = 'Nie udało się pobrać zadań.'
    } finally {
      isLoading.value = false
    }
  }

  const completedCount = computed(() =>
    tasks.value.filter(task => task.completed).length
  )

  const remainingCount = computed(() =>
    tasks.value.filter(task => !task.completed).length
  )

  const hasCompleted = computed(() =>
    tasks.value.some(task => task.completed)
  )

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

    if (sort.value === 'date') {
      result = [...result].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1

        return new Date(a.dueDate) - new Date(b.dueDate)
      })
    }

    if (sort.value === 'status') {
      result = [...result].sort((a, b) => {
        return Number(a.completed) - Number(b.completed)
      })
    }

    return result
  })

  async function addTask(task) {
    if (!task?.title?.trim()) return

    isAdding.value = true
    error.value = null

    try {
      const data = await $fetch(
        'https://dummyjson.com/todos/add',
        {
          method: 'POST',
          body: {
            todo: task.title.trim(),
            completed: false,
            userId: 1
          }
        }
      )

      tasks.value.push({
        id: Date.now(),
        title: data.todo,
        completed: false,
        dueDate: task.dueDate || null,
        fromApi: false
      })
    } catch (err) {
      console.log(err)
      error.value = 'Nie udało się dodać zadania'
    } finally {
      isAdding.value = false
    }
  }

  async function toggleTask(task) {
    const newCompleted = !task.completed

    if (!task.fromApi) {
      task.completed = newCompleted
      return
    }

    try {
      const data = await $fetch(
        `https://dummyjson.com/todos/${task.id}`,
        {
          method: 'PATCH',
          body: {
            completed: newCompleted
          }
        }
      )

      task.completed = data.completed
    } catch (err) {
      console.log(err)
      error.value = 'Nie udało się zaktualizować zadania'
    }
  }

  async function removeTask(task) {
    if (!task.fromApi) {
      tasks.value = tasks.value.filter(
        item => item.id !== task.id
      )

      return
    }

    try {
      await $fetch(
        `https://dummyjson.com/todos/${task.id}`,
        {
          method: 'DELETE'
        }
      )

      tasks.value = tasks.value.filter(
        item => item.id !== task.id
      )
    } catch (err) {
      console.log(err)
      error.value = 'Nie udało się usunąć zadania'
    }
  }

  function removeCompleted() {
    tasks.value = tasks.value.filter(
      task => !task.completed
    )
  }

  async function editTask({ id, newTitle, newDate }) {
    const task = tasks.value.find(
      task => task.id === id
    )

    if (!task) return

    if (!newTitle.trim()) return

    if (!task.fromApi) {
      task.title = newTitle.trim()
      task.dueDate = newDate
      return
    }

    try {
      const data = await $fetch(
        `https://dummyjson.com/todos/${id}`,
        {
          method: 'PATCH',
          body: {
            todo: newTitle.trim()
          }
        }
      )

      task.title = data.todo
      task.dueDate = newDate
    } catch (err) {
      console.log(err)
      error.value = 'Nie udało się zaktualizować zadania'
    }
  }

  function removeAllTasks() {
    const confirmDelete = confirm(
      'Czy na pewno chcesz usunąć wszystkie zadania?'
    )

    if (confirmDelete) {
      tasks.value = []
    }
  }

  const badgeClass = computed(() => {
    const count = remainingCount.value

    if (count <= 2) return 'bg-green-500'
    if (count <= 5) return 'bg-yellow-500'

    return 'bg-red-500 animate-pulse'
  })

  return {
    tasks,
    addTask,
    toggleTask,
    removeTask,
    removeCompleted,
    editTask,
    removeAllTasks,
    completedCount,
    remainingCount,
    hasCompleted,
    isLoading,
    error,
    isAdding,
    fetchTasks,
    isEditing,
    filter,
    searchQuery,
    sort,
    filteredTasks,
    badgeClass
  }
}
