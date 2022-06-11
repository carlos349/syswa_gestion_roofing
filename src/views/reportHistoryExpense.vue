<template>
    <div class="mx-2">
        <h1 class="text-center mt-2">Reporte de gastos mes {{dict[month]}} {{year}}</h1>
        <div class="row">
            <div class="col-4">
                <img src="img/brand/syswa-gestion.png" class="w-100 mt-2">
            </div>
            <div class="col-8 pt-3 border border-5 mb-2 row">
                <div class="col-4 p-0">
                    <p><strong>Saldo inicial:</strong> {{this.reinvestmentTotal}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Saldo final:</strong> {{this.totalFinal}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Ganancia:</strong> {{this.gain}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Ingreso:</strong> {{this.totalSales}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Egreso:</strong> {{this.totalExpenses}}</p>
                </div>
                <div class="col-12">
                    <hr class="mt-0 mb-2">
                </div>
                <div class="col-4 p-0">
                    <p><strong>Comisión:</strong> {{this.commission}}</p>
                </div>
                <div class="col-4 p-0">
                    <p><strong>Gasto mensual:</strong> {{this.monthly}}</p>
                </div>
                <div class="col-12">
                </div>
                <div class="col-4 p-0">
                    <p><strong>Bonos:</strong> {{this.bonus}}</p>
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
            month: '',
            year: '',
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
            inventoryTotal: 0,
            id: this.$route.query.id,
            columnsReport: [
                {
                    title: 'Fecha',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    width: "20%"
                },
                {
                    title: 'Descripción',
                    dataIndex: 'detaill',
                    key: 'detaill',
                    width: "40%"
                },
                {
                    title: 'Tipo',
                    dataIndex: 'typee',
                    key: 'typee',
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
            reinvestmentTotal: 0,
            totalSales: 0,
            totalExpenses: 0,
            totalFinal: 0,
            expenses: [],
            bonus: 0,
            monthly: 0,
            commission: 0
        }
    },
    created(){
        this.getHistoryData()
        this.print()
    },
    methods: {
        async getHistoryData(){
            try {
                const getHistory = await axios.get(`${endPoint.endpointTarget}/expenses/getHistoryClosesExpense/${this.id}`, this.configHeader)
                this.reinvestmentTotal = getHistory.data.data.totals.reinvestment
                this.totalSales = getHistory.data.data.totals.sales
                this.totalExpenses = getHistory.data.data.totals.expenses
                this.totalFinal = getHistory.data.data.totals.totalFinal
                this.gain = getHistory.data.data.totals.gain
                this.expenses = getHistory.data.data.expenses
                this.bonus = getHistory.data.data.totals.bonus
                this.monthly = getHistory.data.data.totals.monthly
                this.commission = getHistory.data.data.totals.commission
                this.month = new Date(getHistory.data.data.createdAt).getMonth(),
                this.year = new Date(getHistory.data.data.createdAt).getFullYear()
                for (const expense of this.expenses) {
                    if (expense.typee == 'Inventario') {
                        this.inventoryTotal = this.inventoryTotal + expense.amount
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
        print(){
            setTimeout(() => {
                print()
                setTimeout(() => {
                    window.close()
                }, 200);
            }, 200);
        }
    }
}
</script>