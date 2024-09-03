import db from '../../../database/index'
import oracledb from 'oracledb'
import { campoNoVacio, columna, setDefaultData } from '../../../utils'
import moment from 'moment'

export default{
  getLocalesHabilitadosXSucursal: async(req,res,next) => {
    try{
      let listado = []
      let sql = `SELECT LO.CODIGO LOCAL_CODIGO,
                        LO.NOMBRE LOCAL_NOMBRE,
                        DE.CODIGO DEPOSITO_CODIGO,
                        DE.SUCURSAL_CODIGO SUCURSAL_CODIGO
                  FROM GESTION.LOCALES LO,
                      GESTION.DEPOSITOS DE
                  WHERE LO.SUCURSAL_CODIGO = ${req}
                  AND NVL(LO.INHABILITADO, 0) = 0
                  AND LO.CODIGO = DE.LOCAL_CODIGO
                  AND NVL(DE.EN_DESUSO, 0) = 0
                  AND DE.TIPO_DEP_CODIGO = 2
                  ORDER BY LO.NOMBRE ASC`
      
      let result = await  db.executeAcc(sql,[],false)
      if (result.rows.length > 0){
        result.rows.forEach(element => {
          let locales = {
            localCodigo: element[0],
            localNombre: element[1],
            depositoCodigo: element[2],
            sucursalCodigo: element[3]
          }
          listado.push(locales)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        localesSucursal: listado
      }
    }catch(error){
      return {
        resultado: 0,
        msj: 'Ocurrio un error en el metodo getLocalesHabilitadosXSucursal: ' + error.message,
        localesSucursal: []
      }
    }
  },
  getTiposLocales: async(req,res,next) => {
    try{
      let listado = []
      let sql = `SELECT PC.CODIGO, PC.NOMBRE, NVL(PC.USA_CAJA, 0), NVL(PC.LISTA_DEFECTO, 0)
                FROM TELECOM.PTOS_VTA_CATEGORIA PC
                WHERE NVL(PC.INHABILITADO, 0) = 0`
      let result = await db.open(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(element => {
          let unTipo = {
            categoria_codigo: element[0],
            categoria_nombre: element[1],
            usa_caja: element[2],
            lista_precio: element[3]
          }
          listado.push(unTipo)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        tipos: listado
      }
    }catch(error){
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo getTiposLocales: ' + error.message,
        tipos: null
      }
    }
  },
  getLocalesOracle: async(req,res,next) => {
    try{
      let listado = []
      // sql principal
      let sql = `SELECT PV.CODIGO PTO_VTA_CODIGO,
                        PV.DOMICILIO DOMICILIO,
                        LO.CODIGO LOCALIDAD_CODIGO,
                        LO.CODIGO_POSTAL LOCALIDAD_CP,
                        LO.NOMBRE LOCALIDAD_NOMBRE,
                        PV.FECHA_GRABACION FECHA_GRABACION,
                        PV.USUARIO_GRABACION USUARIO_GRABACION,
                        PV.NOMBRE PTO_VTA_NOMBRE,
                        PC.CODIGO CATEGORIA_CODIGO,
                        PC.NOMBRE CATEGORIA_NOMBRE,
                        NVL(LOC.CODIGO, 0) LOCAL_ACC_CODIGO,
                        NVL(LOC.NOMBRE, 'SIN LOCAL ACC') LOCAL_ACC_NOMBRE,
                        SU.CODIGO SUCURSAL_CODIGO,
                        SU.NOMBRE SUCURSAL_NOMBRE,
                        DECODE(NVL(PV.INHABILITADO, 0), 0, 0, 1) ESTADO_CODIGO,
                        DECODE(NVL(PV.INHABILITADO, 0), 0, 'HABILITADO', 'INHABILITADO') ESTADO_NOMBRE,
                        EMP.CODIGO EMPRESA_CODIGO,
                        EMP.NOMBRE EMPRESA_NOMBRE,
                        NVL(PV.COBRO_ELECTRONICO, 0) COBRO_ELECTRONICO,
                        NVL(PV.IMPRESORA_TERMICA, 0) IMPRESORA_TERMICA,
                        NVL(PV.IMPRESION_AUTOMATICA, 0) IMPRESION_AUTOMATICA,
                        NVL(PV.FACTURA_AUTOMATICA, 0) FACTURA_AUTOMATICA,
                        NVL(PV.DECIDIR, 0) DECIDIR,
                        NVL(CJ.NOMBRE, 'SIN CAJA') CAJA_NOMBRE,
                        NVL(CJ.NUMERO, 0) CAJA_NUMERO,
                        NVL((SELECT CJJ.NUMERO
                         FROM TELECOM.CAJA_JERARQUIA CJJ
                         WHERE CJJ.NUMERO = CJ.PADRE), 0) CAJA_PADRE_NUMERO,
                        NVL(LOC.SUPERFICIE_VENTA, 0),
                        NVL(LOC.SUPERFICIE_TOTAL, 0),
                        DECODE((SELECT COUNT(*)
                                FROM GESTION.LISTAS_FOX@ACCESORIOS.SERVERORAC.CBB.NET LF,
                                     GESTION.LISTAS@ACCESORIOS.SERVERORAC.CBB.NET LI
                                WHERE LF.SUCURSAL_FOX = LOC.CODIGO_FOX
                                  AND LF.LISTA = LI.CODIGO), 0, 0, 1, (SELECT LI.CODIGO
                                FROM GESTION.LISTAS_FOX@ACCESORIOS.SERVERORAC.CBB.NET LF,
                                     GESTION.LISTAS@ACCESORIOS.SERVERORAC.CBB.NET LI
                                WHERE LF.SUCURSAL_FOX = LOC.CODIGO_FOX
                                  AND LF.LISTA = LI.CODIGO), 0) LISTA_VENTA_COD,
                        NVL(LOC.LISTA_MAYORISTA, 0) LISTA_COMPRA_COD,
                        NVL(LOC.CLIENTE_CODIGO, 0) CLIENTE_CODIGO,
                        NVL(LOC.VENDEDOR_CODIGO, 0) VENDEDOR_CODIGO,
                        NVL(LOC.LOCAL_DEPENDIENTE, 0) LOCAL_DEPENDIENTE,
                        NVL((SELECT COUNT(*)
                         FROM TELECOM.LOG_FOTOS_LOCALES LFO
                         WHERE LFO.PTO_VTA_CODIGO = PV.CODIGO), 0) CON_ARCHIVO,
                        NVL(PV.FP_INTEGRADO, 0) FP_INTEGRADO,
                        NVL(PV.FP_DESINTEGRADO, 0) FP_DESINTEGRADO,
                        NVL(PV.TERMINAL_X_VENTA, 0) TERMINAL_X_VENTA,
                        NVL(CJ.CAJA_DIARIA, 0) CAJA_DIARIA,
                        NVL(PV.MAYORISTA_SALON,0) MAYORISTA_SALON
                FROM TELECOM.PTOS_VTA PV,
                    TELECOM.LOCALIDADES LO,
                    TELECOM.PTOS_VTA_CATEGORIA PC,
                    GESTION.LOCALES@ACCESORIOS.SERVERORAC.CBB.NET LOC,
                    TELECOM.SUCURSALES SU,
                    TELECOM.EMPRESAS EMP,
                    TELECOM.CAJA_JERARQUIA CJ
                WHERE PV.EMPRESA_ID = ${req.empresa_codigo}
                AND PV.LOCALIDAD_CODIGO = LO.CODIGO
                AND PV.CATEGORIA_CODIGO = PC.CODIGO
                AND PV.LOCAL_ACCESORIOS = LOC.CODIGO(+)
                AND PV.SUCURSAL = SU.CODIGO
                AND PV.EMPRESA_ID = EMP.CODIGO
                AND PV.CODIGO = CJ.PTO_VTA_CODIGO(+)
                AND NVL(CJ.NIVEL, 0) <> 0`
      // estado
      if (parseInt(req.estado_codigo) == 0) sql = sql + ` AND NVL(PV.INHABILITADO, 0) = 0`
      else sql = sql + ` AND NVL(PV.INHABILITADO, 0) = 1`
      // sucursal?
      if (parseInt(req.sucursal_codigo) > 0) sql = sql + ` AND SU.CODIGO = ${req.sucursal_codigo}`
      // tipo?
      if (parseInt(req.tipo_codigo) > 0) sql = sql + ` AND PC.CODIGO = ${req.tipo_codigo}`
      // local nombre?
      if (req.nombre_local != null && req.nombre_local != undefined && req.nombre_local.toString().length > 0) sql = sql + ` AND (UPPER(PV.NOMBRE) LIKE '%' || UPPER('${req.nombre_local}') || '%' OR UPPER(LOC.NOMBRE) LIKE '%' || UPPER('${req.nombre_local}') || '%')`
      // ejecucion de la consulta
      let result = await db.open(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(element => {
          let unDetalle = {
            pto_vta_codigo: element[0], domicilio: element[1], localidad_codigo: element[2], 
            localidad_cp: element[3], localidad_nombre: element[4], fecha_grabacion: element[5], 
            usuario_grabacion: element[6], pto_vta_nombre: element[7], categoria_codigo: element[8], 
            categoria_nombre: element[9], local_acc_codigo: element[10], local_acc_nombre: element[11], 
            sucursal_codigo: element[12], sucursal_nombre: element[13], estado_codigo: element[14], 
            estado_nombre: element[15], empresa_codigo: element[16], empresa_nombre: element[17], 
            cobro_electronico: element[18], impresora_termica: element[19], impresion_automatica: element[20], 
            factura_automatica: element[21], decidir: element[22], caja_nombre: element[23],
            caja_numero: element[24], caja_padre_numero: element[25], sup_venta: element[26],
            sup_total: element[27], lista_venta_cod: element[28], lista_compra_cod: element[29],
            cliente_codigo: element[30], vendedor_codigo: element[31], local_dependiente: element[32],
            con_archivo: element[33], fp_integrado: element[34], fp_desintegrado: element[35], terminal_x_venta: element[36], caja_diaria: element[37],
            mayorista_salon: element[38]
          }
          listado.push(unDetalle)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        detalles: listado
      }
    }catch(error){
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo getLocalesOracle: ' + error.message,
        detalles: null
      }
    }
  },
  getClientesLocalesOracle: async(req,res,next) => {
    try{
      let listado = []
      let sql = `SELECT CLI.CODIGO CLIENTE_CODIGO,
                        VE.NOMBRE CLIENTE_NOMBRE,
                        VE.CODIGO VENDEDOR_CODIGO,
                        VE.EMPRESA_ID EMPRESA_CODIGO
                FROM TELECOM.VENDEDORES VE,
                    GESTION.CLIENTES@ACCESORIOS.SERVERORAC.CBB.NET CLI
                WHERE VE.VENDCAT_CODIGO IN (2, 14)
                  AND NVL(VE.INHABILITADO, 0) = 0
                  AND VE.VEND_COD_ACCESORIOS = CLI.CODIGO
                  AND NVL(CLI.INHABILITADO, 0) = 0`
      let result = await db.open(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(element => {
          let unCliente = {
            cliente_codigo: element[0],
            cliente_nombre: element[1],
            vendedor_codigo: element[2],
            empresa_codigo: element[3]
          }
          listado.push(unCliente)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        clientes: listado
      }
    }catch(error){
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo getClientesLocalesOracle: ' + error.message,
        clientes: null
      }
    }
  },
  getEjecutivosFranquicias: async(req,res,next) => {
    try{
      let listado = []
      let sql = `SELECT VE.CODIGO VEND_BB_CODIGO,
                        VE.NOMBRE VEND_BB_NOMBRE,
                        VEND.CODIGO VEND_ACC_CODIGO,
                        VEND.NOMBRE VEND_ACC_NOMBRE
                FROM TELECOM.VENDEDORES VE,
                    GESTION.VENDEDORES@ACCESORIOS.SERVERORAC.CBB.NET VEND
                WHERE VE.VENDCAT_CODIGO IN (15, 16)
                  AND NVL(VE.INHABILITADO, 0) = 0
                  AND VE.VEND_COD_ACCESORIOS = VEND.CODIGO`
      let result = await db.open(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(element => {
          let unEjec = {
            vend_bb_codigo: element[0],
            vend_bb_nombre: element[1],
            vend_acc_codigo: element[2],
            vend_acc_nombre: element[3]
          }
          listado.push(unEjec)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        ejecutivos: listado
      }
    }catch(error){
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo getEjecutivosFranquicias: ' + error.message,
        ejecutivos: null
      }
    }
  },
  getCajasPadre: async(req,res,next) => {
    try{
      let listado = []
      let sql = `SELECT CJ.NUMERO CAJA_NUMERO,
                        CJ.NOMBRE CAJA_NOMBRE,
                        CJ.SUCURSAL_CODIGO SUCURSAL_CODIGO
                FROM TELECOM.CAJA_JERARQUIA CJ
                WHERE CJ.PADRE = 1
                  AND UPPER(NOMBRE) NOT LIKE '%SIN%USO%'
                  AND CJ.NIVEL = 2
                  AND NVL(CJ.INHABILITADO, 0) = 0
                  AND NVL(CJ.SUCURSAL_CODIGO, 0) <> 0`
      let result = await db.open(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(element => {
          let unaCaja = {
            caja_numero: element[0],
            caja_nombre: element[1].toUpperCase(),
            sucursal_codigo: element[2]
          }
          listado.push(unaCaja)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        cajas: listado
      }
    }catch(error){
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo getCajasPadre: ' + error.message,
        cajas: null
      }
    }
  },
  nuevoLocalOracle: async(req,res,next) => {
    // abro la conexion a telecom
    let cadena = await db.getTelecomString()
    cadena.user = req.usuario
    cadena.password = req.clave
    let cnn = await oracledb.getConnection(cadena)
    try{
      let sql = ` BEGIN TELECOM.ADMIN_LOCALES_PKG.NUEVO_LOCAL(:empresa_codigo, :terceros, :sucursal_codigo, :habilitado, :categoria_codigo, :local_nombre,
                  :caja_nombre, :codigo_postal, :localidad_codigo, :domicilio, :superficie_venta, :superficie_total, :lista_venta, :cliente_codigo, :vendedor_codigo,
                  :local_dep_codigo, :lista_compra, :cobro_electronico, :impresora_termica, :caja_padre, :fp_integrado, :fp_desintegrado, :terminal_x_venta,
                  :caja_diaria, :resultadoOracle, :msjOracle, :p_mayorista_salon); END; `
      let param = {
        empresa_codigo: req.empresa_codigo, terceros: req.terceros, sucursal_codigo: req.sucursal_codigo,
        habilitado: req.habilitado, categoria_codigo: req.categoria_codigo, local_nombre: req.local_nombre,
        caja_nombre: req.caja_nombre, codigo_postal: req.codigo_postal, localidad_codigo: req.localidad_codigo,
        domicilio: req.domicilio, superficie_venta: req.superficie_venta, superficie_total: req.superficie_total,
        lista_venta: req.lista_venta, cliente_codigo: req.cliente_codigo, vendedor_codigo: req.vendedor_codigo,
        local_dep_codigo: req.local_dep_codigo, lista_compra: req.lista_compra, cobro_electronico: req.cobro_electronico,
        impresora_termica: req.impresora_termica, caja_padre: req.caja_padre,
        fp_integrado: req.fp_integrado, fp_desintegrado: req.fp_desintegrado, terminal_x_venta: req.terminal_x_venta,
        caja_diaria: req.caja_diaria, p_mayorista_salon: req.mayorista_salon,
        resultadoOracle: {type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1000},
        msjOracle: {type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 }
      }
      // ejecucion
      let result = await cnn.execute(sql, param, { autoCommit: false })
      let response = {...result.outBinds}
      // cierro la conexion
      cnn.release()
      // respuesta
      return {
        resultado: response.resultadoOracle,
        msj: response.msjOracle
      }
    }catch(error){
      cnn.release()
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo nuevoLocalOracle: ' + error.message
      }
    }
  },
  getListasPreciosOracle: async(req,res,next) => {
    try{
      let listadoListasVenta = []
      let listadoListasCompra = []
      let sql = `SELECT LI.CODIGO, LI.NOMBRE, TL.NUMERO, TL.NOMBRE
                FROM GESTION.LISTAS LI,
                    GESTION.TIPOS_LISTAS TL
                WHERE NVL(LI.INHABILITADA, 0) = 0
                  AND LI.TIPO_LISTA = TL.NUMERO`
      let result = await  db.executeAcc(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(element => {
          let unaLista = {
            lista_codigo: element[0],
            lista_nombre: element[1],
            tipo_lista: element[2],
            tipo_lista_nombre: element[3]
          }
          listadoListasVenta.push(unaLista)
        })
      }
      // tengo listas de compra?
      listadoListasCompra = listadoListasVenta.filter(element => element.tipo_lista == 2)
      return{
        resultado: 1,
        msj: 'OK',
        listasVenta: listadoListasVenta,
        listasCompra: listadoListasCompra
      }
    }catch(error){
      return{
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo getListasPreciosOracle: ' + error.message,
        listasVenta: null,
        listasCompra: null
      }
    }
  },
  updateLocalOracle: async(req,res,next) => {
    // abro la conexion a telecom
    let cadena = await db.getTelecomString()
    cadena.user = req.usuario
    cadena.password = req.clave
    let cnn = await oracledb.getConnection(cadena)
    try{
      let sql = ` BEGIN TELECOM.ADMIN_LOCALES_PKG.ACTUALIZAR_LOCAL(:empresa_codigo, :terceros, :sucursal_codigo, :habilitado, :categoria_codigo, :local_nombre,
                  :caja_nombre, :codigo_postal, :localidad_codigo, :domicilio, :superficie_venta, :superficie_total, :lista_venta, :cliente_codigo, :vendedor_codigo,
                  :local_dep_codigo, :lista_compra, :cobro_electronico, :impresora_termica, :caja_padre, :pto_vta_codigo, :fp_integrado, :fp_desintegrado, :terminal_x_venta,
                  :caja_diaria, :resultadoOracle, :msjOracle, :p_mayorista_salon); END; `
      let param = {
        empresa_codigo: req.empresa_codigo, terceros: req.terceros, sucursal_codigo: req.sucursal_codigo,
        habilitado: req.habilitado, categoria_codigo: req.categoria_codigo, local_nombre: req.local_nombre,
        caja_nombre: req.caja_nombre, codigo_postal: req.codigo_postal, localidad_codigo: req.localidad_codigo,
        domicilio: req.domicilio, superficie_venta: req.superficie_venta, superficie_total: req.superficie_total,
        lista_venta: req.lista_venta, cliente_codigo: req.cliente_codigo, vendedor_codigo: req.vendedor_codigo,
        local_dep_codigo: req.local_dep_codigo, lista_compra: req.lista_compra, cobro_electronico: req.cobro_electronico,
        impresora_termica: req.impresora_termica, caja_padre: req.caja_padre, pto_vta_codigo: req.pto_vta_codigo,
        fp_integrado: req.fp_integrado, fp_desintegrado: req.fp_desintegrado, terminal_x_venta: req.terminal_x_venta,
        caja_diaria: req.caja_diaria, p_mayorista_salon: req.mayorista_salon,
        resultadoOracle: {type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1000},
        msjOracle: {type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 }
      }
      // ejecucion
      let result = await cnn.execute(sql, param, { autoCommit: false })
      let response = {...result.outBinds}
      // cierro la conexion
      cnn.release()
      // respuesta
      return {
        resultado: response.resultadoOracle,
        msj: response.msjOracle
      }
    }catch(error){
      cnn.release()
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo updateLocalOracle: ' + error.message
      }
    }
  },
  regLogUploadFotos: async(req,res,next) => {
    try{
      let url = req.ruta_archivo.toString().substring(14, req.ruta_archivo.toString().length)
      let sql = `
        BEGIN
          INSERT INTO TELECOM.LOG_FOTOS_LOCALES(
            CARPETA_NOMBRE, ARCHIVO_NOMBRE, USUARIO, FECHA_LOG, PTO_VTA_CODIGO, URL
          )
          VALUES(
            '${req.id}', '${req.nombre_archivo}', '${req.usuario}', SYSDATE, '${req.id}', '${url}'
          );
          COMMIT;
          :resultadoOracle := 1;
          :msjOracle := 'OK';
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            :resultadoOracle := 0;
            :msjOracle := 'Ocurrio un problema al guardar el log de Facturas de Compra: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
        END;
      `
      let param = {
        resultadoOracle: {type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1000},
        msjOracle: {type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 }
      }
      // ejecuto el insert
      let result = await db.open(sql,param,false)
      let response = {...result.outBinds}
      return {
        resultado: response.resultadoOracle,
        msj: response.msjOracle
      }
    }catch(error){
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo regLogUploadFotos: ' + error.message
      }
    }
  },
  removeLogUploadFotos: async(req,res,next) => {
    try{
      let url = req.path.toString().substring(1, req.path.toString().length)
      let sql = `
        BEGIN
          DELETE FROM TELECOM.LOG_FOTOS_LOCALES
          WHERE PTO_VTA_CODIGO = ${req.id}
            AND TRIM(UPPER(URL)) = TRIM(UPPER('${url}'));
          COMMIT;
          :resultadoOracle := 1;
          :msjOracle := 'OK';
        EXCEPTION
          WHEN OTHERS THEN
            ROLLBACK;
            :resultadoOracle := 0;
            :msjOracle := 'Ocurrio un problema al quitar el log de Facturas de Compra: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
        END;
      `
      let param = {
        resultadoOracle: {type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1000},
        msjOracle: {type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 }
      }
      // ejecuto el insert
      let result = await db.open(sql,param,false)
      let response = {...result.outBinds}
      return {
        resultado: response.resultadoOracle,
        msj: response.msjOracle
      }
    }catch(error){
      return {
        resultado: 0,
        msj: 'Ocurrio un problema al ejecutar el metodo removeLogUploadFotos: ' + error.message
      }
    }
  },
  getTerminalesLocal: async(req, res, next) => {
    try {
      let terminales = []
      let sql = "SELECT * FROM TELECOM.PTOS_VTA_TERMINALES TER WHERE TER.PTO_VTA_CODIGO = :local ORDER BY TERMINAL DESC"
      let result = await db.openUser(sql, req, false)

      const headers = result.metaData
      const size = result.rows.length

      for (let index = 0; index < size; index++) {
        const item = result.rows[index]
        terminales.push({
          id: item[columna(headers, 'ID')],
          numero: item[columna(headers, 'TERMINAL')],
          activa: item[columna(headers, 'INHABILITADO')] == 1 ? false : true,
          integrada: item[columna(headers, 'INTEGRADO')] == 1 ? true : false,
          alias: item[columna(headers, 'ALIAS')] ? item[columna(headers, 'ALIAS')] : ''
        })
      }

      return {
        exito: 1,
        size: size,
        data: terminales
      }
      
    } catch (error) {
      return {
        exito: 0,
        message: 'Ocurrio un problema al ejecutar el metodo getTerminalesLocal: ' + error.message
      }
    }
  },
  cambiarNumeroTerminal: async(req, res, next) => {
    try {
      let sql = `
      DECLARE
        V_ERR EXCEPTION;
        V_COUNT NUMBER;
        V_LOCAL VARCHAR2(100);
      BEGIN
        -- verifico si ya existe otra terminal con el mismo numero
        SELECT COUNT (*) INTO V_COUNT FROM TELECOM.PTOS_VTA_TERMINALES WHERE TERMINAL = :numero;
        IF V_COUNT > 0 THEN
          SELECT PV.NOMBRE INTO V_LOCAL
            FROM TELECOM.PTOS_VTA PV, TELECOM.PTOS_VTA_TERMINALES TER
           WHERE TER.PTO_VTA_CODIGO = PV.CODIGO
             AND TER.TERMINAL = :numero;
          RAISE V_ERR;
        END IF;

        UPDATE TELECOM.PTOS_VTA_TERMINALES
          SET TERMINAL = :numero
        WHERE ID = :codigo;

        IF SQL%ROWCOUNT > 0 THEN
          COMMIT;
          :exito := 1;
          :mensaje := 'Número de terminal cambiado correctamente';
        ELSE
          ROLLBACK;
          :exito := 0;
          :mensaje := 'No se pudo cambiar el número de terminal: ninguna row afectada';
        END IF;

      EXCEPTION
        WHEN V_ERR THEN
          :exito := 0;
          :mensaje := 'La terminal Nº ' || :numero || ' ya se encuentra asociada al local ' || V_LOCAL;
        WHEN OTHERS THEN
          ROLLBACK;
          :exito := 0;
          :mensaje := SUBSTR('Ocurrio un error al cambiar el número de terminal: ' || SQLERRM || '-' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE (), 0, 1000);
      END;
      `
      let param = {
        codigo: req.codigo,
        numero: req.numero,
        exito: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1 },
        mensaje: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 },
        // autenticacion
        usuario: req.usuario,
        clave: req.clave
      }

      let result = await db.openUser(sql, param, false)

      return {
        exito: result.outBinds.exito,
        message: result.outBinds.mensaje
      }
      
    } catch (error) {
      return {
        exito: 0,
        message: 'Ocurrio un problema al ejecutar el metodo cambiarNumeroTerminal: ' + error.message
      }
    }
  },
  cambiarAliasTerminal: async(req, res, next) => {
    try {
      let sql = `
      BEGIN
        UPDATE TELECOM.PTOS_VTA_TERMINALES
          SET ALIAS = :nombre
        WHERE ID = :codigo;

        IF SQL%ROWCOUNT > 0 THEN
          COMMIT;
          :exito := 1;
          :mensaje := 'Alias de la terminal modificado correctamente';
        ELSE
          ROLLBACK;
          :exito := 0;
          :mensaje := 'No se pudo cambiar el alias de la terminal: ninguna row afectada';
        END IF;

      EXCEPTION
        WHEN OTHERS THEN
          ROLLBACK;
          :exito := 0;
          :mensaje := SUBSTR('Ocurrio un error al cambiar el alias de la terminal: ' || SQLERRM || '-' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE (), 0, 1000);
      END;
      `
      let param = {
        codigo: req.codigo,
        nombre: req.nombre,
        exito: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1 },
        mensaje: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 },
        // autenticacion
        usuario: req.usuario,
        clave: req.clave
      }

      let result = await db.openUser(sql, param, false)

      return {
        exito: result.outBinds.exito,
        message: result.outBinds.mensaje
      }
      
    } catch (error) {
      return {
        exito: 0,
        message: 'Ocurrio un problema al ejecutar el metodo cambiarAliasTerminal: ' + error.message
      }
    }
  },
  estadoTerminal: async (req, res, next) => {
    try {
      let sql = `
      BEGIN
        UPDATE TELECOM.PTOS_VTA_TERMINALES
          SET INHABILITADO = DECODE (:inhabilitada, 1, 1, NULL)
        WHERE ID = :codigo;

        IF SQL%ROWCOUNT > 0 THEN
          COMMIT;
          :exito := 1;
          :mensaje := 'Cambios guardados correctamente';
        ELSE
          ROLLBACK;
          :exito := 0;
          :mensaje := 'No se pudo cambiar el estado de la terminal: ninguna row afectada';
        END IF;

      EXCEPTION
        WHEN OTHERS THEN
          ROLLBACK;
          :exito := 0;
          :mensaje := SUBSTR('Ocurrio un error al cambiar el estado de la terminal: ' || SQLERRM || '-' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE (), 0, 1000);
      END;
      `
      let param = {
        codigo: req.codigo,
        inhabilitada: req.inhabilitada,
        exito: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1 },
        mensaje: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 },
        // autenticacion
        usuario: req.usuario,
        clave: req.clave
      }

      let result = await db.openUser(sql, param, false)

      return {
        exito: result.outBinds.exito,
        message: result.outBinds.mensaje
      }
      
    } catch (error) {
      return {
        exito: 0,
        message: 'Ocurrio un problema al ejecutar el metodo estadoTerminal: ' + error.message
      }
    }
  },
  integrarTerminal: async (req, res, next) => {
    try {
      let sql = `
      BEGIN
        UPDATE TELECOM.PTOS_VTA_TERMINALES
          SET INTEGRADO = DECODE (:integrada, 1, 1, NULL)
        WHERE ID = :codigo;

        IF SQL%ROWCOUNT > 0 THEN
          COMMIT;
          :exito := 1;
          :mensaje := 'Cambios guardados correctamente';
        ELSE
          ROLLBACK;
          :exito := 0;
          :mensaje := 'No se pudo integrar/desintegrar la terminal: ninguna row afectada';
        END IF;

      EXCEPTION
        WHEN OTHERS THEN
          ROLLBACK;
          :exito := 0;
          :mensaje := SUBSTR('Ocurrio un error al integrar/desintegrar la terminal: ' || SQLERRM || '-' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE (), 0, 1000);
      END;
      `
      let param = {
        codigo: req.codigo,
        integrada: req.integrada,
        exito: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1 },
        mensaje: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 },
        // autenticacion
        usuario: req.usuario,
        clave: req.clave
      }

      let result = await db.openUser(sql, param, false)

      return {
        exito: result.outBinds.exito,
        message: result.outBinds.mensaje
      }
      
    } catch (error) {
      return {
        exito: 0,
        message: 'Ocurrio un problema al ejecutar el metodo integrarTerminal: ' + error.message
      }
    }
  },
  nuevaTerminal: async (req, res, next) => {
    try {
      let sql = `
      DECLARE
        V_ERR EXCEPTION;
        V_COUNT NUMBER;
        V_LOCAL VARCHAR2(100);
        V_ID NUMBER;
      BEGIN
        -- verifico si ya existe otra terminal con el mismo numero
        SELECT COUNT (*) INTO V_COUNT FROM TELECOM.PTOS_VTA_TERMINALES WHERE TERMINAL = :numero;
        IF V_COUNT > 0 THEN
          SELECT PV.NOMBRE INTO V_LOCAL
            FROM TELECOM.PTOS_VTA PV, TELECOM.PTOS_VTA_TERMINALES TER
           WHERE TER.PTO_VTA_CODIGO = PV.CODIGO
             AND TER.TERMINAL = :numero;
          RAISE V_ERR;
        END IF;

        SELECT TELECOM.PTOS_VTA_TERMINALES_SEQ.NEXTVAL INTO V_ID FROM dual;

        INSERT INTO TELECOM.PTOS_VTA_TERMINALES (ID, TERMINAL, PTO_VTA_CODIGO, INHABILITADO, INTEGRADO, ALIAS, USUARIO_LOG, FECHA_LOG)
        VALUES (V_ID, :numero, :pto_vta, DECODE (:inhabilitada, 1, 1, NULL), DECODE (:integrada, 1, 1, NULL), :nombre, USER, SYSDATE);

        IF SQL%ROWCOUNT > 0 THEN
          COMMIT;
          :id := V_ID;
          :exito := 1;
          :mensaje := 'Terminal agregada correctamente';
        ELSE
          ROLLBACK;
          :id := 0;
          :exito := 0;
          :mensaje := 'No se pudo agregar la terminal: ninguna row afectada';
        END IF;

      EXCEPTION
        WHEN V_ERR THEN
          :id := 0;
          :exito := 0;
          :mensaje := 'La terminal Nº ' || :numero || ' ya se encuentra asociada al local ' || V_LOCAL;
        WHEN OTHERS THEN
          ROLLBACK;
          :id := 0;
          :exito := 0;
          :mensaje := SUBSTR('Ocurrio un error al agregar la terminal: ' || SQLERRM || '-' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE (), 0, 1000);
      END;
      `
      let param = {
        numero: req.numero,
        pto_vta: req.pto_vta,
        inhabilitada: req.inhabilitada,
        integrada: req.integrada,
        nombre: req.nombre,
        id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 10 },
        exito: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1 },
        mensaje: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 },
        // autenticacion
        usuario: req.usuario,
        clave: req.clave
      }

      let result = await db.openUser(sql, param, false)

      return {
        exito: result.outBinds.exito,
        id: result.outBinds.id,
        message: result.outBinds.mensaje
      }
      
    } catch (error) {
      return {
        exito: 0,
        message: 'Ocurrio un problema al ejecutar el metodo nuevaTerminal: ' + error.message
      }
    }
  },
  eliminarTerminal: async (req, res, next) => {
    try {
      let sql = `
      BEGIN
        DELETE FROM TELECOM.PTOS_VTA_TERMINALES WHERE ID = :codigo;

        IF SQL%ROWCOUNT > 0 THEN
          COMMIT;
          :exito := 1;
          :mensaje := 'Terminal eliminada correctamente';
        ELSE
          ROLLBACK;
          :exito := 0;
          :mensaje := 'No se pudo eliminar la terminal: ninguna row afectada';
        END IF;

      EXCEPTION
        WHEN OTHERS THEN
          ROLLBACK;
          :exito := 0;
          :mensaje := SUBSTR('Ocurrio un error al eliminar la terminal: ' || SQLERRM || '-' || DBMS_UTILITY.FORMAT_ERROR_BACKTRACE (), 0, 1000);
      END;
      `
      let param = {
        codigo: req.codigo,
        exito: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1 },
        mensaje: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 },
        // autenticacion
        usuario: req.usuario,
        clave: req.clave
      }

      let result = await db.openUser(sql, param, false)

      return {
        exito: result.outBinds.exito,
        message: result.outBinds.mensaje
      }
      
    } catch (error) {
      return {
        exito: 0,
        message: 'Ocurrio un problema al ejecutar el metodo eliminarTerminal: ' + error.message
      }
    }
  },
  getTerminalesIntegradas: async (req, res, next) => {
    try {
      let terminales = []
      let sql = `
      SELECT ID, TERMINAL, ALIAS, TERMINAL || DECODE (ALIAS, NULL, '', ' - ') || ALIAS NOMBRE
        FROM TELECOM.PTOS_VTA_TERMINALES
      WHERE PTO_VTA_CODIGO = :local
        AND NVL (INHABILITADO, 0) = 0
        AND NVL (INTEGRADO, 0) = 1
      ORDER BY TERMINAL DESC
      `
      let result = await db.openUser(sql, req, false)

      const headers = result.metaData
      const size = result.rows.length
  
      for (let index = 0; index < size; index++) {
        const item = result.rows[index]
        terminales.push({
          id: item[columna(headers, 'ID')],
          alias: item[columna(headers, 'ALIAS')],
          numero: item[columna(headers, 'TERMINAL')],
          nombre: item[columna(headers, 'NOMBRE')]
        })
      }

      return {
        exito: 1,
        data: terminales,
        message: 'Ok'
      }
      
    } catch (error) {
      return {
        exito: 0,
        data: [],
        message: 'Ocurrio un error al obtener las terminales del local: ' + error.message
      }
    }
  },
  initFormLocalesAfipOracle: async(req, res, next) =>{
    try {
      let listado = []
      let sql = `SELECT TF.ID, TF.DESCRIPCION
                FROM GESTION.TIPOS_FACTURACION TF`
      let result = await db.executeAcc(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(element => {
          let unTipo = {
            facturacion_codigo: element[0],
            facturacion_nombre: element[1].toUpperCase(),
          }
          listado.push(unTipo)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        tipos: listado
      }
    } catch (error) {
      return {
        resultado: 0,
        tipos: [],
        msj: 'Ocurrio un error al obtener tipos de facturacion de los locales AFIP (initFormLocalesAfipOracle): ' + error.message
      }
    }
  },
  getLocalesAfipOracle: async (req, res, next) => {
    try {
      let listado = [];
      let sql = `
      SELECT DISTINCT
          LPV.CODIGO_EMISION       PV_AFIP,
          TF.ID                    TIPO_FACTURACION_CODIGO,
          TF.DESCRIPCION           TIPO_FACTURACION_NOMBRE,
          LO.CODIGO                LOCAL_CODIGO,
          LO.NOMBRE                LOCAL,
          LOC.CODIGO               LOCAL_CODIGO_ORIGEN,
          LOC.NOMBRE               LOCAL_ORIGEN,
          EMP.CODIGO               EMPRESA_CODIGO,
          EMP.ABREVIACION          EMPRESA_NOMBRE,
          SUC.CODIGO               SUCURSAL_CODIGO,
          SUC.NOMBRE               SUCURSAL_NOMBRE,
          LPV.FECHA_HABILITACION   FECHA_HABILITACION,
          NVL(LPV.INHABILITADO, 0) INHABILITADO
      FROM 
          GESTION.LOCALES_PV          LPV,
          GESTION.LOCALES             LO,
          GESTION.LOCALES             LOC,
          GESTION.TIPOS_FACTURACION   TF,
          TELECOM.SUCURSALES@TELECOM.SERVERORAC.CBB.NET   SUC,
          TELECOM.EMPRESAS@TELECOM.SERVERORAC.CBB.NET     EMP
      WHERE 
          LPV.LOCAL_CODIGO        = LO.CODIGO     AND
          LPV.LOCAL_CODIGO_ORIGEN = LOC.CODIGO(+) AND
          LPV.TIPO_FACTURACION_ID = TF.ID         AND
          LPV.EMPRESA_ID          = EMP.CODIGO    AND
          NVL(EMP.INHABILITADO,0) = 0             AND
          LO.SUCURSAL_CODIGO      = SUC.CODIGO`

      if(campoNoVacio(req.empresa_codigo)){     sql += ` AND LPV.EMPRESA_ID = ${req.empresa_codigo}`  }
      if(campoNoVacio(req.sucursal_codigo)){     sql += ` AND LO.SUCURSAL_CODIGO = ${req.sucursal_codigo}`  }
      if(campoNoVacio(req.pv_afip)){            sql += ` AND LPV.CODIGO_EMISION = lpad(${req.pv_afip}, 4, '0')`}
      if(campoNoVacio(req.inhabilitado) && (parseInt(req.inhabilitado) == 0 || parseInt(req.inhabilitado) == 1)){ sql += ` AND NVL(LPV.INHABILITADO, 0) = ${parseInt(req.inhabilitado)}` }
      if(campoNoVacio(req.tipoFacturacion)){    sql += ` AND LPV.TIPO_FACTURACION_ID = ${req.tipoFacturacion}` }
      if(campoNoVacio(req.fechaHabilitacion)){  sql += ` AND TRUNC(LPV.FECHA_HABILITACION) = TO_DATE('${req.fechaHabilitacion}', 'DD/MM/RRRR')` }
      
      let result = await db.executeAcc(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(e => {
          let local = {
            pv_afip: e[0],
            tipo_facturacion_codigo: e[1],
            tipo_facturacion_nombre: e[2] ? e[2].toUpperCase() : e[2],
            local_codigo: e[3],
            local_nombre: e[4] ? e[4].toUpperCase() : e[4],
            local_codigo_origen: e[5],
            local_nombre_origen: e[6] ? e[6].toUpperCase() : e[6],
            empresa_codigo: e[7],
            empresa_nombre: e[8] ? e[8].toUpperCase() : e[8],
            sucursal_codigo: e[9],
            sucursal_nombre: e[10] ? e[10].toUpperCase() : e[10],
            fecha_habilitacion: e[11],
            inhabilitado: e[12]
          }
          listado.push(local)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        locales: listado
      }
    } catch (error) {
      return {
        resultado: 0,
        locales: [],
        msj: 'Ocurrió un error al obtener información de los locales AFIP (getLocalesAfipOracle): ' + error.message
      }
    }
  },
  getLocalesPadresOracle: async (req, res, next) =>{
    try {
      let listado = [];
            //´
      let sqlPadres = `
        -- busco los padres disponibles, aquellos habilitados que están en LOCALES y no están en LOCALES_PV(excluir también aquellos que tiene el local_codigo_origen = null)
        SELECT 
            EMP.CODIGO              EMPRESA_CODIGO,  
            EMP.NOMBRE              EMPRESA_NOMBRE,
            SUC.CODIGO              SUCURSAL_CODIGO,
            SUC.NOMBRE              SUCURSAL_NOMBRE,
            NULL                    FECHA_HABILITACION,
            NVL(L.INHABILITADO, 0) INHABILITADO,
            L.CODIGO               LOCAL_CODIGO,
            L.NOMBRE               LOCAL_NOMBRE,
            L.CODIGO               LOCAL_CODIGO_ORIGEN,
            L.NOMBRE               LOCAL_CODIGO_NOMBRE,
            NULL                    PV_AFIP,
            NULL                    TIPO_FACTURACION_CODIGO,
            NULL                    TIPO_FACTURACION_NOMBRE
        FROM GESTION.LOCALES L,
             TELECOM.SUCURSALES@TELECOM.SERVERORAC.CBB.NET   SUC,
             TELECOM.EMPRESAS@TELECOM.SERVERORAC.CBB.NET     EMP
        WHERE NVL(L.INHABILITADO,0) = 0
          AND L.SUCURSAL_CODIGO     = SUC.CODIGO
          AND SUC.CODIGO            = ${req.sucursal_codigo}
          AND L.EMPRESA_CODIGO      = EMP.CODIGO
          AND EMP.CODIGO            = ${req.empresa_codigo}
          AND NOT EXISTS (SELECT 1 FROM GESTION.LOCALES_PV LP
                          WHERE LP.LOCAL_CODIGO         = L.CODIGO
                            AND NVL(LP.INHABILITADO,0)  = 0
                            AND LP.EMPRESA_ID           = ${req.empresa_codigo})
        `;
      if(campoNoVacio(req.tipo_facturacion_id)){
        sqlPadres += ` UNION ALL 
        SELECT 
            EMP.CODIGO              EMPRESA_CODIGO,  
            EMP.NOMBRE              EMPRESA_NOMBRE,
            SUC.CODIGO              SUCURSAL_CODIGO,
            SUC.NOMBRE              SUCURSAL_NOMBRE,
            NULL                    FECHA_HABILITACION,
            NVL(L.INHABILITADO, 0) INHABILITADO,
            L.CODIGO               LOCAL_CODIGO,
            L.NOMBRE               LOCAL_NOMBRE,
            L.CODIGO               LOCAL_CODIGO_ORIGEN,
            L.NOMBRE               LOCAL_CODIGO_NOMBRE,
            NULL                    PV_AFIP,
            NULL                    TIPO_FACTURACION_CODIGO,
            NULL                    TIPO_FACTURACION_NOMBRE
        FROM GESTION.LOCALES L,
             TELECOM.SUCURSALES@TELECOM.SERVERORAC.CBB.NET   SUC,
             TELECOM.EMPRESAS@TELECOM.SERVERORAC.CBB.NET     EMP
        WHERE NVL(L.INHABILITADO,0) = 0
          AND L.SUCURSAL_CODIGO     = SUC.CODIGO
          AND SUC.CODIGO            = ${req.sucursal_codigo}
          AND L.EMPRESA_CODIGO      = EMP.CODIGO
          AND EMP.CODIGO            = ${req.empresa_codigo}
          AND NOT EXISTS (SELECT 1 FROM GESTION.LOCALES_PV LP
                          WHERE LP.LOCAL_CODIGO         = L.CODIGO
                            AND NVL(LP.INHABILITADO,0)  = 0
                            AND LP.EMPRESA_ID           = ${req.empresa_codigo}
                            AND LP.TIPO_FACTURACION_ID  = ${req.tipo_facturacion_id})`
      }

      if(!req.nuevo && campoNoVacio(req.local_codigo_origen)){
        sqlPadres += ` UNION ALL 
        SELECT DISTINCT
            EMP.CODIGO              EMPRESA_CODIGO,  
            EMP.NOMBRE              EMPRESA_NOMBRE,
            SUC.CODIGO              SUCURSAL_CODIGO,
            SUC.NOMBRE              SUCURSAL_NOMBRE,
            NULL                    FECHA_HABILITACION,
            NVL(L.INHABILITADO, 0) INHABILITADO,
            L.CODIGO               LOCAL_CODIGO,
            L.NOMBRE               LOCAL_NOMBRE,
            L.CODIGO               LOCAL_CODIGO_ORIGEN,
            L.NOMBRE               LOCAL_CODIGO_NOMBRE,
            NULL                    PV_AFIP,
            NULL                    TIPO_FACTURACION_CODIGO,
            NULL                    TIPO_FACTURACION_NOMBRE
        FROM GESTION.LOCALES L,
             GESTION.LOCALES_PV LP,
             TELECOM.SUCURSALES@TELECOM.SERVERORAC.CBB.NET   SUC,
             TELECOM.EMPRESAS@TELECOM.SERVERORAC.CBB.NET     EMP
        WHERE NVL(L.INHABILITADO,0)   = 0
          AND L.CODIGO                = LP.LOCAL_CODIGO_ORIGEN
          AND LP.LOCAL_CODIGO_ORIGEN  = LP.LOCAL_CODIGO
          AND LP.LOCAL_CODIGO_ORIGEN  = ${req.local_codigo_origen}
          AND LP.TIPO_FACTURACION_ID  = ${req.tipo_facturacion_id}
          AND L.SUCURSAL_CODIGO       = SUC.CODIGO
          AND SUC.CODIGO              = ${req.sucursal_codigo}
          AND L.EMPRESA_CODIGO        = EMP.CODIGO
          AND EMP.CODIGO              = ${req.empresa_codigo}`
      }else console.log("NO ENTROOOOOOO");

      //console.log("sql: ",sql);
      console.log("sqlPadres: ",sqlPadres);
      let result = await db.executeAcc(sqlPadres, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(e => {
          let local = {
            empresa_codigo: e[0],
            empresa_nombre: e[1].toUpperCase(),
            sucursal_codigo: e[2],
            sucursal_nombre: e[3].toUpperCase(),
            fecha_habilitacion: moment(new Date()).format('DD/MM/YYYY'),
            inhabilitado: e[5],
            local_codigo: e[6],
            local_nombre: e[7] ? e[7].toUpperCase() : e[7],
            local_codigo_origen: e[8],
            local_nombre_origen: e[9] ? e[9].toUpperCase() : e[9],
            pv_afip: e[10],
            tipo_facturacion_codigo: e[11],
            tipo_facturacion_nombre: e[12] ? e[12].toUpperCase() : e[12],
            localesAsociados: [],
          }
          listado.push(local)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        padres: listado
      }
    } catch (error) {
      return {
        resultado: 0,
        locales: [],
        msj: 'Ocurrió un error al obtener información de los locales AFIP (getLocalesPadresOracle): ' + error.message
      }
    }
  },
  getLocalesHijosOracle: async (req, res, next) =>{
    console.log("entroooo a getLocalesHijosOracle: ");
    try {
      let listado = [];
      let sql = `
        -- LOCALES QUE ACABAN DE CREARSE, POR LO TANTO, NO ESTAN EN LOCALES_PV
          SELECT
          EMP.CODIGO              EMPRESA_CODIGO,  
          EMP.NOMBRE              EMPRESA_NOMBRE,
          SUC.CODIGO              SUCURSAL_CODIGO,
          SUC.NOMBRE              SUCURSAL_NOMBRE,
          NULL                    FECHA_HABILITACION,
          NVL(LO.INHABILITADO, 0) INHABILITADO,
          LO.CODIGO               LOCAL_CODIGO,
          LO.NOMBRE               LOCAL_NOMBRE,
          LO.CODIGO               LOCAL_CODIGO_ORIGEN,
          LO.NOMBRE               LOCAL_CODIGO_NOMBRE,
          NULL                    PV_AFIP,
          NULL                    TIPO_FACTURACION_CODIGO,
          NULL                    TIPO_FACTURACION_NOMBRE,
          1                       TIPO
        FROM GESTION.LOCALES LO,
             TELECOM.SUCURSALES@TELECOM.SERVERORAC.CBB.NET   SUC,
             TELECOM.EMPRESAS@TELECOM.SERVERORAC.CBB.NET     EMP
        WHERE NVL(LO.INHABILITADO, 0) = 0
          AND LO.SUCURSAL_CODIGO = SUC.CODIGO
          AND LO.EMPRESA_CODIGO  = EMP.CODIGO
          AND LO.SUCURSAL_CODIGO = ${req.sucursal_codigo} -- SUCURSAL
          AND LO.EMPRESA_CODIGO  = ${req.empresa_codigo}  -- EMPRESA
          AND NOT EXISTS (SELECT 1
                          FROM GESTION.LOCALES_PV LP
                          WHERE LP.LOCAL_CODIGO = LO.CODIGO)         
        UNION ALL
        -- LOCALES QUE ESTAN EN LOCALES_PV, HABILITADOS Y QUE NO TIENEN ASOCIADO UN PADRE
        SELECT 
          EMP.CODIGO                EMPRESA_CODIGO,  
          EMP.NOMBRE                EMPRESA_NOMBRE,
          SUC.CODIGO                SUCURSAL_CODIGO,
          SUC.NOMBRE                SUCURSAL_NOMBRE,
          LP.FECHA_HABILITACION     FECHA_HABILITACION,
          NVL(LOC.INHABILITADO, 0)  INHABILITADO,
          LOC.CODIGO                LOCAL_CODIGO,
          LOC.NOMBRE                LOCAL_NOMBRE,
          LP.LOCAL_CODIGO_ORIGEN    LOCAL_CODIGO_ORIGEN,
          (SELECT L.NOMBRE FROM GESTION.LOCALES L WHERE L.CODIGO = LP.LOCAL_CODIGO_ORIGEN)                  LOCAL_CODIGO_NOMBRE,
          LP.CODIGO_EMISION         PV_AFIP,
          LP.TIPO_FACTURACION_ID    TIPO_FACTURACION_CODIGO,
          (SELECT TF.DESCRIPCION FROM GESTION.TIPOS_FACTURACION TF WHERE TF.ID = LP.TIPO_FACTURACION_ID)  TIPO_FACTURACION_NOMBRE,
          1                         TIPO
        FROM GESTION.LOCALES_PV LP,
            GESTION.LOCALES LOC,
            TELECOM.SUCURSALES@TELECOM.SERVERORAC.CBB.NET   SUC,
            TELECOM.EMPRESAS@TELECOM.SERVERORAC.CBB.NET     EMP
        WHERE LOC.EMPRESA_CODIGO  = EMP.CODIGO
          AND LOC.EMPRESA_CODIGO  = LP.EMPRESA_ID
          AND LP.EMPRESA_ID       = ${req.empresa_codigo} -- EMPRESA
          AND NVL(LP.LOCAL_CODIGO_ORIGEN, 0) = 0
          AND LOC.SUCURSAL_CODIGO = SUC.CODIGO
          AND LOC.SUCURSAL_CODIGO = ${req.sucursal_codigo} -- SUCURSAL
          AND NVL(LP.INHABILITADO, 0) = 0        
          AND LP.LOCAL_CODIGO = LOC.CODIGO
          AND LP.TIPO_FACTURACION_ID = ${req.tipo_facturacion_id}
        UNION
        -- LOCALES QUE ESTAN EN LOCALES_PV, PERO INHABILITADOS Y QUE ADEMÁS NO TENGAN UN PADRE ASOCIADO
        SELECT 
          EMP.CODIGO                EMPRESA_CODIGO,  
          EMP.NOMBRE                EMPRESA_NOMBRE,
          SUC.CODIGO                SUCURSAL_CODIGO,
          SUC.NOMBRE                SUCURSAL_NOMBRE,
          LP.FECHA_HABILITACION     FECHA_HABILITACION,
          NVL(LO.INHABILITADO, 0)   INHABILITADO,
          LO.CODIGO                 LOCAL_CODIGO,
          LO.NOMBRE                 LOCAL_NOMBRE,
          LP.LOCAL_CODIGO_ORIGEN    LOCAL_CODIGO_ORIGEN,
          (SELECT L.NOMBRE FROM GESTION.LOCALES L WHERE L.CODIGO = LP.LOCAL_CODIGO_ORIGEN)                  LOCAL_CODIGO_NOMBRE,
          LP.CODIGO_EMISION         PV_AFIP,
          LP.TIPO_FACTURACION_ID    TIPO_FACTURACION_CODIGO,
          (SELECT TF.DESCRIPCION FROM GESTION.TIPOS_FACTURACION TF WHERE TF.ID = LP.TIPO_FACTURACION_ID)  TIPO_FACTURACION_NOMBRE,
          1                         TIPO
        FROM GESTION.LOCALES_PV LP,
             GESTION.LOCALES LO,
             TELECOM.SUCURSALES@TELECOM.SERVERORAC.CBB.NET   SUC,
             TELECOM.EMPRESAS@TELECOM.SERVERORAC.CBB.NET     EMP
        WHERE NVL(LP.INHABILITADO,0)  = 1
          AND LP.LOCAL_CODIGO         = LO.CODIGO
          AND LO.SUCURSAL_CODIGO      = SUC.CODIGO
          AND LO.SUCURSAL_CODIGO      = ${req.sucursal_codigo} -- SUCURSAL
          AND LP.EMPRESA_ID           = ${req.empresa_codigo} -- EMPRESA
          AND LO.EMPRESA_CODIGO       = EMP.CODIGO
          AND LP.LOCAL_CODIGO <> NVL(LP.LOCAL_CODIGO_ORIGEN, 0)
          AND LP.TIPO_FACTURACION_ID = ${req.tipo_facturacion_id}
          AND NOT EXISTS (SELECT 1
                          FROM GESTION.LOCALES_PV LPP
                          WHERE LPP.LOCAL_CODIGO = LP.LOCAL_CODIGO
                            AND NVL(LPP.INHABILITADO, 0) = 0
                            AND (NVL(LPP.LOCAL_CODIGO_ORIGEN, 0) = 0 OR NVL(LPP.LOCAL_CODIGO_ORIGEN, 0) <> 0)
                            AND (SELECT LOC.SUCURSAL_CODIGO
                                FROM GESTION.LOCALES LOC
                                WHERE LOC.CODIGO = LPP.LOCAL_CODIGO) = ${req.sucursal_codigo} -- SUCURSAL
                            AND LPP.EMPRESA_ID = ${req.empresa_codigo} -- EMPRESA
                            )
      `
      if(campoNoVacio(req.pv_afip)){
        sql += `
        UNION ALL
        -- LOCALES QUE TENGAN COMO PADRE A LOCAL_PADRE
        SELECT DISTINCT
          EMP.CODIGO                EMPRESA_CODIGO,  
          EMP.NOMBRE                EMPRESA_NOMBRE,
          SUC.CODIGO                SUCURSAL_CODIGO,
          SUC.NOMBRE                SUCURSAL_NOMBRE,
          LP.FECHA_HABILITACION     FECHA_HABILITACION,
          NVL(LO.INHABILITADO, 0)   INHABILITADO,
          LO.CODIGO                 LOCAL_CODIGO,
          LO.NOMBRE                 LOCAL_NOMBRE,
          LP.LOCAL_CODIGO_ORIGEN    LOCAL_CODIGO_ORIGEN,
          (SELECT L.NOMBRE FROM GESTION.LOCALES L WHERE L.CODIGO = LP.LOCAL_CODIGO_ORIGEN)                  LOCAL_CODIGO_NOMBRE,
          LP.CODIGO_EMISION         PV_AFIP,
          TF.ID                     TIPO_FACTURACION_CODIGO,
          TF.DESCRIPCION            TIPO_FACTURACION_NOMBRE,
          2 TIPO
        FROM GESTION.LOCALES_PV LP,
             GESTION.LOCALES LO,
             GESTION.TIPOS_FACTURACION TF,
             TELECOM.SUCURSALES@TELECOM.SERVERORAC.CBB.NET   SUC,
             TELECOM.EMPRESAS@TELECOM.SERVERORAC.CBB.NET     EMP
        WHERE NVL(LP.INHABILITADO, 0) = 0
          AND LP.LOCAL_CODIGO         = LO.CODIGO
          AND LP.EMPRESA_ID           = LO.EMPRESA_CODIGO
          AND LO.EMPRESA_CODIGO       = EMP.CODIGO
          AND EMP.CODIGO              = ${req.empresa_codigo} -- EMPRESA
          AND LO.SUCURSAL_CODIGO      = SUC.CODIGO
          AND SUC.CODIGO              = ${req.sucursal_codigo} -- SUCURSAL
          AND LP.LOCAL_CODIGO_ORIGEN  = ${req.local_codigo_origen}
          AND LP.LOCAL_CODIGO <> LP.LOCAL_CODIGO_ORIGEN
          AND LP.TIPO_FACTURACION_ID  = TF.ID
          AND TF.ID                   = ${req.tipo_facturacion_id}
          AND LP.CODIGO_EMISION       = ${req.pv_afip}
      `
      }
      
      console.log("sql: ",sql);
      let result = await db.executeAcc(sql, [], false)
      if (result.rows.length > 0){
        result.rows.forEach(e => {
          let local = {
            empresa_codigo: e[0],
            empresa_nombre: e[1].toUpperCase(),
            sucursal_codigo: e[2],
            sucursal_nombre: e[3].toUpperCase(),
            fecha_habilitacion: moment(e[4]).format('DD/MM/YYYY'),
            inhabilitado: e[5],
            local_codigo: e[6],
            local_nombre: e[7] ? e[7].toUpperCase() : e[7],
            local_codigo_origen: e[8],
            local_nombre_origen: e[9] ? e[9].toUpperCase() : e[9],
            pv_afip: e[10],
            tipo_facturacion_codigo: e[11],
            tipo_facturacion_nombre: e[12] ? e[12].toUpperCase() : e[12],
            tipo: e[13],
            localesAsociados: [],
          }
          listado.push(local)
        })
      }
      return {
        resultado: 1,
        msj: 'OK',
        hijos: listado
      }
    } catch (error) {
      return {
        resultado: 0,
        locales: [],
        msj: 'Ocurrió un error al obtener información de los locales AFIP (getLocalesHijosEditarOracle): ' + error.message
      }
    }
  },
  crearLocalAfipOracle: async(req, res, next) => {
    try {
      /*let localesAux   = req.locales_asociados.filter(e => e.local_acc_codigo != req.local.localOrigen.local_acc_codigo);
      req.locales_asociados = localesAux;*/

      let sqlAsociados = ``;
      let sqlAsoc = '';
      
      if(req.locales_asociados.length != 0){
        let n = req.locales_asociados.length;
        for(let i=0; i<n ;i++){
          sqlAsociados += `SELECT ${req.locales_asociados[i].local_codigo}, '001', LPAD(:p_pv_afip, 4,'0'), TO_DATE(:p_fecha_hab,'DD/MM/RRRR'), NULL, :p_tipo_facturacion, :p_empresa_id, :p_local_codigo_origen FROM DUAL `
          if(i != (n-1)){
            sqlAsociados += ' UNION ALL '
          }
        }
        sqlAsoc += `
          BEGIN
            INSERT INTO GESTION.LOCALES_PV(LOCAL_CODIGO, PV_CODIGO, CODIGO_EMISION, FECHA_HABILITACION, INHABILITADO, TIPO_FACTURACION_ID, EMPRESA_ID, LOCAL_CODIGO_ORIGEN) 
            ${sqlAsociados};
          EXCEPTION
              WHEN OTHERS THEN
                  V_MSJ := 'Ocurrió un problema al agregar los asociados del local origen: '|| substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                  RAISE V_ERROR;
          END;
          IF SQL%ROWCOUNT = 0 THEN
            V_MSJ := 'Ocurrió un problema al agregar los locales asociados:' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
            RAISE V_ERROR;
          END IF;
          `
      }
      let sql = `
      DECLARE
          V_ERROR         EXCEPTION;
          V_CONT_LOCAL    NUMBER;
          V_MSJ           VARCHAR2(4000);

      BEGIN
          -- consulto si no existe antes un pto venta con el mismo local_codigo & local_codigo_origen
          SELECT COUNT(*) INTO V_CONT_LOCAL
          FROM GESTION.LOCALES_PV LP
          WHERE LP.LOCAL_CODIGO               = :p_local_codigo_origen 
            AND NVL(LP.LOCAL_CODIGO_ORIGEN,0) = :p_local_codigo_origen
            AND LP.TIPO_FACTURACION_ID        = :p_tipo_facturacion
            AND LP.CODIGO_EMISION             = :p_pv_afip
            AND LP.EMPRESA_ID                 = :p_empresa_id
            AND NVL(LP.INHABILITADO,0)        = 0;
          IF  NVL(V_CONT_LOCAL,0) > 0 THEN
              V_MSJ := 'Ya se existe un pto de venta con el mismo local origen.';
              RAISE V_ERROR;
          END IF;
          
          -- inserto el local origen
          BEGIN
              INSERT INTO GESTION.LOCALES_PV(LOCAL_CODIGO, PV_CODIGO, CODIGO_EMISION, FECHA_HABILITACION, INHABILITADO,TIPO_FACTURACION_ID, EMPRESA_ID, LOCAL_CODIGO_ORIGEN) 
                                    VALUES(:p_local_codigo_origen, '001', LPAD(:p_pv_afip,4,'0'), TO_DATE(:p_fecha_hab,'DD/MM/RRRR'), NULL, :p_tipo_facturacion, :p_empresa_id, :p_local_codigo_origen);
          EXCEPTION
              WHEN OTHERS THEN
                  V_MSJ := 'Ocurrió un problema general al intentar agregar el local origen: '|| substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                  RAISE V_ERROR;
          END;
          IF SQL%ROWCOUNT < 1 THEN
              V_MSJ := 'Ocurrió un problema al agregar un local origen';
              RAISE V_ERROR;
          END IF;
          
          -- inserto los asociados
          ${sqlAsoc}
          
          -- exito
          :p_msj       := 'OK';
          :p_resultado := 1;
          COMMIT;    
      EXCEPTION
          WHEN V_ERROR THEN
              ROLLBACK;
              :p_msj       := V_MSJ;
              :p_resultado := 0;
          WHEN OTHERS THEN
              ROLLBACK;
              :p_resultado := 0;
              :p_msj       := 'Ocurrió un problema general al crear el nuevo punto de venta: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
      END; `

      let param = {
        p_local_codigo_origen:  req.local.local_codigo_origen,
        p_tipo_facturacion:     req.local.tipo_facturacion_codigo,
        p_empresa_id:           req.local.empresa_codigo,
        p_pv_afip:              req.local.pv_afip,
        p_fecha_hab:            req.local.fecha_habilitacion,
        p_resultado: {type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1000},
        p_msj: {type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 }
      }

      let resultt = await db.executeAcc(sql,param,false)
      let response = {...resultt.outBinds}

      return {
        resultado: response.p_resultado,
        msj: response.p_msj,
      }

    } catch (error) {
      let cad = req.nuevo ? 'crear' : 'editar';
      return {
        resultado: 0,
        msj: 'Ocurrió un error al '+cad+' el local AFIP (crearEditarLocalAfipOracle): ' + error.message
      }
    }
  },
  editarLocalAfipOracle: async(req, res, next) =>{
    console.log("req: ", req);
    try {
      let sql = '';
      //estoy editando al padre ?
      if(req.local.local_codigo_origen == req.local.local_codigo){
        let sqlNoAsociados = ``;
        let sqlAsociados = '';

        if(req.locales_asociados.length > 0){
          let n = req.locales_asociados.length;
          let cursor = '';
          for(let i=0; i<n ;i++){
            cursor += `SELECT :p_pv_afip CODIGO_EMISION,
                              :p_tipo_facturacion_id TIPO_FACTURACION_ID,
                              ${req.locales_asociados[i].local_codigo} LOCAL_CODIGO,
                              :p_local_codigo_origen LOCAL_CODIGO_ORIGEN,
                              :p_empresa_id EMPRESA_ID
                      FROM DUAL
            `
            if(i != (n-1)){
              cursor += ' UNION ALL '
            }
          }
          sqlAsociados += `
            BEGIN
              -- De los que vienen si 1 o algunos están en base, inserto los que no estén en locales_pv
                BEGIN
                  INSERT INTO GESTION.LOCALES_PV(LOCAL_CODIGO, PV_CODIGO, CODIGO_EMISION, FECHA_HABILITACION, INHABILITADO, TIPO_FACTURACION_ID, EMPRESA_ID, LOCAL_CODIGO_ORIGEN)
                  SELECT T.LOCAL_CODIGO, '001' PV_CODIGO, T.CODIGO_EMISION, TRUNC(SYSDATE) FECHA_HABILITACION ,NULL INHABILITADO, T.TIPO_FACTURACION_ID, T.EMPRESA_ID, T.LOCAL_CODIGO_ORIGEN
                  FROM (${cursor}) T
                  WHERE T.LOCAL_CODIGO NOT IN(
                                              SELECT LP.LOCAL_CODIGO
                                              FROM LOCALES_PV LP
                                              WHERE LP.TIPO_FACTURACION_ID  = :p_tipo_facturacion_id
                                                AND LP.EMPRESA_ID           = :p_empresa_id
                                                AND LP.LOCAL_CODIGO_ORIGEN  = :p_local_codigo_origen
                                                AND LP.CODIGO_EMISION       = :p_pv_afip
                                                AND NVL(LP.INHABILITADO, 0) = 0
                                                AND LP.LOCAL_CODIGO_ORIGEN  <> LP.LOCAL_CODIGO
                                              );
                EXCEPTION
                    WHEN OTHERS THEN
                        V_MSJ := 'Ocurrió un problema general al intentar agregar el local asociado: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                        RAISE V_ERROR;
                END;
                IF SQL%ROWCOUNT = 0 THEN
                    V_MSJ := 'No se agregó ningún registro en el sistema. Revisar.';
                    RAISE V_ERROR;
                END IF;

              -- se inhabilitan para ese local_codigo_origen los que no vengan
              UPDATE GESTION.LOCALES_PV LP
              SET LP.INHABILITADO = 1
              WHERE LP.TIPO_FACTURACION_ID  = :p_tipo_facturacion_id
                AND LP.EMPRESA_ID           = :p_empresa_id
                AND LP.LOCAL_CODIGO_ORIGEN  = :p_local_codigo_origen
                AND LP.CODIGO_EMISION       = :p_pv_afip
                AND NVL(LP.INHABILITADO, 0) = 0
                AND LP.LOCAL_CODIGO_ORIGEN  <> LP.LOCAL_CODIGO
                AND LP.LOCAL_CODIGO NOT IN (
                                              SELECT DISTINCT T.LOCAL_CODIGO
                                              FROM (${cursor}) T
                                            );
            EXCEPTION
              WHEN OTHERS THEN
                V_MSJ := 'Ocurrió un problema general al editar los locales asociados: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                RAISE V_ERROR;
            END;
          `
          

        }else{
          //quito todos los que tenía asociado
          sqlAsociados=`
            BEGIN 
              UPDATE GESTION.LOCALES_PV LP
              SET LP.INHABILITADO = 1
              WHERE LP.TIPO_FACTURACION_ID  = :p_tipo_facturacion_id
                AND LP.EMPRESA_ID           = :p_empresa_id
                AND LP.LOCAL_CODIGO_ORIGEN  = :p_local_codigo_origen
                AND LP.CODIGO_EMISION       = :p_pv_afip
                AND NVL(LP.INHABILITADO, 0) = 0
                AND LP.LOCAL_CODIGO_ORIGEN  <> LP.LOCAL_CODIGO;                 
            EXCEPTION
              WHEN OTHERS THEN
                V_MSJ := 'Ocurrió un problema al intentar desasociar los locales al local origen: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                RAISE V_ERROR;
            END;
          `
        }

        sql += `
        DECLARE
            V_ERROR EXCEPTION;
            V_MSJ   VARCHAR2(4000);
            V_CONT  NUMBER;
        BEGIN
            -- actualizo los datos del padre
            BEGIN
                UPDATE GESTION.LOCALES_PV LP
                SET LP.TIPO_FACTURACION_ID  = :p_tipo_facturacion_id,
                    LP.FECHA_HABILITACION   = TO_DATE(:p_fecha_hab, 'DD/MM/RRRR')
                WHERE LP.LOCAL_CODIGO          = :p_local_codigo_origen
                  AND LP.LOCAL_CODIGO_ORIGEN   = :p_local_codigo_origen
                  AND LP.EMPRESA_ID            = :p_empresa_id
                  AND LP.TIPO_FACTURACION_ID   = :p_tipo_facturacion_id
                  AND LP.CODIGO_EMISION        = :p_pv_afip
                  AND LP.LOCAL_CODIGO_ORIGEN   = LP.LOCAL_CODIGO;
            EXCEPTION
                WHEN OTHERS THEN
                    V_MSJ := 'Ocurró un error general al editar los datos del local origen: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                    RAISE V_ERROR;
            END;
            IF SQL%ROWCOUNT = 0 OR SQL%ROWCOUNT > 1 THEN
                V_MSJ := 'Se actualizó más de un local padre en el sistema. Revisar.';
                RAISE V_ERROR;
            END IF;

            -- inserto nuevos asociados de la web que no estén en la base 
            -- deshabilito los viejos que no vengan de la web
            ${sqlAsociados}

            -- exito
            COMMIT;
            :p_resultado  := 1;
            :p_msj        := 'Ok';

        EXCEPTION
            WHEN V_ERROR THEN
                ROLLBACK;
                :p_msj       := V_MSJ;
                :p_resultado := 0;
            WHEN OTHERS THEN
                ROLLBACK;
                :p_msj       := 'Ocurrió un error general al editar el local AFIP: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                :p_resultado := 0;
        END;
        `       
      }else{
        /*para editar un local hijo: 
        - el hijo puede cambiar de padre: en este caso la tupla se inhabilita(se lo desvincula de ese padre SIEMPRE EXISTE)
        - se inserta un nuevo registro con el padre y el hijo       
        
        */
      }

      console.log("sql: ", sql);

      let param = {
        //p_local_codigo:         req.local.local_codigo,
        p_local_codigo_origen:  req.local.local_codigo_origen,
        p_tipo_facturacion_id:  req.local.tipo_facturacion_codigo,
        p_empresa_id:           req.local.empresa_codigo,
        p_pv_afip:              req.local.pv_afip,
        p_fecha_hab:            req.local.fecha_habilitacion,
        p_resultado: {type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1000},
        p_msj: {type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 }
      }
      
      let resultt = await db.executeAcc(sql,param,false)
      let response = {...resultt.outBinds}

      return {
        resultado: response.p_resultado,
        msj: response.p_msj,
      }

    } catch (error) {
      return {
        resultado: 0,
        msj: 'Ocurrió un error al editar el local AFIP (editarLocalAfipOracle): ' + error.message
      }
    }
  },
  inhabilitarLocalesAfipOracle: async(req, res, next) => {
    try {
      console.log("req: ", req);
      //let aux = req.asociados.filter(e => e.local_codigo != req.local.local_codigo);
      //req.asociados = aux;

      let sqlCursor = `
        SELECT ${req.local.pv_afip} CODIGO_EMISION,
               ${req.local.tipo_facturacion_codigo} TIPO_FACTURACION_ID,
               ${req.local.local_codigo} LOCAL_CODIGO,
               ${req.local.local_codigo_origen} LOCAL_CODIGO_ORIGEN,
               ${req.local.empresa_codigo} EMPRESA_ID
        FROM DUAL`;
      if(req.asociados.length > 0){
        let n = req.asociados.length;
        console.log("n: ", n);
        for(let i=0; i<n ;i++){
          if(req.asociados[i].inhabilitado == 0){
            if(i != (n-1) || n == 1){
              sqlCursor += ' UNION ALL '
            }
            sqlCursor += `SELECT ${req.asociados[i].pv_afip} CODIGO_EMISION,
                                ${req.asociados[i].tipo_facturacion_codigo} TIPO_FACTURACION_ID,
                                ${req.asociados[i].local_codigo} LOCAL_CODIGO,
                                ${req.asociados[i].local_codigo_origen} LOCAL_CODIGO_ORIGEN,
                                ${req.asociados[i].empresa_codigo} EMPRESA_ID
                          FROM DUAL`
          }
        }
      }

      let sql = `
      DECLARE
          V_ERROR         EXCEPTION;
          V_CONT_LOCAL    NUMBER;
          V_MSJ           VARCHAR2(4000);
          CURSOR PTOS_VTA_ELECT IS
              ${sqlCursor};
          PTOS_DET PTOS_VTA_ELECT%ROWTYPE;
      BEGIN
          -- controlo que no este inhabilitado antes
          SELECT COUNT(*) INTO V_CONT_LOCAL
          FROM GESTION.LOCALES_PV LP
          WHERE NVL(LP.INHABILITADO, 0)   = 1
            AND LP.LOCAL_CODIGO           = :p_local_codigo
            AND LP.LOCAL_CODIGO_ORIGEN    = :p_local_codigo_origen
            AND LP.TIPO_FACTURACION_ID    = :p_tipo_facturacion
            AND LP.CODIGO_EMISION         = :p_pv_afip
            AND LP.EMPRESA_ID             = :p_empresa_id;
          IF NVL(V_CONT_LOCAL,0) > 0 THEN
              V_MSJ := 'El local origen ya se encuentra inhabilitado.';
              RAISE V_ERROR;
          END IF;
          
          -- inhabilito el local y sus asociados si los tiene
          OPEN PTOS_VTA_ELECT;
          FETCH PTOS_VTA_ELECT INTO PTOS_DET;
          WHILE PTOS_VTA_ELECT%FOUND
          LOOP
              BEGIN
                  UPDATE GESTION.LOCALES_PV LP
                  SET LP.INHABILITADO = 1
                  WHERE NVL(LP.INHABILITADO, 0) = 0
                    AND LP.LOCAL_CODIGO = PTOS_DET.LOCAL_CODIGO
                    AND LP.CODIGO_EMISION = PTOS_DET.CODIGO_EMISION
                    AND LP.TIPO_FACTURACION_ID = PTOS_DET.TIPO_FACTURACION_ID
                    AND LP.EMPRESA_ID = PTOS_DET.EMPRESA_ID
                    AND NVL(LP.LOCAL_CODIGO_ORIGEN, 0) = PTOS_DET.LOCAL_CODIGO_ORIGEN;
              EXCEPTION
                  WHEN OTHERS THEN
                      V_MSJ := 'Ocurrió un problema general al intentar inhabiliar el local: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                      RAISE V_ERROR;
              END;
              IF SQL%ROWCOUNT = 0 OR SQL%ROWCOUNT > 1 THEN
                  V_MSJ := 'Se actualizó más de un registro en el sistema. Revisar.';
                  RAISE V_ERROR;
              END IF;
              -- SIGUIENTE REGISTRO
              FETCH PTOS_VTA_ELECT INTO PTOS_DET;
          END LOOP;
          CLOSE PTOS_VTA_ELECT;

          -- exito
          COMMIT;
          :p_resultado := 1;
          :p_msj       := 'OK';

      EXCEPTION
          WHEN V_ERROR THEN
              ROLLBACK;
              :p_msj       := V_MSJ;
              :p_resultado := 0;
          WHEN OTHERS THEN
              ROLLBACK;
              :p_msj       := 'Ocurrió un problema general al inhabilitar el local: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
              :p_resultado := 0;
      END;
      `;
      let param = {
        p_local_codigo:         req.local.local_codigo,
        p_local_codigo_origen:  req.local.local_codigo_origen,
        p_tipo_facturacion:     req.local.tipo_facturacion_codigo,
        p_empresa_id:           req.local.empresa_codigo,
        p_pv_afip:              req.local.pv_afip,
        p_resultado: {type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1000},
        p_msj: {type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 }
      }
      console.log("sql: ", sql);

      let resultt = await db.executeAcc(sql,param,false)
      let response = {...resultt.outBinds}

      return {
        resultado: response.p_resultado,
        msj: response.p_msj,
      }
    } catch (error) {
      return {
        resultado: 0,
        msj: 'Ocurrió un error al inhabilitar el local AFIP (inhabilitarLocalesAfipOracle): ' + error.message
      }
    }
  },
  habilitarLocalesAfipOracle: async(req, res, next) => {
    try {
      setDefaultData(req.local,'fecha_habilitacion', '');
      let sql = `
      DECLARE
          V_ERROR         EXCEPTION;
          V_CONT_LOCAL    NUMBER;
          V_CONT_PADRE    NUMBER;
          V_MSJ           VARCHAR2(4000);
      BEGIN
          -- si es hijo, pregunto primero si su padre está habilitado
          IF :p_local_codigo_origen <> :p_local_codigo THEN
              SELECT COUNT(*) INTO V_CONT_LOCAL
              FROM GESTION.LOCALES_PV LP
              WHERE NVL(LP.INHABILITADO, 0)      = 0
                AND LP.LOCAL_CODIGO              = :p_local_codigo_origen
                AND LP.LOCAL_CODIGO_ORIGEN       = :p_local_codigo_origen
                AND LP.TIPO_FACTURACION_ID       = :p_tipo_facturacion
                AND LP.CODIGO_EMISION            = :p_pv_afip
                AND TRUNC(LP.FECHA_HABILITACION) = TO_DATE(:p_fecha_hab, 'DD/MM/RRRR')
                AND LP.EMPRESA_ID                = :p_empresa_id;
              IF  NVL(V_CONT_LOCAL,0) = 0 THEN 
                V_MSJ := 'No es posible habilitar el local ya que su local origen se encuentra inhabilitado.';
                RAISE V_ERROR;
              END IF;              
          END IF;

          -- controlo que no este habilitado antes
          SELECT COUNT(*) INTO V_CONT_LOCAL
          FROM GESTION.LOCALES_PV LP
          WHERE NVL(LP.INHABILITADO, 0)      = 0
            AND LP.LOCAL_CODIGO              = :p_local_codigo
            AND LP.LOCAL_CODIGO_ORIGEN       = :p_local_codigo_origen
            AND LP.TIPO_FACTURACION_ID       = :p_tipo_facturacion
            AND LP.CODIGO_EMISION            = :p_pv_afip
            AND TRUNC(LP.FECHA_HABILITACION) = TO_DATE(:p_fecha_hab, 'DD/MM/RRRR')
            AND LP.EMPRESA_ID                = :p_empresa_id;
          IF NVL(V_CONT_LOCAL,0) > 0 THEN
              V_MSJ := 'El local origen ya se encuentra habilitado.';
              RAISE V_ERROR;
          END IF;

          -- habilito el local
          BEGIN
              UPDATE GESTION.LOCALES_PV LP
              SET LP.INHABILITADO = NULL
              WHERE NVL(LP.INHABILITADO, 0)      = 1
                AND LP.LOCAL_CODIGO              = :p_local_codigo
                AND LP.LOCAL_CODIGO_ORIGEN       = :p_local_codigo_origen
                AND LP.TIPO_FACTURACION_ID       = :p_tipo_facturacion
                AND LP.CODIGO_EMISION            = :p_pv_afip
                AND TRUNC(LP.FECHA_HABILITACION) = TO_DATE(:p_fecha_hab, 'DD/MM/RRRR')
                AND LP.EMPRESA_ID                = :p_empresa_id;
          EXCEPTION
              WHEN OTHERS THEN
                  V_MSJ := 'Ocurrió un problema general al intentar habiliar el local: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
                  RAISE V_ERROR;
          END;
          IF SQL%ROWCOUNT = 0 OR SQL%ROWCOUNT > 1 THEN
              V_MSJ := 'Se actualizó más de un registro en el sistema. Revisar.';
              RAISE V_ERROR;
          END IF;

          -- exito
          COMMIT;
          :p_resultado := 1;
          :p_msj       := 'OK';

      EXCEPTION
          WHEN V_ERROR THEN
              ROLLBACK;
              :p_msj       := V_MSJ;
              :p_resultado := 0;
          WHEN OTHERS THEN
              ROLLBACK;
              :p_msj       := 'Ocurrió un problema general al habilitar el local: ' || substr(SQLERRM||'-'||DBMS_UTILITY.FORMAT_ERROR_BACKTRACE(),0,4000);
              :p_resultado := 0;
      END;
      `;
      let param = {
        p_local_codigo:         req.local.local_codigo,
        p_local_codigo_origen:  req.local.local_codigo_origen,
        p_tipo_facturacion:     req.local.tipo_facturacion_codigo,
        p_empresa_id:           req.local.empresa_codigo,
        p_pv_afip:              req.local.pv_afip,
        p_fecha_hab:            moment(req.local.fecha_habilitacion).format('DD/MM/YYYY'),
        p_resultado: {type: oracledb.NUMBER, dir: oracledb.BIND_OUT, maxSize: 1000},
        p_msj: {type: oracledb.STRING, dir: oracledb.BIND_OUT, maxSize: 1000 }
      }
      //console.log("sql: ", sql);

      let resultt = await db.executeAcc(sql,param,false)
      let response = {...resultt.outBinds}

      return {
        resultado: response.p_resultado,
        msj: response.p_msj,
      }
    } catch (error) {
      return {
        resultado: 0,
        msj: 'Ocurrió un error al habilitar el local AFIP (habilitarLocalesAfipOracle): ' + error.message
      }
    }
  },
}
