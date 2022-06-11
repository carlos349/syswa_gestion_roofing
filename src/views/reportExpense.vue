<template>
    <div class="mx-2">
        <h1 class="text-center mt-2">Reporte preliminar de gastos mes {{dict[month]}} {{year}}</h1>
        <div class="row">
            <div class="col-4">
                <img src="img/brand/syswa-gestion.png" class="w-100 mt-2">
            </div>
            <div class="col-8 pt-3 border border-5 mb-2 row">
                <div class="col-4 p-0">
                    <p><strong>Saldo inicial:</strong> {{this.reinvestmentTotal | formatPrice}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Saldo final:</strong> {{this.totalFinal | formatPrice}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Ganancia:</strong> {{this.gain.toFixed(1)}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Ingreso:</strong> {{this.totalSales | formatPrice}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Egreso:</strong> {{this.totalExpenses | formatPrice}}</p>
                </div>
                <div class="col-12">
                    <hr class="mt-0 mb-2">
                </div>
                <div class="col-4 p-0">
                    <p><strong>Comisión:</strong> {{this.commission | formatPrice}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Gasto mensual:</strong> {{this.monthly | formatPrice}}</p>
                </div>
                <div class="col-12">
                </div>
                <div class="col-4 p-0">
                    <p><strong>Bonos:</strong> {{this.bonus | formatPrice}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Gasto Inventario:</strong> {{this.inventoryTotal | formatPrice}}</p>
                </div>
            </div>
        </div>
        <a-config-provider :locale="es_ES">
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2>Sin gastos registrados en el mes</h2>
                </div>
            </template>
            <a-table :columns="columnsReport" :data-source="expenses" :pagination="false">
                <template slot="amount-slot" slot-scope="record, column">
                    {{column.amount | formatPrice}}
                </template>
                <template slot="date-slot" slot-scope="record, column">
                    {{column.createdAt | formatDate}}
                </template>
            </a-table>
        </a-config-provider>
    </div>
</template>
<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinES],
    data(){
        return {
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            dict: {
                0: 'Enero',
                1: 'Febrero',
                2: 'Marzo',
                3: 'Abril',
                4: 'Mayp',
                5: 'Junio',
                6: 'Julio',
                7: 'Agosto',
                8: 'Septiembre',
                9: 'Octubre',
                10: 'Noviembre',
                11: 'Diciembre'
            },
            branch: this.$route.query.branch,
            columnsReport: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    scopedSlots: { customRender: 'date-slot' },
                    width: "20%"
                },
                {
                    title: 'Descripción',
                    dataIndex: 'detail',
                    key: 'detail',
                    width: "40%"
                },
                {
                    title: 'Tipo',
                    dataIndex: 'type',
                    key: 'type',
                    width: "20%"
                },
                {
                    title: 'Total',
                    dataIndex: 'amount',
                    key: 'amount',
                    scopedSlots: { customRender: 'amount-slot' },
                    width: "20%"
                } 
            ],
            commission: 0,
            monthly: 0,
            bonus: 0,
            inventoryTotal: 0,
            reinvestmentTotal: 0,
            totalSales: 0,
            totalExpenses: 0,
            totalFinal: 0,
            expenses: []
        }
    },
    created(){
        this.getExpenseData()
        this.getReinvestment()
        this.getTotalSales()
        this.getTotal()
        this.print()
    },
    methods: {
        async getExpenseData(){
            try {
                const expenses = await axios.get(`${endPoint.endpointTarget}/expenses/${this.branch}`, this.configHeader)
                this.expenses = expenses.data.data.expenses
                this.totalExpenses = expenses.data.data.expenseTotals.Inventario + expenses.data.data.expenseTotals.Bono + expenses.data.data.expenseTotals.Mensual + expenses.data.data.expenseTotals.Comision
                this.commission = expenses.data.data.expenseTotals.Comision
                this.monthly = expenses.data.data.expenseTotals.Mensual
                this.bonus = expenses.data.data.expenseTotals.Bono
                this.inventoryTotal = expenses.data.data.expenseTotals.Inventario
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
        async getReinvestment(){
            try {
                const reinvestment = await axios.get(`${endPoint.endpointTarget}/expenses/findReinvestment/${this.branch}`, this.configHeader)
                if (reinvestment.data.status == 'ok') {
                    this.reinvestmentTotal = reinvestment.data.data.amount
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
        getTotal(){
            setTimeout(() => {
                this.totalFinal = (this.reinvestmentTotal + this.totalSales) - this.totalExpenses
                this.gain = ((this.totalFinal - this.reinvestmentTotal) / this.totalFinal) * 100
            }, 200);
        },
        print(){
            setTimeout(() => {
                print()
                setTimeout(() => {
                    window.close()
                }, 200);
            }, 500);
        }
    }
}
</script>