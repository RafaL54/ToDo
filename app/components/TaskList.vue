<template>
  <div>
    <div
      v-if="loading"
      class="text-center py-5 text-gray-500"
    >
      Ładowanie...
    </div>

    <template v-else>
      <div
        v-if="!tasks.length"
        class="text-center text-gray-500 py-5"
      >
        Brak zadań
      </div>

      <template v-else>
        <div
          v-for="task in tasks"
          :key="task.id"
          class="flex items-center justify-between w-full gap-3 border-b py-3"
        >
          <TaskItem
            :task="task"
            @removed="emit('removed', $event)"
            @edit-change="emit('edit-change', $event)"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
const emit = defineEmits(['removed', 'edit-change'])
defineProps({
  tasks: Array,
  loading: Boolean
})
</script>
