<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <h1 class="text-2xl font-semibold text-center mb-6">
          Zaloguj się
        </h1>

        <p
          v-if="errorMessage"
          class="text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-sm"
        >
          {{ errorMessage }}
        </p>

        <UForm @submit="handleLogin">
          <div class="space-y-5">
            <UFormField label="E-mail">
              <UInput
                v-model="email"
                type="email"
                placeholder="rafal@example.com"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Hasło">
              <UInput
                v-model="password"
                type="password"
                placeholder="Wprowadź hasło"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              size="lg"
              class="mt-2"
            >
              Zaloguj się
            </UButton>
          </div>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'guest'
})

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const { login } = useAuth()

async function handleLogin() {
  if (!email.value.trim() || !password.value.trim()) {
    return
  }

  errorMessage.value = ''

  try {
    await login(email.value, password.value)
    await navigateTo('/tasks')
  } catch {
    errorMessage.value = 'Nieprawidłowy e-mail lub hasło.'
  }
}
</script>
