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
