<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="mx-auto max-w-3xl w-full">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <NuxtLink to="/tasks">
          <UButton
            icon="i-lucide-arrow-left"
            color="success"
            variant="solid"
            class="mb-6"
          >
            Wróć do listy
          </UButton>
        </NuxtLink>

        <div v-if="loading">
          <div class="text-center py-10 text-gray-500">
            Ładowanie...
          </div>
        </div>

        <template v-else>
          <div v-if="task">
            <h1 class="text-2xl font-semibold mb-6">
              Szczegóły zadania
            </h1>

            <div class="border rounded-lg p-4 bg-white">
              <h2
                class="text-lg font-medium mb-3"
                :class="{
                  'line-through text-gray-400': task.completed
                }"
              >
                {{ task.todo }}
              </h2>

              <p class="text-sm">
                Status:
                <span
                  :class="{
                    'text-green-500': task.completed,
                    'text-red-500': !task.completed
                  }"
                >
                  {{ task.completed ? 'Wykonane' : 'Do wykonania' }}
                </span>
              </p>
            </div>
          </div>

          <template v-else>
            <div class="text-center py-10 text-gray-500">
              Nie znaleziono zadania.
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

const loading = ref(true)
const task = ref(null)

async function fetchTask() {
  try {
    task.value = await $fetch(
      `https://dummyjson.com/todos/${route.params.id}`
    )
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

fetchTask()
</script>
