export default {
  computed: {
    cp: function () {
      return this.$router.currentRoute.query.currentPage
        ? Number(this.$router.currentRoute.query.currentPage) : 1
    },
    pageCount: function () {
      const pageSize = this.$router.currentRoute.query.perPage
        ? Number(this.$router.currentRoute.query.perPage) : 10
      return Math.round(this.$props.totalRows / pageSize)
    },
    leftDisabled: function () {
      return this.cp === 1
    },
    rightDisabled: function () {
      return this.cp === this.pageCount
    }
  },
  props: ['totalRows'],
  methods: {
    left: function () {
      const query = Object.assign({}, this.$router.currentRoute.query, {
        currentPage: this.cp - 1
      })
      this.$router.push({ query })
    },
    right: function () {
      const query = Object.assign({}, this.$router.currentRoute.query, {
        currentPage: this.cp + 1
      })
      this.$router.push({ query })
    }
  },
  template: `
  <div class="float-right">
    <b-button @click="left" :disabled="leftDisabled"><< zpět</b-button>

    {{ cp }} / {{ pageCount }}
    
    <b-button @click="right" :disabled="rightDisabled">vpřed >></b-button>
  </div>
  `
}
//<b-pagination align="right" :value="cp"
//:total-rows="totalRows" :per-page="perPage" @change="onChange">
//</b-pagination>