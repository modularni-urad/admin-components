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

  <table class="table table-sm table-hover table-striped">
    <thead>
      <tr>
        <THeader v-for="i,idx in fields" :key="idx" :field="i" :query="query">
          {{ i.label }}
        </THeader>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i, idx in items" :key="idx">
        <td v-for="j,jidx in fields" :key="jidx">{{ cellData(i, j) }}</td>
        <td key="actions"><DefaultActions :row="i" :query="query" /></td>
      </tr>
    </tbody>
  </table>

  <div class="float-left">
    <b-dropdown dropup text="Velikost stránky" variant="primary" class="m-2">
      <b-dropdown-item @click="setPageSize(5)">5</b-dropdown-item>
      <b-dropdown-item @click="setPageSize(10)">10</b-dropdown-item>
      <b-dropdown-item @click="setPageSize(50)">50</b-dropdown-item>
    </b-dropdown>
  </div>

  <Paginator :totalRows="totalRows" :query="query" />

  <Detail :query="query" :cfg="cfg" :formconfig="formconfig" />

</div>
`
