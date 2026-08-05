<template>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">
      Moja lista zadań
    </h1>

    <div class="flex items-center gap-3">
      <UBadge
        v-if="remainingCount"
        size="lg"
        :color="badgeColor"
        :class="{ 'animate-pulse': badgeColor === 'error' }"
      >
        {{ remainingCount }} zostało
      </UBadge>

      <UButton
        color="neutral"
        variant="subtle"
        @click="handleLogout"
      >
        Wyloguj
      </UButton>
    </div>
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

const { logout } = useAuth()

async function handleLogout() {
  await logout()
  await navigateTo('/login')
}
</script>
