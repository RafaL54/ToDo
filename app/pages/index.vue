<template>
  <div class="min-h-screen p-6">
    <div class="mx-auto max-w-xl">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">
            Moja lista zadań
          </h1>

          <span
            v-if="remainingCount"
            :class="['px-3 py-1 rounded text-white text-sm', badgeClass]"
          >
            {{ remainingCount }} zostało
          </span>
        </div>

        <TaskInput
          @add="addTask"
        />

        <TaskList
          :tasks="tasks"
          @toggle="toggleTask"
          @remove="removeTask"
        />

        <div
          v-if="hasCompleted"
          class="mt-5"
        >
          <button
            class="bg-red-500 text-white px-4 py-2 rounded"
            @click="removeCompleted"
          >
            Usuń zaznaczone
          </button>
        </div>

        <div class="mt-6 text-sm text-gray-500">
          Wykonane:
          {{ completedCount }}
          /
          {{ tasks.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const tasks = ref([])

const completedCount = computed(
  () => tasks.value.filter(task => task.completed).length
)
const remainingCount = computed(
  () => tasks.value.filter(task => !task.completed).length
)
const hasCompleted = computed(() => tasks.value.some(task => task.completed))

const badgeClass = computed(() => {
  const count = remainingCount.value

  if (count <= 2) return 'bg-green-500'
  if (count <= 5) return 'bg-yellow-500'

  return 'bg-red-500 animate-pulse'
})

function addTask(title) {
  tasks.value.push({
    id: Date.now(),
    title,
    completed: false
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

onMounted(() => {
  const saved = localStorage.getItem('tasks')

  if (saved) {
    tasks.value = JSON.parse(saved)
  }
})

watch(
  tasks,
  () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  },
  { deep: true }
)
</script>

/*
* Instrukcja — Trello
* ===================
* Zaproszenie do tablicy w Trello wysłałem na maila. Na liście "Today"
* znajdziesz 4 zadania do zrobienia, każde z opisem co trzeba zrobić.
*
* Workflow dla każdego zadania:
* 1. Każda karta ma pole "Branch" / "Gałąź" — to nazwa gałęzi, którą
*    zakładasz w gicie dla tego zadania.
* 2. Zaczynasz pracę:
*    - przypisz siebie do karty (+ Members), jeśli jeszcze nie jesteś przypisany
*    - przenieś kartę do listy "In Progress"
* 3. Kończysz pracę:
*    - zrób pull request z tej gałęzi do main i zmerguj go
*    - przenieś kartę do listy "Ready to Test"
*    - przypnij mnie do karty i odepnij siebie
*/
