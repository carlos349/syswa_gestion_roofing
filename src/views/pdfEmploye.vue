<template>
    <div class="mx-2">
        <template>
            <center>
                <h1  class="display-2 pb-3 mb-3 hide text-center text-white">Reporte de cierre {{initDate | formatDate}}</h1> 
            </center>
            <div class="row mb-3">
                <div class="col-6 pl-9">
                    <strong>Nombre de la empleada:</strong> {{nameLender}}
                </div>
                <div class="col-6 pl-9">
                    <strong>Comisión total:</strong> {{totalComission | formatPrice}}
                </div>
                <div class="col-6 pl-9">
                    <strong>Total de adelantos:</strong> {{advancement | formatPrice}}
                </div>
                <div class="col-6 pl-9">
                    <strong>Total de bonos:</strong> {{lenderBonus | formatPrice}}
                </div>
                <div class="col-6 pl-9">
                    <strong>Total servicios:</strong> {{sales.length}}
                </div>
                <div class="col-6 pl-9">
                    <strong>Total a recibir:</strong> {{totalSales | formatPrice}}
                </div>
            </div>
            <hr class="mt-2 mb-2">
            <h1 class="text-center">Servicios realizados</h1>
            <a-config-provider :locale="es_ES">
                <template #renderEmpty>
                    <div style="text-align: center">
                        <a-icon type="warning" style="font-size: 20px" />
                        <h2>Empleado no posee ventas registradas</h2>
                    </div>
                </template>
                <a-table :columns="columns" :data-source="sales" :pagination="false">
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
                        {{column.commission | formatPrice}}
                    </template>
                    
                    <template slot="total" slot-scope="record, column">
                        {{column.total | formatPrice}}
                    </template>
                </a-table>
            </a-config-provider>

            <!-- <div class="container-fluid hide">
                <vue-bootstrap4-table :rows="lendeAdvancements" :columns="columnsLender" :classes="classes" :config="configLender" >
                    <template slot="format-total" slot-scope="props">
                        <span>{{formatPrice(props.row.total)}}</span>
                    </template>
                    <template slot="format-date" slot-scope="props">
                        <span>{{formatDate(props.row.date)}}</span>
                    </template>
                </vue-bootstrap4-table>
                <vue-bootstrap4-table :rows="lenderBonuses" :columns="columnsBonuses" :classes="classes" :config="configBonuses" >
                    <template slot="format-reason" slot-scope="props">
                        <span>{{props.row.expense.split(" / ")[0]}}</span>
                    </template>
                    <template slot="format-total" slot-scope="props">
                        <span>{{formatPrice(props.row.figure)}}</span>
                    </template>
                    <template slot="format-date" slot-scope="props">
                        <span>{{formatDate(props.row.date)}}</span>
                    </template>
                </vue-bootstrap4-table>
            </div> -->
        </template>
    </div>
</template>
<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import mixinUserToken from '../mixins/mixinUserToken'
import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinUserToken, mixinES],
    data(){
        return {
            auth: [],
            id: this.$route.query.id,
            sales: [],
            salesTotal:[],
            initDate: '',
            closeDate: '',
            lenderBonuses:[],
            code: '',
            dataDetail: [],
            nameLender: '',
            totalComission: 0,
            lenderBonus:0,
            advancement: '',
            totalSale: 0,
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
                    ellipsis: true
                },
                {
                    title: 'Servicio',
                    dataIndex: 'service',
                    key: 'service',
                    ellipsis: true
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
                    key: 'total',
                    ellipsis: true,
                    scopedSlots: { customRender: 'total' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.total - b.total
                }
            ],
            totalSales: 0
        }
    },
    created(){
        this.getData()
    },
    methods: {
        getData(){
            this.closeDate = new Date()
            axios.get(endPoint.endpointTarget+'/employes/getHistoryEmploye/'+this.id, this.configHeader)
            .then(resData => {
                this.nameLender = resData.data.data.employe.name
                this.totalComission = resData.data.data.commission
                this.lenderBonus = resData.data.data.bonus
                this.advancement = resData.data.data.advancement
                this.sales = resData.data.data.sales
                this.initDate = resData.data.data.createdAt
                this.totalSales = ((this.lenderBonus + this.totalComission) - this.advancement)
                setTimeout(() => {
                    print()
                    setTimeout(() => {
                        window.close()
                    }, 200);
                }, 200);
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
    }
}
</script>