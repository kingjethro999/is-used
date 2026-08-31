<template>
  <div>
    <h1>{{ message }}</h1>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script>
export default {
  name: 'TestComponent',
  data() {
    return {
      message: 'Hello Vue!',
      unusedData: 'This is not used',
      anotherUnused: 123
    }
  },
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    },
    unusedComputed() {
      return 'Not used';
    }
  },
  methods: {
    handleClick() {
      console.log(this.message);
    },
    unusedMethod() {
      console.log('This method is never called');
    }
  }
}
</script>

<style scoped>
h1 {
  color: blue;
}
</style>
