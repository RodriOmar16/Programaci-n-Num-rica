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
                  @change="getLocalesPadre()"
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
                  @change="getLocalesPadre()"
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
                  
                />
                <!-- @change="getLocalesPadresHijos(2)" -->
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
                  @change="!nuevo && esPadre?  getLocalesHijos() : getLocalesPadre()"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="5" class="py-1" v-if="!esPadre && !nuevo">
                Local
                <v-text-field
                  v-model="localCopia.local_nombre"
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
                  v-model="localCopia.local_codigo_origen"
                  item-value="local_codigo"
                  item-text="local_nombre"
                  tabindex="1"
                  :items="localesPadres"
                  hide-details
                  outlined
                  dense
                  :filled="!nuevo && esPadre"
                  :readonly="!nuevo && esPadre"
                  :clearable="nuevo"
                  @change=" getLocalesHijos(); controlarLocalOrigen();"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="12" class="py-1" v-if="esPadre">
                Local Asociados
                <v-autocomplete
                  v-model="localCopia.localesAsociados"
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
    controlarLocalOrigen(){
      if(this.localCopia.local_codigo_origen){
        let aux = this.localesPadres.filter(e => e.local_codigo == this.localCopia.local_codigo_origen);
        this.localCopia.empresa_nombre      = aux[0].empresa_nombre;
        this.localCopia.local_codigo        = aux[0].local_codigo;
        this.localCopia.local_nombre        = aux[0].local_nombre;
        this.localCopia.local_nombre_origen = aux[0].local_nombre;
        this.localCopia.sucursal_nombre     = aux[0].sucursal_nombre;
        //se adapta el nuevo pv_afip al del nuevo padre para cuando edito al hijo
        if(!this.esPadre && !this.nuevo){ this.localCopia.pv_afip = aux[0].pv_afip;  }
      }else{
        this.localCopia.local_codigo        = null;
        this.localCopia.local_nombre        = null;
        this.localCopia.local_nombre_origen = null;
        this.localCopia.localesAsociados = [];
        this.localesHijos = [];
      }
    },
    //NUEVO & EDITAR
    async getLocalesPadre(){
      if(this.nuevo){
        this.localesHijos   = [];  //los disponibles a seleccionar
        this.localCopia.localesAsociados    = [] //hijos que se fueron agregando, los seleccionados
        this.localesPadres  = []; //resultado de la consulta
        this.localCopia.local_codigo_origen = null;
        this.controlarLocalOrigen(); // ?
      }
      let obj = {
        empresa_codigo:       null,
        sucursal_codigo:      null,
        local_codigo_origen:  null,
        pv_afip:              null,
        tipo_facturacion_id:  null,
        esPadre:              true,
        nuevo:                this.nuevo
      };
      if(this.localCopia.empresa_codigo && this.localCopia.sucursal_codigo){
        obj.empresa_codigo  = this.localCopia.empresa_codigo,
        obj.sucursal_codigo = this.localCopia.sucursal_codigo

        if(this.localCopia.pv_afip && this.localCopia.tipo_facturacion_codigo){
          obj.pv_afip             = this.localCopia.pv_afip,
          obj.tipo_facturacion_id = this.localCopia.tipo_facturacion_codigo
        }
        if(this.localCopia.local_codigo_origen){
          obj.local_codigo_origen = this.localCopia.local_codigo_origen
        }
        this.load1 = true;
        this.$store.state.loading = true;
        const res = await this.$store.dispatch(`localesStore/getLocalesPadres`,  obj);
        this.$store.state.loading = false;
        this.load1 = false;

        if (res.resultado == 0){
          return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error'})
        }
        console.log("res: ", res);

        console.log("res.locales.padres: ", res.locales.padres);
        this.localesPadres = res.locales.padres;
        console.log("this.localesPadres: ", this.localesPadres);
        order_list_by(this.localesPadres, 'local_nombre')           
      }
    },
    //Nuevos/Editar Padre
    async getLocalesHijos(){
      if(this.localCopia.empresa_codigo && this.localCopia.sucursal_codigo && 
        this.localCopia.local_codigo_origen && this.localCopia.tipo_facturacion_codigo){
          console.log("entrooooo getLocalesHijos: ");
        let obj = {
          empresa_codigo:       this.localCopia.empresa_codigo,
          sucursal_codigo:      this.localCopia.sucursal_codigo,
          local_codigo_origen:  this.localCopia.local_codigo_origen,
          tipo_facturacion_id:  this.localCopia.tipo_facturacion_codigo,
          pv_afip:              this.nuevo ? null : this.localCopia.pv_afip,
          esPadre:              false, //indica que se va a traer
        };
        console.log("obj: ", obj);
        this.load1 = true;
        this.$store.state.loading = true;
        const res = await this.$store.dispatch('localesStore/getLocalesHijos', obj)
        this.$store.state.loading = false;
        this.load1 = false;

        if (res.resultado == 0){
          return this.$store.dispatch('show_snackbar', { text: res.message, color: 'error'})
        }
        console.log("localHijos: ", this.localesHijos);
        console.log("res: ", res);
        this.localesHijos = res.locales.hijos;
        order_list_by(this.localesHijos, 'local_nombre')
        if(this.nuevo){
          this.localesHijos = this.localesHijos.filter(e => e.local_codigo_origen != obj.local_codigo_origen);
        }
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
        if(!this.nuevo) this.localCopia.localesAsociados = this.localesHijos.filter(e => e.local_codigo_origen == this.localCopia.local_codigo_origen && e.tipo == 2);
      }
    },
    limpiar(){
      this.local = {
          empresa_codigo: null,
          empresa_nombre: '',
          sucursal_codigo: null,
          sucursal_nombre: '',
          fecha_habilitacion: '',
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
    },
    limpiarCopia(){
      this.localCopia = {
        empresa_codigo: null,
        empresa_nombre: '',
        sucursal_codigo: null,
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
      if(!this.localCopia.tipo_facturacion_codigo){
        error.text = 'Debe seleccionar el Tipo de Facturación.';
        error.color = 'warning';
        return error;
      }
      if(!this.localCopia.pv_afip){
        error.text = 'Debe completar el campo Pto Vta AFIP.';
        error.color = 'warning';
        return error;
      }
      if(!this.localCopia.fecha_habilitacion){
        error.text = 'Debe completar el campo Fecha de Habilitación.';
        error.color = 'warning';
        return error;
      }
      if(!this.localCopia.local_codigo_origen){
        error.text = 'Debe seleccionar un Local de Origen.';
        error.color = 'warning';
        return error;
      }
      return error;
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
        locales_asociados: this.localCopia.localesAsociados,
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
        if(!this.localCopia.fecha_habilitacion){
          this.localCopia.fecha_habilitacion = moment(new Date()).format('DD/MM/YYYY')
        }else{
          this.localCopia.fecha_habilitacion = moment(this.localCopia.fecha_habilitacion).format('DD/MM/YYYY')
        }
        if(!this.nuevo){
          this.esPadre = this.localCopia.local_codigo == this.localCopia.local_codigo_origen;
          if(this.localCopia.localesAsociados.length != 0 || this.esPadre ){
            //es un padre
            this.localesPadres.push(this.localCopia);
            await this.getLocalesHijos();
            console.log("es padre");
          }else{
            //es un hijo
            console.log("es hijo");
            await this.getLocalesPadre();
          }
        }else this.esPadre = true;
      }else{
        //this.limpiar();
        this.localesPadres = [];
        this.localesHijos = [];
      }
    },
  }
}
</script>

<style>

</style>
