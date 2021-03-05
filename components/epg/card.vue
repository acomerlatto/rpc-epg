<template>
  <div>
    <div class="detalhes" @click="exibirDetalhes">
      <!-- Desktpo -->
      <img :src="imagem" alt="Imagem" class="flex-none object-cover w-56 h-auto hidden md:block md:rounded-l">
      <div class="ml-3 hidden md:flex md:flex-col md:py-2 md:pr-2">
        <!-- Titulo -->
        <div>
          <div v-if="programaAtual" class="inline-flex align-middle">
            <ping-no-ar />
          </div>
          <div class="inline-flex align-middle text-blue-900 font-bold">
            <p><fa v-if="!programaAtual" :icon="['far', 'clock']" /> <span class="font-normal">{{ horarioInicio }}</span> {{ programa.title }}</p>
          </div>
        </div>

        <!-- Categorias -->
        <div class="my-1 hidden md:block">
          <span class="bg-blue-300 rounded-full py-1 px-2 text-white text-xs">{{ categoria }}</span>
        </div>

        <!-- Descrição -->
        <div class="text-sm break-words hidden md:block">
          {{ programa.description }}
        </div>
      </div>

      <!--  Mobile  -->
      <img :src="logotipo" alt="Logotipo" class="flex-none object-cover rounded-l w-14 md:hidden">
      <div class="ml-3 my-auto flex-auto content-center md:hidden">
        <div v-if="programaAtual" class="inline-flex align-middle">
          <ping-no-ar />
        </div>
        <div class="inline-flex align-middle text-blue-900 font-bold">
          <p><fa v-if="!programaAtual" :icon="['far', 'clock']" /> <span class="font-normal">{{ horarioInicio }}</span> {{ programa.title }}</p>
        </div>
      </div>
    </div>

    <!-- Modal para Mobile -->
    <card-modal v-if="detalhes" :programa="programa" @fechar="fecharDetalhes" />
  </div>
</template>

<script>

import CardModal from '~/components/epg/card-modal'
import ComputedPrograma from '~/plugins/mixins/epg/programa'
import PingNoAr from '~/components/elements/ping-no-ar'

export default {
  name: 'Card',
  components: {
    CardModal,
    PingNoAr
  },
  mixins: [ComputedPrograma],
  props: {
    programa: {
      type: Object,
      required: true
    },
    programaAtual: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      detalhes: false
    }
  },
  methods: {
    exibirDetalhes () {
      if (window.innerWidth >= 768) { return }

      this.detalhar()
    },

    fecharDetalhes () {
      this.detalhar()
    },
    detalhar () {
      const root = document.getElementsByTagName('html').item(0)

      if (this.detalhes) {
        root.classList.remove('overflow-hidden')
      } else {
        root.classList.add('overflow-hidden')
      }

      this.detalhes = !this.detalhes
    }
  }
}
</script>

<style>
.detalhes {
  @apply flex rounded w-11/12 md:w-10/12 lg:w-2/3 xl:w-1/2 md:h-40 mx-auto my-4 p-0 bg-white shadow md:shadow-md cursor-pointer md:cursor-default
}
</style>
