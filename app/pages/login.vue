<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="border rounded-lg p-6 shadow bg-gray-50">
        <h1 class="text-2xl font-semibold mb-6">
          Logowanie
        </h1>

        <UForm>
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
</script>
