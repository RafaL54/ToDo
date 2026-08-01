<template>
  <div>
    <div v-if="loading">
      <slot name="loading" />
    </div>

    <template v-else>
      <div v-if="!tasks.length">
        <slot name="empty" />
      </div>

      <template v-else>
        <div
          v-for="task in tasks"
          :key="task.id"
          class="flex items-center justify-between w-full gap-3 border-b py-3"
        >
          <slot
            name="item"
            :task="task"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup>
defineProps({
  tasks: Array,
  loading: Boolean
})
</script>
