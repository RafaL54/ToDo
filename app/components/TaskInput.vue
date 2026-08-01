<template>
  <UForm
    :validate="validate"
    :state="state"
    class="flex flex-col gap-2 mb-6"
    @submit="addTask"
  >
    <UFormField
      name="title"
      class="flex-1"
    >
      <div class="flex gap-2">
        <UInput
          v-model="state.title"
          :disabled="editing || isAdding"
          class="flex-1"
          placeholder="Dodaj zadanie..."
        />

        <UButton
          type="submit"
          :disabled="editing || isAdding"
          color="success"
        >
          Dodaj
        </UButton>
      </div>
    </UFormField>
  </UForm>
</template>

<script setup lang="ts">
defineProps({
  editing: Boolean
})

const emit = defineEmits(['added'])

const state = reactive({
  title: ''
})

type Schema = typeof state

function validate(state: Partial<Schema>) {
  const errors = []

  if (!state.title?.trim()) {
    errors.push({
      name: 'title',
      message: 'Uzupełnij treść'
    })
  }

  return errors
}

const isAdding = ref(false)

const toast = useToast()

async function addTask() {
  isAdding.value = true

  try {
    const data = await $fetch(
      'https://dummyjson.com/todos/add',
      {
        method: 'POST',
        body: {
          todo: state.title.trim(),
          userId: 1
        }
      }
    )

    state.title = ''

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
