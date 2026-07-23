<template>
        <div
          v-if="tasks.length === 0"
          class="text-center text-gray-500 py-5"
        >
          Brak zadań
        </div>

        <div
          v-for="task in tasks"
           :key="task.id"
          >
		  <TaskItem 
		   :task="task"
		   @toggle="emit('toggle', $event)"
		   @remove="emit('remove', $event)" 
		  />
		  </div>
</template>

<script setup>

const emit = defineEmits([
	'toggle',
	'remove'
])

defineProps({
	tasks: Array
})

</script>