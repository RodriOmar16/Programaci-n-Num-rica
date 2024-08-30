<template>
  <div>
    <v-row class="d-flex justify-center mt-0">
      <v-col cols="12" class="py-0">
        <v-expansion-panels v-model="panel">
          <v-expansion-panel readonly>
            <v-btn
              style="position: absolute; top: -15px; right: 55px; z-index: 1"
              color="success"
              small
              fab
              title="Agregar Nuevo"
              @click="open_window(null)"
              >
              <v-icon>fas fa-plus</v-icon>
            </v-btn>
            <v-expansion-panel-header class="py-0 px-4 text-h5">
              <div>
                <v-icon class="mb-1" left>fas fa-filter</v-icon>
                Filtro
              </div>
              <template v-slot:actions>
                <v-btn icon @click.stop="panel = panel === 1 ? 0 : 1">
                  <v-icon>fas fa-chevron-down</v-icon>
                </v-btn>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pt-1">
              <v-form @submit.prevent="buscar()">
                <v-row>
                  <v-col cols="12" sm="6" md="2" class="pt-1">
                    Empresa
                    <v-autocomplete
                      v-model="filtro.empresa_codigo"
                      :items="empresas"
                      item-text="nombre_corto"
                      item-value="id"
                      tabindex="1"
                      hide-details
                      outlined
                      dense clearable>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3" class="py-1">
                    Sucursal
                    <v-autocomplete
                      v-model="filtro.sucursal_codigo"
                      item-text="nombre"
                      item-value="id"
                      tabindex="1"
                      :items="sucursales"
                      hide-details
                      outlined
                      dense
                      clearable
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" sm="6" md="3" class="pt-1">
                    Pto Venta AFIP
                    <v-text-field-integer
                        v-model.trim="filtro.pv_afip"
                        v-bind:properties="{
                          hideDetails: true,
                          tabindex: 1,
                          clearable: true,
                          outlined: true,
                          dense: true
                        }"
                        v-bind:options="{
                          inputMask: '####',
                          outputMask: '####',
                          empty: null
                        }"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" md="4" class="pt-1">
                    Tipo Facturación
                    <v-autocomplete
                      v-model="filtro.tipoFacturacion"
                      item-text="facturacion_nombre"
                      item-value="facturacion_codigo"
                      tabindex="1"
                      :items="tiposFacturacion"
                      hide-details
                      outlined
                      dense
                      clearable
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12" md="3" sm="3" class="py-0">
                    Fecha Habilitación
                    <FechaPicker
                      v-model="filtro.fechaHabilitacion"
                      hideDetails
                      clearable
                    />
                  </v-col>
                  <v-col cols="6" sm="6" md="2" class="d-flex justify-center align-center py-1">
                    <v-switch
                      v-model="filtro.inhabilitado"
                      label="Inhabilitado"
                      class="mb-md-2"
                      tabindex="1"
                      :true-value="1"
                      :false-value="0"
                      hide-details
                      dense
                    ></v-switch>
                  </v-col>
                  <v-col cols="7" class="d-flex justify-end py-1">
                    <BtnFiltro
                      class="pb-1 pt-0"
                      :loading="load"
                      clase="mt-0"
                      @clear="limpiar()"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12" class="py-0">
        <v-data-table
          class="cebra elevation-2 mt-2"
          :headers="filtro.empresa_codigo ? headers_se : headers"
          :items="localesAfip"
          :loading="load"
          :search="search"
          :footer-props="{'items-per-page-options':[10, 15, 50, 100]}"
          dense
        >
          <template v-slot:top>
            <v-row class="d-flex justify-end pa-2" no-gutters>
              <v-col cols="6" sm="3" md="2">
                <SearchDataTableVue
                  v-model="search"
                />
              </v-col>
            </v-row>
          </template>
          <template v-slot:no-data>
            <v-alert
              class="mx-auto mt-4"
              max-width="400"
              type="warning"
              border="left"
              dense
              text
            >
              No hay datos para los filtros seleccionados
            </v-alert>
          </template>
          <!-- Fecha -->
          <template v-slot:[`item.fecha_habilitacion`]="{item}">
            {{ item.fecha_habilitacion ? moment(item.fecha_habilitacion).format('DD/MM/YYYY') : ''}}
          </template>
          <template v-slot:[`item.acciones`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn small icon color="warning" @click="open_window(item)" v-on="on" >
                  <v-icon small>fas fa-pen</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip bottom v-if="item.inhabilitado==0">
              <template v-slot:activator="{ on }">
                <v-btn small icon color="error" v-on="on" @click="inhabilitarPtoVenta(item)" >
                  <v-icon small>fas fa-ban</v-icon>
                </v-btn>
              </template>
              <span>Inhabilitar</span>
            </v-tooltip>
            <v-tooltip bottom v-if="item.inhabilitado==1">
              <template v-slot:activator="{ on }">
                <v-btn small icon color="success" v-on="on" @click="habilitarPtoVenta(item)" >
                  <v-icon small>fas fa-check</v-icon>
                </v-btn>
              </template>
              <span>Habilitar</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!-- Componenete -->
     <ModalNvoEditLocalesAfip
      v-model="objModal.dialog"
      :datos="objModal"
      @guardarGrabar="guardarGrabar"
     />
  </div>
</template>

<script>
import { format_money,order_list_by } from '../../../util/utils'
import BtnFiltro from '../../../components/util/BtnFiltro.vue'
import FechaPicker from '../../../components/util/FechaPicker'
import SearchDataTableVue from '../../../components/util/SearchDataTable.vue'
import ModalNvoEditLocalesAfip from '../../../components/generales/locales/ModalNvoEditLocalesAfip.vue'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'ABMLocalesAfip',
  data(){
    return{
      moment: moment,
      panel: 0,
      filtro: {
        empresa_codigo: null,
        sucursal_codigo: null,
        pv_afip: null,
        inhabilitado: 0,
        tipoFacturacion: null,
        fechaHabilitacion: '',
      },
      localesAfip:[],
      /*localUno: null,
      localOrigen: null,
      loacalesAsociados: [],*/
      load: false,
      search: '',
      headers: [
        { text: 'Pto Vta AFIP', value: 'pv_afip'},
        { text: 'Tipo Facturación', value: 'tipo_facturacion_nombre' },
        { text: 'Local', value: 'local_nombre' },
        { text: 'Local Origen', value: 'local_nombre_origen' },
        { text: 'Empresa', value: 'empresa_nombre' },
        { text: 'Sucursal', value: 'sucursal_nombre' },
        { text: 'Fecha Habilit.', value: 'fecha_habilitacion' },
        { text: 'Acciones',value: 'acciones', align: 'center', sortable: false, filterable: false}
      ],
      headers_se: [
        { text: 'Pto Vta AFIP', value: 'pv_afip'},
        { text: 'Tipo Facturación', value: 'tipo_facturacion_nombre' },
        { text: 'Local', value: 'local_nombre' },
        { text: 'Local Origen', value: 'local_nombre_origen' },
        { text: 'Sucursal', value: 'sucursal_nombre' },
        { text: 'Fecha Habilit.', value: 'fecha_habilitacion' },
        { text: 'Acciones',value: 'acciones', align: 'center', sortable: false, filterable: false}
      ],
      dialog: false,
      tiposFacturacion:[],
      /*objModal:{
        nuevo: false,
        activo: false,
        tiposFacturacion: [],
        local: {
          empresa_codigo:     null,
          pv_afip:            null,
          tipoFacturacion:    null,
          sucursal_codigo:    null,
          fechaHabilitacion:  null,
          localOrigen:        null,
          localesAsociados:   [],
          localUno:           null,
        },
      },*/
      localesAsociados: [],
		  objModal:{
        dialog: false,
        nuevo: false,
        local:{
          empresa_codigo: 0,
          empresa_nombre: '',
          sucursal_codigo: 0,
          sucursal_nombre: '',
          fecha_habilitacion: moment(new Date()).format('DD/MM/YYYY'),
          inhabilitado: 0,
          local_codigo: 0,
          local_nombre: '',
          local_codigo_origen: 0,
          local_nombre_origen: '',
          pv_afip: '',
          tipo_facturacion_codigo: 0,
          tipo_facturacion_nombre: '',
          localesAsociados: []
        },
        tiposFacturacion: [];
		  }
    }
  },
  created(){
    this.iniciar();
  },
  methods:{
    async iniciar(){
      this.$store.state.loading = true;
      const res = await this.$store.dispatch('localesStore/initFormLocalesAfip');
      this.$store.state.loading = false;
      if(res.resultado == 0){
        this.tiposFacturacion = [];
        return this.$store.dispatch('show_snackbar', {text: error.message, color: 'error'});
      }
      this.tiposFacturacion = res.tipos;
    },
    async buscar(){
      this.search = '';
      this.localesAfip = [];
      this.load = true;
      const res = await this.$store.dispatch('localesStore/getLocalesAfip',this.filtro);
      this.load = false;

      if(res.resultado == 0){
        return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error' })
      }
      this.localesAfip = res.locales;
    },
    limpiar(){
      this.filtro = {
        empresa_codigo: null,
        sucursal_codigo: null,
        pv_afip: null,
        inhabilitado: 0,
        tipoFacturacion: null,
        fechaHabilitacion: '',
      };
      this.search = '';
    },
    /*asociarLocales(item){
      console.log("item: ", item);
      if(item.local_codigo == item.local_codigo_origen){
        this.localUno         = {};
        this.localOrigen      = item 
        this.localesAsociados = this.localesAfip.filter(e => e.local_codigo != item.local_codigo && e.local_codigo_origen == item.local_codigo_origen && e.empresa_codigo == item.empresa_codigo && e.pv_afip == item.pv_afip);
        if(this.localesAsociados.length == 0){
          this.localesAsociados = this.localesAfip.filter(e => e.local_codigo == item.local_codigo_origen && e.pv_afip == item.pv_afip && e.empresa_codigo == item.empresa_codigo);
        }
      }else{
        this.localOrigen      = this.localesAfip.filter(e => e.local_codigo == item.local_codigo_origen && e.pv_afip == item.pv_afip && e.empresa_codigo == item.empresa_codigo)[0];
        this.localesAsociados = [];//this.localesAfip.filter(e => e.local_codigo == item.local_codigo);
        this.localUno         = item;
      }
      console.log("this.localOrigen: ", this.localOrigen);
      console.log("localesAsociados: ", this.localesAsociados);
    },*/
    detAsociados(item){
      if(item.local_codigo == item.local_codigo_origen){
        this.localesAsociados = this.localesAfip.filter(e => 
          (	e.local_codigo != item.local_codigo && 
            e.local_codigo_origen == item.local_codigo_origen &&
            e.tipo_facturacion == item.tipo_facturacion &&
            e.empresa_id == item.empresa_id &&
            e.pv_afip == item.pv_afip
          )
        );
        /*if(this.localesAsociados.length == 0){
          this.localesAsociados = this.localesAfip.filter(e => e.local_codigo == item.local_codigo_origen && e.pv_afip == item.pv_afip && e.empresa_codigo == item.empresa_codigo);
        }*/
      }
      console.log("localesAsociados: ", this.localesAsociados);
    },
    open_window(item){
      /*if(item){
        this.asociarLocales(item);
        this.objModal.nuevo = false;
        this.objModal.local = {
          empresa_codigo:     item.empresa_codigo,
          pv_afip:            item.pv_afip,
          tipoFacturacion:    item.tipo_facturacion_codigo,
          sucursal_codigo:    item.sucursal_codigo,
          fechaHabilitacion:  item.fecha_habilitacion,
          localOrigen:        this.localOrigen,
          localesAsociados:   this.localesAsociados,
          local:              this.localUno,
        };
      }else{
        this.objModal.nuevo = true;
      }
      this.objModal.tiposFacturacion = this.tiposFacturacion;
      this.objModal.activo = true;*/
      if(!item){
        this.objModal.nuevo = true;
      }else{
        this.objModal.nuevo = false;
        await this.detAsociados(item);
        this.objModal.local = item;
        this.objModal.local.localesAsociados = this.localesAsociados;
      }
      this.objModal.tiposFacturacion = this.tiposFacturacion;
      this.objModal.dialog = true;
    },
    async inhabilitarPtoVenta(item){
      let cad    = ''; let cad2 = 'Local inhabilitado exitosamente.';
      let nombre = item.local_nombre;
      if(item.local_codigo == item.local_codigo_origen){
        cad  = 'Esta acción inhabilitará también todos los locales asociados.' ;
        cad2 = 'Locales inhabilitados con éxito.'
      }
      let modal = await this.$swal.fire({
        icon: 'question',
        title: 'Confirmar acción',
        text: `¿Está seguro de inhabilitar el local: ${nombre}? ${cad}`,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true
      });
      if (!modal.isConfirmed) return
      //detAsociados
      this.asociarLocales(item);

      this.$store.state.loading = true;
      const res = await this.$store.dispatch('localesStore/inhabilitarLocalesAfip',{
        local: item,
        asociados: this.localesAsociados
      });
      this.$store.state.loading = false;
      if(res.resultado == 0){
        return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error' });
      }
      this.$store.dispatch('show_snackbar', { text: cad2, color: 'success' });

      let pos = this.localesAfip.map(e => e.local_codigo).indexOf(item.local_codigo);
      if(pos != -1){
        this.localesAfip[pos].inhabilitado = 1;
      }
    },
    async habilitarPtoVenta(item){
      let nombre = item.local_nombre;
      let modal = await this.$swal.fire({
        icon: 'question',
        title: 'Confirmar acción',
        text: `¿Está seguro de habilitar el local: ${nombre}?`,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true
      });
      if (!modal.isConfirmed) return

      this.$store.state.loading = true;
      const res = await this.$store.dispatch('localesStore/habilitarLocalesAfip',{
        local: item,
      });
      this.$store.state.loading = false;
      if(res.resultado == 0){
        return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error' });
      }
      this.$store.dispatch('show_snackbar', { text: 'Local habilitado exitosamente.', color: 'success' });

      let pos = this.localesAfip.map(e => e.local_codigo).indexOf(item.local_codigo);
      if(pos != -1){
        this.localesAfip[pos].inhabilitado = 0;
      }
    },
    guardarGrabar(local, nuevo){
      console.log("EMIT __ local: ", local);
      if(nuevo){
        this.limpiar();
        this.filtro.pv_afip = local.pv_afip;
        this.buscar();
      }else{
        /*let pos = this.localesAfip.map(e => e.local_acc_codigo).indexOf(local.localOrigen.local_acc_codigo);
        if(pos != -1){

        }*/
      }

    },
  },
  computed:{
    ...mapState(['empresas','sucursales']),
  },
  components: {
    BtnFiltro,
    FechaPicker,
    SearchDataTableVue,
    ModalNvoEditLocalesAfip
  },
}
</script>


