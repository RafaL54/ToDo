<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <h1 class="text-2xl font-semibold text-center mb-6">
          Zaloguj się
        </h1>

        <UForm
          novalidate
          @submit="handleLogin"
        >
          <div class="space-y-5">
            <UFormField
              label="E-mail"
              :error="submitted ? emailError : undefined"
            >
              <UInput
                v-model="email"
                type="email"
                placeholder="rafal@example.com"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Hasło"
              :error="submitted ? passwordError : undefined"
            >
              <UInput
                v-model="password"
                type="password"
                placeholder="Wprowadź hasło"
                class="w-full"
              />
            </UFormField>

            <p
              v-if="errorMessage"
              class="text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 text-sm"
            >
              {{ errorMessage }}
            </p>

            <UButton
              type="submit"
              block
              size="lg"
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
const emailError = ref('')
const passwordError = ref('')
const errorMessage = ref('')
const submitted = ref(false)

const { login } = useAuth()

function validateForm() {
  emailError.value = ''
  passwordError.value = ''

  if (!email.value.trim()) {
    emailError.value = 'E-mail jest wymagany.'
  } else if (!email.value.includes('@')) {
    emailError.value = 'Podaj poprawny adres e-mail.'
  }

  if (!password.value.trim()) {
    passwordError.value = 'Hasło jest wymagane.'
  }

  return !emailError.value && !passwordError.value
}

async function handleLogin() {
  submitted.value = true
  errorMessage.value = ''

  if (!validateForm()) {
    return
  }

  try {
    await login(email.value, password.value)
    await navigateTo('/tasks')
  } catch {
    errorMessage.value = 'Nieprawidłowy e-mail lub hasło.'
  }
}
</script>
