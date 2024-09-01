import routerx from 'express-promise-router'
import locales from '../../controllers/Accesorios/localesController' 

import auth from '../../middleware/auth'

const router = routerx()

router.get('/getLocalesXSucursal', auth.logginUser, locales.getLocalesSucursal)
router.get('/initFormLocales', auth.logginUser, locales.initFormLocales)
router.get('/getLocales', auth.logginUser, locales.getLocales)
router.get('/initFormVerLocales', auth.logginUser, locales.initFormVerLocales)
router.post('/nuevoLocal', auth.logginUser, locales.crearNuevoLocal)
router.post('/modificarLocal', auth.logginUser, locales.modificarLocal)
// terminales
router.get('/terminales', auth.logginUser, locales.getTerminalesLocal)
router.post('/numTerminal', auth.logginUser, locales.cambiarNumeroTerminal)
router.post('/aliasTerminal', auth.logginUser, locales.cambiarAliasTerminal)
router.post('/estadoTerminal', auth.logginUser, locales.cambiarEstadoTerminal)
router.post('/integrarTerminal', auth.logginUser, locales.cambiarModoTerminal)
router.post('/nuevaTerminal', auth.logginUser, locales.nuevaTerminal)
router.post('/eliminarTerminal', auth.logginUser, locales.eliminarTerminal)
router.get('/terminalesIntegradas', auth.logginUser, locales.getTerminalesIntegradas)
//afip
router.get('/initFormLocalesAfip', auth.logginUser, locales.initFormLocalesAfip)
router.get('/getLocalesPadresHijos', auth.logginUser, locales.getLocalesPadresHijos)
router.get('/getLocalesPtoVta', auth.logginUser, locales.getLocalesPtoVta)
router.get('/getLocalesPtoVtaEditar', auth.logginUser, locales.getLocalesPtoVtaEditar)
router.get('/getLocalesAfip', auth.logginUser, locales.getLocalesAfip)
router.post('/crearEditarLocalAfip', auth.logginUser, locales.crearEditarLocalAfip)
router.post('/inhabilitarLocalesAfip', auth.logginUser, locales.inhabilitarLocalesAfip)
router.post('/habilitarLocalesAfip', auth.logginUser, locales.habilitarLocalesAfip)

export default router
