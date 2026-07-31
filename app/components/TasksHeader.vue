<template>
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
</template>

<script setup>
defineProps({
  remainingCount: {
    type: Number,
    required: true
  },
  badgeClass: {
    type: String,
    required: true
  }
})
</script>
