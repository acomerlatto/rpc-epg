<template>
  <div class="py-6">
    <div class="mb-6 text-center">
      <img ref="logotipo" class="logotipo" src="/images/logo.png" alt="Logotipo RPC">
      <h2 class="text-blue-900 text-4xl capitalize font-bold">
        {{ $moment(dataProgramacao, 'YYYY-MM-DD').format('dddd, DD [de] MMMM') }}
      </h2>
    </div>

    <app-on-air v-if="noAr && programaAtual" ref="on-air" class="my-8" :programa="programaAtual" />

    <div class="mt-6">
      <app-card-detalhes v-for="(programa, index) in epg.programme.entries" :key="index" :programa="programa" />
    </div>
  </div>
</template>

<script>
import OnAir from '~/components/epg/on-air'
import Card from '~/components/epg/card'

export default {
  name: 'EPGIndex',
  components: {
    AppOnAir: OnAir,
    AppCardDetalhes: Card
  },
  async asyncData ({ $axios, $moment }) {
    // Retira-se 4 horas pois a programação da Globo/RPC inicia um novo dia às 04:00
    const dataProgramacao = $moment().subtract(4, 'hours').format('YYYY-MM-DD')
    const epg = await $axios.$get(`/epg?date=${dataProgramacao}`)

    return { epg, dataProgramacao }
  },
  data () {
    return {
      programaAtual: null,
      timer: null
    }
  },
  head () {
    return {
      title: 'RPC - Grade de Programação'
    }
  },
  computed: {
    imagem () {
      return this.programaAtual.custom_info.Graficos.ImagemURL
    },

    horarioInicio () {
      return this.$moment.unix(this.programaAtual.start_time).format('HH:mm')
    },

    noAr () {
      const agora = this.$moment().subtract(4, 'hours').format('YYYY-MM-DD')

      return this.dataProgramacao === agora
    }
  },
  mounted () {
    this.definirProgramaAtual()

    this.timer = setInterval(this.definirProgramaAtual, 1000)
  },
  methods: {
    definirProgramaAtual () {
      const $this = this
      this.programaAtual = this.epg.programme.entries.find(function (elemento) {
        const inicio = $this.$moment.unix(elemento.start_time)
        const fim = $this.$moment.unix(elemento.end_time)

        return $this.$moment().isBetween(inicio, fim)
      })
    }
  }
}
</script>

<style>
.logotipo {
  @apply mx-auto w-64 h-auto
}
</style>
