
<template>
    <div>
        <base-header class="header d-flex align-items-center"
                     style="min-height: 300px; background-image: url(img/theme/access.png); background-size: cover; background-position: center;">
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-5"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-12">
                        <h1 class="display-2 text-white mb-0">Perfiles de acceso</h1>
                        <p class="text-white mt-0">Sección dedicada a la creación de perfiles de accesos, que se le asignen a los usuarios.</p>
                    </div>
                    
                </div>
            </div>
            <base-button @click="modals.modal1 = true" :class="screenClases == 'phone' ? '' : 'float-right'" class="mr-5" :style="screenClases == 'phone' ? '' : 'margin-top:-50px;'" size="sm" type="success">
                <a-icon type="idcard" class="mr-2" style="vertical-align:1px;font-size:1.6em;" />
                Registrar
            </base-button>
        </base-header>

        <div class="container-fluid mt--6 pb-2">
            <div class="row">
                <div class="col-xl-2 col-sm-12">
                    <card shadow type="secondary" >
                        <!-- <div slot="body" class="bg-white border-0"> -->
                            <div class="row align-items-center py-2">
                                <h3 class="mb-2 w-100 text-center">Perfiles</h3>
                                <base-button size="sm" v-for="(profile, index) in accessProfiles" :key="profile.profile" class="w-100 mt-2 mx-auto" :outline="profileSelect.name == profile.profile ? false : true" type="primary" v-on:click="selectProfile(profile.profile, profile.routes, index)">{{profile.profile}}</base-button>
                            </div>
                        <!-- </div> -->
                    </card>
                </div>
                <div class="col-xl-8 col-sm-12 mb-5 mb-xl-0">
                    <div class="card card-profile shadow">
                        <!-- <button class="putoBoton">
                            aja qlq
                        </button> -->
                        <base-button v-if="IfSelect && profileSelect.name != 'Gerente'" v-on:click="removeProfile" class="putoBoton" size="sm" type="danger">
                            <i class="fa fa-ban mt-1" :class="screenClases == 'phone' ? '' : 'float-left'"></i>
                            {{screenClases == 'phone' ? '' : 'Eliminar'}}
                        </base-button>
                        <a-config-provider :locale="es_ES">
                            <template #renderEmpty>
                                <div style="text-align: center">
                                    <a-icon type="info-circle" style="font-size: 60px" />
                                    <h1>Seleccione un perfil para configurar</h1>
                                </div>
                            </template>
                            <a-list v-if="profileSelect.name == ''">
                            </a-list>
                        </a-config-provider>
                        <div v-if="profileSelect.name != ''" class="p-2">
                            <p> <strong class="mr-2">Activar comisiones </strong> <a-switch  :checked="commissionsProfile" @change="activeCommission" /></p> 
                            <h2>Accesos</h2>
                            <div class="row">
                                <div v-for="(route, index) in routesProfiles" :key="route.ruta" class="col-md-4">
                                    <base-button class="w-100 mt-2" :type="route.valid ? 'success' : 'danger'" @click="openFunctionalities(index, route.route)">
                                        <i :class="route.valid ? 'ni ni-check-bold' : 'fa fa-ban'" class="float-left mt-1"></i>
                                        <span class="text-center">{{route.route.charAt(0).toUpperCase()}}{{route.route.slice(1)}}</span>
                                    </base-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <a-modal v-model="modals.modal1" :width="400">
            <template>
                <div class="text-muted text-center">
                    <h3>Crear perfil</h3>
                    <p>Activar comisiones <a-switch size="small" :checked="newAccess.commission" @change="activeProfileCommission" /></p>
                </div>
            </template>
            <template>
                <a-input 
                v-model="newAccess.name"
                placeholder="Nombre del perfil"
                class="mb-2">
                    <a-icon slot="prefix" type="idcard" style="color:rgba(0,0,0,.25); font-size:1.2em;vertical-align:1.5px;" />
                    <i slot="suffix" class="fa fa-asterisk text-danger"></i>
                </a-input>
            </template>
            <template slot="footer">
                <base-button size="sm" class="mt-2" type="success" @click="createAccess">
                    Registrar perfil
                </base-button>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal2" :footer="null" :width="500">
            <template>
                <div class="text-muted text-center">
                    <h3>Habilite las funciones de la sección de <span class="text-primary"> <b>{{selectedRouteName.charAt(0).toUpperCase()}}{{selectedRouteName.slice(1)}}</b> </span> </h3>
                    <p>Activar acceso <a-switch size="small" :checked="routesProfiles[routeSelected].valid" @change="changeActive" /></p>
                </div>
            </template>
            <template>
                <div class="p-2">
                    <a-table :pagination="false" :columns="columns" :data-source="routesProfiles[routeSelected].functions">
                        <template slot="slot-functions" slot-scope="record, column, index">
                            <base-button :disabled="routesProfiles[routeSelected].valid ? false : true" class="w-100" size="sm" :type="column.valid ? 'success' : 'danger'" v-on:click="activeFunction(column.function, index)">
                                <i :class="column.valid ? 'ni ni-check-bold' : 'fa fa-ban'"></i>
                            </base-button>
                        </template>
                    </a-table>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import EventBus from '../components/EventBus'
