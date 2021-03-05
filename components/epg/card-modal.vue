<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" :class="{'hidden' : !detalhes}">
    <div class="flex items-center justify-center w-full h-full text-center">
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white text-left overflow-hidden align-middle w-full h-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <div class="h-10 bg-blue-600 text-white">
          <div class="flex items-center justify-end h-10 pr-2">
            <div class="flex cursor-pointer" @click="fecharDetalhes">
              Fechar
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
        <img :src="imagem" alt="Imagem" class="flex-none object-cover object-top w-full max-h-48 block">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-left">
              <h3 id="modal-headline" class="text-lg leading-6 font-medium text-gray-900">
                <span class="font-semibold text-blue-900">
                  <span class="mr-1"><fa :icon="['far', 'clock']" /> {{ horarioInicio }}</span>
                  {{ programa.title }}
                </span>
              </h3>
              <span class="bg-blue-300 rounded-full py-1 px-2 text-white text-xs">{{ programa.program.category }}</span>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {{ programa.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CardModal',
  props: {
    detalhes: {},
    fecharDetalhes: {},
    horarioInicio: {},
    imagem: {},
    programa: {}
  }
}
</script>
