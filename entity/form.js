/* global axios, API, _, moment */
import { editableAttrs } from './utils.js'

export default {
  data: function () {
    return {
      submitting: false,
      formdata: _.reduce(editableAttrs(this.$props.config), (acc, i) => {
        acc[i.name] = this.$props.item ? this.$props.item[i.name] : null
        return acc
      }, {}),
      origData: null
    }
  },
  computed: {
    disabled: function () {
      return this.$props.item && this.$store.getters.UID !== this.$props.item.manager
    }
  },
  props: ['item', 'config', 'onSubmit'],
  methods: {
    handleSubmit: async function () {
      this.$data.submitting = true
      await this.$props.onSubmit(this.$data.formdata)
      this.$data.submitting = false
    }
  },
  template: `
  <ValidationObserver v-slot="{ invalid }">
    <form @submit.prevent="handleSubmit">

      <slot name="form" :config="$props.config" :data="formdata">
        <component v-for="c in $props.config" :key="c.name"
          :is="c.component" :config="c" :data="formdata">
        </component>
      </slot>

      <b-button-group>
        <b-button type="submit" variant="primary" class="mt-3" :disabled="invalid || submitting">
          uložit <i v-if="submitting" class="fas fa-spinner fa-spin"></i>
        </b-button>
        <slot name="buttons" :invalid="invalid" :submitting="submitting" />
      </b-button-group>
    </form>
  </ValidationObserver>
  `
}
