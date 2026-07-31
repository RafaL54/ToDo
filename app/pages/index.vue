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
            :class="[
              'px-3 py-1 rounded text-white text-sm',
              badgeClass
            ]"
          >
            {{ remainingCount }} zostało
          </span>
        </div>

        <TaskInput />

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

        <TaskList />

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

          <div class="mt-5">
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
import { useTasksStore } from '~/stores/tasks'
import { storeToRefs } from 'pinia'

const {
  fetchTasks
} = useTasksStore()

const {
  tasks,
  removeCompleted,
  removeAllTasks,
  completedCount,
  remainingCount,
  hasCompleted,
  filter,
  searchQuery,
  sort,
  badgeClass
} = storeToRefs(useTasksStore())

fetchTasks()
</script>