//------------------------------------------------------

data(){
	return{
		localesAsociados: [],
		objModal:{
			dialog: false,
			nuevo: false,
			local:{
				empresa_codigo: 0,
				empresa_nombre: '',
				sucursal_codigo: 0,
				sucursal_nombre: '',
				fecha_habilitacion: moment(new Date()).format('DD/MM/YYYY'),
				inhabilitado: 0,
				local_codigo: 0,
				local_nombre: '',
				local_codigo_origen: 0,
				local_nombre_origen: '',
				pv_afip: '',
				tipo_facturacion_codigo: 0,
				tipo_facturacion_nombre: '',
				localesAsociados: []
			},
					
		}
	}
}

detAsociados(item){
	if(item.local_codigo == item.local_codigo_origen){
		this.localesAsociados = this.localesAfip.filter(e => 
			(	e.local_codigo != item.local_codigo && 
				e.local_codigo_origen == item.local_codigo_origen &&
				e.tipo_facturacion == item.tipo_facturacion &&
				e.empresa_id == item.empresa_id &&
				e.pv_afip == item.pv_afip
			)
		);
	}
},
async editarLocal(item){
	if(!item){
		//los objetos vacíos
		this.objModal.nuevo = true;

	}else{
		this.objModal.nuevo = false;
		await this.detAsociados();
		this.objModal.local = item;
		this.objModal.local.localesAsociados = this.localesAsociados;
	}
	this.objModal.dialog = true;
}   
