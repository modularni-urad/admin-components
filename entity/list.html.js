export default `
<div>
  <b-breadcrumb class="float-left">
    <b-breadcrumb-item to="/"><i class="fas fa-home"></i></b-breadcrumb-item>
    <slot name="breadcrumb" :cfg="cfg">
      <b-breadcrumb-item active>{{ cfg.label }}</b-breadcrumb-item>
    </slot>
  </b-breadcrumb>

  <div class="float-right">
    <slot name="rightcontrols" :cfg="cfg" :add="add" :query="query">
      <Filters v-if="cfg.filters" :query="query" :cfg="cfg" />
      <b-button variant="primary" @click="add">
        <i class="fas fa-plus"></i> Přidat
      </b-button>
    </slot>
  </div>

  <slot name="middle" :cfg="cfg"></slot>

  <slot :cfg="cfg">

    <table class="table table-sm table-hover table-striped">
      <thead>
        <tr>
          <THeader v-for="i,idx in cfg.fields" :key="idx" :field="i" :query="query">
            {{ i.label }}
          </THeader>
        </tr>
      </thead>
      <tbody>

        <slot name="tbody" :items="items" :fields="cfg.fields" :doEdit="doEdit">
          <tr v-for="i, rowidx in items" :key="rowidx">
            <td v-for="j,idx in cfg.fields" :key="idx">
              <span v-if="j.component" :is="j.component" :field="j" :row="i" />
              <span v-else>{{ cellData(i, j) }}</span>
            </td>
            <td>
              <slot name="actions" :item="i" :cfg="cfg" :doEdit="doEdit">
                <b-button @click.prevent="doEdit(i)">
                  <i class="fas fa-edit"></i> upravit
                </b-button>              
              </slot>
            </td>
          </tr>          
        </slot>
        
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
    
  </slot>

  <slot name="detail" :query="query" :cfg="cfg">
    <Detail :query="query" :cfg="cfg" :detail="detail" :hide="hide" />
  </slot>
</div>
`
