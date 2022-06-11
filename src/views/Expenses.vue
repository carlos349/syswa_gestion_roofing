<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
            style="min-height: 50px; background-image: url(img/theme/metrics.png); background-size: cover; background-position: center center;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12 ml-0">
                    <div class="text-absolute topExpense">
                        <p class="mb-0 display-4 text-white">Gastos</p>
                    </div>
                    <div class="row p-0">
                        <div class="col-md-2 px-1">
                            <stats-card title="Inventario"
                                type="gradient-orange"
                                :sub-title="thisMonth.Inventario | formatPrice"
                                icon="ni ni-box-2"
                                class="mt-6">
                                <template slot="footer">
                                    <span :class="percentInventory >= 0 ? 'text-success' : 'text-danger'" class="mr-2">
                                        <i :class="percentInventory >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i> 
                                        {{percentInventory}}%
                                    </span><br>
                                    <span class="text-nowrap">
                                        Mes pasado 
                                        <small class="text-muted">  
                                            {{beforeMonth.Inventario | formatPrice}}
                                        </small>
                                    </span>
                                </template>
                            </stats-card>
                        </div>
                        <div class="col-md-2 px-1">
                            <stats-card title="Bonos"
                                type="gradient-orange"
                                :sub-title="thisMonth.Bono | formatPrice"
                                icon="ni ni-trophy"
                                class="marginTopCards">
                                <template slot="footer">
                                    <span :class="percentBonus >= 0 ? 'text-success' : 'text-danger'" class="mr-2">
                                        <i :class="percentBonus >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i> 
                                        {{percentBonus}}%
                                    </span><br>
                                    <span class="text-nowrap"
                                        >Mes pasado 
                                        <small class="text-muted">  
                                            {{beforeMonth.Bono | formatPrice}}
                                        </small>
                                    </span>
                                </template>
                            </stats-card>
                        </div>
                        <div class="col-md-2 px-1">
                            <stats-card title="Comisiones"
                                type="gradient-orange"
                                :sub-title="thisMonth.Comision | formatPrice"
                                icon="ni ni-money-coins"
                                class="marginTopCards">
                                <template slot="footer">
                                    <span :class="percentCommission >= 0 ? 'text-success' : 'text-danger'" class="mr-2">
                                        <i :class="percentCommission >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i> 
                                        {{percentCommission}}%
                                    </span><br>
                                    <span class="text-nowrap">
                                        Mes pasado 
                                        <small class="text-muted">  
                                            {{beforeMonth.Comision | formatPrice}}
                                        </small>
                                    </span>
                                </template>
                            </stats-card>
                        </div>
                        <div class="col-md-2 px-1">
                            <stats-card title="Mensuales"
                                type="gradient-orange"
                                :sub-title="thisMonth.Mensual | formatPrice"
                                icon="ni ni-shop"
                                class="marginTopCards">
                                <template slot="footer">
                                    <span :class="percentMonth >= 0 ? 'text-success' : 'text-danger'" class="mr-2">
                                        <i :class="percentMonth >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i> 
                                        {{percentMonth}}%
                                    </span><br>
                                    <span class="text-nowrap">
                                        Mes pasado 
                                        <small class="text-muted">  
                                            {{beforeMonth.Mensual | formatPrice}}
                                        </small>
                                    </span>
                                </template>
                            </stats-card>
                        </div>
                        <div class="col-md-2 px-1">
                            <stats-card title="Total gastos"
                                type="gradient-orange"
                                :sub-title="totalExpenses | formatPrice"
                                icon="ni ni-trophy"
                                class="marginTopCards">
                                <template slot="footer">
                                    <span :class="percentTotalExpenses >= 0 ? 'text-success' : 'text-danger'" class="mr-2">
                                        <i :class="percentTotalExpenses >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i> 
                                        {{percentTotalExpenses}}%
                                    </span><br>
                                    <span class="text-nowrap"
                                        >Mes pasado 
                                        <small class="text-muted">  
                                            {{totalExpensesBefore | formatPrice}}
                                        </small>
                                    </span>
                                </template>
                            </stats-card>
                        </div>
                        <div class="col-md-2 px-1">
                            <a-tooltip>
                                <template slot="title">
                                    Total = Ventas + Reinversión - Gastos
                                </template>
                                <stats-card title="Ganancia"
                                    type="gradient-orange"
                                    :sub-title="totalFinal | formatPrice"
                                    icon="ni ni-sound-wave"
                                    class="marginTopCards">
                                    <template slot="footer">
                                        <span :class="totalFinal >= 0 ? 'text-success' : 'text-danger'" class="mr-2">
                                            <i :class="totalFinal >= 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i> 
                                        </span><br>
                                        <span v-if="totalFinal < 0" class="text-nowrap">
                                            Saldo negativo
                                            <small class="text-muted">  
                                                {{totalFinal | formatPrice}}
                                            </small>
                                        </span>
                                        <span v-else class="text-nowrap">
                                            Disponible
                                            <small class="text-muted">  
                                                {{totalFinal | formatPrice}}
                                            </small>
                                        </span>
                                    </template>
                                </stats-card>
                            </a-tooltip>
                        </div>
                    </div>
                    <div class="float-left mt-2">
                        <label style="margin-left:-10px;" for="date" class="text-white">Busque por fecha</label><br>
                        <a-range-picker :disabled="validRoute('gastos', 'filtrar') ? false : true" :ranges="{ Hoy: [moment(), moment()], 'Este mes': [moment(), moment().endOf('month')] }" @change="selectDate" style="margin-left:-10px;width:55%;" :locale="locale" />
                        <base-button class="ml-2" style="margin-top:-5px;" size="sm"  :disabled="validRoute('gastos', 'filtrar') ? false : true"  v-on:click="findExpenses" type="success">
                            <a-icon type="search" style="vertical-align:1px;font-size:1.8em;" />
                        </base-button>
                    </div>
                    <base-button style="margin-top:3.3em;" class="float-right" size="sm"  v-on:click="modals.modal1 = true" type="success">
                        <a-icon type="wallet" class="mr-1" style="vertical-align:1px;font-size:1.5em;" />
                        Registrar
                    </base-button>
                    <base-button class="float-right mr-1" style="margin-top:3.3em;" size="sm"  :disabled="validRoute('gastos', 'registrar_inversion') ? false : true"  v-on:click="modals.modal4 = true, getReinvestment()" type="default">
                        <a-icon type="book" class="mr-1" style="vertical-align:1px;font-size:1.5em;" />
                        Inversión
                    </base-button>
                    <base-button @click="openReport" class="float-right mr-1" style="margin-top:3.3em;" size="sm" type="danger">
                        <a-icon type="file-pdf" class="mr-1" style="vertical-align:1px;font-size:1.5em;"/>
                    </base-button>
                    <base-button @click="closeReinvestment" class="float-right mr-1" style="margin-top:3.3em;" size="sm"  :disabled="validRoute('gastos', 'cierre') ? false : true" type="danger">
                        <i class="fa fa-archive mr-1" style="vertical-align:1px;font-size:1.2em;"></i>
                        Cierre
                    </base-button>
                </div>
            </div>
        </base-header>
        <tabs fill class="flex-column flex-md-row inventory inventoryTabs p-2">
            <card class="tablesExpense" shadow>
                <tab-pane>
                    <span class="p-2" slot="title">
                        <i class="ni ni-shop"></i>
                        Tabla de gastos
                    </span>
                    <a-config-provider :locale="es_ES">
                        <template #renderEmpty>
                            <div style="text-align: center">
                                <a-icon type="warning" style="font-size: 20px" />
                                <h2>Sucursal sin gastos registrados.</h2>
                            </div>
                        </template>
                        <a-table :columns="columns" :loading="progress" :data-source="expenses" :scroll="getScreen">
                            <template slot="format-date" slot-scope="record, column">
                                {{column.createdAt | formatDate}}
                            </template>
                            <template slot="total-slot" slot-scope="record, column">
                                {{column.amount | formatPrice}}
                            </template>
                            <template slot="action-slot" slot-scope="record, column">
                                <base-button v-if="column.type == 'Bono' || column.type == 'Mensual'" :disabled="validRoute('gastos', 'eliminar') ? false : true" @click="deleteExpense(column._id, column.type, column.employe, column.amount)" size="sm" type="danger">
                                    <a-icon type="close-circle" style="vertical-align:1.5px;" />
                                </base-button>
                            </template>
                        </a-table>
                    </a-config-provider>
                </tab-pane>
                <tab-pane>
                    <span class="p-2" slot="title">
                        <i class="ni ni-calendar-grid-58"></i>
                        Historial de cierres
                    </span>
                    <a-config-provider :locale="es_ES">
                        <template #renderEmpty>
                            <div style="text-align: center">
                                <a-icon type="warning" style="font-size: 20px" />
                                <h2>Sucursal sin historial.</h2>
                            </div>
                        </template>
                        <a-table :columns="columnsHistory" :loading="progress" :data-source="historyExpenses" :scroll="getScreen">
                            <template slot="expenses-slot" slot-scope="record, column">
                                {{column.expenses.length}}
                            </template>
                            <template slot="format-date" slot-scope="record, column">
                                {{column.createdAt | formatDate}}
                            </template>
                            <template slot="action-slot" slot-scope="record, column">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>Ver informe</span>
                                    </template>
                                    <base-button size="sm" type="default" @click="modals.modal5 = true, dataHistoryClosedReport = column" icon="ni ni-bullet-list-67"></base-button>
                                </a-tooltip>
                            </template>
                        </a-table>
                    </a-config-provider>
                </tab-pane>
            </card>
        </tabs>
        <a-modal v-model="modals.modal1" :footer="null" >
            <template>
                <h3 class="text-center w-100">Seleccione el tipo de gasto</h3>
                <center>
                    <base-button :disabled="validRoute('gastos', 'registrar_bono') ? false : true" @click="modals.modal1 = false, modals.modal2 = true" class="w-25" type="default">
                        Bono
                    </base-button>
                    <base-button :disabled="validRoute('gastos', 'registrar_gasto') ? false : true" @click="modals.modal1 = false, modals.modal3 = true" type="primary">
                        Gasto mensual
                    </base-button>  
                </center>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal2" :width="300" >
            <template>
                <template>
                    <h3>Registrar un bono</h3>
                    <label for="descripción">Descripción</label>
                    <a-input 
                        v-model="registerExpense.detail"
                        type="textarea"
                        class="mb-2"
                        placeholder="Escriba la razón del bono"/>
                    <label for="employe">Empleado</label>
                    <a-select
                        show-search
                        placeholder="Seleccione el empleado"
                        option-filter-prop="children"
                        :filter-option="filterOption"
                        :allowClear="true"
                        class="mb-2 pt-1 w-100 selectEmploye"
                        @change="chooseEmploye">
                        <a-select-option v-for="employe of employes" :key="employe._id" :value="employe._id">
                            {{employe.firstName}} {{employe.lastName}}
                        </a-select-option>
                    </a-select>
                    <label for="Monto">Monto</label>
                    <currency-input
                        v-model="registerExpense.amount"
                        locale="de"
                        class="ant-input w-100"
                    />
                </template>
                <template slot="footer">
                    <base-button class="float-left" @click="modals.modal1 = true, modals.modal2 = false" size="sm" type="default">
                        Regresar
                    </base-button>
                    <base-button :disabled="registerExpense.detail.length > 0 && registerExpense.amount > 0 && employeSelect.id.length > 0 ? false : true" @click="registerBonusExpense" size="sm" type="success">
                        Registrar
                    </base-button>
                </template>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal3" :width="300" >
            <template>
                <h3>Registrar un gasto mensual</h3>
                <label for="descripción">Descripción</label>
                <a-input 
                    v-model="registerExpense.detail"
                    type="textarea"
                    class="mb-2"
                    placeholder="Escriba la descripción del gasto"/>
                <label for="Monto">Monto</label>
                <currency-input
                    v-model="registerExpense.amount"
                    locale="de"
                    class="ant-input w-100"
                />
            </template>
            <template slot="footer">
                <base-button class="float-left" @click="modals.modal1 = true, modals.modal3 = false" size="sm" type="default">
                        Regresar
                    </base-button>
                <base-button :disabled="registerExpense.detail.length > 0 && registerExpense.amount > 0 ? false : true" @click="registerMonthExpense" size="sm" type="success">
                    Registrar
                </base-button>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal4" :width="300" >
            <template v-if="reinvestmentValid">
                <h3>Edite reinversion mensual</h3>
                <label for="Monto">Monto a editar</label>
                <currency-input
                    v-model="reinvestmentTotal"
                    locale="de"
                    class="ant-input w-100"
                />
            </template>
            <template v-else>
                <h3>Registre reinversion mensual</h3>
                <label for="Monto">Monto</label>
                <currency-input
                    v-model="reinvestmentTotal"
                    locale="de"
                    class="ant-input w-100"
                />
            </template>
            <template slot="footer">
                <base-button @click="registerReinvestment" v-if="reinvestmentValid" size="sm" type="success">
                    Editar
                </base-button>
                <base-button @click="registerReinvestment" v-else size="sm" type="success">
                    Registrar
                </base-button>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal5" width="60%" :closable="true" >
            <template>
                <h3 class="text-center w-100">Informe de cierre</h3>
                <template v-if="dataHistoryClosedReport.branch">
                    <a-table :columns="columnsHistoryExpenses" :loading="progress" :data-source="dataHistoryClosedReport.expenses" :scroll="getScreen">
                        <template slot="total-slot" slot-scope="record, column">
                            {{column.amount | formatPrice}}
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
import endPoint from '../../config-endpoint/endpoint.js'
import EventBus from '../components/EventBus'
import jwtDecode from 'jwt-decode'
import moment from 'moment';
import locale from 'ant-design-vue/es/date-picker/locale/es_ES';
// COMPONENTS
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import mixinUserToken from '../mixins/mixinUserToken'
import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinUserToken, mixinES],
    components: {
        flatPicker
    },
    data(){
        return {
            auth:[],
            configDate: {
                allowInput: true, 
                minDate: new Date(),
            },
            dates: {
                simple: new Date()
            },
            locale,
            moment,
            dateFind: [],
            modals: {
                modal1: false,
                modal2: false,
                modal3: false,
                modal4: false,
                modal5: false
            },
            registerExpense: {
                detail: '',
                amount: 0,
                type: ''
            },
            progress: false,
            expenses: [],
            configHeader: {
                headers: {
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            dataHistoryClosedReport: {},
            branchName: '',
            branch: '',
            columnsHistoryExpenses: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    width: "20%"
                },
                {
                    title: 'Tipo',
                    dataIndex: 'typee',
                    key: 'typee',
                    width: "20%"
                },
                {
                    title: 'Descripción',
                    dataIndex: 'detaill',
                    key: 'detaill',
                    width: "40%"
                },
                {
                    title: 'Total',
                    dataIndex: 'total',
                    key: 'total',
                    scopedSlots: { customRender: 'total-slot' },
                    sorter: (a, b) => a.total - b.total,
                    width: "20%"
                }
            ],
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
                    title: 'Gastos',
                    dataIndex: 'expenses',
                    key: 'expenses',
                    scopedSlots: { customRender: 'expenses-slot' }
                },
                ,
                {
                    title: 'Total',
                    dataIndex: 'totals.totalFinal',
                    key: 'totals.totalFinal'
                },
                {
                    title: 'Ver informe',
                    dataIndex: '_id',
                    key: '_id',
                    scopedSlots: { customRender: 'action-slot' }
                }
            ],
            columns: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    scopedSlots: { customRender: 'format-date' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                },
                {
                    title: 'Tipo',
                    dataIndex: 'type',
                    key: 'type',
                },
                {
                    title: 'Descripción',
                    dataIndex: 'detail',
                    key: 'detail'
                },
                {
                    title: 'Total',
                    dataIndex: 'total',
                    key: 'total',
                    scopedSlots: { customRender: 'total-slot' },
                    sorter: (a, b) => a.total - b.total,
                },
                {
                    title: 'Eliminar',
                    dataIndex: '_id',
                    key: '_id',
                    scopedSlots: { customRender: 'action-slot' }
                }
            ],
            historyExpenses: [],
            expenses: [],
            typeRegister: '',
            employes: [],
            employeSelect: {
                name: '',
                id: ''
            },
            thisMonth:  {
                Inventario: 0,
                Bono: 0,
                Mensual: 0,
                Comision: 0
            },
            beforeMonth: {
                Inventario: 0,
                Bono: 0,
                Mensual: 0,
                Comision: 0
            },
            commissionThisMonth: 0,
            commissionBeforeMonth: 0,
            percentInventory: 0,
            percentBonus: 0,
            percentMonth: 0,
            percentCommission: 0,
            totalSales: 0,
            totalFinal: 0,
            reinvestmentTotal: 0,
            reinvestmentValid: false,
            reinvestmentId: '',
            totalExpenses: 0,
            totalExpensesBefore: 0,
            percentTotalExpenses: 0
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
        },
        getBranch(){
            this.branchName = localStorage.branchName  
            this.branch = localStorage.branch
            this.getExpenses()
            this.getEmployes()
            this.getTotalSales()
            this.getReinvestment()
            this.getTotal() 
            this.getHistoryExpenses()
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
        async getHistoryExpenses(){
            try {
                const getHistory = await axios.get(`${endPoint.endpointTarget}/expenses/historyExpenses/${this.branch}`, this.configHeader)
                if (getHistory.data.status == 'ok') {
                    this.historyExpenses = getHistory.data.data
                }else{
                    this.historyExpenses = []
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
        async getTotalSales(){
            try {
                const getTotal = await axios.get(`${endPoint.endpointTarget}/sales/totalSales/${this.branch}`, this.configHeader)
                if (getTotal.data.status == 'ok') {
                    this.totalSales = getTotal.data.data
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
        closeReinvestment(){
            if (this.reinvestmentValid && this.reinvestmentId != '') {
                axios.post(`${endPoint.endpointTarget}/expenses/validclose`, {
                    branch: this.branch
                }, this.configHeader)
                .then(valid =>{
                    if (valid.data.status == 'bad employes') {
                        this.$swal({
                            icon: 'error',
                            title: 'Debe realizar cierre de empleados',
                            text: 'Para continuar debe hacer cierre en sección de empleados',
                            showConfirmButton: true
                        })
                    }if (valid.data.status == 'bad inventories') {
                        this.$swal({
                            icon: 'error',
                            title: 'Debe realizar cierre de inventario',
                            text: 'Para continuar debe hacer cierre en sección de inventario',
                            showConfirmButton: true
                        })
                    }if (valid.data.status == 'bad cashfound') {
                        this.$swal({
                            icon: 'error',
                            title: 'Debe realizar cierre de Caja del día',
                            text: 'Para continuar debe hacer cierre en sección de caja',
                            showConfirmButton: true
                        })
                    }if (valid.data.status == 'ok') {
                        const expenseTotal = this.thisMonth.Inventario + this.thisMonth.Bono + this.thisMonth.Mensual + this.thisMonth.Comision
                        this.$swal({
                            title: '¿Desea realizar el cierre de gastos?',
                            text: '¡Recuerda! Esta acción no se puede revertir',
                            type: 'warning',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Sí',
                            cancelButtonText: 'No, cancelar',
                            showCloseButton: true,
                            showLoaderOnConfirm: true
                        }).then((result) => {
                            if(result.value) {
                                axios.post(`${endPoint.endpointTarget}/expenses/closeExpenses`, {
                                    reinvestment: this.reinvestmentTotal,
                                    sales: this.totalSales,
                                    expenses: expenseTotal,
                                    totalFinal: this.totalFinal,
                                    branch: this.branch,
                                    reinvestmentId: this.reinvestmentId,
                                    bonus: this.thisMonth.Bono,
                                    monthly: this.thisMonth.Mensual,
                                    commission: this.thisMonth.Comision
                                }, this.configHeader)
                                .then(res => {
                                    if(res.data.status == 'ok'){
                                        this.$swal({
                                            icon: 'success',
                                            title: 'Cierre exitoso',
                                            text: 'Para visualizar reporte verifique el historial',
                                            showConfirmButton: true
                                        })
                                        this.getBranch()
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
                    }
                })
            }else{
                this.$swal({
					icon: 'error',
					title: 'Debe registrar reinversión',
                    text: 'Para continuar debe ingresar un monto de reinversión',
					showConfirmButton: true
				})
            }
        },
        async getReinvestment(){
            try {
                const reinvestment = await axios.get(`${endPoint.endpointTarget}/expenses/findReinvestment/${this.branch}`, this.configHeader)
                if (reinvestment.data.status == 'ok') {
                    this.reinvestmentTotal = reinvestment.data.data.amount
                    this.reinvestmentValid = true
                    this.reinvestmentId = reinvestment.data.data._id
                }else{
                    this.reinvestmentTotal = 0
                    this.reinvestmentValid = false
                    this.reinvestmentId = reinvestment.data.data._id
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
        registerReinvestment(){
            axios.put(`${endPoint.endpointTarget}/expenses/regReinvestment/${this.reinvestmentId}`, {
                amount: this.reinvestmentTotal
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    if (this.reinvestmentValid) {
                        this.$swal({
                            icon: 'success',
                            title: 'Reinversión editada',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }else{
                        this.$swal({
                            icon: 'success',
                            title: 'Reinversión registrada',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    this.getBranch()
                    this.modals.modal4 = false
                    this.reinvestmentValid = true
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
        getTotal(){
            setTimeout(() => {
                this.totalFinal = this.reinvestmentTotal + this.totalSales - (this.thisMonth.Comision + this.thisMonth.Inventario + this.thisMonth.Bono + this.thisMonth.Mensual)
            }, 200);
        },
        selectDate(date, dateString){
            if (date) {
                this.dateFind = dateString
            }else{
                this.dateFind = []
            }
        },
        async findExpenses(){
            if (this.dateFind.length > 0) {
                this.progress = true
                try {
                    const expenses = await axios.post(`${endPoint.endpointTarget}/expenses/findByDates/${this.branch}`, {
                        dates: this.dateFind
                    }, this.configHeader)
                    if (expenses.data.status == 'ok') {
                        this.expenses = expenses.data.data
                        this.progress = false
                    }else{
                        this.expenses = []
                        this.progress = false
                        this.$swal({
                            icon: 'error',
                            title: 'Fechas sin gastos registrados',
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
            }else{
               this.$swal({
					icon: 'error',
					title: 'Debe seleccionar fechas',
					showConfirmButton: false,
					timer: 1500
				}) 
            }
        },
        async getExpenses(){
            try {
                const expenses = await axios.get(`${endPoint.endpointTarget}/expenses/${this.branch}`, this.configHeader)
                if (expenses.data.status == 'ok') {
                    this.expenses = expenses.data.data.expenses
                    this.thisMonth = expenses.data.data.expenseTotals
                    this.beforeMonth = expenses.data.data.expenseTotalsBefore
                    this.totalExpenses = this.thisMonth.Comision + this.thisMonth.Inventario + this.thisMonth.Bono + this.thisMonth.Mensual
                    this.totalExpensesBefore = this.beforeMonth.Comision + this.beforeMonth.Inventario + this.beforeMonth.Bono + this.beforeMonth.Mensual
                    this.percentInventory = this.thisMonth.Inventario > 0 ? ((this.thisMonth.Inventario - this.beforeMonth.Inventario) / this.thisMonth.Inventario) * 100 : 0
                    this.percentBonus = this.thisMonth.Bono > 0 ? ((this.thisMonth.Bono - this.beforeMonth.Bono) / this.thisMonth.Bono) * 100 : 0
                    this.percentMonth = this.thisMonth.Mensual > 0 ? ((this.thisMonth.Mensual - this.beforeMonth.Mensual) / this.thisMonth.Mensual) * 100 : 0
                    this.percentCommission = this.thisMonth.Comision > 0 ? ((this.thisMonth.Comision - this.beforeMonth.Comision) / this.thisMonth.Comision) * 100 : 0
                    this.percentTotalExpenses = this.totalExpenses > 0 ? ((this.totalExpenses - this.totalExpensesBefore) / this.totalExpenses) * 100 : 0
                }else{
                    this.expenses = []
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
        async chooseEmploye(value){
            if (value) {
                try {
                    const getEmploye = await axios.get(`${endPoint.endpointTarget}/employes/justonebyid/${value}`, this.configHeader)
                    this.employeSelect.id = getEmploye.data.data._id
                    this.employeSelect.name = getEmploye.data.data.firstName+' '+getEmploye.data.data.lastName
                }catch(err) {
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
            }else{
                this.employeSelect.id = ''
                this.employeSelect.name = ''
            }
        },
        async getEmployes(){
            try {
                const employes = await axios.get(endPoint.endpointTarget+'/employes/employesbybranch/'+this.branch, this.configHeader)
                if (employes.data.status == 'ok') {
                    this.employes = employes.data.data
                }else{
                    this.employes = []
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
        deleteExpense(id, type, employe, total){
            axios.put(`${endPoint.endpointTarget}/expenses/${id}`, {
                type: type,
                idEmploye: employe,
                total: total
            }, this.configHeader)
            .then(res => {
                this.$swal({
                    type: 'success',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    title: 'Se elimino con éxito',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.getBranch()
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
        registerBonusExpense(){
            const detail = `${this.registerExpense.detail} a ${this.employeSelect.name}`
            axios.post(`${endPoint.endpointTarget}/expenses/`, {
                branch: this.branch,
                detail: detail,
                employe: this.employeSelect.id,
                amount: this.registerExpense.amount,
                type: "Bono",
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    axios.put(`${endPoint.endpointTarget}/employes/registerBonus/${this.employeSelect.id}`, {
                        amount: this.registerExpense.amount
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.registerExpense.detail = ''
                            this.registerExpense.amount = 0
                            this.employeSelect.name = ''
                            this.employeSelect.id = ''
                            this.modals.modal2 = false
                            $('.selectEmploye .ant-select-selection__clear').click()
                            this.$swal({
                                icon: 'success',
                                title: 'Bono registrado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getBranch()
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
        registerMonthExpense(){
            axios.post(`${endPoint.endpointTarget}/expenses/`, {
                branch: this.branch,
                detail: this.registerExpense.detail,
                employe: 'none',
                amount: this.registerExpense.amount,
                type: "Mensual",
            }, this.configHeader)
            .then(res => {
                if (res.data.status = 'ok') {
                    this.registerExpense.detail = ''
                    this.registerExpense.amount = 0
                    this.modals.modal3 = false
                    this.$swal({
                        icon: 'success',
                        title: 'Gasto registrado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.getBranch()
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
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        openReport(){
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;
            var win = window.open(endPoint.url+'/reporteGasto?branch='+this.branch, '_blank', params)
            win.focus();
        },
        reportHistory(){
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=0,height=0,left=-1000,top=-1000`;
            var win = window.open(endPoint.url+'/reporteGastoHistorial?id='+this.dataHistoryClosedReport._id, '_blank', params)
            win.focus();
        }
    },
    mounted (){
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 280 }
        }
    }
}
</script>
<style>
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