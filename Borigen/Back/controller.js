import localesGestion from '../../models/gestion/genericos/locales'
import remDevModel from '../../models/gestion/remitosDevolucion'
import { esNumeroEntero, setDefaultData, validarNumeroEntero, validarNumeroBinario, campoNoVacio } from '../../utils'
export default {
  getLocalesSucursal: async (req,res,next) => {
    try{
      const parametros = req.query
      let localesRespuesta = {}
      // controlo a ver si me llego el objeto con los parametros
      if (Object.keys(parametros).length === 1){
        // llego, pero tiene los elementos que quiero?
        if (parametros.hasOwnProperty('sucursal_codigo') && Number.isInteger(parseInt(parametros.sucursal_codigo))){
          localesRespuesta = await localesGestion.getLocalesHabilitadosXSucursal(parametros.sucursal_codigo)
        }else{
          // responder error
          res.status(400).send({
            resultado: 0,
            error:'Consulta Incorrecta',
            message: 'Los parametros codRubro, codCategoria, codMarca y codModelo son obligatorios y deben ser Numericos'
          })
          next(error)
          return
        }
      }else{
        // responder error
        res.status(400).send({
          resultado: 0,
          error:'Consulta Incorrecta',
          message: 'Para realizar esta consulta necesita ingresar los parametros correctos.'
        })
        next(error)
        return
      }
      // controlo la salida
      if (parseInt(localesRespuesta.resultado) === 1){
        // todo OK
        res.status(200).json(localesRespuesta)
      }else{
        // error al obtener las categorias
        res.status(500).send({
          resultado: 0,
          error:'Ocurrio un error al obtener los locales para la Sucursal indicada',
          message: localesRespuesta.msj
        })
        next(error)
      }
    }catch(error){
      res.status(500).send({
        resultado: 0,
        error:'Ocurrio un error al ejecutar el metodo getLocalesSucursal',
        message: error.message
      })
      next(error)
    }
  },
  initFormLocales: async (req,res,next) => {
    try{
      let usuario = req.usuario
      // obtengo los tipos de locales
      let tiposPeticion = await localesGestion.getTiposLocales()
      if (tiposPeticion.resultado == 0){
        res.status(500).send({
          resultado: 0,
          message: tiposPeticion.msj
        })
        return
      }
      // permiso para borrar imagenes
      let permisoPeticion = await remDevModel.tienePermiso({usuario: usuario, funcion: 127})
      if (permisoPeticion.resultado == 0){
        res.status(500).send({
          resultado: 0,
          message: permisoPeticion.msj
        })
        return
      }
      // respuesta
      res.status(200).send({
        resultado: 1,
        message: 'OK',
        tipos: tiposPeticion.tipos,
        permiso: permisoPeticion.permiso
      })
    }catch(error){
      res.status(500).send({
        resultado: 0,
        message: 'Ocurrio un problema al ejecutar el metodo initFormLocales: ' + error.message
      })
    }
  },
  getLocales: async (req,res,next) => {
    try{
      let parametros = req.query
      if (Object.keys(parametros).length == 5 && parametros.hasOwnProperty('empresa_codigo') && parametros.hasOwnProperty('sucursal_codigo') &&
      parametros.hasOwnProperty('estado_codigo') && parametros.hasOwnProperty('tipo_codigo') && parametros.hasOwnProperty('nombre_local') &&
      esNumeroEntero(parametros.empresa_codigo) && esNumeroEntero(parametros.estado_codigo) && esNumeroEntero(parametros.sucursal_codigo) &&
      esNumeroEntero(parametros.tipo_codigo) && parseInt(parametros.empresa_codigo) > 0){
        let localesPeticion = await localesGestion.getLocalesOracle(parametros)
        if (localesPeticion.resultado == 1){
          res.status(200).send({
            resultado: 1,
            message: 'OK',
            detalles: localesPeticion.detalles
          })
        }else{
          res.status(500).send({
            resultado: 0,
            message: localesPeticion.msj
          })
        }
      }else{
        res.status(400).send({
          resultado: 0,
          message:'Consulta Incorrecta'
        })
      }
    }catch(error){
      res.status(500).send({
        resultado: 0,
        message: 'Ocurrio un problema al ejecutar el metodo getLocales: ' + error.message
      })
    }
  },
  initFormVerLocales: async (req,res,next) => {
    try{
      let usuario = req.usuario
      // obtengo los clientes
      let clientesPeticion = await localesGestion.getClientesLocalesOracle()
      if (clientesPeticion.resultado == 0){
        res.status(500).send({
          resultado: 0,
          message: clientesPeticion.msj
        })
        return
      }
      // obtengo los ejecutivos
      let ejecutivosPeticion = await localesGestion.getEjecutivosFranquicias()
      if (ejecutivosPeticion.resultado == 0){
        res.status(500).send({
          resultado: 0,
          message: ejecutivosPeticion.msj
        })
        return
      }
      // obtengo las cajas padres
      let cajasPeticion = await localesGestion.getCajasPadre()
      if (cajasPeticion.resultado == 0){
        res.status(500).send({
          resultado: 0,
          message: cajasPeticion.msj
        })
        return
      }
      // obtengo las listas de precios, tanto de venta como de compra
      let listasPeticion = await localesGestion.getListasPreciosOracle()
      if (listasPeticion.resultado == 0){
        res.status(500).send({
          resultado: 0,
          message: listasPeticion.msj
        })
        return
      }
      // permiso para modificar listas de precios
      let permisoPeticion = await remDevModel.tienePermiso({usuario: usuario, funcion: 126})
      if (permisoPeticion.resultado == 0){
        res.status(500).send({
          resultado: 0,
          message: permisoPeticion.msj
        })
        return
      }
      // exito
      res.status(200).send({
        resultado: 1,
        message: 'OK',
        clientes: clientesPeticion.clientes,
        ejecutivos: ejecutivosPeticion.ejecutivos,
        cajas: cajasPeticion.cajas,
        listasVenta: listasPeticion.listasVenta,
        listasCompra: listasPeticion.listasCompra,
        permiso: permisoPeticion.permiso
      })
    }catch(error){
      res.status(500).send({
        resultado: 0,
        message: 'Ocurrio un problema al ejecutar el metodo initFormVerLocales: ' + error.message
      })
    }
  },
  crearNuevoLocal: async (req,res,next) => {
    try{
      let parametros = req.body
      if (Object.keys(parametros).length == 25 && parametros.hasOwnProperty('empresa_codigo') && parametros.hasOwnProperty('terceros') &&
      parametros.hasOwnProperty('sucursal_codigo') && parametros.hasOwnProperty('habilitado') && parametros.hasOwnProperty('categoria_codigo') &&
      parametros.hasOwnProperty('local_nombre') && parametros.hasOwnProperty('caja_nombre') && parametros.hasOwnProperty('codigo_postal') &&
      parametros.hasOwnProperty('localidad_codigo') && parametros.hasOwnProperty('domicilio') && parametros.hasOwnProperty('superficie_venta') &&
      parametros.hasOwnProperty('superficie_total') && parametros.hasOwnProperty('lista_venta') && parametros.hasOwnProperty('cliente_codigo') &&
      parametros.hasOwnProperty('vendedor_codigo') && parametros.hasOwnProperty('local_dep_codigo') && parametros.hasOwnProperty('lista_compra') &&
      parametros.hasOwnProperty('cobro_electronico') && parametros.hasOwnProperty('impresora_termica') && parametros.hasOwnProperty('caja_padre') &&
      parametros.hasOwnProperty('fp_integrado') && parametros.hasOwnProperty('fp_desintegrado') && parametros.hasOwnProperty('terminal_x_venta') &&
      parametros.hasOwnProperty('caja_diaria') && parametros.hasOwnProperty('mayorista_salon') && esNumeroEntero(parametros.caja_diaria) &&
      esNumeroEntero(parametros.empresa_codigo) && esNumeroEntero(parametros.terceros) && esNumeroEntero(parametros.sucursal_codigo) &&
      esNumeroEntero(parametros.habilitado) && esNumeroEntero(parametros.categoria_codigo) && esNumeroEntero(parametros.codigo_postal) &&
      esNumeroEntero(parametros.localidad_codigo) && esNumeroEntero(parametros.lista_venta) && esNumeroEntero(parametros.cliente_codigo) &&
      esNumeroEntero(parametros.vendedor_codigo) && esNumeroEntero(parametros.local_dep_codigo) && esNumeroEntero(parametros.lista_compra) &&
      esNumeroEntero(parametros.cobro_electronico) && esNumeroEntero(parametros.impresora_termica) && esNumeroEntero(parametros.caja_padre) &&
      esNumeroEntero(parametros.fp_integrado) && esNumeroEntero(parametros.fp_desintegrado) && esNumeroEntero(parametros.terminal_x_venta) && 
      esNumeroEntero(parametros.mayorista_salon) && (parseInt(parametros.mayorista_salon) == 0 || parseInt(parametros.mayorista_salon) == 1)
    ){
        parametros.usuario = req.usuario
        parametros.clave = req.clave
        let nuevoLocal = await localesGestion.nuevoLocalOracle(parametros)
        if (nuevoLocal.resultado == 1){
          res.status(200).send({
            resultado: 1,
            message: 'OK'
          })
        }else{
          res.status(500).send({
            resultado: 0,
            message: nuevoLocal.msj
          })
        }
      }else{
        res.status(400).send({
          resultado: 0,
          message:'Consulta Incorrecta'
        })
      }
    }catch(error){
      res.status(500).send({
        resultado: 0,
        message: 'Ocurrio un problema al ejecutar el metodo crearNuevoLocal: ' + error.message
      })
    }
  },
  modificarLocal: async (req,res,next) => {
    try{
      let parametros = req.body
      if (Object.keys(parametros).length == 26 && parametros.hasOwnProperty('empresa_codigo') && parametros.hasOwnProperty('terceros') &&
      parametros.hasOwnProperty('sucursal_codigo') && parametros.hasOwnProperty('habilitado') && parametros.hasOwnProperty('categoria_codigo') &&
      parametros.hasOwnProperty('local_nombre') && parametros.hasOwnProperty('caja_nombre') && parametros.hasOwnProperty('codigo_postal') &&
      parametros.hasOwnProperty('localidad_codigo') && parametros.hasOwnProperty('domicilio') && parametros.hasOwnProperty('superficie_venta') &&
      parametros.hasOwnProperty('superficie_total') && parametros.hasOwnProperty('lista_venta') && parametros.hasOwnProperty('cliente_codigo') &&
      parametros.hasOwnProperty('vendedor_codigo') && parametros.hasOwnProperty('local_dep_codigo') && parametros.hasOwnProperty('lista_compra') &&
      parametros.hasOwnProperty('cobro_electronico') && parametros.hasOwnProperty('impresora_termica') && parametros.hasOwnProperty('caja_padre') &&
      parametros.hasOwnProperty('fp_integrado') && parametros.hasOwnProperty('fp_desintegrado') && parametros.hasOwnProperty('terminal_x_venta') &&
      parametros.hasOwnProperty('caja_diaria') && parametros.hasOwnProperty('mayorista_salon') && esNumeroEntero(parametros.caja_diaria) &&
      esNumeroEntero(parametros.empresa_codigo) && esNumeroEntero(parametros.terceros) && esNumeroEntero(parametros.sucursal_codigo) &&
      esNumeroEntero(parametros.habilitado) && esNumeroEntero(parametros.categoria_codigo) && esNumeroEntero(parametros.codigo_postal) &&
      esNumeroEntero(parametros.localidad_codigo) && esNumeroEntero(parametros.lista_venta) && esNumeroEntero(parametros.cliente_codigo) &&
      esNumeroEntero(parametros.vendedor_codigo) && esNumeroEntero(parametros.local_dep_codigo) && esNumeroEntero(parametros.lista_compra) &&
      esNumeroEntero(parametros.cobro_electronico) && esNumeroEntero(parametros.impresora_termica) && esNumeroEntero(parametros.caja_padre) &&
      esNumeroEntero(parametros.fp_integrado) && esNumeroEntero(parametros.fp_desintegrado) && esNumeroEntero(parametros.terminal_x_venta) &&
      parametros.hasOwnProperty('pto_vta_codigo') && esNumeroEntero(parametros.pto_vta_codigo) && parseInt(parametros.pto_vta_codigo) > 0 &&
      esNumeroEntero(parametros.mayorista_salon) && (parseInt(parametros.mayorista_salon) == 0 || parseInt(parametros.mayorista_salon) == 1)
    ){
        parametros.usuario = req.usuario
        parametros.clave = req.clave
        let updatePeticion = await localesGestion.updateLocalOracle(parametros)
        if (updatePeticion.resultado == 1){
          res.status(200).send({
            resultado: 1,
            message: 'OK'
          })
        }else{
          res.status(500).send({
            resultado: 0,
            message: updatePeticion.msj
          })
        }
      }else{
        res.status(400).send({
          resultado: 0,
          message:'Consulta Incorrecta'
        })
      }
    }catch(error){
      res.status(500).send({
        resultado: 0,
        message: 'Ocurrio un problema al ejecutar el metodo modificarLocal: ' + error.message
      })
    }
  },
  getTerminalesLocal: async(req, res, next) => {
    // parametro: codigo del local
    try {
      let params = req.query
      // obtengo el usuario y clave del token
      params.usuario = req.usuario
      params.clave = req.clave

      // valida haya enviado el codigo del local
      if (!validarNumeroEntero(params, 'local', false)) {
        return res.status(400).send({
          exito: 0,
          error: 'Consulta incorrecta',
          message: 'No se pudo realizar la consulta: faltan parámetros o son de otro tipo de dato'
        })
      }

      let result = await localesGestion.getTerminalesLocal(params)

      if (result.exito == 1) {
        res.status(200).send({
          exito: 1,
          data: result.data
        })
      }
      else {
        res.status(500).send({
          exito: 0,
          error: 'Model error',
          message: result.message
        })
      }

    } catch (error) {
      res.status(500).send({
        exito: 0,
        error: 'Controller error',
        message: 'Ocurrio un problema al ejecutar el controlador getTerminalesLocal: ' + error.message
      })
    }
  },
  cambiarNumeroTerminal: async(req, res, next) => {
    // parametro: codigo y numero de terminal
    try {
      let params = req.body
      // obtengo el usuario y clave del token
      params.usuario = req.usuario
      params.clave = req.clave

      // valida haya enviado el codigo y el numero
      if (!(validarNumeroEntero(params, 'codigo', false) && validarNumeroEntero(params, 'numero', false))) {
        return res.status(400).send({
          exito: 0,
          error: 'Consulta incorrecta',
          message: 'No se pudo realizar la consulta: faltan parámetros o son de otro tipo de dato'
        })
      }

      let result = await localesGestion.cambiarNumeroTerminal(params)

      if (result.exito == 1) {
        res.status(200).send({
          exito: 1,
          message: result.message
        })
      }
      else {
        res.status(500).send({
          exito: 0,
          error: 'Model error',
          message: result.message
        })
      }
      
    } catch (error) {
      res.status(500).send({
        exito: 0,
        error: 'Controller error',
        message: 'Ocurrio un problema al ejecutar el controlador cambiarNumeroTerminal: ' + error.message
      })
    }
  },
  cambiarAliasTerminal: async(req, res, next) => {
    // parametro: codigo y alias de terminal
    try {
      let params = req.body
      // obtengo el usuario y clave del token
      params.usuario = req.usuario
      params.clave = req.clave

      // valida haya enviado el codigo
      if (!validarNumeroEntero(params, 'codigo', false)) {
        return res.status(400).send({
          exito: 0,
          error: 'Consulta incorrecta',
          message: 'No se pudo realizar la consulta: faltan parámetros o son de otro tipo de dato'
        })
      }

      setDefaultData(params, 'alias', null)

      let result = await localesGestion.cambiarAliasTerminal(params)

      if (result.exito == 1) {
        res.status(200).send({
          exito: 1,
          message: result.message
        })
      }
      else {
        res.status(500).send({
          exito: 0,
          error: 'Model error',
          message: result.message
        })
      }
      
    } catch (error) {
      res.status(500).send({
        exito: 0,
        error: 'Controller error',
        message: 'Ocurrio un problema al ejecutar el controlador cambiarAliasTerminal: ' + error.message
      })
    }
  },
  cambiarEstadoTerminal: async (req, res, next) => {
    // parametro: codigo y estado de terminal
    try {
      let params = req.body
      // obtengo el usuario y clave del token
      params.usuario = req.usuario
      params.clave = req.clave

      // valida haya enviado el codigo y el estado
      if (!(validarNumeroEntero(params, 'codigo', false) && validarNumeroBinario(params, 'inhabilitada', false))) {
        return res.status(400).send({
          exito: 0,
          error: 'Consulta incorrecta',
          message: 'No se pudo realizar la consulta: faltan parámetros o son de otro tipo de dato'
        })
      }

      let result = await localesGestion.estadoTerminal(params)

      if (result.exito == 1) {
        res.status(200).send({
          exito: 1,
          message: result.message
        })
      }
      else {
        res.status(500).send({
          exito: 0,
          error: 'Model error',
          message: result.message
        })
      }
      
    } catch (error) {
      res.status(500).send({
        exito: 0,
        error: 'Controller error',
        message: 'Ocurrio un problema al ejecutar el metodo cambiarEstadoTerminal: ' + error.message
      })
    }
  },
  cambiarModoTerminal: async (req, res, next) => {
    // parametro: codigo y integracion de terminal
    try {
      let params = req.body
      // obtengo el usuario y clave del token
      params.usuario = req.usuario
      params.clave = req.clave

      // valida haya enviado el codigo y el estado
      if (!(validarNumeroEntero(params, 'codigo', false) && validarNumeroBinario(params, 'integrada', false))) {
        return res.status(400).send({
          exito: 0,
          error: 'Consulta incorrecta',
          message: 'No se pudo realizar la consulta: faltan parámetros o son de otro tipo de dato'
        })
      }

      let result = await localesGestion.integrarTerminal(params)

      if (result.exito == 1) {
        res.status(200).send({
          exito: 1,
          message: result.message
        })
      }
      else {
        res.status(500).send({
          exito: 0,
          error: 'Model error',
          message: result.message
        })
      }
      
    } catch (error) {
      res.status(500).send({
        exito: 0,
        error: 'Controller error',
        message: 'Ocurrio un problema al ejecutar el metodo cambiarModoTerminal: ' + error.message
      })
    }
  },
  nuevaTerminal: async (req, res, next) => {
      /**
     * Parámetros: - numero       (obligatorio, number)
     *             - pto_vta      (obligatorio, number)
     *             - inhabilitada (obligatorio, binario)
     *             - integrada    (obligatorio, binario)
     *             - nombre       (opcional, varchar)
     */
    try {
      let params = req.body
      // obtengo el usuario y clave del token
      params.usuario = req.usuario
      params.clave = req.clave

      // valido que haya enviado los campos obligatorios
      if (!(validarNumeroEntero(params, 'numero', false) && validarNumeroEntero(params, 'pto_vta', false) &&
            validarNumeroBinario(params, 'inhabilitada', false) && validarNumeroBinario(params, 'integrada', false))) {
        return res.status(400).send({
          exito: 0,
          error: 'Consulta incorrecta',
          message: 'No se pudo realizar la consulta: faltan parámetros o son de otro tipo de dato'
        })
      }

      setDefaultData(params, 'nombre', null)

      let result = await localesGestion.nuevaTerminal(params)

      if (result.exito == 1) {
        res.status(200).send({
          exito: 1,
          id: result.id,
          message: result.message
        })
      }
      else {
        res.status(500).send({
          exito: 0,
          error: 'Model error',
          message: result.message
        })
      }
      
    } catch (error) {
      res.status(500).send({
        exito: 0,
        error: 'Controller error',
        message: 'Ocurrio un problema al ejecutar el controlador nuevaTerminal: ' + error.message
      })
    }
  },
  eliminarTerminal: async (req, res, next) => {
    // parametro: codigo de terminal
    try {
      let params = req.body
      // obtengo el usuario y clave del token
      params.usuario = req.usuario
      params.clave = req.clave

      // valida que haya enviado el codigo
      if (!validarNumeroEntero(params, 'codigo', false)) {
        return res.status(400).send({
          exito: 0,
          error: 'Consulta incorrecta',
          message: 'No se pudo realizar la consulta: faltan parámetros o son de otro tipo de dato'
        })
      }

      let result = await localesGestion.eliminarTerminal(params)

      if (result.exito == 1) {
        res.status(200).send({
          exito: 1,
          message: result.message
        })
      }
      else {
        res.status(500).send({
          exito: 0,
          error: 'Model error',
          message: result.message
        })
      }
      
    } catch (error) {
      res.status(500).send({
        exito: 0,
        error: 'Controller error',
        message: 'Ocurrio un problema al ejecutar el controlador eliminarTerminal: ' + error.message
      })
    }
  },
  getTerminalesIntegradas: async (req, res, next) => {
    // parámetros: local
    try {
      let params = req.query
      // obtengo el usuario y clave del token
      params.usuario = req.usuario
      params.clave = req.clave

      // valido q haya enviado el local
      if (!validarNumeroEntero(params, 'local', false)) {
        return res.status(400).send({
          exito: 0,
          terminales: [],
          message: 'No se pudo realizar la consulta: faltan parámetros o son de otro tipo de dato'
        })
      }

      let result = await localesGestion.getTerminalesIntegradas(params)

      if (result.exito == 1) {
        res.status(200).send({
          exito: 1,
          terminales: result.data,
          message: result.message
        })
      }
      else {
        res.status(500).send({
          exito: 0,
          terminales: [],
          message: result.message
        })
      }
      
    } catch (error) {
      res.status(500).send({
        exito: 0,
        terminales: [],
        message: error.message
      })
    }
  },
  initFormLocalesAfip: async(req, res, next) =>{
    try {
      let peticion = await localesGestion.initFormLocalesAfipOracle();
      if(peticion.resultado == 0){
        return res.status(500).send({
          resultado: 0,
          tipos: [],
          message: peticion.msj
        });
      }
      res.status(200).send({
        resultado: peticion.resultado,
        tipos: peticion.tipos,
        message: peticion.msj
      });

    } catch (error) {
      res.status(500).send({
        resultado: 0,
        tipos: [],
        message: 'Ocurrió un error en el controlador initFormLocalesAfip: '+error.message
      })
    }
  },
  getLocalesAfip: async(req, res, next) => {
    try {
      let parametros = req.query;
      if(
        Object.keys(parametros).length == 6 &&
        parametros.hasOwnProperty('empresa_codigo') &&
        parametros.hasOwnProperty('sucursal_codigo') &&
        parametros.hasOwnProperty('pv_afip') && 
        parametros.hasOwnProperty('inhabilitado') && esNumeroEntero(parametros.inhabilitado) && (parseInt(parametros.inhabilitado)==0 || parseInt(parametros.inhabilitado)==1) &&
        parametros.hasOwnProperty('tipoFacturacion') &&
        parametros.hasOwnProperty('fechaHabilitacion')
      ){
        let peticion = await localesGestion.getLocalesAfipOracle(parametros);
        if(peticion.resultado == 0){
          return res.status(500).send({
            resultado: 0,
            locales: [],
            message: peticion.msj
          });
        }
        res.status(200).send({
          resultado: peticion.resultado,
          locales: peticion.locales,
          message: peticion.msj
        });
      }else{
        res.status(400).send({
          resultado: 0,
          message: 'Consulta incorrecta.'
        });
      }
    } catch (error) {
      res.status(500).send({
        resultado: 0,
        locales: [],
        message: 'Ocurrió un error al intentar obtener los locales Afip (getLocalesAfip): '+error.message
      })
    }
  },
  getLocalesPadresHijos: async(req, res, next) => {
    try {
      let parametros = req.query;
      if(
        Object.keys(parametros).length == 5 &&
        parametros.hasOwnProperty('empresa_codigo') && esNumeroEntero(parametros.empresa_codigo) && parseInt(parametros.empresa_codigo) >0 &&
        parametros.hasOwnProperty('sucursal_codigo') && esNumeroEntero(parametros.sucursal_codigo) && parseInt(parametros.sucursal_codigo) >0 &&
        parametros.hasOwnProperty('local_codigo_origen') && parametros.hasOwnProperty('pv_afip') && parametros.hasOwnProperty('tipo_facturacion_id')
      ){
        console.log("parametros: ", parametros);
        let peticion;

        if(campoNoVacio(parametros.local_codigo_origen) && campoNoVacio(parametros.tipo_facturacion_id)){
          if(campoNoVacio(parametros.pv_afip)){
            peticion = await localesGestion.getLocalesHijosEditarOracle(parametros);
          }else{
            peticion = await localesGestion.getLocalesHijosOracle(parametros);
          }

        } else { peticion = await localesGestion.getLocalesPadresOracle(parametros); }

        if(peticion.resultado == 0){
          return res.status(500).send({
            resultado: 0,
            locales: [],
            message: peticion.msj
          });
        }
        res.status(200).send({
          resultado: peticion.resultado,
          locales: {
            padres: peticion.padres,
            hijos:  peticion.hijos
          },
          message: peticion.msj
        });
      }else{
        res.status(400).send({
          resultado: 0,
          message: 'Consulta incorrecta.'
        });
      }
    } catch (error) {
      res.status(500).send({
        resultado: 0,
        locales: [],
        message: 'Ocurrió un error al intentar obtener los locales Afip (getLocalesPadres): '+error.message
      })
    }
  },
  getLocalesPtoVta: async (req, res, NEXTVAL) => {
    try {
      let parametros = req.query;
      if(
        Object.keys(parametros).length == 2 &&
        parametros.hasOwnProperty('empresa_codigo') && esNumeroEntero(parametros.empresa_codigo) && parseInt(parametros.empresa_codigo) >0 &&
        parametros.hasOwnProperty('sucursal_codigo') && esNumeroEntero(parametros.sucursal_codigo) && parseInt(parametros.sucursal_codigo) >0
      ){
        console.log("parametros: ", parametros);
        let peticion = await localesGestion.getLocalesPtoVtaOracle(parametros);
        if(peticion.resultado == 0){
          return res.status(500).send({
            resultado: 0,
            locales: [],
            message: peticion.msj
          });
        }
        res.status(200).send({
          resultado: peticion.resultado,
          locales: peticion.locales,
          message: peticion.msj
        });
      }else{
        res.status(400).send({
          resultado: 0,
          message: 'Consulta incorrecta.'
        });
      }
    } catch (error) {
      res.status(500).send({
        resultado: 0,
        locales: [],
        message: 'Ocurrió un error al intentar obtener los locales Afip (getLocalesPtoVta): '+error.message
      })
    }
  },
  getLocalesPtoVtaEditar: async(req, res, next) =>{
    try {
      let parametros = req.query;
      if(
        Object.keys(parametros).length == 4 &&
        parametros.hasOwnProperty('local_codigo') &&
        parametros.hasOwnProperty('empresa_codigo') && esNumeroEntero(parametros.empresa_codigo) && parseInt(parametros.empresa_codigo) >0 &&
        parametros.hasOwnProperty('sucursal_codigo') && esNumeroEntero(parametros.sucursal_codigo) && parseInt(parametros.sucursal_codigo) >0 &&
        parametros.hasOwnProperty('tipo_facturacion')
      ){
        console.log("parametros: ", parametros);
        let peticion = await localesGestion.getLocalesPtoVtaEditarOracle(parametros);
        if(peticion.resultado == 0){
          return res.status(500).send({
            resultado: 0,
            locales: [],
            message: peticion.msj
          });
        }
        res.status(200).send({
          resultado: peticion.resultado,
          locales: peticion.locales,
          message: peticion.msj
        });
      }else{
        res.status(400).send({
          resultado: 0,
          message: 'Consulta incorrecta.'
        });
      }
    } catch (error) {
      res.status(500).send({
        resultado: 0,
        locales: [],
        message: 'Ocurrió un error al intentar obtener los locales Afip (getLocalesPtoVta): '+error.message
      })
    }
  },
  crearEditarLocalAfip: async(req, res, next) => {
    try {
      let parametros = req.body;
      if(
        Object.keys(parametros).length == 3 &&
        parametros.hasOwnProperty('local') && Object.keys(parametros.local).length >= 6 && 
        parametros.local.hasOwnProperty('empresa_codigo') && parseInt(parametros.local.empresa_codigo) > 0 &&
        parametros.local.hasOwnProperty('fechaHabilitacion') && parametros.local.fechaHabilitacion &&
        parametros.local.hasOwnProperty('localOrigen') && parametros.local.localOrigen.hasOwnProperty('local_acc_codigo') && parseInt(parametros.local.localOrigen.local_acc_codigo) > 0 &&
        parametros.local.hasOwnProperty('pv_afip') && parametros.local.pv_afip.toString().length >= 1 &&
        parametros.local.hasOwnProperty('sucursal_codigo') && parseInt(parametros.local.sucursal_codigo) > 0 &&
        parametros.local.hasOwnProperty('tipoFacturacion') && parseInt(parametros.local.tipoFacturacion) > 0 &&
        parametros.hasOwnProperty('locales_asoc') && Array.isArray(parametros.locales_asoc) &&
        parametros.hasOwnProperty('nuevo') && (parametros.nuevo == true || parametros.nuevo == false)
      ){
        parametros.usuario = req.usuario;
        parametros.clave   = req.clave;
        let peticion; 
        if(parametros.nuevo){
          peticion = await localesGestion.crearLocalAfipOracle(parametros);
        }else{
          peticion = await localesGestion.editarLocalAfipOracle(parametros);
        }
        if(peticion.resultado == 0){
          return res.status(500).send({
            resultado: 0,
            message: peticion.msj
          })
        }
        //exito
        res.status(200).send({
          resultado: 1,
          message: peticion.msj
        })
      }else{
        res.status(400).send({
          resultado: 0,
          message: 'Consulta incorrecta.'
        })
      }
    } catch (error) {
      let cad = req.body.nuevo ? 'crear' : 'editar';
      res.status(500).send({
        resultado: 0,
        message: 'Ocurrió un problema al '+cad+' el local: '+error.message
      })
    }
  },
  inhabilitarLocalesAfip: async (req, res, next) =>{
    try {
      let parametros = req.body;
      if(
        Object.keys(parametros).length == 2 &&
        parametros.hasOwnProperty('local') && Object.keys(parametros.local).length == 13 && 
        parametros.hasOwnProperty('asociados') && Array.isArray(parametros.asociados)
      ){
        parametros.usuario = req.usuario;
        parametros.clave   = req.clave;
        let peticion = await localesGestion.inhabilitarLocalesAfipOracle(parametros);
        if(peticion.resultado == 0){
          return res.status(500).send({
            resultado: 0,
            message: peticion.msj
          })
        }
        res.status(200).send({
          resultado: 1,
          message: 'OK'
        })
      }else{
        res.status(400).send({
          resultado: 0,
          message: 'Consulta incorrecta.'
        })
      }
    } catch (error) {
      res.status(500).send({
        resultado: 0,
        message: 'Ocurrió un problema al inhabilitar el local: '+error.message
      })
    }
  },
  habilitarLocalesAfip: async (req, res, next) =>{
    try {
      let parametros = req.body;
      if(
        Object.keys(parametros).length == 1 &&
        parametros.hasOwnProperty('local') && Object.keys(parametros.local).length == 13
      ){
        parametros.usuario = req.usuario;
        parametros.clave   = req.clave;
        let peticion = await localesGestion.habilitarLocalesAfipOracle(parametros);
        if(peticion.resultado == 0){
          return res.status(500).send({
            resultado: 0,
            message: peticion.msj
          })
        }
        res.status(200).send({
          resultado: 1,
          message: 'OK'
        })
      }else{
        res.status(400).send({
          resultado: 0,
          message: 'Consulta incorrecta.'
        })
      }
    } catch (error) {
      res.status(500).send({
        resultado: 0,
        message: 'Ocurrió un problema al habilitar el local: '+error.message
      })
    }
  },
}
