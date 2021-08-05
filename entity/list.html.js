export default `
<div>
  <b-breadcrumb class="float-left">
    <b-breadcrumb-item to="/"><i class="fas fa-home"></i></b-breadcrumb-item>
    <b-breadcrumb-item active>{{ cfg.label }}</b-breadcrumb-item>
  </b-breadcrumb>

  <div class="float-right">
    <b-button variant="primary" @click="add">
      <i class="fas fa-plus"></i> Přidat
    </b-button>
  </div>

  <b-table v-if="ready" small striped hover sort-icon-left no-local-sorting
    ref="table"
    primary-key="id"
    :current-page="currentPage"
    :per-page="perPage"
    :busy.sync="isBusy"
    :items="myProvider"
    :fields="fields"
  >
    <template #cell(actions)="data">
      <div :is="actionsComponent || 'DefaultActions'" :data="data" :doEdit="edit" />
    </template>
  </b-table>

  <b-pagination class="float-right" v-model="currentPage"
    :total-rows="totalRows" :per-page="perPage">
  </b-pagination>

  <div class="float-left">
    <b-dropdown dropup text="Velikost stránky"
      variant="primary" class="m-2">
      <b-dropdown-item @click="setPageSize(5)">5</b-dropdown-item>
      <b-dropdown-item @click="setPageSize(10)">10</b-dropdown-item>
      <b-dropdown-item @click="setPageSize(50)">50</b-dropdown-item>
    </b-dropdown>
  </div>

  <b-modal v-if="ready" size="xl" id="modal-add" title="Upravit" hide-footer>
    <item-form :config="formconfig" :onSubmit="onSubmit" :item="curr" :showcancel="true">
    </item-form>
  </b-modal>

</div>
`
