<template>
  <div>
    <Nuxt />
    <app-footer />
  </div>
</template>

<script>
import AppFooter from '~/components/shared/footer'
export default {
  components: { AppFooter }
}

</script>

<style>
html {
  @apply bg-indigo-50
}
</style>
