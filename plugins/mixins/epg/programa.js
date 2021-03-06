export default {
  computed: {
    imagem () {
      return this.programa.custom_info.Graficos.ImagemURL || '/images/noimage.png'
    },
    logotipo () {
      return this.programa.custom_info.Graficos.LogoURL || '/images/noimage.png'
    },
    horarioInicio () {
      return this.$moment.unix(this.programa.start_time).format('HH:mm')
    },
    categoria () {
      return this.programa.program.category
    },
    nomePrograma () {
      return this.programa.title
    },
    descricaoPrograma () {
      return this.programa.description
    }
  }
}
