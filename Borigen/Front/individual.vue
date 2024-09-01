
<template>
  <div>
  <v-dialog
      v-model="activo"
      width="700"
      :persistent="activo"
      scrollable
    >
      <v-card :loading="load1">
        <v-card-title class="">
          <div style="font-size: 20px" v-text="nuevo ? 'Nuevo Pto. Vta. AFIP' : 'Editar Pto. Vta. AFIP'"></div>
          <v-spacer></v-spacer>
          <v-btn right icon @click="activo = false">
            <v-icon>fas fa-times</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-3">
          <v-form @submit.prevent="guardarEmit()">
            <v-row class="pt-2">
              <v-col cols="12" sm="6" md="4" class="py-1">
                Empresa
                <v-autocomplete
                  v-model="localCopia.empresa_codigo"
                  item-text="nombre_corto"
                  item-value="id"
                  tabindex="1"
                  :items="empresas"
                  hide-details
                  outlined
                  dense
                  :filled="!nuevo"
                  :readonly="!nuevo"
                  :clearable="nuevo"
                  @change="getLocalesPadresHijos()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="py-1">
                Sucursal
                <v-autocomplete
                  v-model="localCopia.sucursal_codigo"
                  item-text="nombre"
                  item-value="id"
                  tabindex="1"
                  :items="sucursales"
                  hide-details
                  outlined
                  dense
                  :filled="!nuevo"
                  :readonly="!nuevo"
                  :clearable="nuevo"
                  @change="getLocalesPadresHijos()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4" class="py-1">
                Fecha Habilitación
                <FechaPickerVue v-model="localCopia.fecha_habilitacion"
                  hideDetails
                  outline clearable
                />
              </v-col>
              <v-col cols="12" sm="6" md="2" class="py-1">
                Pto Vta  AFIP
                <v-text-field-integer
                  v-model.trim="localCopia.pv_afip"
                  v-bind:properties="{
                    hideDetails: true,
                    tabindex: 1,
                    clearable: true,
                    outlined: true,
                    dense: true,
                    filled:!nuevo,
                    readonly:!nuevo,
                    clearable: nuevo,
                  }"
                  v-bind:options="{
                    inputMask: '####',
                    outputMask: '####',
                    empty: null
                  }"
                  @change="getLocalesPadresHijos()"
                />
              </v-col>
              <v-col cols="12" sm="6" md="5" class="py-1">
                Tipo Facturación
                <v-autocomplete
                  v-model="localCopia.tipo_facturacion_codigo"
                  item-text="facturacion_nombre"
                  item-value="facturacion_codigo"
                  tabindex="1"
                  :items="tiposFacturacion"
                  hide-details
                  outlined
                  dense
                  clearable
                  @change="!nuevo ? (esPadre? getLocalesHijos() : getLocalesPadres() ) : getLocalesPadresHijos()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="5" class="py-1">
                Local
                <!-- <v-autocomplete
                  v-model="localCopia.local.local_codigo"
                  item-value="local_codigo"
                  item-text="local_nombre"
                  tabindex="1"
                  :items="localesHijos"
                  hide-details
                  outlined
                  dense
                  :filled="!nuevo"
                  :readonly="!nuevo"
                  :clearable="!esPadre"
                  @change="controlarLocal()"
                ></v-autocomplete>-->
                <v-text-field
                  v-model="localCopia.local.local_nombre"
                  outlined
                  dense
                  type="text"
                  hide-details
                  filled
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="5" class="py-1">
                Local Origen
                <v-autocomplete
                  v-model="localCopia.local.local_codigo_origen"
                  item-value="local_codigo_origen"
                  item-text="local_nombre_origen"
                  tabindex="1"
                  :items="localesPadres"
                  hide-details
                  outlined
                  dense
                  :filled="!nuevo && esPadre"
                  :readonly="!nuevo && esPadre"
                  :clearable="nuevo"
                  @change="getLocalesPadresHijos()"
                ></v-autocomplete>
              <!-- :filled="!nuevo && localCopia.local_codigo == localCopia.local_codigo_origen"
                  :readonly="!nuevo && localCopia.local_codigo == localCopia.local_codigo_origen" -->
                <!-- Local Origen 2 
                <v-text-field
                  v-if="localesAsociados.length != 0"
                  v-model="localCopia.localOrigen.local_nombre_origen"
                  outlined
                  dense
                  type="text"
                  hide-details
                  :filled="!nuevo"
                  :readonly="!nuevo"
                ></v-text-field>
                <v-autocomplete
                v-else
                  v-model="localCopia.localOrigen"
                  item-text="local_acc_nombre"
                  tabindex="1"
                  :items="locales"
                  hide-details
                  outlined
                  dense
                  :filled="!nuevo && !localLocal"
                  :readonly="!nuevo && !localLocal"
                  :clearable="nuevo"
                  return-object
                  @change="controlarLocal()"
                ></v-autocomplete> -->
              </v-col>
              <v-col cols="12" sm="6" md="12" class="py-1" v-if="esPadre || nuevo">
                Local Asociados
                <v-autocomplete
                  v-model="localCopia.local.localesAsociados"
                  item-text="local_nombre"
                  tabindex="1"
                  :items="localesHijos"
                  hide-details
                  outlined
                  dense
                  clearable
                  return-object
                  multiple
                  small-chips
                  deletable-chips
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <!-- BOTONES -->
        <v-card-actions class="d-flex justify-end pb-4">
          <v-btn
            class="mr-2"
            color="secondary"
            @click="activo = false"
          >cancelar</v-btn>
          <BtnConfirmarVue
            :texto="`${ nuevo? 'Creará un nuevo Local' : 'Aplicar cambios al Local AFIP.'} ¿Confirma esta accion?`"
            :nombre="nuevo ? 'GRABAR': 'GUARDAR CAMBIOS'"
            :loading="load"
            @action="guardarEmit()"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import BtnConfirmarVue from '../../util/BtnConfirmar.vue'
