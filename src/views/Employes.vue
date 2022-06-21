<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
            style="min-height: 50px; background-image: url(img/theme/employes.png); background-size: cover; background-position: center 60%;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Empleados</p>
                        <p class="text-white hideText">Sección dedicada a la administración de sus empleados. Donde podrá obtener detalle de sus ventas y comisiones correspondientes.</p>
                    </div>
                    <base-button class="float-right mt-7" size="sm" :disabled="validRoute('empleados', 'registrar') ? false : true" @click="modals.modal1 = true , initialState(2)" type="success">
                        <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Registrar
                    </base-button>
                </div>
            </div>
        </base-header>
        <modal :show.sync="modals.modal1"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-md">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-1"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                        Datos del empleado
                    </div>
                </template>
                <template>
                    <form role="form">
                        <div class="row">
                            <base-input alternative
                                    class="mb-3 col-6"
                                    placeholder="Nombre"
                                    v-model="registerEmploye.firstName"
                                    v-on:keyup="validRegister()"
                                    addon-left-icon="ni ni-single-02"
                                    addon-right-icon="fa fa-asterisk text-danger">
                            </base-input>
                            <base-input alternative
                                        class="mb-3 col-6"
                                        placeholder="Apellido"
                                        v-model="registerEmploye.lastName"
                                        v-on:keyup="validRegister()"
                                        addon-left-icon="ni ni-single-02"
                                        addon-right-icon="fa fa-asterisk text-danger">
                            </base-input>
                            </div>
                        
                        <base-input alternative
                            class="mb-3"
                            placeholder="Documento"
                            v-model="registerEmploye.document"
                            v-on:keyup="validRegister(), formatRut(registerEmploye.document)"
                            addon-left-icon="ni ni-key-25"
                            addon-right-icon="fa fa-asterisk text-danger">
                        </base-input>
                        <center>
                            <p class="mx-auto"> <strong class="mr-2">Agendamiento online </strong> <a-switch class="mr-3" :checked="registerEmploye.online" @click="chageOnlineValid()"/></p>
                        </center>
                        
                        <template>
                            <div class="text-muted text-center mb-1">Días laborales</div>
                        </template>
                        <vue-bootstrap4-table @refresh-data="onRefreshData" ref="employeTable" class="text-left styleDays" v-if="employeEditTableValid" :rows="days" :columns="columnsDays" :config="configDays">
                            <template slot="name" slot-scope="props">
                                <base-button :disabled="props.row.valid ? false : true" v-on:click="addDay(props.row.vbt_id, props.row.value, props.row.validator, props.row.value)" class="w-75 mt-1 ml-1" size="sm" type="success" v-if="props.row.validator">
                                    {{props.row.day}}
                                </base-button>
                                <base-button :disabled="props.row.valid ? false : true" v-on:click="addDay(props.row.vbt_id, props.row.value, props.row.validator,props.row.value)" class="w-75 mt-1 ml-1" size="sm" type="danger" v-else>
                                    {{props.row.day}}
                                </base-button>
                            </template>
                            <template slot="validation" slot-scope="props">
                                <a-select :disabled="props.row.validator == true ? false : true" @change="selectHourInit" style="width:45%" class="ml-1 mt-1 mb-1 input-group-alternative" placeholder="Desde" v-model="props.row.start">
                                    <a-select-option v-on:click="addHour(props.row.value, props.row.vbt_id)" v-for="i in props.row.hour" :key="i">
                                        {{i}}
                                    </a-select-option>
                                </a-select>
                                <a-select :disabled="props.row.validator == true ? false : true" @change="selectHourFinally" style="width:45%" class="ml-1 mt-1 mb-1 input-group-alternative" placeholder="Hasta" v-model="props.row.end">
                                    <a-select-option v-on:click="removeHour(props.row.value, props.row.vbt_id)" v-for="i in props.row.hour" :key="i">
                                        {{i}}
                                    </a-select-option>
                                </a-select>
                            </template>
                        </vue-bootstrap4-table>
                        <div class="text-center">
                            <base-button type="primary" v-on:click="proccess()" :disabled="disabledform" class="my-4">{{tipeForm}}</base-button>
                        </div>
                        
                    </form>
            </template>
            </card>
        </modal>
        <a-modal v-model="modals.modal2" :width="300" >
            <template>
                <h3>Ingresar avance</h3>
                <label for="Monto">Monto</label>
                <currency-input
                    v-model="advancementTotal"
                    locale="de"
                    class="ant-input w-100"
                />
            </template>
            <template slot="footer">
                <base-button :disabled="advancementTotal > 0 ? false : true" @click="registerAdvancement" size="sm" type="success">
                    Ingresar
                </base-button>
            </template>
        </a-modal>
        <!-- TABLA DE CLIENTES -->
        <a-config-provider :locale="es_ES">
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2>Selecciona un filtro en la parte superior</h2>
                </div>
            </template>
            <a-table :columns="columns" :loading="employeState" :data-source="employes" :scroll="getScreen">
                <div
                slot="filterDropdown"
                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                style="padding: 8px"
                >
                <a-input
                    v-ant-ref="c => (searchInput = c)"
                    :placeholder="`Buscar por ${column.title.toLowerCase()}`"
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
                    Restablecer
                </a-button>
                </div>
                <a-icon
                    slot="filterIcon"
                    slot-scope="filtered"
                    type="search"
                    :style="{ color: filtered ? '#108ee9' : undefined }"
                />
                <template slot="names-slot" slot-scope="record,column">
                    {{column.firstName}} {{column.lastName}}
                </template>
                <template slot="total" slot-scope="record,column">
                    {{(parseFloat(column.commission) + parseFloat(column.bonus)) - parseFloat(column.advancement) | formatPrice}}
                </template>
                <template slot="bonus" slot-scope="record">
                    {{record | formatPrice}}
                </template>
                <template slot="advancement" slot-scope="record">
                    {{record | formatPrice}}
                </template>
                <template slot="commission" slot-scope="record">
                    {{record | formatPrice}}
                </template>
                <template slot="name" slot-scope="record, column, index">
                    <!-- <a-tooltip placement="top">
                        <template slot="title">
                            <span>Avance</span>
                        </template>
                        <base-button class="mt-1" v-if="validRoute('empleados', 'reportes')" size="sm" type="warning" @click="modals.modal2 = true, advancementId = column._id, advancementName = column.firstName + ' '+column.lastName">
                            <a-icon type="wallet" style="vertical-align:1.5px;" />
                        </base-button>
                        <base-button class="mt-1" v-else disabled size="sm" type="warning">
                            <a-icon type="wallet" style="vertical-align:1.5px;" />
                        </base-button>
                    </a-tooltip> -->

                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>Editar</span>
                        </template>
                        <base-button class="mt-1" v-if="validRoute('empleados', 'editar')" size="sm" type="default" @click="modals.modal1 = true , initialState(3), pushData(column.firstName, column.days, column._id, column.document,column.lastName, column.branch, column.validOnline,index)" icon="fa fa-edit"></base-button>
                        <base-button class="mt-1" v-else disabled size="sm" type="default" icon="fa fa-edit"></base-button>
                    </a-tooltip>
                    
                    <!-- <a-tooltip placement="top">
                        <template slot="title">
                            <span>Reporte</span>
                        </template>
                        <base-button class="mt-1" v-if="validRoute('empleados', 'reportes')" size="sm" v-on:click="reportEmploye(column._id)" type="primary" icon="ni ni-align-center"></base-button>
                        <base-button class="mt-1" v-else size="sm" disabled type="primary" icon="ni ni-align-center"></base-button>
                    </a-tooltip> -->
                    
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>Eliminar</span>
                        </template>
                        <base-button class="mt-1" v-if="validRoute('empleados', 'eliminar')" size="sm" v-on:click="deleteEmploye(column._id)" type="danger" icon="fas fa-trash"></base-button>
                        <base-button class="mt-1" v-else size="sm" disabled type="danger" icon="fas fa-trash"></base-button>
                    </a-tooltip>
                </template>
            </a-table>
        </a-config-provider>  
    </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import EventBus from '../components/EventBus'
