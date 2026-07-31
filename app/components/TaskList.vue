<template>
  <div
    v-if="isLoading"
    class="text-center py-5 text-gray-500"
  >
    Ładowanie...
  </div>
  <template v-else>
    <div
      v-if="!filteredTasks.length"
      class="text-center text-gray-500 py-5"
    >
      Brak zadań
    </div>

    <template v-else>
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="flex items-center justify-between w-full gap-3 border-b py-3"
      >
        <TaskItem :task="task" />
      </div>
    </template>
  </template>
</template>

<script setup>
import { useTasksStore } from '~/stores/tasks'
import { storeToRefs } from 'pinia'

const {
  filteredTasks,
  isLoading
} = storeToRefs(useTasksStore())
</script>
