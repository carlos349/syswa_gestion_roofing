<template>
    <div>
        <base-header class="header pt-lg-5 pb-3 d-flex align-items-center"
                        style="min-height: 50px; background-image: url(img/theme/employeReport.png); background-size: cover; background-position: center 35%;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Reporte <br v-if="screenClases == 'phone'"> {{nameLender}}</p>
                        <p class="text-white hideText">Sección dedicada al reporte de ventas y comisiones de empleados.</p>
                    </div>
                    <base-button v-on:click="back" :class="screenClases == 'phone' ? 'mt-9' : 'float-right mt-7'" class="mr-2" size="sm" type="warning">
                        <a-icon type="rollback" style="vertical-align:1px;font-size:1.4em;" />
                    </base-button>  
                    <base-button :class="screenClases == 'phone' ? 'mt-9' : 'float-right mt-7'" size="sm" v-if="validRoute('empleados', 'cerrar ventas')" type="danger" v-on:click="printReport">Cerrar ventas</base-button>
                    <base-button :class="screenClases == 'phone' ? 'mt-9' : 'float-right mt-7'" size="sm" v-else disabled type="danger">Cerrar ventas</base-button>
                    <base-button :class="screenClases == 'phone' ? 'mt-9' : 'float-right mt-7'" class="mr-2" size="sm" v-if="validRoute('empleados', 'reportes')" type="success" v-on:click="modals.modal2 = true">Datos avanzados</base-button>
                    <base-button :class="screenClases == 'phone' ? 'mt-9' : 'float-right mt-7'" class="mr-2" size="sm" v-else disabled type="success">Datos avanzados</base-button>
                </div>
            </div>
        </base-header>
        <center>
            <h1  class="display-2 pb-3 mb-3 hide text-center text-white">Reporte de cierre</h1> 
        </center>
        <modal :show.sync="modals.modal1"
               :gradient="modals.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modals.icon"></i>
                <h1 class="heading mt-5">{{modals.message}}</h1>
            </div>
        </modal>
        <modal :show.sync="modals.modal2"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 "
                  class="border-0">
                <template>
                    <div style="margin-top:-10% !important" class="text-muted text-center mb-3">
                        Datos del mes
                    </div>
                </template>
                <template>
                    <tabs fill class="flex-column flex-md-row">
                        <card shadow>
                            <div class="description">
                                <base-button type="secondary" class="w-100 mb-1 mt-3">
                                    <span class="float-left">Fecha</span>
                                    <badge style="font-size:.9em" class="float-right text-default" type="success">{{fecha}}</badge>
                                </base-button>
                                <base-button type="secondary" class="w-100 mb-1">
                                    <span class="float-left">Nombre</span>
                                    <badge style="font-size:.9em" class="float-right text-default" type="success">{{nameLender}}</badge>
                                </base-button>
                                <base-button type="secondary" class="w-100 mb-1">
                                    <span  class="float-left">Adelantos</span>
                                    <badge  style="font-size:.9em" class="float-right text-default" type="success">{{formatPrice(advancement)}}</badge>
                                </base-button>
                                <base-button type="secondary" class="w-100 mb-1">
                                    <span  class="float-left">Bonos</span>
                                    <badge  style="font-size:.9em" class="float-right text-default" type="success">{{formatPrice(lenderBonus)}}</badge>
                                </base-button>
                                <base-button type="secondary" class="w-100 mb-1">
                                    <span class="float-left">Comisión total</span>
                                    <badge style="font-size:.9em" class="float-right text-default" type="success">{{formatPrice(totalComission)}}</badge>
                                </base-button>
                                <base-button type="secondary" class="w-100 mb-1">
                                    <span class="float-left">Total</span>
                                    <badge style="font-size:.9em" class="float-right text-default" type="success">{{formatPrice(totalComission + lenderBonus - advancement)}}</badge>
                                </base-button>
                            </div>
                        </card>
                    </tabs>
                </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal3"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
               <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-25%" class="text-muted text-center mb-3">
                       <h3>Servicios</h3> 
                    </div>
                </template>
                <template>
                    <div class="m-2 w-100">
                        <badge class="w-100 text-default" type="primary" v-for="data in dataDetail" :key="data.servicio">{{data.servicio}}</badge>
                    </div>
                </template>
            </card>
        </modal>
        <tabs fill class="flex-column flex-md-row inventory inventoryTabs p-2">
            <card class="tablesExpense" shadow>
                 <tab-pane>
                    <span class="p-2" slot="title">
                        <i class="ni ni-shop"></i>
                        Ventas sin cerrar
                    </span>
                    <a-config-provider :locale="es_ES">
                        <template #renderEmpty>
                            <div style="text-align: center">
                                <a-icon type="warning" style="font-size: 20px" />
                                <h2>Empleado no posee ventas registradas</h2>
                            </div>
                        </template>
                        <a-table :columns="columns" :loading="progress" :data-source="sales" :scroll="getScreen">
                            <div
                                slot="filterDropdown"
                                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                                style="padding: 8px"
                                >
                                <a-input
                                    v-ant-ref="c => (searchInput = c)"
                                    :placeholder="`Buscar por nombre`"
                                    :value="selectedKeys[0]"
                                    style="width: 188px; margin-bottom: 8px; display: block;"
                                    @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
                                    @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                                />
                                <a-button
                                    type="primary"
                                    icon="search"
                                    size="small"
                                    style="width: 90px; margin-right: 8px"
                                    @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
                                >
                                    Buscar
                                </a-button>
                                <a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
                                    resetear
                                </a-button>
                            </div>
                            <a-icon
                                slot="filterIcon"
                                slot-scope="filtered"
                                type="search"
                                :style="{ color: filtered ? '#108ee9' : undefined }"
                            />
                            <template slot="customRender" slot-scope="text, record, index, column">
                                <span v-if="searchText && searchedColumn === column.dataIndex">
                                    <template
                                    v-for="(fragment, i) in text
                                        .toString()
                                        .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
                                    >
                                    <mark
                                        v-if="fragment.toLowerCase() === searchText.toLowerCase()"
                                        :key="i"
                                        class="highlight"
                                        >{{ fragment }}</mark
                                    >
                                    <template v-else>{{ fragment }}</template>
                                    </template>
                                </span>
                                <template v-else>
                                    {{ text }}
                                </template>
                            </template>
                            <template slot="date-format" slot-scope="record, column">
                                {{column.createdAt | formatDate}}
                            </template>
                            <template slot="commission" slot-scope="record, column">
                                {{parseFloat(column.commission) | formatPrice}}
                            </template>
                            
                            <template slot="total" slot-scope="record, column">
                                {{column.total | formatPrice}}
                            </template>
                            <template slot="reportSale" slot-scope="record, column">
                                <template v-if="validRoute('ventas', 'detalle')" >
                                    <a-tooltip placement="right">
                                        <template slot="title">
                                            <span>Anular venta</span>
                                        </template>
                                        <base-button v-if="fuckyou" size="sm" :disabled="column.validNull" type="danger" v-on:click="nullSale(column.saleData._id, column.id, column.createdAt, column.saleData)">
                                            <a-icon type="stop" style="vertical-align:1.5px;font-size:1.3em;" />
                                        </base-button>
                                    </a-tooltip>
                                </template>
                            </template>
                        </a-table>
                    </a-config-provider>
                 </tab-pane>
                 <tab-pane>
                    <span class="p-2" slot="title">
                        <i class="ni ni-calendar-grid-58"></i>
                        Historial de cierre
                    </span>
                    <a-config-provider :locale="es_ES">
                        <template #renderEmpty>
                            <div style="text-align: center">
                                <a-icon type="warning" style="font-size: 20px" />
                                <h2>Empleado sin historial.</h2>
                            </div>
                        </template>
                        <a-table :columns="columnsHistory" :loading="progress" :data-source="historyCloses" :scroll="getScreen">
                            <template slot="commission-slot" slot-scope="record, column">
                                {{column.commission | formatPrice}}
                            </template>
                            <template slot="advancement-slot" slot-scope="record, column">
                                {{column.advancement | formatPrice}}
                            </template>
                            <template slot="bonus-slot" slot-scope="record, column">
                                {{column.bonus | formatPrice}}
                            </template>
                            <template slot="format-date" slot-scope="record, column">
                                {{column.createdAt | formatDate}}
                            </template>
                            <template slot="action-slot" slot-scope="record, column">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>Ver informe</span>
                                    </template>
                                    <base-button size="sm" type="default" @click="modals.modal4 = true, dataHistoryClosedReport = column" icon="ni ni-bullet-list-67"></base-button>
                                </a-tooltip>
                            </template>
                        </a-table>
                    </a-config-provider>
                 </tab-pane>
            </card>
        </tabs>
        <a-modal v-model="modals.modal4" :width="screenClases == 'phone' ? '100%' : '60%'" :closable="true" >
            <template>
                <h3 class="text-center w-100">Informe de cierre</h3>
                <template v-if="dataHistoryClosedReport.employe">
                    <a-table :columns="columnsHistoryEmploye" :data-source="dataHistoryClosedReport.sales" :scroll="getScreen">
                        <template slot="date-format" slot-scope="record, column">
                            {{column.createdAt | formatDate}}
                        </template>
                        <template slot="commission" slot-scope="record, column">
                            {{parseFloat(column.commission) | formatPrice}}
                        </template>
                        
                        <template slot="total" slot-scope="record, column">
                            {{column.total | formatPrice}}
                        </template>
                    </a-table>
                </template>
            </template>
            <template slot="footer">
                <base-button @click="reportHistory" size="sm" type="primary">
                    Imprimir reporte
                </base-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import jwtDecode from 'jwt-decode'