import jwtDecode from 'jwt-decode'
// COMPONENTS

import mixinUserToken from '../mixins/mixinUserToken'
import mixinES from '../mixins/mixinES'
export default {
    mixins: [mixinUserToken, mixinES],
    components: {
        VueBootstrap4Table 
    },
    data() {
      return {
        auth: [],
        tipeForm:'Registrar',
        employeState:false,
        registerEmploye: {
            branch:'Seleccione una sucursal',
            firstName: '',
            lastName: '',
            document: '',
            days: [],
            _id: '',
            show: false,
            valid: false,
            valid2: false,
            online: true,
        },
        disabledform:false,
        indexEdit:null,
        originalDays:[],
        dayValid:false,
        filter:'',
        branch:'',
        employeEditTableValid:true,
        branchName:'',
        configHeader: {
            headers:{
                "x-database-connect": endPoint.database,
                'x-access-token':localStorage.userToken
                }
        },
        advancementId: '',
        advancementName: '',
        advancementTotal: 0,
        modals: {
            modal1: false,
            modal2: false
        },
        columnsDays: [
            {
                label: "Día",
                name: "day",
                slot_name:"name",
                sort: false,
            },
            {
                label: "Horas de descanso",
                name: "value",
                slot_name:"validation",
                sort: false,
            }
        ],
        configDays: {
            card_title: "Tabla de días",
            checkbox_rows: false,
            rows_selectable : false,
            highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
            global_search: {
                placeholder: "Filtre por día",
                visibility: true,
                case_sensitive: false
            },
            show_refresh_button: false,
            show_reset_button: false,  
            selected_rows_info: false,
            preservePageOnDataChange : false,
            pagination_info : false,
            pagination:false
        },
        days: [],
        employes: [],
        searchText: '',
        searchInput: null,
        searchedColumn: '',
        columns: [
            {
                title: 'Nombres',
                dataIndex: 'firstName',
                key: 'firstName',
                sorter: (a, b) => {
                     if (a.firstName > b.firstName) {
                        return -1;
                    }
                    if (b.firstName > a.firstName) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'names-slot',
                },
                onFilter: (value, record) => record.firstName.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Documento',
                dataIndex: 'document',
                key: 'document',
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.document.replace(/[-.]/g,'').toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Comisión',
                dataIndex: 'commission',
                key: 'commission',
                scopedSlots: { customRender: 'commission' },
                sorter: (a, b) => a.commission - b.commission,
            },
            {
                title: 'Bonos',
                dataIndex: 'bonus',
                key: 'bonus',
                scopedSlots: { customRender: 'bonus' },
                sorter: (a, b) => a.bonus - b.bonus,
            },
            {
                title: 'Avances',
                dataIndex: 'advancement',
                key: 'advancement',
                scopedSlots: { customRender: 'advancement' },
                sorter: (a, b) => a.advancement - b.advancement,
            },
            {
                title: 'Total',
                key: '_id',
                scopedSlots: { customRender: 'total' },
                sorter: (a, b) => (a.commission + a.bonus - a.advancement) - (b.commission + b.bonus - b.advancement),
            },
            {
                title: 'Acciones varias',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: { customRender: 'name' }
            }
        ],
        selectedDays: [],
        hourInit: 'Desde',
        hourFinally: 'Hasta',
        editHourIndex: 0
      };
    },
    created(){
        this.getToken()
        this.getBranch()
    },
    methods: {
        getBranch(){
            this.branchName = localStorage.branchName  
            this.branch = localStorage.branch
            this.getEmployes()
            this.getBlockHours()
        },
        registerAdvancement(){
            const detail = `Avance de comisión para ${this.advancementName}`
            axios.post(`${endPoint.endpointTarget}/expenses/`, {
                branch: this.branch,
                detail: detail,
                employe: this.advancementId,
                amount: this.advancementTotal,
                type: "Comision",
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    axios.put(`${endPoint.endpointTarget}/employes/regAdvancement/${this.advancementId}`, {
                        amount: this.advancementTotal
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.getEmployes()
                            this.advancementTotal = 0
                            this.modals.modal2 = false
                            this.$swal({
                                icon: 'success',
                                title: '¡Avance ingresado con éxito!',
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
        async getBlockHours(){
            try{
                const getHours = await axios.get(endPoint.endpointTarget+'/configurations/getHours/'+this.branch, this.configHeader)
                if (getHours.data.status == 'ok') {
                    console.log(getHours)
                    for (const day of getHours.data.data) {
                        day.validator = false
                    }
                    this.days = getHours.data.data
                    console.log(this.days)
                    // this.fromArray = getHours.data.data
                    // this.toArray = false
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
        async getEmployes(){
            this.employeState = true
            try{
                const getByBranch = await axios.get(endPoint.endpointTarget+'/employes/employesbybranch/'+this.branch, this.configHeader)
                if (getByBranch.data.data.length > 0) {
                    this.employes = getByBranch.data.data
                    this.employeState = false
                }else{
                    setTimeout(() => {
                        this.employeState = false
                    }, 200);
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
        selectHourInit(value){
            this.hourInit = value
            this.dayValid = true
        },
        selectHourFinally(value){
            this.hourFinally = value
            this.dayValid = true
        },
        addHour(day, index){
            setTimeout(() => {
                for (const key in this.selectedDays) {
                    const days = this.selectedDays[key]
                    if (days.day == day ) {
                        this.selectedDays[key].hours[0] = this.hourInit
                        this.days[index - 1].start = this.hourInit  
                    }
                }
            }, 200);
        },
        chageOnlineValid(){
            console.log("aja?"+ this.registerEmploye.online)
            console.log(this.registerEmploye)
            console.log("aje"+this.registerEmploye.online)
            if (this.registerEmploye.online) {
                this.registerEmploye.online = false
            }else{
                this.registerEmploye.online = true
            }
            console.log(this.registerEmploye.online)
        },
        removeHour(day, index){
            setTimeout(() => {
                for (const key in this.selectedDays) {
                    const days = this.selectedDays[key]
                    if (days.day == day ) {
                        this.selectedDays[key].hours[1] = this.hourFinally
                        this.days[index - 1].end = this.hourFinally                  
                    }
                }
            }, 200);
        },
        addDay(id, value, valid, indes){
            if (valid) {
                console.log(this.employes[this.indexEdit])
                this.days[id - 1].validator = false
                for (let index = 0; index < this.days.length; index++) {
                    const element = this.days[index];
                    for (let indexTwo = 0; indexTwo < this.selectedDays.length; indexTwo++) {
                        const elementTwo = this.selectedDays[indexTwo];
                        if (value == elementTwo.day) {
                            this.selectedDays.splice(indexTwo, 1)
                        }
                    }
                }
                this.validRegister()
                if (indes == 0) {
                    indes = 7
                }
                this.$refs.employeTable.rows[indes-1].start = "Desde"
                this.$refs.employeTable.rows[indes-1].end = "Hasta"
            }else{
                this.days[id - 1].validator = true
                this.selectedDays.push({day: value, hours: []})
            }
        },
        selectBranchForCreate(value){
            this.registerEmploye.branch = value._id
            this.validRegister()
        },
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },
        handleReset(clearFilters) {
            clearFilters();
            this.searchText = '';
        },
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
        },
        reportEmploye(id){
            localStorage.setItem('idReportEmploye', id)
            router.push({path: '/reporteEmpleado'})
        },
        proccess(){
            if (this.tipeForm == "Registrar") {
                this.registerEmployes()
            }
            else{
                this.updateEmploye()
            }
        },
        validHoursDays(){
            if (this.selectedDays.length > 0) {
                for (const days of this.days) {
                    if (days.validator) {
                        if (days.start == "Desde" || days.start == undefined || days.end == "Hasta" || days.end == undefined) {
                            return false
                        }else{
                            if (parseInt(days.end.split(':')[0]) < parseInt(days.start.split(':')[0])) {
                                if (parseInt(days.end.split(':')[0]) == parseInt(days.start.split(':')[0])) {
                                    if (parseInt(days.end.split(':')[1]) < parseInt(days.start.split(':')[1])) {
                                       return 'hora atras' 
                                    }
                                }else{
                                    return 'hora atras'
                                }
                            }
                        }
                    }
                } 
                return true
            }else{
                return false
            }
        },
        registerEmployes(){
            this.disabledform = true
            if (this.validHoursDays() == 'hora atras') {
                this.$swal.fire({
                    icon: 'error',
                    title: '¡Oh oh! Horario incorrecto',
                    text: 'Revise el principio y fin de los horarios seleccionados',
                    showConfirmButton: true,
                    // timer: 1500
                })
            }else{
                if (this.registerEmploye.firstName.length != '' && this.registerEmploye.lastName.length != '' && this.registerEmploye.document.length > 1 && this.validHoursDays() == true) {
                    axios.post(endPoint.endpointTarget+'/employes', {
                        branch: this.branch,
                        days: this.selectedDays,
                        firstName: this.registerEmploye.firstName,
                        lastName: this.registerEmploye.lastName,
                        document: this.registerEmploye.document,
                        validOnline: this.registerEmploye.online
                    }, this.configHeader)
                    .then(res => {
                        if(res.data.status == 'employe created'){
                            this.$swal({
                                icon: 'success',
                                title: '¡Empleado registrado con éxito!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.modals.modal1 = false
                            this.getEmployes()
                            this.initialState(1)
                            EventBus.$emit('reloadLenders', 'reload')
                            this.disabledform = false
                        }else{
                            this.$swal({
                                icon: 'error',
                                title: '¡El empleado ya se encuentra registrado!',
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
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Debe completar los datos',
                        text: 'Recuerda completar los datos y horarios de descanso en los días seleccionados',
                        showConfirmButton: true,
                        // timer: 1500
                    })
                }
            }
            this.disabledform = false
        },
        updateEmploye(){
            this.disabledform = true
            if (this.validHoursDays() == 'hora atras') {
                this.$swal.fire({
                    icon: 'error',
                    title: '¡Oh oh! Horario incorrecto. Revise el principio y fin de los horarios seleccionados.',
                    showConfirmButton: true,
                    // timer: 1500
                })
            }else{
                if (this.registerEmploye.firstName.length > 3 && this.registerEmploye.lastName.length > 3 && this.registerEmploye.document.length > 1 && this.validHoursDays() == true) {
                    axios.put(endPoint.endpointTarget+'/employes', {
                        id:this.registerEmploye._id,
                        firstName: this.registerEmploye.firstName,
                        document: this.registerEmploye.document,
                        days: this.selectedDays,
                        lastName: this.registerEmploye.lastName,
                        validOnline: this.registerEmploye.online,
                        branch: this.branch,
                        validBlocked:false,
                        dayValid: this.dayValid
                    }, this.configHeader)
                    .then(res => {
                        if(res.data.status == "employe edited"){
                            this.$swal({
                                icon: 'success',
                                title: '¡Edición exitosa!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            if (this.filter == 'Todas') {
                                this.getEmployes()
                            }if (this.filter != 'Todas' && this.filter != '') {
                                const sendBranch = {
                                    _id:this.filter
                                }
                                this.findBranch(sendBranch)
                            }
                            this.modals.modal1 = false
                            this.getEmployes()
                            this.initialState(1)
                            EventBus.$emit('reloadLenders', 'reload')
                            this.disabledform = false
                        }else{
                            this.$swal({
                                type: 'error',
                                icon: 'error',
                                title: 'Prestador ya existe',
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
                    this.$swal.fire({
                        icon: 'error',
                        title: '¡Recuerda!',
                        text: 'Completa los datos y horario de descanso',
                        showConfirmButton: true,
                        // timer: 1500
                    })
                }
            }
		},
        deleteEmploye(id){
		    this.$swal({
                title: '¿Eliminar usuario?',
                text: '¡Recuerda! No es posible revertir esta acción',
                type: 'warning',
                icon:'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
                showCloseButton: true,
                showLoaderOnConfirm: true
            })
            .then(result => {
                if (result.value) {
                    axios.delete(endPoint.endpointTarget+'/employes/' + id, this.configHeader)
                    .then(res => {
                        if(res.data.status = 'employe deleted'){
                            this.$swal({
                                icon: 'success',
                                title: 'Empleado eliminado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getEmployes()
                            this.initialState(1)
                            EventBus.$emit('reloadLenders', 'reload')
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
		},
        onRefreshData(){
            
        },
        pushData(firstName,days,_id,document,lastName,branch,online, index){
            console.log("Que pasa?")
            axios.get(endPoint.endpointTarget+'/employes/justOneById/'+_id, this.configHeader)
            .then(resData => {
                this.originalDays = []
                this.registerEmploye.firstName = resData.data.data.firstName
                this.registerEmploye.lastName = resData.data.data.lastName
                this.registerEmploye.document = resData.data.data.document
                this.registerEmploye.branch = resData.data.data.branch
                this.registerEmploye.days = resData.data.data.days
                this.registerEmploye.online = resData.data.data.validOnline
                this.registerEmploye.show = true
                this.registerEmploye._id = _id
                this.selectedDays = days
                this.indexEdit = index
                console.log("day1")
                console.log(this.days)
                console.log(days)
                for (let index = 0; index < this.days.length; index++) {
                    const element = this.days[index];
                    for (let j = 0; j < this.registerEmploye.days.length; j++) {
                        const elementTwo = this.registerEmploye.days[j];
                        if (element.value == elementTwo.day) {
                            element.validator = true
                            element.start = elementTwo.hours[0]
                            element.end = elementTwo.hours[1]
                        }
                    }
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
                    console.log(err)
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
            
            console.log("day2")
            console.log(this.days)
        },
        validFields(field){
            if (field == 'c') {
                if (this.registerUser.correo == this.registerUser.correoConfirm) {
                this.registerUser.c = true
                console.log("y entonces?")
                }
                else{
                    this.registerUser.c = false
                }
            }
            
            if (field == 'p') {
                if (this.registerUser.password == this.registerUser.passwordConfirm) {
                this.registerUser.p = true
                }
                else{
                    this.registerUser.p = false
                }
            } 
        },
        initialState(val){
            this.registerEmploye = {
                firstName:'',
                lastName:'',
                branch: '',
                document:'',
                timeRestOne:"Seleccione el tiempo",
                timeRestTwo:"Seleccione el tiempo",
                dayFree:[],
                show:false,
                _id:'',
                valid:false,
                valid2:false,
                online: true
            }
            this.dayValid = false
            this.selectedDays = []
            for (let index = 0; index < this.days.length; index++) {
                this.days[index].validator = false
            }
            if (val == 2) {
                this.registerEmploye.show = true
                setTimeout(() => {
                    this.registerEmploye.show = false
                }, 10);
                this.tipeForm = 'Registrar'
                for (const days of this.days){
                    days.start = 'Desde',
                    days.end = 'Hasta'
                }
            }
            if (val == 3) {
                
                this.tipeForm = 'Editar'
                for (const days of this.days){
                    days.start = 'Desde',
                    days.end = 'Hasta'
                }
            }
        },
        validRegister(){
            if (this.registerEmploye.firstName != '' && this.registerEmploye.lastName != '' && this.registerEmploye.branch != '' && this.registerEmploye.document != '' && this.selectedDays.length > 0) {
                this.registerEmploye.valid = this.selectedDays[0].hours.length > 0 ? true : false
            }
            else{
                this.registerEmploye.valid = false
            }
        },
        formatRut(rut) {
            rut.replace(/[-.]/g,'')
            const newRut = rut.replace(/\./g,'').replace(/\-/g, '').trim().toLowerCase();
            const lastDigit = newRut.substr(-1, 1);
            const rutDigit = newRut.substr(0, newRut.length-1)
            let format = '';
            for (let i = rutDigit.length; i > 0; i--) {
            const e = rutDigit.charAt(i-1);
            format = e.concat(format);
            if (i % 3 === 0){
                format = '.'.concat(format);
            }
            }
            this.registerEmploye.document = format.concat('-').concat(lastDigit);
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
        }
    },
    mounted() {
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
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
    .styleDays .card-header{
        display: none;
    }
    .styleDays .footer-header{
        display: none;
    }
    .styleDays .vbt-table-tools{
        display: none;
    }
    .styleDays .table td{
        padding: 2px !important;
    }
    .styleDays .card-footer{
        display: none !important;
    }
    .styleDays .card-body{
        padding: 0 !important;
    }
</style>