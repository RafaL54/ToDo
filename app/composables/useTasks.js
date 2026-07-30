export function useTasks() {
  const tasks = ref([])
  const isLoading = ref(false)
  const isAdding = ref(false)
  const error = ref(null)

  onMounted(async () => {
    isLoading.value = true

    try {
      const data = await $fetch(
        'https://dummyjson.com/todos?limit=10'
      )

      tasks.value = data.todos.map(todo => ({
        id: todo.id,
        title: todo.todo,
        completed: todo.completed,
        dueDate: null
      }))
    } catch (err) {
      console.log(err)
      error.value = 'Nie udało się pobrać zadań.'
    } finally {
      isLoading.value = false
    }
  })

  const completedCount = computed(
    () => tasks.value.filter(task => task.completed).length
  )

  const remainingCount = computed(
    () => tasks.value.filter(task => !task.completed).length
  )

  const hasCompleted = computed(() =>
    tasks.value.some(task => task.completed)
  )

  async function addTask(task) {
    isAdding.value = true
    error.value = null

    try {
      const data = await $fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        body: {
          todo: task.title,
          completed: false,
          userId: 1
        }
      })

      tasks.value.push({
        id: data.id,
        title: data.todo,
        completed: data.completed,
        dueDate: task.dueDate
      })
    } catch (err) {
      console.log(err)
      error.value = 'Nie udało się dodać zadania'
    } finally {
      isAdding.value = false
    }
  }

  async function toggleTask(task) {
    try {
      const data = await $fetch(
        `https://dummyjson.com/todos/${task.id}`,
        {
          method: 'PATCH',
          body: {
            completed: !task.completed
          }
        }
      )

      task.completed = data.completed
    } catch (err) {
      console.log(err)
      error.value = 'Nie udało się zaktualizować zadania'
    }
  }

  function removeTask(task) {
    tasks.value = tasks.value.filter(item => item.id !== task.id)
  }

  function removeCompleted() {
    tasks.value = tasks.value.filter(task => !task.completed)
  }

  async function editTask({ id, newTitle, newDate }) {
    const task = tasks.value.find(task => task.id === id)

    if (!task) return

    try {
      const data = await $fetch(
        `https://dummyjson.com/todos/${id}`,
        {
          method: 'PATCH',
          body: {
            todo: newTitle
          }
        }
      )

      console.log(data)

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
    isAdding
  }
}