// COMPONENTS
import VueBootstrap4Table from 'vue-bootstrap4-table'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import flatPicker from "vue-flatpickr-component";
import io from 'socket.io-client';
import "flatpickr/dist/flatpickr.css";
import mixinUserToken from '../mixins/mixinUserToken'
import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinUserToken, mixinES],
    components: {
        VueBootstrap4Table,
        vueCustomScrollbar,
        flatPicker
    },
    data(){
        return {
            socket: io(endPoint.endpointTarget),
            auth: [],
            id: localStorage.getItem('idReportEmploye'),
            sales: [],
            salesTotal:[],
            dateInit:'',
            fecha: '',
            lenderBonuses:[],
            code: '',
            dataDetail: [],
            nameLender: '',
            totalComission: 0,
            lenderBonus:0,
            advancement: '',
            totalSale: 0,
            progress: true,
            fuckyou:true,
            modals: {
                modal1: false,
                modal2: false,
                modal3: false,
                modal4: false,
                message: "",
                icon: '',
                type:''
            },
            configDate: {
                allowInput: true, 
                minDate: new Date(),
            },
            dates: {
                simple: new Date()
            },
            dataExpense: {
                reason: '',
                amount: 0,
                valid: false
            },
            bonus: false,
            lendeAdvancements: [],
            columnsHistoryEmploye: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    scopedSlots: { customRender: 'date-format' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                    ellipsis: true,
                },
                {
                    title: 'UUID de venta',
                    dataIndex: 'saleData.uuid',
                    key: 'saleData.uuid',
                    scopedSlots: { customRender: 'uuid-format' },
                },
                {
                    title: 'Cliente',
                    dataIndex: 'client',
                    key: 'client',
                    ellipsis: true,
                    scopedSlots: { customRender: 'client-slot' }
                },
                {
                    title: 'Servicio',
                    dataIndex: 'service',
                    key: 'service',
                    ellipsis: true,
                    scopedSlots: { customRender: 'service-slot' }
                },
                {
                    title: 'Comisión',
                    dataIndex: 'commission',
                    key: 'commission',
                    ellipsis: true,
                    scopedSlots: { customRender: 'commission' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.commission - b.commission
                },
                {
                    title: 'Total',
                    dataIndex: 'total',
                    key: 'totals.total',
                    ellipsis: true,
                    scopedSlots: { customRender: 'total' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.total - b.total
                }
            ],
            historyCloses: [],
            dataHistoryClosedReport: {},
            columnsHistory: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    scopedSlots: { customRender: 'format-date' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                },
                {
                    title: 'Comisión',
                    dataIndex: 'commission',
                    key: 'commission',
                    scopedSlots: { customRender: 'commission-slot' }
                },
                {
                    title: 'Avances',
                    dataIndex: 'advancement',
                    key: 'advancement',
                    scopedSlots: { customRender: 'advancement-slot' }
                },
                {
                    title: 'Bonos',
                    dataIndex: 'bonus',
                    key: 'bonus',
                    scopedSlots: { customRender: 'bonus-slot' }
                },
                {
                    title: 'Ver informe',
                    dataIndex: '_id',
                    key: '_id',
                    scopedSlots: { customRender: 'action-slot' }
                }
            ],
            columnsLender: [
                {
                    label: "Razón",
                    name: "reason",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "id"
                    // },
                    sort: true,
                },
                {
                    label: "Total",
                    name: "total",
                    slot_name: "format-total",
                    sort: false,
                },
                {
                    label: "Fecha",
                    name: "date",
                    slot_name: "format-date",
                    sort: false,
                },

            ],
            columnsBonuses: [
                {
                    label: "Razón",
                    name: "expense",
                    slot_name: "format-reason",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "id"
                    // },
                    sort: true,
                },
                {
                    label: "Total",
                    name: "Figure",
                    slot_name: "format-total",
                    sort: false,
                },
                {
                    label: "Fecha",
                    name: "date",
                    slot_name: "format-date",
                    sort: false,
                },

            ],
            configBonuses: {
                card_title: "Bonos",
                checkbox_rows: false,
                rows_selectable : false,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: false,
                preservePageOnDataChange : true,
                pagination_info : false,
                pagination: false,
                global_search: {
                    placeholder: "Busque el prestador",
                    visibility: false,
                    case_sensitive: false,
                    showClearButton: true,
                    searchOnPressEnter: false,
                    searchDebounceRate: 200,                      
                },
            },
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database,
                    'x-access-token':localStorage.userToken
                    }
            },
            configLender: {
                card_title: "Adelantos",
                checkbox_rows: false,
                rows_selectable : false,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: false,
                preservePageOnDataChange : true,
                pagination_info : false,
                pagination: false,
                global_search: {
                    placeholder: "Busque el prestador",
                    visibility: false,
                    case_sensitive: false,
                    showClearButton: true,
                    searchOnPressEnter: false,
                    searchDebounceRate: 200,                      
                },
            },
            columns: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    scopedSlots: { customRender: 'date-format' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                    ellipsis: true,
                },
                {
                    title: 'UUID de venta',
                    dataIndex: 'saleData.uuid',
                    key: 'saleData.uuid',
                    scopedSlots: { customRender: 'uuid-format' },
                },
                {
                    title: 'Cliente',
                    dataIndex: 'client',
                    key: 'client',
                    ellipsis: true,
                    scopedSlots: { customRender: 'client-slot' }
                },
                {
                    title: 'Servicio',
                    dataIndex: 'service',
                    key: 'service',
                    ellipsis: true,
                    scopedSlots: { customRender: 'service-slot' }
                },
                {
                    title: 'Comisión',
                    dataIndex: 'commission',
                    key: 'commission',
                    ellipsis: true,
                    scopedSlots: { customRender: 'commission' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.commission - b.commission
                },
                {
                    title: 'Total',
                    dataIndex: 'total',
                    key: 'totals.total',
                    ellipsis: true,
                    scopedSlots: { customRender: 'total' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.total - b.total
                },
                {
                    title: 'Anular',
                    dataIndex: '_id',
                    key: '_id',
                    ellipsis: true,
                    scopedSlots: { customRender: 'reportSale' },
                },
            ],
        }
    },
    created(){
        this.getData()
        this.getToken()
        $(document).ready(function(){
            setTimeout(() => {
               $("input[placeholder='Go to page']").hide(); 
            }, 200);
            
        });
        this.getHistoryCloses()
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
            this.branch = localStorage.branch
            this.firstNameUser = localStorage.firstname  
            this.lastNameUser = localStorage.lastname
            this.imgUser = localStorage.imgUser
        },
        back(){
            window.history.go(-1);
        },
        servicesSale(Data){
            this.dataDetail = Data
            this.modals.modal3 = true
            
        },
        async getHistoryCloses(){
            try {
                const getHistory = await axios.get(`${endPoint.endpointTarget}/employes/historyCloses/${this.id}`, this.configHeader)
                if (getHistory.data.status == 'ok') {
                    this.historyCloses = getHistory.data.data
                }else{
                    this.historyCloses = []
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
        },
        async cancelSale(id,servicios, comission){
            try{
                const cancelSale = await axios.put(endPoint.endpointTarget+'/ventas/'+id, {
                    employeComision: comission
                })
                if (cancelSale.data.status == 'ok') {
                    axios.post(endPoint.endpointTarget+'/inventario/nullSale', {
                        array:servicios
                    })
                    this.modals = {
                        modal1: true,
                        message: "¡Venta anulada!",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3: false,
                            message: "",
                            icon: '',
                            type:''
                        }
                    }, 1500);
                    this.getData()
                    const notify = await axios.post(endPoint.endpointTarget+'/notifications', {
                        branch: this.branch,
                        userName:this.firstNameUser + " " + this.lastNameUser,
                        userImage:this.imgUser,
                        detail:'Anuló una venta del día '+this.formatDate(this.arreglo.fecha),
                        link: 'Ventas'
                    }, this.configHeader)
                    if (notify) {
                        this.socket.emit('sendNotification', notify.data)
                    }   
                }
                else{
                    this.modals = {
                        modal1: true,
                        message: "¡Error al anular!",
                        icon: 'ni ni-fat-remove ni-5x',
                        type: 'danger'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3: false,
                            message: "",
                            icon: '',
                            type:''
                        }
                    }, 1500);
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
            
        },
        validRegister(){
            this.dataExpense.valid = this.dataExpense.reason != '' && this.dataExpense.amount > 0 ? true : false
        },
        registerExpense(){
            axios.post(endPoint.endpointTarget+'/manicuristas/registerAdvancement', {
                reason: this.dataExpense.reason,
                id:this.id,
                name: this.nameLender,
                prest: this.code,
                total: this.dataExpense.amount,
                check: this.bonus,
                date: this.dates.simple
            })
            .then(res => {
                if (res.data.status == 'bonus') {
                    this.modals = {
                        modal1: true,
                        message: "Se registro el bono con éxito",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3: false,
                            message: "",
                            icon: '',
                            type:''
                        }
                    }, 1500);
                    this.bonus = false
                    this.dataExpense.reason = ''
                    this.dataExpense.amount = 0
                    this.dataExpense.valid = false
                    this.getAdvancements();
                    this.getData()
                }else{
                    this.modals = {
                        modal1: true,
                        message: "Se registro el avance con éxito",
                        icon: 'ni ni-check-bold ni-5x',
                        type: 'success'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: false,
                            modal2: false,
                            modal3: false,
                            message: "",
                            icon: '',
                            type:''
                        }
                    }, 1500);
                    this.getAdvancements();
                    this.getData()
                }
            })
            .catch(err => {
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
        formatDate(date) {
            let dateFormat = new Date(date)
            return dateFormat.getDate()+"-"+(dateFormat.getMonth() + 1)+"-"+dateFormat.getFullYear()
        },
       
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        async nullSale(id, idItem, date, data){
            if (data.typesPay.length > 1) {
                this.$swal({
                    icon: 'error',
                    title: 'Por los tipos de pago',
                    html: 'Debes hacer la anulación en la sección de <b>Ventas</b>',
                    showConfirmButton: true
                })
            }else{
                this.$swal({
                    title: '¿Desea anular la venta?',
                    text: "¡Recuerda! Esta acción no se podrá revertir",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No, cancelar',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                })
                .then(result => {
                    if (result.value) {
                        axios.put(endPoint.endpointTarget+'/employes/nullsale/'+id, {
                            id:idItem,
                            idEmploye:this.id,
                            commission: this.totalComission
                        }, this.configHeader)
                        .then(res => {
                            if (res.data.status == 'ok') {
                                this.$swal({
                                    icon: 'success',
                                    title: 'Venta anulada',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                this.getData()
                                    axios.post(endPoint.endpointTarget+'/notifications', {
                                    branch: this.branch,
                                    userName:this.firstNameUser + " " + this.lastNameUser,
                                    userImage:this.imgUser,
                                    detail:'Anuló una venta del día ' + this.formatDate(date),
                                    link: 'Ventas'
                                    }, this.configHeader)
                                    .then(not =>{
                                        this.socket.emit('sendNotification', notify.data)
                                    }) 
                                
                            }else{
                                this.$swal({
                                    icon: 'error',
                                    title: 'Problemas tecnicos',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
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
                    }else{
                        this.$swal('No se hizo el cierre', 'Aborto la acción', 'info')
                    }
                })
            }
            
            
        },
        getData(){
            const date = new Date()
            this.fecha = date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()
            axios.get(endPoint.endpointTarget+'/employes/justOneById/'+this.id, this.configHeader)
            .then(resData => {
                this.code = resData.data.data._id
                this.nameLender = resData.data.data.firstName + ' ' + resData.data.data.lastName
                this.totalComission = resData.data.data.commission
                this.lenderBonus = resData.data.data.bonus
                this.advancement = resData.data.data.advancement
                axios.get(endPoint.endpointTarget+'/employes/salesbyemploye/'+this.id, this.configHeader)
                .then(res => {
                    this.sales = res.data.data
                    console.log(this.sales)
                    this.dateInit = res.data.data[0] ? res.data.data[0].createdAt : ''
                    this.progress = false
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
            })
            .catch(err => {
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
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        reportHistory(){
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;
            var win = window.open(endPoint.url+'/pdfCierreEmpleado?id='+this.dataHistoryClosedReport._id, '_blank', params)
            win.focus();
        },
        printReport(){
            this.$swal({
                title: '¿Desea realizar el cierre?',
                text: 'Esta acción no se puede revertir',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No, cancelar',
                showCloseButton: true,
                showLoaderOnConfirm: true
            })
            .then(result => {
                if (result.value) {
                    axios.put(endPoint.endpointTarget+'/employes/closeemploye/'+this.code, {
                        sales: this.sales,
                        bonus: this.lenderBonus,
                        advancement: this.advancement,
                        commission: this.totalComission,
                        employe: {
                            name: this.nameLender,
                            id: this.id
                        }
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'employe closed') {
                            axios.post(`${endPoint.endpointTarget}/expenses/`, {
                                branch: this.branch,
                                detail: 'Pago de comisión de '+ this.nameLender ,
                                employe: this.code,
                                amount: this.totalComission,
                                type: "Comision",
                            }, this.configHeader)
                            .then(res => {
                                if (res.data.status == 'ok') {
                                    this.getHistoryCloses()
                                    this.$swal({
                                        icon: 'success',
                                        title: 'Cierre exitoso',
                                        text: 'Para visualizar reporte verifique el historial',
                                        showConfirmButton: true
                                    })
                                    this.getData()
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
                        }else{
                            this.$swal('Error en el cierre', 'Hubo un error', 'error')
                        }
                    }) 
                    .catch(err => {
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
                }else{
                    this.$swal('No se hizo el cierre', 'Acción cancelada', 'info')
                }
            })
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
        }
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 'auto' }
        },
        screenClases: () => {
            return screen.width < 780 ? 'phone' : 'desktop'
        }
    }
}
</script>
<style>
    .card-header{
        font-size: 2.5vw;
    }
    .maxHeight{
        max-height: 200px;
        overflow-y: scroll;
    }
    .maxHeight .card-footer{
        display:none;
    }
    .hide{
        display: none;
    }
    .inventory .nav-item .active{
        background-color:#172b4d !important;
        color: white !important;
    }
    .inventory .nav-link {
        color: #172b4d !important;
    }
    .inventory .card-header{
        display:none;
    }
    .tablesExpense .card-body{
        padding: 0px !important;
    }
</style>