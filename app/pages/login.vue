<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <h1 class="text-2xl font-semibold mb-6">
          Logowanie
        </h1>

        <p
          v-if="errorMessage"
          class="text-red-500 mb-4"
        >
          {{ errorMessage }}
        </p>

        <UForm @submit="handleLogin">
          <UFormField label="E-mail">
            <UInput v-model="email" />
          </UFormField>

          <UFormField label="Hasło">
            <UInput
              v-model="password"
              type="password"
            />
          </UFormField>

          <UButton
            type="submit"
            class="mt-4"
          >
            Zaloguj
          </UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  } catch {
    errorMessage.value = 'Nieprawidłowy e-mail lub hasło.'
  }
}
