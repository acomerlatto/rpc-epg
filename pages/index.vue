<template>
  <div class="py-6">
    <div class="mb-6 text-center">
      <img ref="logotipo" class="logotipo" src="/images/logo.png" alt="Logotipo RPC">
      <h2 class="text-blue-900 text-2xl capitalize font-bold">
        {{ $moment(dataProgramacao, 'YYYY-MM-DD').format('dddd, DD [de] MMMM') }}
      </h2>
    </div>

    <app-on-air v-if="noAr && programaAtual" ref="on-air" class="my-8" :programa="programaAtual" />

    <div class="mt-6">
      <app-card-detalhes v-for="(programa, index) in programas" :key="index" :programa="programa" :programaAtual="programa === programaAtual" />
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
    const dataProgramacao = $moment()
    const epgToday = await $axios.$get(`/epg?date=${dataProgramacao.format('YYYY-MM-DD')}`)
    const epgYesterday = await $axios.$get(`/epg?date=${$moment(dataProgramacao).subtract(1, 'day').format('YYYY-MM-DD')}`)

    return { epg: epgToday.programme.entries.concat(epgYesterday.programme.entries), dataProgramacao }
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
    programas () {
      const $this = this
      const inicioHoje = $this.$moment().startOf('day')
      const fimHoje = $this.$moment().endOf('day')

      return this.epg.filter(elemento => $this.$moment.unix(elemento.start_time).isBetween(inicioHoje, fimHoje))
        .sort(function (a, b) {
          if (a.start_time < b.start_time) { return -1 }

          if (a.start_time > b.start_time) { return 1 }

          return 0
        })
    },
    imagem () {
      return this.programaAtual.custom_info.Graficos.ImagemURL
    },

    horarioInicio () {
      return this.$moment.unix(this.programaAtual.start_time).format('HH:mm')
    },

    noAr () {
      return this.dataProgramacao.isSame(this.$moment(), 'day')
    }
  },
  mounted () {
    this.definirProgramaAtual()

    this.timer = setInterval(this.definirProgramaAtual, 1000)
  },
  methods: {
    definirProgramaAtual () {
      const $this = this
      this.programaAtual = this.programas.find(function (elemento) {
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