import jwtDecode from 'jwt-decode'
import mixinUserToken from '../mixins/mixinUserToken'
import BaseButton from '../components/BaseButton.vue'
import mixinES from '../mixins/mixinES'
export default {
    components: { BaseButton },
    mixins: [mixinUserToken, mixinES],                
    data() {
        const token = localStorage.userToken
		const decoded = jwtDecode(token)
        return {
            id: decoded._id,
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            accessProfiles: [],
            idProfile: '',
            profileSelect: {
                name: '',
                index: 0
            },
            selectedRouteName: '',
            newAccess: {
                name: '',
                commission: false
            },
            routesProfile: [],
            columns: [
                {
                    title: 'Funciones',
                    dataIndex: 'name',
                    key: 'name',
                    width: '70%'
                },
                {
                    title: 'Activadores',
                    dataIndex: 'function',
                    key: 'function',
                    scopedSlots: { customRender: 'slot-functions' },
                    width: '30%'
                }
            ],
            routesProfiles: [
                {
                    route: 'procesar', 
                    valid: false,
                    functions: [
                        {function: 'editar_cliente', name:'Editar cliente', valid: false},
                        {function: 'nuevo_cliente', name:'Registrar cliente', valid: false},
                        {function: 'descuento', name:'Ingresar descuento', valid: false}
                    ]
                },
                {
                    route: 'reportes',
                    valid: false,
                    functions: [
                        {function: 'filtrar', name:'Filtrar', valid: false}
                    ]
                },
                {
                    route: 'usuarios', 
                    valid: false,
                    functions: [
                        {function: 'registrar', name:'Registar', valid: false},
                        {function: 'editar', name:'Editar', valid: false},
                        {function: 'eliminar', name:'Eliminar', valid: false}
                    ]
                },
                {
                    route: 'ventas', 
                    valid: false,
                    functions: [
                        {function: 'filtrar', name:'Filtrar', valid: false},
                        {function: 'anular', name:'Anular', valid: false},
                        {function: 'detalle', name:'Ver detalle', valid: false},
                        {function: 'correo', name:'Enviar correo', valid: false},
                        {function: 'reporte', name:'Descargar reporte', valid: false}
                    ]
                },
                {
                    route: 'servicios',
                    valid: false,
                    functions: [
                        {function: 'ingresar', name:'Registrar', valid: false},
                        {function: 'editar', name:'Editar', valid: false},
                        {function: 'eliminar', name:'Eliminar', valid: false},
                        {function: 'activaciones', name:'Activar o Desactivar', valid: false},
                        {function: 'categoria', name:'Gestionar categorias', valid: false}
                    ]
                },
                {
                    route: 'empleados', 
                    valid: false,
                    functions: [
                        {function: 'registrar', name:'Registrar', valid: false},
                        {function: 'editar', name:'Editar', valid: false},
                        {function: 'reportes', name:'Ver reporte', valid: false},
                        {function: 'cerrar ventas', name:'Cerrar ventas', valid: false},
                        {function: 'eliminar', name: 'Eliminar', valid: false},
                        {function: 'adelantos', name: 'Adelantos o Bonos', valid: false},
                        {function: 'correos', name: 'Envio de correos', valid: false}
                    ]
                },
                {
                    route: 'clientes', 
                    valid: false,
                    functions: [
                        {function: 'filtrar', name:'Filtrar', valid: false},
                        {function: 'registrar', name:'Registrar', valid: false},
                        {function: 'editar', name:'Editar', valid: false},
                        {function: 'detalle', name:'Ver detalle', valid: false},
                        {function: 'eliminar', name:'Eliminar', valid: false},
                        {function: 'correos', name:'Envio de correos', valid: false},
                        {function: 'excel', name:'Descargar excel', valid: false}
                    ]
                },
                {
                    route: 'inventario', 
                    valid: false,
                    functions: [
                        {function: 'cerrar', name:'Cerrar inventario', valid: false},
                        {function: 'cambiar_tipo', name:'Cambiar tipo', valid: false}
                    ]
                },
                {
                    route: 'gastos', 
                    valid: false,
                    functions: [
                        {function: 'registrar_bono', name:'Registrar bono', valid: false},
                        {function: 'registrar_gasto', name:'Registrar gasto', valid: false},
                        {function: 'registrar_inversion', name:'Registrar inversion', valid: false},
                        {function: 'cierre', name:'Cerrar gastos', valid: false},
                        {function: 'filtrar', name:'Filtrar registros', valid: false},
                        {function: 'eliminar', name:'Borrar gastos', valid: false}
                    ]
                },
                {
                    route: 'agendamiento', 
                    valid: false,
                    functions: [
                        {function: 'filtrar', name:'Filtrar', valid: false},
                        {function: 'agendar', name:'Agendar', valid: false},
                        {function: 'todas', name:'Ver todas las agendas', valid: false},
                        {function: 'editar', name:'Editar cita', valid: false},
                        {function: 'eliminar', name:'Eliminar cita', valid: false},
                        {function: 'finalizar', name:'Finalizar cita', valid: false},
                        {function: 'confirmacion', name:'Enviar confirmacion', valid: false}
                    ]
                },
                {
                    route: 'caja', 
                    valid: false,
                    functions: [
                        {function: 'visualizar', name:'Ver cierres', valid: false},
                        {function: 'cerrar', name:'hacer cierre', valid: false},
                        {function: 'fondo', name:'Ingresar fondos', valid: false},
                        {function: 'reporte', name:'Ver reporte del cierre', valid: false},
                        {function: 'editar', name:'Editar cierre', valid: false}
                    ]
                },
                // {
                //     route: 'pedidos', 
                //     valid: false,
                //     functions: [
                //         {function: 'filtrar', name:'Filtrar', valid: false},
                //         {function: 'registrar', name:'Registrar', valid: false},
                //         {function: 'editar', name:'Editar', valid: false},
                //         {function: 'detalle', name:'Ver detalle', valid: false},
                //         {function: 'eliminar', name:'Eliminar', valid: false},
                //         {function: 'correos', name:'Envio de correos', valid: false}
                //     ]
                // },
                {
                    route: 'bodega', 
                    valid: false,
                    functions: [
                        {function: 'registrar_producto', name:'Registrar producto', valid: false},
                        {function: 'editar_producto', name:'Editar producto', valid: false},
                        {function: 'eliminar_producto', name:'Eliminar producto', valid: false},
                        {function: 'anexar_productos', name:'Anexar productos', valid: false},
                        {function: 'gestion_sucursales', name:'Gestionar sucursales', valid: false},
                        {function: 'cierre_bodega', name:'Cerrar bodega', valid: false},
                        {function: 'registrar_proveedores', name:'Registrar proveerdor', valid: false},
                        {function: 'editar_proveedor', name:'Editar proveerdor', valid: false},
                        {function: 'eliminar_proveedor', name:'Eliminar proveerdor', valid: false},
                        {function: 'ver_historial_compras', name:'Ver historiales', valid: false}
                    ]
                },
                {
                    route: 'sucursales', 
                    valid: false,
                    functions: [
                        {function: 'cambiar', name:'Elegir sucursal', valid: false},
                        {function: 'registrar', name:'Registrar sucursal', valid: false},
                        {function: 'configurar', name:'Configurar sucursal', valid: false}
                    ]
                }
            ],
            modals: {
                modal1: false,
                modal2: false
            },
            routeSelected: 0,
            commissionsProfile: false,
            IfSelect: false
        }
    },
    created() {
        this.getAccessProfile()
    },
    methods: {
        async getAccessProfile() {
            try {
                const getProfiles = await axios.get(endPoint.endpointTarget+'/configurations/profiles', this.configHeader)
                if (getProfiles.data.status == 'ok') {
                    this.accessProfiles = getProfiles.data.data[0].profiles
                    this.idProfile = getProfiles.data.data[0]._id
                }
            } catch (err) {
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (err.response.status == 401) {
                    this.$swal({
                        icon: 'error',
                        title: 'Session caducada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        router.push("login")
                    }, 1550);
                }
            }
        },
        selectProfile(profile, routes, index){
            this.IfSelect = true
            this.profileSelect.name = profile
            this.profileSelect.index = index
            this.commissionsProfile = this.accessProfiles[index].commission
            for (const allRoute of this.routesProfiles) {
                var valid = true
                for (const route of routes) {
                    if (allRoute.route.toLowerCase() == route.ruta.toLowerCase()) {
                        allRoute.valid = true
                        valid = false
                    }
                }
                if (valid) {
                    allRoute.valid = false
                }
            }
        },
        removeProfile(){
            this.$swal({
                title: '¿Está seguro de borrar el perfil? Se eliminara toda su configuración',
                text: 'No puedes revertir esta acción',
                type: 'warning',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No, cancelar',
                showCloseButton: true,
                showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    this.accessProfiles.splice(this.profileSelect.index, 1)
                    this.updateconfig()
                    this.profileSelect.name = ''
                    this.profileSelect.index = 0
                    this.IfSelect = false
                }
                else{
                    this.$swal({
                        type: 'info',
                        icon: 'info',
                        title: 'Accion cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        openFunctionalities(index, route){
            if (this.routesProfiles[index].valid) {
                this.routeSelected = index
                this.selectedRouteName = route
                for (const i in this.routesProfiles[index].functions) {
                    const functionn = this.routesProfiles[index].functions[i]
                    for (const key in this.accessProfiles[this.profileSelect.index].routes) {
                        const routesAccess = this.accessProfiles[this.profileSelect.index].routes[key]
                        if (routesAccess.ruta.toLowerCase() == route.toLowerCase()) {
                            for (const validators of routesAccess.validaciones) {
                                if (functionn.function == validators) {
                                    this.routesProfiles[index].functions[i].valid = true
                                }
                            }
                        }
                    }
                }
                this.modals.modal2 = true
            }else{
                for (const functions of this.routesProfiles[index].functions) {
                    functions.valid = false
                }
                this.selectedRouteName = route
                this.routeSelected = index
                this.modals.modal2 = true
            }
        },
        activeFunction(functionn, index){
            if (this.routesProfiles[this.routeSelected].functions[index].valid) {
                this.routesProfiles[this.routeSelected].functions[index].valid = false
                for (const key in this.accessProfiles[this.profileSelect.index].routes) {
                    const route = this.accessProfiles[this.profileSelect.index].routes[key]
                    if (route.ruta.toLowerCase() == this.routesProfiles[this.routeSelected].route.toLowerCase()) {
                        this.accessProfiles[this.profileSelect.index].routes[key].validaciones.splice()
                        for (const i in this.accessProfiles[this.profileSelect.index].routes[key].validaciones) {
                            const validation = this.accessProfiles[this.profileSelect.index].routes[key].validaciones[i]
                            if (validation == functionn) {
                                this.accessProfiles[this.profileSelect.index].routes[key].validaciones.splice(i, 1)
                            }
                        }
                    }
                }
            }else{
                this.routesProfiles[this.routeSelected].functions[index].valid = true
                for (const key in this.accessProfiles[this.profileSelect.index].routes) {
                    const route = this.accessProfiles[this.profileSelect.index].routes[key]
                    if (route.ruta.toLowerCase() == this.routesProfiles[this.routeSelected].route.toLowerCase()) {
                        this.accessProfiles[this.profileSelect.index].routes[key].validaciones.push(functionn)
                    }
                }
            }
            this.updateconfig()
        },
        changeActive(checked){
            this.routesProfiles[this.routeSelected].valid = checked
            if (checked) {
                this.accessProfiles[this.profileSelect.index].routes.push({
                    ruta: this.routesProfiles[this.routeSelected].route.toLowerCase(),
                    validaciones: []
                })
            }else{
                for (const key in this.accessProfiles[this.profileSelect.index].routes) {
                    const access = this.accessProfiles[this.profileSelect.index].routes[key]
                    if (access.ruta == this.routesProfiles[this.routeSelected].route.toLowerCase()) {
                        this.accessProfiles[this.profileSelect.index].routes.splice(key, 1)
                    }
                }
                for (const functions of this.routesProfiles[this.routeSelected].functions) {
                    functions.valid = false
                }
            }
            this.updateconfig()
        },
        async updateconfig(){
            try {
                const changeProfile = await axios.put(endPoint.endpointTarget+'/configurations/editProfiles/'+this.idProfile, {
                    profiles: this.accessProfiles
                }, this.configHeader)
                if(changeProfile.data.status == 'ok'){
                    try {
                        var routes = []
                        for (const access of this.accessProfiles) {
                            if (access.profile == this.profileSelect.name) {
                                routes = access.routes
                            }
                        }
                        const updateUsers = await axios.put(endPoint.endpointTarget+'/configurations/editAccessUsers/'+this.profileSelect.name, {
                            access: routes,
                            id: this.id
                        }, this.configHeader)
                        console.log(updateUsers)
                        if (updateUsers.data.status == "reload") {
                            EventBus.$emit('loggedin-user', routes)
                            localStorage.setItem('userToken', updateUsers.data.token)
                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                toast: true,
                                position: 'top-end',
                                title: 'Cambio exitoso',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }else{
                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                toast: true,
                                position: 'top-end',
                                title: 'Cambio exitoso',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }catch(err){
                        if (!err.response) {
                            this.$swal({
                                icon: 'error',
                                title: 'Error de conexión',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }else if (err.response.status == 401) {
                            this.$swal({
                                icon: 'error',
                                title: 'Session caducada',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(() => {
                                router.push("login")
                            }, 1550);
                        }
                    }
                }
            } catch (err) {
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (err.response.status == 401) {
                    this.$swal({
                        icon: 'error',
                        title: 'Session caducada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setTimeout(() => {
                        router.push("login")
                    }, 1550);
                }
            }
        },
        activeCommission(checked){
            this.commissionsProfile = checked
            this.accessProfiles[this.profileSelect.index].commission = checked
            this.updateconfig()
        },
        activeProfileCommission(checked){
            this.newAccess.commission = checked
        },
        createAccess(){
            if (this.newAccess.name.length >= 3) {
                this.accessProfiles.push({
                    commission: this.newAccess.commission,
                    profile: this.newAccess.name,
                    routes: []
                })
                this.modals.modal1 = false
                this.updateconfig()
                this.selectProfile(this.newAccess.name, [], this.accessProfiles.length - 1)
                this.newAccess.commission = false
                this.newAccess.name = ''
                this.$swal.fire({
                    icon: 'success',
                    title: 'Perfil creado, proceda a registrar rutas de acceso'
                })
            }else{
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Por favor, ingrese nombre del perfil con mas de 2 dígitos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
    },
    computed: {
        screenClases: () => {
            return screen.width < 780 ? 'phone' : 'desktop'
        }
    }
}
</script>
<style>
    .putoBoton{
        position: absolute;
        top:1%;
        right: 1%;
        width: 15%;

    }
</style>