<template>
  <div>
    <div class="flex gap-2 mb-6">
      <input
        v-model="newTitle"
        :disabled="editing || isAdding"
        class="flex-1 border rounded px-3 py-2 bg-white cursor-caret disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
        placeholder="Dodaj zadanie..."
        @keyup.enter="addTask"
      >

      <button
        :disabled="editing || isAdding"
        class="bg-green-500 text-white px-4 rounded cursor-pointer disabled:bg-gray-200 disabled:cursor-not-allowed"
        @click="addTask"
      >
        Dodaj
      </button>
    </div>

    <p
      v-if="error"
      class="text-center text-red-500 text-lg mb-6"
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
