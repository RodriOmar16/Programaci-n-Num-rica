import store from "../../store"
import config from "../../../config"

export default {
  namespaced: true,
  state: {

  },
  mutations: {

  },
  actions: {
    async initFormLocales(){
      return await new Promise(async (resolve, reject) => {
        try{
          let initPeticion = await fetch(`${config.BASE_URL}/locales/initFormLocales`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          })
          let init = await initPeticion.json()
          init.msj = init.message
          return resolve(init)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo initFormLocales: ' + error.message
          })
        }
      })
    },
    async getLocales({}, datos){
      return await new Promise(async (resolve, reject) => {
        try{
          let localesPeticion = await fetch(`${config.BASE_URL}/locales/getLocales?empresa_codigo=${datos.empresa_codigo}&sucursal_codigo=${datos.sucursal_codigo}&estado_codigo=${datos.estado_codigo}&tipo_codigo=${datos.tipo_codigo}&nombre_local=${datos.nombre_local}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          })
          let locales = await localesPeticion.json()
          locales.msj = locales.message
          return resolve(locales)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo getLocales: ' + error.message
          })
        }
      })
    },
    async initFormVerLocales(){
      return await new Promise(async (resolve, reject) => {
        try{
          let initPeticion = await fetch(`${config.BASE_URL}/locales/initFormVerLocales`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          })
          let init = await initPeticion.json()
          init.msj = init.message
          return resolve(init)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo initFormVerLocales: ' + error.message
          })
        }
      })
    },
    async getLocalesXVendedor({}, datos){
      return await new Promise(async (resolve, reject) => {
        try{
          let localesPeticion = await fetch(`${config.BASE_URL}/vendedores/ptosvta`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(datos)
          })
          let locales = await localesPeticion.json()
          return resolve(locales)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo getLocalesXVendedor: ' + error.message
          })
        }
      })
    },
    async nuevoLocal({}, datos){
      return await new Promise(async (resolve, reject) => {
        try{
          let nuevoPeticion = await fetch(`${config.BASE_URL}/locales/nuevoLocal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(datos)
          })
          let nuevo = await nuevoPeticion.json()
          nuevo.msj = nuevo.message
          return resolve(nuevo)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo nuevoLocal: ' + error.message
          })
        }
      })
    },
    async modificarLocal({}, datos){
      return await new Promise(async (resolve, reject) => {
        try{
          let updatePeticion = await fetch(`${config.BASE_URL}/locales/modificarLocal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(datos)
          })
          let update = await updatePeticion.json()
          update.msj = update.message
          return resolve(update)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo modificarLocal: ' + error.message
          })
        }
      })
    },
    async getTerminales ({}, codigo) {
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/terminales?local=${codigo}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          })

          const data = await res.json()

          if (data.exito == 1) {
            resolve(data)
          } else {
            reject(data)
          }

        } catch (error) {
          reject(error)
        }
      })
    },
    async cambiarNumeroTerminal ({}, payload) {
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/numTerminal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(payload)
          })

          const data = await res.json()

          if (data.exito == 1) {
            resolve(data)
          } else {
            reject(data)
          }

        } catch (error) {
          reject(error)
        }
      })
    },
    async cambiarAliasTerminal ({}, payload) {
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/aliasTerminal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(payload)
          })

          const data = await res.json()

          if (data.exito == 1) {
            resolve(data)
          } else {
            reject(data)
          }

        } catch (error) {
          reject(error)
        }
      })
    },
    async marcarEstadoTerminal ({}, payload) {
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/estadoTerminal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(payload)
          })

          const data = await res.json()

          if (data.exito == 1) {
            resolve(data)
          } else {
            reject(data)
          }

        } catch (error) {
          reject(error)
        }
      })
    },
    async marcarModoTerminal ({}, payload) {
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/integrarTerminal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(payload)
          })

          const data = await res.json()

          if (data.exito == 1) {
            resolve(data)
          } else {
            reject(data)
          }

        } catch (error) {
          reject(error)
        }
      })
    },
    async nuevaTerminal ({}, payload) {
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/nuevaTerminal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(payload)
          })

          const data = await res.json()

          if (data.exito == 1) {
            resolve(data)
          } else {
            reject(data)
          }

        } catch (error) {
          reject(error)
        }
      })
    },
    async eliminarTerminal ({}, id) {
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/eliminarTerminal`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify({ codigo: id })
          })

          const data = await res.json()

          if (data.exito == 1) {
            resolve(data)
          } else {
            reject(data)
          }

        } catch (error) {
          reject(error)
        }
      })
    },
    async getTerminalesIntegradas ({}, local) {
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/terminalesIntegradas?local=${local}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          })
          const data = await res.json()

          resolve(data)

        } catch (error) {
          resolve({
            exito: 0,
            message: error
          })
        }
      })
    },
    /*
          LOCALES AFIP
    */
    async initFormLocalesAfip({}){
      return await new Promise(async (resolve, reject)=>{
        try {
          const res = await fetch(`${config.BASE_URL}/locales/initFormLocalesAfip`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          });
          const data = await res.json()

          resolve(data);
        } catch (error) {
          resolve({
            resultado: 0,
            message: 'Ocurrió un problema al intentar obtener los datos del formulario: '+error.message,
          });
        }
      });
    },
    //index
    async getLocalesAfip({}, payload){
      return await new Promise(async (resolve, reject)=>{
        try {
          const res = await fetch(`${config.BASE_URL}/locales/getLocalesAfip?empresa_codigo=${payload.empresa_codigo}&sucursal_codigo=${payload.sucursal_codigo}&pv_afip=${payload.pv_afip}&inhabilitado=${payload.inhabilitado}&tipoFacturacion=${payload.tipoFacturacion}&fechaHabilitacion=${payload.fechaHabilitacion}`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          });
          const data = await res.json()

          resolve(data);
        } catch (error) {
          resolve({
            resultado: 0,
            message: 'Ocurrió un problema al intentar obtener los Locales AFIP: '+error.message,
          });
        }
      });
    },
    async inhabilitarLocalesAfip({}, payload){
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/inhabilitarLocalesAfip`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(payload)
          })

          const data = await res.json()
          resolve(data)
        }catch (error) {
          resolve({
            resultado: 0,
            message: 'Ocurrió un error al iniciar el proceso de inhabilitar un local AFIP: '+error.message,
          })
        }
      })
    },async habilitarLocalesAfip({}, payload){
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/habilitarLocalesAfip`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(payload)
          })

          const data = await res.json()
          resolve(data)
        }catch (error) {
          resolve({
            resultado: 0,
            message: 'Ocurrió un error al iniciar el proceso de habilitar un local AFIP: '+error.message,
          })
        }
      })
    },
    //fin index
    //individual
    async crearEditarLocalAfip({}, payload){
      return await new Promise(async (resolve, reject) => {
        try {
          const res = await fetch(`${config.BASE_URL}/locales/crearEditarLocalAfip`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            },
            body: JSON.stringify(payload)
          })

          const data = await res.json()
          resolve(data)
        }catch (error) {
          let cad = payload.nuevo ? 'crear' : 'editar';
          resolve({
            resultado: 0,
            message: 'Ocurrió un error al iniciar el proceso de '+cad+' un local AFIP: '+error.message,
          })
        }
      })
    },
    async getLocalesPadresHijos({}, datos){
      return await new Promise(async (resolve, reject) => {
        try{
          let localesPeticion = await fetch(`${config.BASE_URL}/locales/getLocalesPadresHijos?empresa_codigo=${datos.empresa_codigo}&sucursal_codigo=${datos.sucursal_codigo}&local_codigo_origen=${datos.local_codigo_origen}&pv_afip=${datos.pv_afip}&tipo_facturacion_id=${datos.tipo_facturacion_id}&esPadre=${datos.esPadre}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          })
          let locales = await localesPeticion.json()
          return resolve(locales)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo getLocalesPadresHijos: ' + error.message
          })
        }
      })
    },
    async getLocalesPadres({}, datos){
      return await new Promise(async (resolve, reject) => {
        try{
          let localesPeticion = await fetch(`${config.BASE_URL}/locales/getLocalesPadres?empresa_codigo=${datos.empresa_codigo}&sucursal_codigo=${datos.sucursal_codigo}&local_codigo_origen=${datos.local_codigo_origen}&pv_afip=${datos.pv_afip}&tipo_facturacion_id=${datos.tipo_facturacion_id}&esPadre=${datos.esPadre}&nuevo=${datos.nuevo}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          })
          let locales = await localesPeticion.json()
          return resolve(locales)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo getLocalesPadres: ' + error.message
          })
        }
      })
    },
    async getLocalesHijos({}, datos){
      return await new Promise(async (resolve, reject) => {
        try{
          let localesPeticion = await fetch(`${config.BASE_URL}/locales/getLocalesHijos?empresa_codigo=${datos.empresa_codigo}&sucursal_codigo=${datos.sucursal_codigo}&local_codigo_origen=${datos.local_codigo_origen}&pv_afip=${datos.pv_afip}&tipo_facturacion_id=${datos.tipo_facturacion_id}&esPadre=${datos.esPadre}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': store.state.long_token
            }
          })
          let locales = await localesPeticion.json()
          return resolve(locales)
        }catch(error){
          return resolve({
            resultado: 0,
            msj: 'Ocurrio un problema al ejecutar el metodo getLocalesHijos: ' + error.message
          })
        }
      })
    },
    //fin individual
  }
}
