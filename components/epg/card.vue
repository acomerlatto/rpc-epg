<template>
  <div class="flex rounded w-11/12 md:w-10/12 lg:w-2/3 xl:w-1/2 md:h-40 mx-auto my-4 p-0 bg-white shadow md:shadow-md">
    <!-- Imagem presente nos dispositivos maiores -->
    <img :src="imagem" alt="Imagem" class="flex-none object-cover w-56 h-auto hidden md:block md:rounded-l">

    <!--  Logotipo presente no mobile  -->
    <img :src="logotipo" alt="Logotipo" class="flex-none object-cover rounded-l w-12 md:hidden">

    <!-- Titulo +  Descrição (dispositivos grandes) -->
    <div class="ml-3 hidden md:flex md:flex-col md:py-2 md:pr-2">
      <!-- Titulo -->
      <div class="hover:text-red-600">
        <span class="font-semibold text-blue-900">
          <span class="text-blue-900"><fa :icon="['far', 'clock']" /> {{ horarioInicio }}</span>
          {{ programa.title }}</span>
      </div>

      <!-- Categorias -->
      <div class="my-1 hidden md:block">
        <span class="bg-blue-300 rounded-full py-1 px-2 text-white text-xs">{{ programa.program.category }}</span>
      </div>

      <!-- Descrição -->
      <div class="text-sm break-words hidden md:block">
        {{ programa.description }}
      </div>
    </div>

    <!-- Titulo (mobile) -->
    <div class="ml-3 flex flex-wrap content-center md:hidden">
      <span class="text-blue-900 font-bold">
        <span class="font-normal"><fa :icon="['far', 'clock']" /> {{ horarioInicio }}</span>
        {{ programa.title }}
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Card',
  props: {
    programa: {
      type: Object,
      required: true
    }
  },
  computed: {
    imagem () {
      return this.programa.custom_info.Graficos.ImagemURL || '/images/noimage.png'
    },
    logotipo () {
      return this.programa.custom_info.Graficos.LogoURL || '/images/noimage.png'
    },
    horarioInicio () {
      return this.$moment.unix(this.programa.start_time).format('HH:mm')
    }
  }
}
</script>

<style scoped>

</style>
