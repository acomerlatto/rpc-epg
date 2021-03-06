<template>
  <div class="py-6">
    <div class="flex-auto justify-center items-center flex md:space-x-4 mb-6">
      <button class="btn btn-rounded btn-primary-outline hidden md:flex focus:outline-none" @click="baixarNovoGuia($moment(dataProgramacao).subtract(2, 'day'))">
        {{ $moment(dataProgramacao).subtract(2, 'day').format('DD/MM') }}
      </button>
      <button class="btn btn-rounded btn-primary-outline focus:outline-none" @click="baixarNovoGuia($moment(dataProgramacao).subtract(1, 'day'))">
        {{ $moment(dataProgramacao).subtract(1, 'day').format('DD/MM') }}
      </button>
      <div class="btn btn-rounded bg-blue-900 text-white text-center mx-4">
        {{ dataProgramacao.isSame($moment(), 'date') ? 'Hoje' : dataProgramacao.format('DD/MM') }}
      </div>
      <button class="btn btn-rounded btn-primary-outline focus:outline-none" @click="baixarNovoGuia($moment(dataProgramacao).add(1, 'day'))">
        {{ $moment(dataProgramacao).add(1, 'day').format('DD/MM') }}
      </button>
      <button class="btn btn-rounded btn-primary-outline hidden md:flex focus:outline-none" @click="baixarNovoGuia($moment(dataProgramacao).add(2, 'day'))">
        {{ $moment(dataProgramacao).add(2, 'day').format('DD/MM') }}
      </button>
    </div>

    <div class="mb-6 text-center">
      <img ref="logotipo" class="logotipo" src="/images/logo.png" alt="Logotipo RPC">
      <h2 class="text-blue-900 text-2xl capitalize font-bold">
        {{ $moment(dataProgramacao, 'YYYY-MM-DD').format('dddd, DD [de] MMMM') }}
      </h2>
    </div>

    <app-on-air v-if="noAr && programaAtual" ref="on-air" class="my-8" :programa="programaAtual" />

    <div class="mt-6">
      <app-card-detalhes v-for="(programa, index) in programas" :key="index" :programa="programa" :programa-atual="programa === programaAtual" />
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
  async asyncData ({ $axios, $moment, $_ }) {
    const dataProgramacao = $moment()
    const epgInicial = await $axios.$get(`/epg?date=${dataProgramacao.format('YYYY-MM-DD')}`)
    const epgFinal = await $axios.$get(`/epg?date=${$moment(dataProgramacao).subtract(1, 'day').format('YYYY-MM-DD')}`)

    return { epg: $_.concat(epgInicial.programme.entries, epgFinal.programme.entries), dataProgramacao }
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
      const inicioHoje = this.$moment(this.dataProgramacao).startOf('day')
      const fimHoje = this.$moment(this.dataProgramacao).endOf('day')
      const agora = this.$moment()

      const filter = function (el) {
        const inicio = $this.$moment.unix(el.start_time)
        const fim = $this.$moment.unix(el.end_time)

        const gradeHoje = inicio.isBetween(inicioHoje, fimHoje)
        const noAr = agora.isBetween(inicio, fim) && $this.dataProgramacao.isSame(fim, 'day')

        return gradeHoje || noAr
      }

      let epg = this.epg
      epg = this.$_.filter(epg, filter)
      epg = this.$_.orderBy(epg, ['start_time'])
      return this.$_.uniqBy(epg, 'start_time')
    },

    noAr () {
      return this.dataProgramacao.isSame(this.$moment(), 'day')
    }
  },
  mounted () {
    this.fazerLeituraPrograma()
  },
  methods: {
    fazerLeituraPrograma () {
      this.timer = setInterval(this.definirProgramaAtual, 1000)
      this.definirProgramaAtual()
    },
    cancelarLeituraPrograma () {
      clearInterval(this.timer)
      this.programaAtual = this.timer = null
    },
    definirProgramaAtual () {
      const $this = this
      this.programaAtual = this.programas.find(function (elemento) {
        const inicio = $this.$moment.unix(elemento.start_time)
        const fim = $this.$moment.unix(elemento.end_time)

        return $this.$moment().isBetween(inicio, fim)
      })
    },
    async baixarNovoGuia (data) {
      const epgInicial = await this.$axios.$get(`/epg?date=${data.format('YYYY-MM-DD')}`)
      const epgFinal = await this.$axios.$get(`/epg?date=${this.$moment(data).subtract(1, 'day').format('YYYY-MM-DD')}`)

      this.dataProgramacao = data
      this.epg = epgInicial.programme.entries.concat(epgFinal.programme.entries)
      return this.noAr ? this.fazerLeituraPrograma() : this.cancelarLeituraPrograma()
    }
  }
}
</script>

<style>
.logotipo {
  @apply mx-auto w-64 h-auto
}

.btn {
  @apply py-2 w-36 items-center justify-center font-bold
}
.btn-rounded {
  @apply rounded-full
}
.btn-primary-outline {
  @apply border border-blue-900 text-blue-900 hover:border-blue-800 hover:text-blue-800
}
</style>
