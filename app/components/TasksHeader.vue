<template>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">
      Moja lista zadań
    </h1>

    <UBadge
      v-if="remainingCount"
      size="lg"
      :color="badgeColor"
      :class="{ 'animate-pulse': badgeColor === 'error' }"
    >
      {{ remainingCount }} zostało
    </UBadge>
  </div>
</template>

<script setup>
defineProps({
  remainingCount: {
    type: Number,
    required: true
  },
  badgeColor: {
    type: String,
    required: true
  }
})
</script>
