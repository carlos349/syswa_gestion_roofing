<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
                     style="min-height: 50px; background-image: url(img/theme/clients.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-12">
                        <h1 class="display-2 text-white">Pedidos</h1>
                        <p class="text-white mt-0 mb-2">Esta es la sección administrativa de tus pedidos, aquí podrás visualizar todos tus pedidos.</p>
                        
                        <base-button v-if="validRoute('clientes', 'filtrar')" @click="modals.modal1 = true" type="success">Crear pedido</base-button>
                        <base-button v-if="validRoute('clientes', 'filtrar')" @click="showFilter" type="default">Filtrar</base-button>
                        <base-button type="primary">Pedidos por confirmar: {{rowsPending.length}}</base-button>
                        
                        <base-button type="secondary">Monto total: <span class="text-success">$ {{formatPrice(totalPending)}}</span> </base-button>
                    </div>
                </div>
            </div>
        </base-header>
        

        <!-- MODAL REGISTRAR -->

        <modal :show.sync="modals.modal1"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                        Aun en construcción
                    </div>
                </template>
                <template>
                    
                    <form role="form">
                        <vue-single-select
                            v-model="registerClient.recommender"
                            :options="clientsNames"
                            placeholder="Comprador"
                        ></vue-single-select>
                        <template>
                            <a-select
                                mode="multiple"
                                :default-value="['a1', 'b2']"
                                style="width: 100%"
                                placeholder="Please select"
                                @change="handleChange"
                            >
                                <a-select-option v-for="i in services" :key="i.nombre">
                                {{ i.nombre }}
                                </a-select-option>
                            </a-select>
                        </template>
                        <base-input alternative
                                    type="text"
                                    placeholder="Contacto"
                                    v-model="registerClient.id"
                                    v-on:change="validRegister()"
                                    addon-left-icon="fa fa-address-card"
                                    addon-right-icon="fa fa-asterisk text-danger">
                        </base-input>
                        <base-input alternative
                                    type="text"
                                    placeholder="Pedido"
                                    v-model="registerClient.contactOne"
                                    addon-left-icon="fa fa-address-card"
                                    addon-right-icon="fas fa-plus text-default">
                        </base-input>
                        <base-input alternative
                                    type="text"
                                    placeholder="Medio de pago"
                                    v-model="registerClient.contactTwo"
                                    addon-left-icon="fa fa-address-card"
                                    addon-right-icon="fas fa-plus text-default">
                        </base-input>
                        
                        <div class="text-center">
                            
                            <base-button type="primary" v-on:click="registerClients()" class="my-4">Registrar pedido</base-button>
                        </div>
                        
                    </form>
            </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal2"
               :gradient="modals.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modals.icon"></i>
                <h1 class="heading mt-5">{{modals.message}}</h1>
            </div>
        </modal>
        <modal :show.sync="modals.modal3"
               modal-classes="modal-dialog-centered">
            <div class="py-3 text-center">
                <h1 class="heading mt-5">¿Seguro que desea confirmar este pedido?</h1>
                <base-button type="success" v-on:click="confirmar()" class="my-4">Si</base-button>
                <base-button type="danger" v-on:click="modals.modal3 = false, idPedido = ''" class="my-4">No</base-button>
            </div>
        </modal>
        

        <!-- TABLA DE CLIENTES -->
        <tabs fill class="flex-column flex-md-row">
            <card shadow>
                <tab-pane>
                    <span slot="title">
                        <i class="ni ni-cart"></i>
                        Pedidos por confirmar
                    </span>
                    <vue-bootstrap4-table class="tableClient" :rows="rowsPending" :columns="columns" :classes="classes" :config="config">
                        <template slot="Administrar" slot-scope="props">
                            <b>
                                <center>
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                        <span>Confirmar pedido</span>
                                        </template>
                                        <base-button v-if="validRoute('clientes', 'detalle') && props.row.estado == 'Nconfirmado'" size="sm" type="success" @click="modals.modal3 = true, idPedido = props.row._id,identidadPedido = props.row.contacto, codePedido = props.row.codigo, articuloPedido = props.row.articulo, clientePedido = props.row.cliente" icon="ni ni-check-bold"></base-button>
                                    </a-tooltip>
                                    
                                </center>
                                
                            </b>
                        </template>
                        <template slot="date" slot-scope="props">
                            <b>
                               
                                {{formatDate(props.row.date)}}
                                    
                                
                                
                            </b>
                        </template>

                        <template slot="vencimiento" slot-scope="props">
                            <b>
                                
                                {{formatCaducity(props.row.date)}}
                              
                                
                            </b>
                        </template>
                        
                        <template slot="pagination-info" slot-scope="props">
                            Actuales {{props.currentPageRowsLength}} | 
                            Registros totales {{props.originalRowsLength}}
                        </template>
                        <template slot="selected-rows-info" slot-scope="props">
                            Total Number of rows selected : {{props.selectedItemsCount}}
                        </template>
                    </vue-bootstrap4-table>
                </tab-pane>

                <tab-pane title="Profile">
                    <span slot="title">
                        <i class="ni ni-check-bold"></i>
                        Pedidos confirmados
                    </span>
                    <vue-bootstrap4-table class="tableClient" :rows="rowsConfirmed" :columns="columnsConfirmed" :classes="classes" :config="config">
                        
                        <template slot="date" slot-scope="props">
                            <b>
                                {{formatDate(props.row.date)}}
                            </b>
                        </template>
                        <template slot="dateConfirm" slot-scope="props">
                            <b>
                               
                                {{formatDates(props.row.dateConfirm)}}
                              
                                
                            </b>
                        </template>
                        <template slot="pagination-info" slot-scope="props">
                            Actuales {{props.currentPageRowsLength}} | 
                            Registros totales {{props.originalRowsLength}}
                        </template>
                        <template slot="selected-rows-info" slot-scope="props">
                            Total Number of rows selected : {{props.selectedItemsCount}}
                        </template>
                    </vue-bootstrap4-table>
                </tab-pane>

                <tab-pane>
                    <span slot="title">
                        <i class="ni ni-folder-17"></i>
                        Pedidos procesados / vencidos
                    </span>
                    <vue-bootstrap4-table class="tableClient" :rows="rowsUsed" :columns="columnsProccess" :classes="classes" :config="config">
                        <template slot="date" slot-scope="props">
                            <b>
                                
                                {{formatDate(props.row.date)}}
                                    
                                
                                
                            </b>
                        </template>
                        <template slot="dateProccess" slot-scope="props">
                            <b>
                                <div v-if="props.row.estado == 'usado'">
                                    {{formatDates(props.row.dateProccess)}}  
                                </div>
                                <a-tooltip  v-else placement="top">
                                    <template slot="title">
                                    <span>Pedido vencido el {{formatDates(props.row.dateProccess)}}  </span>
                                    </template>
                                    <base-button size="sm" type="danger"  >Vencido</base-button>
                                </a-tooltip>
                                
                            </b>
                        </template>
                        <template slot="pagination-info" slot-scope="props">
                            Actuales {{props.currentPageRowsLength}} | 
                            Registros totales {{props.originalRowsLength}}
                        </template>
                        <template slot="selected-rows-info" slot-scope="props">
                            Total Number of rows selected : {{props.selectedItemsCount}}
                        </template>
                    </vue-bootstrap4-table>
                </tab-pane>
            </card>
        </tabs>

        

        <!-- END -->

    </div> 