import FechaPickerVue from '../../util/FechaPicker.vue';
import { mapState } from 'vuex';
import { order_list_by } from '../../../util/utils'

export default {
  name: 'ModalNvoEditLocalesAfip',
  props:{
    value: Boolean,
    datos:{
      type: Object,
      default: {}
    }
  },
  computed:{
    ...mapState(['empresas', 'sucursales']),
    activo:{
      get(){
        return this.datos.dialog;
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    nuevo:{
      get(){
        return this.datos.nuevo;
      },
    },
    tiposFacturacion:{
      get(){
        return this.datos.tiposFacturacion;
      },
    },
    local:{
      get(){
        return this.datos.local;
      },
    },
    /*localOrigen:{
      get(){
        return this.datos.local.localOrigen;
      },
    },
    localesAsociados:{
      get(){
        return this.datos.local.localesAsociados;
      },
    },*/
  },
  data(){
    return{
      localCopia: {},
      locales:[],
      //localesAsoc: [],
      localesPadres: [],
      localesHijos: [],
      load: false,
      load1: false,
      esPadre: false,
      /*objLocal: {
        sucursal_codigo:   null,
        local_acc_codigo:  null,
        localLocal:        null,
      },
      localLocal: null,*/
    }
  },
  created(){
  },
  methods:{
    controlarLocal(){
      if(!this.localCopia.localOrigen){
        this.localLocal = null;
      }
    },
    validarCampos(){
      let error = {}
      if(!this.localCopia.empresa_codigo){
        error.text = 'Debe seleccionar la Empresa.';
        error.color = 'warning';
        return error;
      }
      if(!this.localCopia.sucursal_codigo){
        error.text = 'Debe seleccionar la Sucursal.';
        error.color = 'warning';
        return error;
      }
      if(!this.localCopia.tipoFacturacion){
        error.text = 'Debe seleccionar el Tipo de Facturación.';
        error.color = 'warning';
        return error;
      }
      if(!this.localCopia.pv_afip){
        error.text = 'Debe completar el campo Pto Vta AFIP.';
        error.color = 'warning';
        return error;
      }
      if(!this.localCopia.fechaHabilitacion){
        error.text = 'Debe completar el campo Fecha de Habilitación.';
        error.color = 'warning';
        return error;
      }
      if(!this.localCopia.localOrigen  || Object.keys(this.localCopia.localOrigen).length == 0){
        error.text = 'Debe seleccionar un Local de Origen.';
        error.color = 'warning';
        return error;
      }
      /*if(this.localesAsoc.length == 0){
        error.text = 'Debe seleccionar al menos un local.';
        error.color = 'warning';
        return error;
      }*/

      return error;
    },
    //Editar: Inicial Padre
    async getLocalesHijos(){
      let obj = {
        empresa_codigo:       this.localCopia.empresa_codigo,
        sucursal_codigo:      this.localCopia.sucursal_codigo,
        local_codigo_origen:  this.localCopia.local_codigo_origen,
        tipo_facturacion_id:  this.localCopia.tipo_facturacion_codigo,
        pv_afip:              this.localCopia.pv_afip
      };

      this.load1 = true;
      this.$store.state.loading = true;
      const res = await this.$store.dispatch('localesStore/getLocalesHijosHuerfanos', obj)
      this.$store.state.loading = false;
      this.load1 = false;

      if (res.resultado == 0){
        return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error'})
      }
      this.localesHijos = res.locales;
      order_list_by(this.localesHijos, 'local_acc_nombre')
      /*
      {
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
        }
      */
      this.localCopia.localesAsociados = this.localesHijos.filter(e => e.local_codigo_origen == this.localCopia.local_codigo_origen);
    },
    //Editar: Inicial Hijos
    async getLocalesPadres(){
      let obj = {};
      if(this.localCopia.empresa_codigo && this.localCopia.sucursal_codigo &&
         this.localCopia.local_codigo_origen && this.localCopia.pv_afip && 
         this.localCopia.tipo_facturacion_codigo
      ){
        obj.empresa_codigo  = this.localCopia.empresa_codigo,
        obj.sucursal_codigo = this.localCopia.sucursal_codigo
        obj.local_codigo_origen = this.localCopia.local_codigo_origen,
        obj.pv_afip             = this.localCopia.pv_afip,
        obj.tipo_facturacion_id = this.localCopia.tipo_facturacion_codigo
        
        this.load1 = true;
        this.$store.state.loading = true;
        const res = await this.$store.dispatch(`localesStore/getLocalesPadres`,  obj);
        this.$store.state.loading = false;
        this.load1 = false;

        if (res.resultado == 0){
          return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error'})
        }
        this.localesPadres = res.locales;
        order_list_by(this.localesPadres, 'local_nombre')
      }
    },
    //Nuevos
    async getLocalesPadresHijos(){
      this.localesHijos   = [];  //los disponibles a seleccionar
      this.localCopia.localesAsociados    = [] //hijos que se fueron agregando, los seleccionados
      let obj = {
        empresa_codigo:       null,
        sucursal_codigo:      null,
        local_codigo_origen:  null,
        pv_afip:              null,
        tipo_facturacion_id:  null
      };
      if(this.localCopia.empresa_codigo && this.localCopia.sucursal_codigo){
        obj.empresa_codigo  = this.localCopia.empresa_codigo,
        obj.sucursal_codigo = this.localCopia.sucursal_codigo
        
        if(
          this.localCopia.local_codigo_origen && this.localCopia.pv_afip && 
          this.localCopia.tipo_facturacion_codigo
        ){
          obj.local_codigo_origen = this.localCopia.local_codigo_origen,
          obj.pv_afip             = this.localCopia.pv_afip,
          obj.tipo_facturacion_id = this.localCopia.tipo_facturacion_codigo
        }else{
          this.localesPadres  = []; //resultado de la consulta
          this.localCopia.local_codigo_origen = null; //padre
        }

        this.load1 = true;
        this.$store.state.loading = true;
        const res = await this.$store.dispatch(`localesStore/getLocalesPadresHijos`,  obj);
        this.$store.state.loading = false;
        this.load1 = false;

        if (res.resultado == 0){
          return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error'})
        }
        if(obj.local_codigo_origen && obj.pv_afip && obj.tipo_facturacion_id){
          this.localesHijos = res.locales;
          order_list_by(this.localesHijos, 'local_nombre')
        }else{
          this.localesPadres = res.locales;
          order_list_by(this.localesPadres, 'local_nombre')
        }
      }
    },
    //Nuevos
    /*async getLocalesPtoVta(){
      this.localesPadres  = []; //resultado de la consulta
      this.localesHijos   = [];  //los disponibles a seleccionar
      this.localCopia.local_codigo_origen = null; //padre
      this.localCopia.localesAsociados    = [] //hijos que se fueron agregando, los seleccionados
      if(this.localCopia.empresa_codigo && this.localCopia.sucursal_codigo){
        this.load1 = true;
        this.$store.state.loading = true;
        const res = await this.$store.dispatch(`localesStore/getLocalesPtoVta`,  {
          empresa_codigo: this.localCopia.empresa_codigo,
          sucursal_codigo: this.localCopia.sucursal_codigo
        });
        this.$store.state.loading = false;
        this.load1 = false;

        if (res.resultado == 0){
          return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error'})
        }
        this.localesPadres = res.locales;
        order_list_by(this.locales, 'local_nombre')
      }
    },
    //Nuevos
    async getLocalesHuerfanos(){
      this.localesHijos = [];  //los disponibles a seleccionar
      this.localCopia.localesAsociados = [] //hijos que se fueron agregando, los seleccionados
      if(this.localCopia.local_codigo_origen && this.localCopia.empresa_codigo && 
        this.localCopia.sucursal_codigo && this.localCopia.pv_afip && this.localCopia.tipo_facturacion_codigo
      ){
        this.load1 = true;
        this.$store.state.loading = true;
        const res = await this.$store.dispatch(`localesStore/getLocalesHuerfanos`,  {
          empresa_codigo:       this.localCopia.empresa_codigo,
          sucursal_codigo:      this.localCopia.sucursal_codigo,
          local_codigo_origen:  this.localCopia.local_codigo_origen,
          pv_afip:              this.localCopia.pv_afip,
          tipo_facturacion_id:  this.localCopia.tipo_facturacion_codigo
        });
        this.$store.state.loading = false;
        this.load1 = false;

        if (res.resultado == 0){
          return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error'})
        }
        this.localesHijos = res.locales;
        order_list_by(this.locales, 'local_nombre')
      }
    },*/
    limpiar(){
      this.local.empresa_codigo    = null;
      this.local.sucursal_codigo   = null;
      this.local.tipoFacturacion   = null;
      this.local.pv_afip           = null;
      this.local.fechaHabilitacion = null;
      this.local.localOrigen       = null;
      this.local.localesAsociados  = [];
      this.localesAsoc             = [];
      this.locales                 = [];
      this.localLocal              = null;
    },
    async guardarEmit(){
      let error = this.validarCampos();
      if(Object.keys(error).length != 0){
        return this.$store.dispatch('show_snackbar', error)
      }
      this.load = true;
      this.$store.state.loading = true;
      const res = await this.$store.dispatch('localesStore/crearEditarLocalAfip',{
        local: this.localCopia,
        locales_asoc: this.localesAsoc,
        nuevo: this.nuevo
      });
      this.$store.state.loading = false;
      this.load = false;
      console.log("res: ", res);
      if(res.resultado == 0){
        return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error' })
      }
      let cad = ''
      if(this.nuevo){
        cad = 'Local AFIP creado correctamente.'
      }else { cad = 'Local AFIP actualizado correctamente.' }

      this.$store.dispatch('show_snackbar', { text: cad, color: 'success' })
      this.$emit('guardarGrabar', this.localCopia, this.nuevo);
      this.activo = false;
    },
  },
  components:{
    FechaPickerVue, BtnConfirmarVue
  },
  watch:{
    activo: async function(val){
      if(val){
        this.localCopia = JSON.parse(JSON.stringify(this.local));
        /*if(!this.localCopia.fechaHabilitacion){
          this.localCopia.fechaHabilitacion = moment(new Date()).format('DD/MM/YYYY')
        }else{
          this.localCopia.fechaHabilitacion = moment(this.localCopia.fechaHabilitacion).format('DD/MM/YYYY')
        }*/
        if(!this.nuevo){
          this.localCopia.fecha_habilitacion = moment(this.localCopia.fecha_habilitacion).format('DD/MM/YYYY')
          //this.objLocal.local_acc_codigo  = this.localCopia.localOrigen.local_codigo_origen;
          //this.objLocal.sucursal_codigo   = this.localCopia.sucursal_codigo;
          this.esPadre = this.localCopia.local_codigo == this.localCopia.local_codigo_origen;
          if(this.localCopia.localesAsociados.length != 0 || this.esPadre ){
            //es un padre
            await this.getLocalesHijos();
          }else{
            //es un hijo
            await this.getLocalesPadres();
          }
        }
      }else{
        this.limpiar();
      }
    },
  }
}
</script>

<style>

</style>
