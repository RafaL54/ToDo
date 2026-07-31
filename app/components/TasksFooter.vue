<template>
  <div v-if="tasksCount">
    <div class="flex gap-3">
      <div class="mt-5">
        <UButton
          class="ml-auto"
          variant="solid"
          color="error"
          @click="emit('remove-all')"
        >
          Usuń wszystko
        </UButton>
      </div>
    </div>

    <div class="mt-6 text-sm text-gray-500">
      Wykonane:
      {{ completedCount }}
      /
      {{ tasksCount }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  tasksCount: {
    type: Number,
    required: true
  },
  completedCount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['remove-all'])
</script>