</template>

<script>
//Back - End 
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import EventBus from '../components/EventBus'
import jwtDecode from 'jwt-decode'
import router from '../router'
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
// COMPONENTS

import mixinUserToken from '../mixins/mixinUserToken'
export default {
    mixins: [mixinUserToken],
    components: {
        VueBootstrap4Table 
    },
    data() {
      return {
        auth: [],
        idPedido:'',
        identidadPedido:'',
        codePedido:'',
        articuloPedido:'',
        clientePedido:'',
        successRegister:false,
        clientsNames: [],
        tipeForm: '',
        services:'',
        registerClient: {
            name:'',
            id:'',
            contactOne:'',
            contactTwo:'',
            recommender:null,
            discount:false,
            valid:false,
            valid2:false,
            recommenders:'',
            lastDate:'',
            date:'',
            participation:0
        },
        modals: {
            modal1: false,
            modal2: false,
            modal3: false,
            message: "",
            icon: '',
            type:''
        },
        rowsPending: [],
        rowsConfirmed: [],
        rowsUsed: [],
        totalPending:0,
        columnsConfirmed: [{
                label: "Fecha",
                name: "date",
                // filter: {
                //     type: "simple",
                //     placeholder: "id"
                // },
                sort: true,
                slot_name: "date"
            },
            {
                label: "N° de pedido",
                name: "nPedido",
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter first name"
                // },
                sort: true,
            },
            {
                label: "Regalador",
                name: "cliente",
                sort: true,
            },
            {
                label: "Articulo",
                name: "articulo",
                sort: true,
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            {
                label: "Medio de pago",
                name: "tipoPago",
                sort: true,
                slot_name: "vencimiento"
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            {
                label: "Total",
                name: "total",
                sort: true,
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            
            {
                label: "Fecha de confirmación",
                name: "dateConfirm",
                sort: true,
                slot_name: "dateConfirm"
            },
        ],
        columnsProccess: [{
                label: "Fecha",
                name: "date",
                // filter: {
                //     type: "simple",
                //     placeholder: "id"
                // },
                sort: true,
                slot_name: "date"
            },
            {
                label: "N° de pedido",
                name: "nPedido",
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter first name"
                // },
                sort: true,
            },
            {
                label: "Regalador",
                name: "cliente",
                sort: true,
            },
            {
                label: "Articulo",
                name: "articulo",
                sort: true,
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            {
                label: "Codigo",
                name: "codigo",
                sort: true,
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            {
                label: "Medio de pago",
                name: "tipoPago",
                sort: true,
                
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            {
                label: "Total",
                name: "total",
                sort: true,
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            
            {
                label: "Fecha de procesamiento",
                name: "dateProccess",
                sort: true,
                slot_name: "dateProccess"
            },
        ],
        columns: [{
                label: "Fecha",
                name: "date",
                // filter: {
                //     type: "simple",
                //     placeholder: "id"
                // },
                sort: true,
                slot_name: "date"
            },
            {
                label: "N° de pedido",
                name: "nPedido",
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter first name"
                // },
                sort: true,
            },
            {
                label: "Cliente",
                name: "cliente",
                sort: true,
            },
            {
                label: "Contacto",
                name: "contacto",
                sort: true,
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            {
                label: "Articulo",
                name: "articulo",
                sort: true,
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            {
                label: "Fecha de vencimiento",
                name: "",
                sort: true,
                slot_name: "vencimiento"
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            {
                label: "Total",
                name: "total",
                sort: true,
                // filter: {
                //     type: "simple",
                //     placeholder: "Enter country"
                // },
            },
            
            {
                label: "Administrar",
                name: "_id",
                sort: false,
                slot_name: "Administrar"
            },
            ],
        config: {
            card_title: "Tabla de pedidos",
            checkbox_rows: false,
            rows_selectable : true,
            highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
            rows_selectable: true,
            per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
            global_search: {
                placeholder: "Filtre sus pedidos",
                visibility: true,
                case_sensitive: false
            },
            show_refresh_button: false,
            show_reset_button: false,  
            selected_rows_info: true,
            preservePageOnDataChange : true,
            pagination_info : true
        },
        classes: {
            table: "table-bordered table-striped"
        }     
      };
    },
    created(){
		this.getOrders();
        this.getToken();
        this.getServices()
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
        },
        getServices(){
            axios.get(endPoint.endpointTarget+'/servicios')
            .then(res => {
				this.services = res.data
            }).catch(err =>{
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
            })
        },
        getOrders(){
            axios.get(endPoint.endpointTarget+'/pedidos/findPending')
            .then(res => {
                this.rowsPending = res.data
                for (let i = 0; i < res.data.length; i++) {
                    const element = res.data[i];
                    var remp = element.total.replace('.', "")
                    
                    var remp2 = remp.replace('$ ', "")
                    
                    this.totalPending = parseFloat(this.totalPending)+parseFloat(remp2)
                }
            }).catch(err =>{
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
            })
            axios.get(endPoint.endpointTarget+'/pedidos/findConfirmed')
            .then(res => {
                this.rowsConfirmed = res.data
            }).catch(err => {
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
            })
            axios.get(endPoint.endpointTarget+'/pedidos/findUsed')
            .then(res => {
                this.rowsUsed = res.data
            }).catch(err => {
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
            })
        },
        registerClients(){
            
            var ifCheck = this.registerClient.discount ? 0 : 1
            axios.post(endPoint.endpointTarget+'/pedidos', {
                nombre:this.registerClient.name,
                identidad:this.registerClient.id,
                recomendador:this.registerClient.recommender,
                correoCliente:this.registerClient.contactOne,
                instagramCliente:this.registerClient.contactTwo,
                ifCheck: ifCheck
            })
            .then(res => {
                if (res.data.status == 'Registrado') {
                    this.modals = {
                        modal2: true,
                        message: "Se registro el cliente con éxito",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type:''
                        }
                        this.initialState(1)
                        this.getClients()
                        // EventBus.$emit('reloadClients', 'reload')
                    }, 1500);
                    
                }else{
                    this.modals = {
                        modal2: true,
                        message: "El cliente ya existe",
                        icon: 'ni ni-fat-remove ni-5x',
                        type: 'danger'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type: ''
                        }
                    }, 1500);
                }
            }).catch(err => {
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
            })
        },
        validRegister(){
            if (this.registerClient.name != '' && this.registerClient.id != '') {
                this.registerClient.valid = true
            }
            else {
                this.registerClient.valid = false
            }
        },
        MaysPrimera(string){
			return string.charAt(0).toUpperCase() + string.slice(1);
        },
        initialState(val){
            this.registerClient= {
                name:'',
                id:'',
                contactOne:'',
                discount:false,
                contactTwo:'',
                recommender:null,
                valid:false
            }
            if (val == 1) {
                this.modals = {
                    modal1: false,
                    modal2:false,
                    modal3:false,
                }
            }
            if (val == 2) {
                this.tipeForm = 'Registrar'
            }
            if (val == 3) {
                this.tipeForm = 'Editar'
            }
        },
        pushData(nombre,id,correo,ig,participacion,recomendacion,recomendaciones,ultimaFecha,fecha,_id){
            this.registerClient= {
                name:nombre,
                id:id,
                contactOne:correo,
                discount:false,
                contactTwo:ig,
                recommender:recomendacion,
                valid:true,
                valid2:true,
                recommenders:recomendaciones,
                lastDate:this.formatDate(ultimaFecha),
                date:this.formatDate(fecha),
                participation:participacion,
                _id:_id
            }

        },
        formatDate(date) {
            let dateFormat = new Date(date)
            dateFormat.setDate(dateFormat.getDate() +1)
            return moment(dateFormat).format("DD-MM-YYYY")
        },
        formatDates(date){
            let dateFormat = new Date(date)
            return moment(dateFormat).format("DD-MM-YYYY")
        },
        deleteClient(id){
			this.$swal({
				title: '¿Está seguro de borrar el cliente?',
				text: 'No puedes revertir esta acción',
				type: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Estoy seguro',
				cancelButtonText: 'No, evitar acción',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
				if(result.value) {
					axios.put(endPoint.endpointTarget+'/clients/deleteClient/'+id)
					.then(res => {
                        if (res.data.status == 'ok') {
                            this.modals = {
                                modal2: true,
                                message: "Cliente borrado con éxito",
                                icon: 'ni ni-check-bold ni-5x',
                                type: 'success'
                            }
                            setTimeout(() => {
                                this.modals = {
                                    modal1: false,
                                    modal2: false,
                                    modal3:false,
                                    message: "",
                                    icon: '',
                                    type:''
                                }
                                this.getClients()
                                // EventBus.$emit('reloadClients', 'reload')
                            }, 1500);
							// this.getClientsThree()
							// this.ServicesQuantityChartFunc();
							// this.emitMethodTwo()
						}
					}).catch(err =>{
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
                    })
				}
				else{
					this.modals = {
                        modal2: true,
                        message: "Acción cancelada",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type:''
                        }
                    }, 1500);
				}
			})
        },
        clientEdit(){
            axios.put(endPoint.endpointTarget+'/clients/'+this.registerClient._id, {
                nombreClienteEditar: this.registerClient.name,
                identidadClienteEditar: this.registerClient.id,
                correoClienteEditar: this.registerClient.contactOne,
                instagramClienteEditar: this.registerClient.contactTwo,
            })
            .then(res => {
                if (res.data.status == 'Servicio actualizado') {
                    this.modals = {
                        modal2: true,
                        message: "el cliente editó con éxito",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type:''
                        }
                        this.getClients();
                        this.initialState(1)
                        // EventBus.$emit('reloadClients', 'reload')
                    }, 1500);
                }else{
                    this.modals = {
                        modal2: true,
                        message: "El cliente ya existe",
                        icon: 'ni ni-fat-remove ni-5x',
                        type: 'danger'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type: ''
                        }
                    }, 1500);
                }
            }).catch(err => {
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
            })
        },
        showFilter(){
            $('.tableClient .vbt-table-tools').toggle()
        },
        validRoute(route, type){
            for (let index = 0; index < this.auth.length; index++) {
                const element = this.auth[index];
                if (element.ruta == route) {
                    for (let i = 0; i < element.validaciones.length; i++) {
                        if (type == element.validaciones[i]) { 
                            return true
                        } 
                    }
                }
            }
        },
        selectTemplate(select){
            this.modals = {
                modal1: false,
                modal2: false,
                modal3:false,
                message: "",
                icon: '',
                type: ''
            }
            setTimeout(() => {
               localStorage.setItem('selectTemplate', select)
                router.push({path: 'Correo'}) 
            }, 200);
			
        },
        confirmar(){
            axios.put(endPoint.endpointTarget+'/pedidos/'+this.idPedido, {
                nombreClienteEditar: this.registerClient.name,
                identidadClienteEditar: this.registerClient.id,
                correoClienteEditar: this.registerClient.contactOne,
                instagramClienteEditar: this.registerClient.contactTwo,
            })
            .then(res => {
                if (res.data.status == 'Servicio actualizado') {
                    axios.post(endPoint.endpointTarget+'/pedidos/sendEmailPedido',{
                        to : this.identidadPedido,
                        code : this.codePedido,
                        article : this.articuloPedido,
                        client: this.clientePedido
                    })
                    this.modals = {
                        modal2: true,
                        message: "Pedido confirmado",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type:''
                        }
                        this.getOrders();
                        this.initialState(1)
                        // EventBus.$emit('reloadClients', 'reload')
                    }, 1500);
                }else{
                    this.modals = {
                        modal2: true,
                        message: "Falla de conexion a internet",
                        icon: 'ni ni-fat-remove ni-5x',
                        type: 'danger'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type: ''
                        }
                    }, 1500);
                }
            }).catch(err => {
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
            })
        },
        
        formatCaducity(date) {
            let dateFormat = new Date(date)
            dateFormat.setDate(dateFormat.getDate() + 7)
            return moment(dateFormat).format("DD-MM-YYYY")
        },
        formatPrice(value) {
          let val = (value/1).toFixed(2).replace('.', ',')
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },

    }
  };
</script>
<style lang="scss">
    .card-header{
        font-size: 2.5vw;
    }
    .cursor-pointer{
        cursor: pointer;
    }
    .positionAlert{
        position: absolute;
        top:14%;
        left: 32%;
        z-index: 100000;
    }
    .tableClient .vbt-table-tools{
        display:none;
    }
    .tableClient .vbt-table-tools .vbt-global-search .form-group{
        width: 30%;
    }
    .template{
		padding: 2px;
		// background-color: #e4e8ec;
		cursor: pointer;
		-webkit-transition: all 0.5s ease-out;
        opacity:.6;
	}
	.template:hover{
		background-color: rgb(90, 90, 90);
        opacity:1;
	}

</style>