<template>
  <div ref="onAir">
    <div class="ao-vivo" :class="{ 'on-body': !topFixed, 'on-top': topFixed }">
      <div class="flex w-full mx-auto" :class="{'md:w-10/12': topFixed, 'lg:w-2/3': topFixed, 'xl:w-1/2': topFixed}">
        <img :src="logotipo" alt="Logotipo Agora" class="w-10 hidden sm:block">
        <div class="w-full sm:ml-2">
          <div class="my-auto flex">
            <div class="flex-auto">
              <ping-no-ar />
              <p class="inline-flex align-middle text-blue-900 font-bold">
                <span class="text-red-600 font-normal mr-2">No Ar</span>{{ nomePrograma }}
              </p>
            </div>
            <div class="flex-auto text-right">
              <span class="align-middle text-red-500">{{ minutosRestantes }} min <span class="hidden md:inline">restante{{ minutosRestantes > 1 ? 's': '' }}</span></span>
            </div>
          </div>
          <div class="shadow w-full bg-gray-100 mt-1 rounded">
            <div ref="progress-bar" class="bg-red-600 py-1 leading-none text-xs rounded" :style="{ width: barraDeProgresso +'%' }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PingNoAr from '~/components/elements/ping-no-ar'
import ComputedPrograma from '~/plugins/mixins/epg/programa'

export default {
  name: 'EPGOnAir',
  components: { PingNoAr },
  mixins: [ComputedPrograma],
  props: {
    programa: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      timer: null,
      minutosRestantes: 0,
      barraDeProgresso: 0,
      topFixed: false
    }
  },
  mounted () {
    this.calcularProgresso()
    this.calcularPosicao()

    window.addEventListener('scroll', this.calcularPosicao)
    this.timer = setInterval(this.calcularProgresso, 500)
  },
  beforeDestroy () {
    clearInterval(this.timer)
    window.removeEventListener('scroll', this.calcularPosicao)
  },
  methods: {
    calcularProgresso () {
      const fracaoProgresso = this.$moment.duration(this.programa.duration_in_minutes, 'minutes').asMilliseconds() / 100

      const agora = this.$moment().utc()
      const inicioPrograma = this.$moment.unix(this.programa.start_time).utc()
      const fimPrograma = this.$moment.unix(this.programa.end_time).utc()

      const progresso = (agora - inicioPrograma) / fracaoProgresso

      this.barraDeProgresso = progresso.toFixed(2)
      this.minutosRestantes = Math.ceil(this.$moment.duration(fimPrograma - agora).asMinutes())
    },
    calcularPosicao () {
      this.topFixed = this.$refs.onAir.getBoundingClientRect().top < 0
    }
  }
}
</script>

<style scoped>

.ao-vivo {
  @apply bg-white shadow-md p-2
}

.ao-vivo.on-body {
  @apply w-11/12 md:w-10/12 lg:w-2/3 xl:w-1/2 mx-auto rounded
}

.ao-vivo.on-top {
  @apply w-full fixed top-0 z-10
}
</style>
