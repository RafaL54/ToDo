export function useTasks() {
  const tasks = ref([])

  onMounted(() => {
    const savedTasks = localStorage.getItem('tasks')

    if (savedTasks) {
      tasks.value = JSON.parse(savedTasks)
    }
  })

  watch(
    tasks,
    () => {
      localStorage.setItem('tasks', JSON.stringify(tasks.value))
    },
    { deep: true }
  )

  const completedCount = computed(
    () => tasks.value.filter(task => task.completed).length
  )

  const remainingCount = computed(
    () => tasks.value.filter(task => !task.completed).length
  )

  const hasCompleted = computed(() =>
    tasks.value.some(task => task.completed)
  )

  function addTask(task) {
    tasks.value.push({
      id: Date.now(),
      title: task.title,
      completed: false,
      dueDate: task.dueDate
    })
  }

  function toggleTask(task) {
    task.completed = !task.completed
  }

  function removeTask(task) {
    tasks.value = tasks.value.filter(item => item.id !== task.id)
  }

  function removeCompleted() {
    tasks.value = tasks.value.filter(task => !task.completed)
  }

  function editTask({ id, newTitle, newDate }) {
    const task = tasks.value.find(task => task.id === id)

    if (task) {
      task.title = newTitle
      task.dueDate = newDate
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
    hasCompleted
  }
}
