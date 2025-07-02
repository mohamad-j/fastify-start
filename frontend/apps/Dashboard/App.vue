<template>
  <div id="app" class="app">
    <header class="app-header">
      <h1>{{ title }}</h1>
    </header>
    <main class="app-main">
      <HelloWorld :message="message" />
    </main>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'DashboardApp',
  components: {
    HelloWorld
  },
  data() {
    return {
      title: 'Dashboard App',
      message: 'Welcome to your new Vue.js app!'
    }
  }
}
</script>

<style lang="scss">
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.app-header {
  margin-bottom: 2rem;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>