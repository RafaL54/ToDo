<template>
  <div class="flex flex-col gap-2 mb-6">
    <div class="flex gap-2">
      <UInput
        v-model="newTitle"
        :disabled="editing || isAdding"
        :color="error ? 'error' : 'primary'"
        class="flex-1"
        placeholder="Dodaj zadanie..."
        @keyup.enter="addTask"
        @blur="newTitle.length ? error = null : ''"
      />

      <UButton
        :disabled="editing || isAdding"
        color="success"
        @click="addTask"
      >
        Dodaj
      </UButton>
    </div>

    <p
      v-if="error"
      class="text-left text-error"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  editing: Boolean
})

const emit = defineEmits(['added'])

const newTitle = ref('')

const isAdding = ref(false)
const error = ref(false)

const toast = useToast()

async function addTask() {
  if (!newTitle.value.length) {
    error.value = 'Uzupełnij treść'
    return
  }

  isAdding.value = true
  error.value = null

  try {
    const data = await $fetch(
      'https://dummyjson.com/todos/add',
      {
        method: 'POST',
        body: {
          todo: newTitle.value.trim(''),
          userId: 1
        }
      }
    )

    newTitle.value = ''

    emit('added', data)
    toast.add({
      title: 'Pomyślnie dodano zadanie',
      color: 'success'
    })
  } catch (err) {
    console.log(err)
    toast.add({
      title: 'Ups coś poszło nie tak',
      color: 'error'
    })
  } finally {
    isAdding.value = false
  }
}
</script>
