export default {
  data: () => {
    return {
      shown: false,
      position: null
    }
  },
  props: ['config', 'disabled', 'data'],
  created () {
    function _extractVal () {
      const p = this.data[this.config.name] 
        ? this.data[this.config.name]
        : this.$store.state.cfg.defaultMapCenter
      const r = /\d+.\d*,\s*\d+.\d*/g
      return p.match(r) ? p.split(',') : [49.41812070066643, 14.666748046875002]
    }
    this.$data.position = _extractVal.bind(this)()
  },
  methods: {
    onSubmited () {
      this.data[this.config.name] = this.position.join(',')
      // TODO: unload scripts
    },
    async onShown() {
      try {
        const self = this
        const u = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet-src.js'
        await this.$store.dispatch('loadScript', u)
        await this.$store.dispatch('loadStyle', 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css')

        var map = L.map('mapContainer').setView(this.$data.position, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        var marker = L.marker(this.$data.position, {
          draggable: true
        }).addTo(map)
        marker.on('dragend', (evt) => {
          const val = evt.target.getLatLng()
          self.$data.position[0] = val.lat
          self.$data.position[1] = val.lng
        })
      } catch (er) {
        console.error(er)
      }
    }
  },
  template: `
<validation-provider v-bind:rules="config.rules" v-slot="{ errors }">
  <b-form-group
    :state="errors.length === 0"
    :label="config.label"
    :invalid-feedback="errors[0]"
  >
    {{ data[config.name] }}
    <b-button size="xs" @click="shown=true">upravit</b-button>

  </b-form-group>

  <b-modal v-model="shown" @shown="onShown" @ok="onSubmited" size="lg"
      title="posunem markeru vyberte polohu">
    <div id="mapContainer" style="width: 100%; height: 400px;"></div>
  </b-modal>
</validation-provider>
  `
}
