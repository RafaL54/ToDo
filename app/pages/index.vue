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
          :disabled="isEditing"
          @add="addTask"
        />

        <div class="flex gap-3 mb-5">
          <select
            v-model="filter"
            class="border rounded px-2 py-2 bg-white cursor-pointer"
          >
            <option value="all">
              Wszystkie
            </option>
            <option value="active">
              Aktywne
            </option>
            <option value="completed">
              Ukończone
            </option>
          </select>

          <select
            v-model="sort"
            class="border rounded px-2 py-2 bg-white cursor-pointer"
          >
            <option value="none">
              Bez sortowania
            </option>

            <option value="date">
              Data
            </option>

            <option value="status">
              Status
            </option>
          </select>

          <input
            v-model="searchQuery"
            placeholder="Szukaj zadania..."
            class="flex-1 border rounded px-3 py-2 bg-white"
          >
        </div>

        <TaskList
          :tasks="filteredTasks"
          @toggle="toggleTask"
          @remove="removeTask"
          @edit="editTask"
          @editing-change="isEditing = $event"
        />
        <div class="flex gap-3">
          <div
            v-if="hasCompleted"
            class="mt-5"
          >
            <button
              class="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
              @click="removeCompleted"
            >
              Usuń zaznaczone
            </button>
          </div>

          <div
            class="mt-5"
          >
            <button
              class="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
              @click="removeAllTasks"
            >
              Usuń wszystko
            </button>
          </div>
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
const {
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
} = useTasks()

const filter = ref('all')
const searchQuery = ref('')
const sort = ref('none')
const isEditing = ref(false)

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

  if (searchQuery.value) {
    result = result.filter(task =>
      task.title
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase())
    )
  }

  if (sort.value === 'date') {
    result = [...result].sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1

      return new Date(a.dueDate) - new Date(b.dueDate)
    })
  }

  if (sort.value === 'status') {
    result = [...result].sort((a, b) => {
      return a.completed - b.completed
    })
  }

  return result
})
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
