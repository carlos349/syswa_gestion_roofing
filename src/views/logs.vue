<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
            style="min-height: 50px; background-image: url(img/theme/sales.png); background-size: cover; background-position: center 65%;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Log del sistema</p>
                        
                    </div>
                    <div class="float-right mt-6">
                        <div class="float-right widthDiv">
                            
                        </div>
                    </div>
                </div>
            </div>
        </base-header>
        <a-modal v-model="modals.modal1" class="modalReport" width="70%" :footer="null" :closable="true" >
            <div class="mx-2" id="htmlPrint">
                <template v-if="dataSale != null">
                    <h2>Detalles del log (ID: {{dataSale._id}}) ---- Branch: ({{dataSale.user.branch}})</h2>
                </template>
                <template v-if="dataSale != null">
                    <hr class="mt-0 mb-0">
                    <div class="row">
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Fecha</b></label><br>
                            <span class="ml-1">{{dataSale.createdAt}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Nombre Usuario / Cargo</b></label><br>
                            <span class="ml-1">{{dataSale.user.name}} / {{dataSale.user.status}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Correo Usuario / ID</b></label><br>
                            <span class="ml-1">{{dataSale.user.email}} / {{dataSale.user.id}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Host</b></label><br>
                            <span class="ml-1">{{dataSale.host}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Parametros</b></label><br>
                            <span class="ml-1">{{dataSale.params}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Body</b></label><br>
                            <span class="ml-1">{{dataSale.body}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Ruta</b></label><br>
                            <span class="ml-1">{{dataSale.route}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Base de datos</b></label><br>
                            <span class="ml-1">{{dataSale.database}}</span>
                        </div>
                        <div class="col-md-4 mt-2">
                            <label for="date" style="margin-bottom:0px;"><b>Error</b></label><br>
                            <span class="ml-1">{{dataSale.error}}</span>
                        </div>
                    </div>
                    
                </template>
            </div>
        </a-modal>
        <a-config-provider :locale="es_ES">
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2>No se han registrado logs</h2>
                </div>
            </template>
            <a-table :columns="columns" :loading="progress" :data-source="logs" :scroll="getScreen">
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
                    {{column.createdAt | formatDate + getHourT(column.createdAt)}}
                </template>
                <template slot="reportSale" slot-scope="record, column">
                    <template v-if="validRoute('ventas', 'detalle')" >
                        <a-tooltip placement="top">
                            <template slot="title">
                                <span>Ver detalles</span>
                            </template>
                            <base-button size="sm" type="default" v-on:click="dataReport(column)">
                                <a-icon type="file-pdf" style="vertical-align:1.5px;font-size:1.3em;" />
                            </base-button>
                        </a-tooltip>
                    </template>
                    <template v-else >
                        <base-button v-if="column.status" disabled size="sm" type="default">
                            <a-icon type="file-pdf" style="vertical-align:1.5px;font-size:1.3em;" />
                        </base-button>
                        <base-button v-else disabled size="sm" type="danger" >
                            <a-icon type="file-pdf" style="vertical-align:1.5px;font-size:1.3em;" />
                        </base-button>
                    </template>
                </template>
            </a-table>
        </a-config-provider>
        <modal :show.sync="modals.modal2"
               :gradient="modals.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modals.icon"></i>
                <h1 class="heading mt-5">{{modals.message}}</h1>
            </div>
        </modal>
    </div>
</template>
<script>
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import EventBus from '../components/EventBus'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {Spanish} from 'flatpickr/dist/l10n/es.js';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode'
import XLSX from 'xlsx'
const dateNew = new Date()

import mixinUserToken from '../mixins/mixinUserToken'

import es_ES from 'ant-design-vue/lib/locale-provider/es_ES';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');
import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinUserToken, mixinES],
    components: {
        VueBootstrap4Table
    },
    data() {
        return {
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            progress:true,
            auth: [],
            moment,
            socket: io(endPoint.endpointTarget),
            modals: {
                modal1: false,
                modal2: false,
                modal3:false,
                message: "",
                icon: '',
                type:''
            },
            validCloseSale: false,
            configDatePicker: {
                allowInput: true, 
                mode: 'range',
                dateFormat: 'd-m-Y',
                locale: Spanish, // locale for this instance only          
            },
            es_ES,
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
                    title: 'host',
                    dataIndex: 'host',
                    key: 'host',
                    ellipsis: true,
                    scopedSlots: { customRender: 'host-slot' }
                },
                {
                    title: 'ruta',
                    dataIndex: 'route.path',
                    key: 'route',
                    ellipsis: true,
                    scopedSlots: { customRender: 'route' },
                    defaultSortOrder: 'descend',
                },
                {
                    title: 'Usuario',
                    dataIndex: 'user.name',
                    key: 'user.name',
                    ellipsis: true,
                    scopedSlots: { customRender: 'user' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.total - b.total
                },
                {
                    title: 'Detalle',
                    dataIndex: '_id',
                    key: '_id',
                    ellipsis: true,
                    scopedSlots: { customRender: 'reportSale' },
                },
            ],
            logs: [],
            dataSale: null,
            inspectorFilter: false,
            lenderSelect: '',
            lenderNames: [],
            clientSelect: '',
            clientNames: [],
            validLender: true,
            validClient: true,
            branch: '',
            branchName: '',
            dateFind: [],
            dateFindExcel: []
        }
    },
    created(){
        this.getToken()
        this.getBranch()
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
            this.firstNameUser = localStorage.firstname  
            this.lastNameUser = localStorage.lastname
            this.imgUser = localStorage.imgUser
        },
        getBranch(){
            this.branchName = localStorage.branchName  
            this.branch = localStorage.branch
            this.getClient()
            this.getEmployes()
            this.getLogs()
        },
        selectDate(date, dateString){
            if (date) {
                this.dateFind = dateString
            }else{
                this.dateFind = []
            }
        },
        selectDateExcel(date, dateString){
            console.log(date, dateString)
            if (date) {
                this.dateFindExcel = dateString
            }else{
                this.dateFindExcel = []
            }
        },
        sendSale(id){
            axios.get(endPoint.endpointTarget+'/mails/salemail/'+id, this.configHeader)
            .then(res => {
                if (res) {
                    this.$swal({
                        icon: 'success',
                        title: 'Enviado con éxito',
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
        },
        async getClient(){
            try{
                const clients = await axios.get(endPoint.endpointTarget+'/clients', this.configHeader)
                this.clientNames = []
                for (let index = 0; index < clients.data.data.length; index++) {
                    this.clientNames.push(clients.data.data[index].firstName+ ' / ' +clients.data.data[index].email)
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
        calculateCommission(data){
            var totalCommission = 0
            data.forEach(element => {
                if (element.type == "service") {
                    totalCommission = totalCommission + element.employe.commission
                }
            });
            return totalCommission
        },
        async getEmployes(){
            try {
                const employes = await axios.get(endPoint.endpointTarget+'/employes/employesbybranch/'+this.branch, this.configHeader)
                if(employes.data.status == 'ok'){
                    this.lenderNames = []
                    for (let index = 0; index < employes.data.data.length; index++) {
                        this.lenderNames.push(employes.data.data[index].firstName)
                    }
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
        getHourT(time){
            return new Date(time).getHour() + ":" + new Date(time).getMinutes()
        },
        async filterSale(){
            this.progress = true
            this.inspectorFilter = true
            try {
                const sales = await axios.post(endPoint.endpointTarget+'/sales/findSalesByDate', {
                    branch: this.branch,
                    dates: this.dateFind
                }, this.configHeader)
                if (sales.data.status == 'sales does exist') {
                    this.progress = false
                    this.sales = []
                    this.$swal({
                        icon: 'error',
                        title: 'No se encontraron ventas',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    this.progress = false
                    this.sales = sales.data.data
                }
            }catch(error){
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
        async getLogs(){
            this.progress = true
            this.inspectorFilter = false
            this.dateFind = []
            try {
                const logs = await axios.get(endPoint.endpointTarget+'/configurations/clientlog', this.configHeader)
                if (logs.data.status == 'ok') {
                    this.logs = logs.data.data
                    console.log(this.logs)
                    this.progress = false
                }else{
                    this.logs = []
                    this.progress = false
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
        justName(value){
            if(value){
                const split = value.split(' / ')
                var goBack = ''
                for (let index = 0; index < split.length; index++) {
                    goBack = goBack +'\n '+ split[index]
                }
                return goBack
            }
        },
        async dataReport(data){
            this.dataSale = data
            this.modals.modal1 = true
        },
        cancelSale(id){
            this.$swal({
				title: '¿Desea anular la venta?',
				text: 'No puede revertir esta acción',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Sí',
				cancelButtonText: 'No, cancelar',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
                if (result.value) {
                    axios.put(endPoint.endpointTarget+'/sales/'+id, {
                        branch: this.branch
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.$swal({
                                icon: 'success',
                                title: 'Venta anulada',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getSales()
                            this.dataSale.status = false
                            axios.post(endPoint.endpointTarget+'/notifications', {
                                branch: this.branch,
                                userName:this.firstNameUser + " " + this.lastNameUser,
                                userImage:this.imgUser,
                                detail: 'Anuló una venta del día '+this.formatDate(this.dataSale.createdAt),
                                link: 'Ventas'
                            }, this.configHeader).then(res => {
                                if (res.data.status == 'ok') {
                                    this.socket.emit('sendNotification', res.data.data)
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
                            this.$swal({
                                icon: 'error',
                                title: 'Error para anular la venta',
                                text: 'Si persiste, contacte a soporte técnico',
                                showConfirmButton: true
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
                    this.$swal({
                        icon: 'info',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
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
        },
        generateExcel(){
            var valid = this.dateFindExcel[0]+' a '+this.dateFindExcel[1]
            if (this.clientSelect == null) {
                this.clientSelect = ''
            }
            axios.post(endPoint.endpointTarget+'/sales/generateDataExcel', {
                rangeExcel: this.dateFindExcel,  
                clientSelect: this.clientSelect.split(' / ')[1] ? this.clientSelect.split(' / ')[1] : '',
                branch: this.branch
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    var Datos = XLSX.utils.json_to_sheet(res.data.dataTable) 
                    var wb = XLSX.utils.book_new() 
                    XLSX.utils.book_append_sheet(wb, Datos, 'Datos') 
                    XLSX.writeFile(wb, 'Ventas del '+valid+'.xlsx') 
                    this.clientSelect = ''
                    $('.rangeInput .ant-calendar-picker-clear').click()
                    this.modals.modal3 = false
                }else{
                    this.$swal({
                        icon: 'info',
                        title: 'No se encontraron ventas en las fechas seleccionadas',
                        showConfirmButton: false,
                        timer: 2000
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
        },
        chooseLender(){
            if (this.lenderSelect == '' || this.lenderSelect == null) {
                this.validLender = true
            }else{
                this.validLender = false
            }
        },
        chooseClient(){
            if (this.clientSelect == '' || this.clientSelect == null) {
                this.validClient = true
            }else{
                this.validClient = false
            }
        },
        printReport(id){
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;
            var win = window.open(endPoint.url+'/reportPdf?id='+id, '_blank', params)
            win.focus();
        }
    },
    mounted (){
        EventBus.$on('reloadSales', status => {
            this.getSales()
        })
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 'auto' }
        }
    }
}
</script>
<style>
    .vue-progress-path path {
        stroke-width: 12;
    }
    .vue-progress-path .progress {
        stroke:#00768c;
    }
    .vue-progress-path .background {
        stroke: transparent;
    }
    /* .excel-generate{
        position:absolute;
        right:2%;
        top:30%;
        z-index: 10;
    } */
    .bgcolor-danger #single-select{
        border-color:red;
    }
    .modalReport div .ant-modal{
        top: 10px !important;
    }
    .widthDiv{
        width: 76%;
    }
    @media only screen and (max-width: 768px)
    {
        .hideText{
            display: none;
        }
        .widthDiv{
            width: 100%;
            margin-top:20px;
        }
    }
</style>