<template>
    <div class="mx-2">
        <template v-if="dataSale != null">
            <h2>Detalle de la venta (ID: {{dataSale.uuid}}) <b v-if="!dataSale.status"># Anulada</b></h2>
        </template>
        <template v-if="dataSale != null">
            <h3>Resumen de pago</h3>
            <hr class="mt-0 mb-0">
            <div class="row">
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Fecha</b></label><br>
                    <span class="ml-1">{{dataSale.createdAt | formatDate}}</span>
                </div>
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Cliente</b></label><br>
                    <span class="ml-1">{{dataSale.client.firstName}} {{dataSale.client.lastName}}</span>
                </div>
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Correo cliente</b></label><br>
                    <span class="ml-1">{{dataSale.client.email}}</span>
                </div>
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Monto total</b></label><br>
                    <span class="ml-1">{{dataSale.totals.total | formatPrice}}</span>
                </div>
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Monto pagado</b></label><br>
                    <span class="ml-1">{{dataSale.totals.totalPay | formatPrice}}</span>
                </div>
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Vuelto</b></label><br>
                    <span class="ml-1">{{((dataSale.totals.total - dataSale.totals.totalPay) * (-1)) | formatPrice}}</span>
                </div>
            </div>
            <h3 class="mt-3">Abonos</h3>
            <hr class="mt-0 mb-0">
            <div class="row" v-for="pay of dataSale.typesPay" :key="pay.type">
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Fecha</b></label><br>
                    <span class="ml-1">{{dataSale.createdAt | formatDate}}</span>
                </div>
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Medio de pago</b></label><br>
                    <span class="ml-1">
                        {{pay.type}}
                    </span>
                </div>
                <div class="col-md-4 mt-2">
                    <label for="date" style="margin-bottom:0px;"><b>Total</b></label><br>
                    <span class="ml-1">{{pay.total | formatPrice}}</span>
                </div>
            </div>
            <!-- <hr class="mt-3 mb-1" style="height:2px;background-color:#353535;border-radius:5px;"> -->
            <hr class="mt-3 mb-1">
            <h3 class="mt-3">ítems</h3>
            <hr class="mt-1 mb-1">
            <a-table :columns="columnsReport" :loading="progress" :data-source="dataSale.items" :scroll="getScreen">
                <template slot="total-slot" slot-scope="record, column">
                    {{column.totalItem | formatPrice}}
                </template>
                <template slot="dicount-slot" slot-scope="record, column">
                    {{column.discount}} %
                </template>
                <template slot="price-slot" slot-scope="record, column">
                    {{column.price | formatPrice}}
                </template>
                <template slot="add-slot" slot-scope="record, column">
                    <template v-if="column.type == 'service'">
                        {{column.additionalsTotal | formatPrice}}
                    </template>
                    <template v-else>
                        {{column.quantityProduct}}
                    </template>
                </template>
                <template slot="type-slot" slot-scope="record, column">
                    <span v-if="column.type == 'service'">Servicio, {{column.employe.name}}</span>
                    <span v-else>Producto</span>
                </template>
            </a-table>
        </template>
    </div>
</template>
<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
export default {
    data(){
        return {
            dataSale: {},
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            id: this.$route.query.id,
            columnsReport: [
                {
                    title: 'Nombre',
                    dataIndex: 'item.name',
                    key: 'item.name',
                    width: "15%"
                },
                {
                    title: 'Tipo',
                    dataIndex: 'type',
                    key: 'type',
                    scopedSlots: { customRender: 'type-slot' },
                    width: "25%"
                },
                {
                    title: 'Precio',
                    dataIndex: 'price',
                    key: 'price',
                    scopedSlots: { customRender: 'price-slot' },
                    width: "15%"
                },
                {
                    title: 'Adicional/Cantidad',
                    dataIndex: 'additionalsTotal',
                    key: 'additionalsTotal',
                    scopedSlots: { customRender: 'add-slot' },
                    width: "20%"
                },
                {
                    title: 'Descuento',
                    dataIndex: 'discount',
                    key: 'discount',
                    width: "10%",
                    scopedSlots: { customRender: 'dicount-slot' }
                },
                {
                    title: 'Total',
                    dataIndex: 'totalItem',
                    key: 'totalItem',
                    scopedSlots: { customRender: 'total-slot' },
                    width: "15%"
                }  
            ]
        }
    },
    created(){
        this.getData()
    },
    methods: {
        async getData(){
            try {
                const sale = await axios.get(endPoint.endpointTarget+'/sales/getSale/'+this.id, this.configHeader)
                console.log(sale)
                this.dataSale = sale.data.data
                setTimeout(() => {
                    print()
                    setTimeout(() => {
                        window.close()
                    }, 200);
                }, 200);
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
    }
}
</script>