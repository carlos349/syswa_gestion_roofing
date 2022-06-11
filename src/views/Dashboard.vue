<template>
    <div>
        <base-header class="header pb-5 pt-2 pt-lg-4 d-flex align-items-center"
            style="min-height: 100px; background-image: url(img/theme/metrics.png); background-size: cover; background-position: center 36%;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Card stats -->
            <div class="row">
              <div class="col-12 py-5">
                <div class="text-absolute" style="top:10%;">
                  <p class="mb-0 mt-4 display-2 text-white">Reportes</p>
                  <p class="text-white hideText">Sección dedicada a reportes y gráficos que permiten visualizar los indicadores de tu negocio.</p>
                </div>
              </div>
            </div>
        </base-header>
        <!--Charts-->
        <template v-if="validRoute('reportes', 'filtrar')"> 
          <card 
            class="mt-2"
            shadow>
            <template slot="header">
              <div class="row">
                <div class="col-10 mt-1 row">
                  <div class="col-md-4 mt-1">
                    <a-select default-value="Producción anual" class="w-100" @change="selectTypeAnual">
                      <a-select-option value="anualProduction">
                        Producción anual
                      </a-select-option>
                      <a-select-option value="anualServices">
                        Servicios anuales
                      </a-select-option>
                      <a-select-option value="dataExpense">
                        Gastos vs Ganancias anuales
                      </a-select-option>
                      <a-select-option value="dataEmploye">
                        Detalle de empleado
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-show="serviceChart" class="col-md-4 mt-1">
                    <a-select v-if="services[0]" :default-value="services[0].name" class="w-100" @change="selectService">
                      <a-select-option v-for="service of services" :key="service._id" :value="service._id">
                        {{service.name}}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-show="employeChart" class="col-md-4 mt-1">
                    <a-select v-if="employes[0]" :default-value="employes[0].firstName+' '+employes[0].lastName" class="w-100" @change="selectEmploye">
                      <a-select-option v-for="employe of employes" :key="employe._id" :value="employe._id">
                        {{employe.firstName}} {{employe.lastName}}
                      </a-select-option>
                    </a-select>
                  </div>
                </div>
                <div class="col-2 mt-2">
                  <base-button :disabled="validRoute('reportes', 'filtrar') ? false : true" @click="filterAnualGraph" size="sm" type="default">
                      <a-icon type="filter" style="vertical-align:1px;font-size:1.6em;" />
                  </base-button>
                </div>
              </div>
            </template>
            <template>
              <div class="row mt-2">
                <div class="col-md-12">
                  <a-spin :spinning="loadingChartAnual">
                    <apexchart class="borderClass" ref="chartApisAnual" :height="350" :options="chartOptionsAnual" :series="graphDataAnual"></apexchart>
                  </a-spin>
                </div>
              </div>
            </template>
          </card>
          <card 
            class="mt-2"
            shadow>
            <template slot="header">
              <div class="row">
                <div class="col-10 mt-1 row">
                  <div class="col-md-6 mt-1">
                    <a-range-picker
                      :ranges="{ Today: [moment(), moment()], 'Este mes': [moment(), moment().endOf('month')] }"
                      :default-value="[moment(dateFormat), moment().endOf('month')]"
                      format="MM-DD-YYYY"
                      @change="selectDate"
                      class="w-100"
                    />
                  </div>
                  <div class="col-md-6 mt-1">
                    <a-select default-value="Producción total" class="w-100" @change="selectType">
                      <a-select-option value="totalSales">
                        Producción total
                      </a-select-option>
                      <a-select-option value="totalServices">
                        Servicios totales
                      </a-select-option>
                      <a-select-option value="totalByEmploye">
                        Producción por empleado
                      </a-select-option>
                      <a-select-option value="commissionsByEmploye">
                        Comisión por empleado
                      </a-select-option>
                      <a-select-option value="servicesByEmploye">
                        Servicios por empleado
                      </a-select-option>
                      <a-select-option value="diaryTotals">
                        Totales diarios
                      </a-select-option>
                      <a-select-option value="diaryPromedies">
                        Promedios diarios
                      </a-select-option>
                      <a-select-option value="totalExpenses">
                        Gastos totales
                      </a-select-option>
                      <a-select-option value="totalsTypesPays">
                        Tipos de pago
                      </a-select-option>
                      <a-select-option value="totalPerService">
                        Total por servicios
                      </a-select-option>
                      <a-select-option value="totalPerProducts">
                        Total por productos
                      </a-select-option>
                    </a-select>
                  </div>
                </div>
                <div class="col-2 mt-2">
                  <base-button class="forBug" :disabled="validRoute('reportes', 'filtrar') ? false : true" @click="filterGraph" size="sm" type="default">
                      <a-icon type="filter" style="vertical-align:1px;font-size:1.6em;" />
                  </base-button>
                </div>
              </div>
            </template>
            <template>
              <div class="row mt-2">
                <div class="col-md-8">
                  <a-spin :spinning="loadingChart">
                    <apexchart v-show="change" class="borderClass" ref="chartApis" :height="350" :options="chartOptions" :series="graphData"></apexchart>

                    <apexchart v-show="noChange" class="borderClass" ref="chartApisDaily" :height="350" :options="chartDaily" :series="graphDataDaily"></apexchart>

                    <apexchart v-show="noChangeTwo" class="borderClass" ref="chartApisService" :height="350" :options="chartService" :series="graphDataService"></apexchart>
                  </a-spin>
                </div>
                <div class="col-md-4">
                  <stats-card title="Promedios"
                      type="gradient-orange"
                      sub-title="Ventas y servicios"
                      icon="ni ni-atom"
                      class="mt-1">
                      <template slot="footer">
                          <p style="line-height: 2.2;">
                            Promedio ventas <strong>{{promedySales | formatPrice}}</strong><br>
                            Promedio servicios <strong>{{promedyServices.toFixed(2)}}</strong><br>
                            <a-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>Debe indicar la cantidad de días laborales del mes en curso, para calcular la proyección de venta total a final de mes</span>
                                </template>
                                <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                            </a-tooltip>
                            Proyección de ventas 
                            <a-input style="width: 15%" @keyup="calculatedProjection" type="number" placeholder="Días" v-model="projection"/>
                            <strong> {{salesProjection | formatPrice}}</strong><br>
                            <a-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>Debe indicar la cantidad de días laborales del mes en curso, para calcular la proyección de servicios totales a final de mes</span>
                                </template>
                                <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                            </a-tooltip>
                            Proyección de servicios
                            <a-input style="width: 15%" @keyup="calculatedProjection" type="number" placeholder="Días" v-model="projection"/>
                            <strong> {{serviceProjection.toFixed(2)}}</strong><br>
                            <a-tooltip placement="topLeft">
                                <template slot="title">
                                    <span>Gastos totales del mes</span>
                                </template>
                                <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                            </a-tooltip>
                            Total de gastos <strong> {{expenseTotal | formatPrice}}</strong>
                            
                          </p>
                      </template>
                  </stats-card>
                </div>
              </div>
            </template>
          </card>
        </template>
        <template v-else>

        </template> 
    </div>
</template>
<script>
  //Back - End 
  import axios from 'axios'
  import endPoint from '../../config-endpoint/endpoint.js'
  import router from '../router'
  import jwtDecode from 'jwt-decode'
  import moment from 'moment';
  // Charts
  import * as chartConfigs from '@/components/Charts/config';
  import LineChart from '@/components/Charts/LineChart';
  import BarChart from '@/components/Charts/BarChart';
  // Tables
  import SocialTrafficTable from './Dashboard/SocialTrafficTable';
  import PageVisitsTable from './Dashboard/PageVisitsTable';
  //components
  import flatPicker from "vue-flatpickr-component";
  import "flatpickr/dist/flatpickr.css";
  import {Spanish} from 'flatpickr/dist/l10n/es.js';
  import vueCustomScrollbar from 'vue-custom-scrollbar'
  import mixinUserToken from '../mixins/mixinUserToken'
  import XLSX from 'xlsx'
  export default {
    mixins: [mixinUserToken],
    components: {
      LineChart,
      BarChart,
      PageVisitsTable,
      SocialTrafficTable,
      flatPicker,
      vueCustomScrollbar
    },
    data() {
      return {
        configHeader: {
          headers:{
            "x-database-connect": endPoint.database,
            "x-access-token": localStorage.userToken
          }
        },
        dateFormat: (new Date().getMonth()+1)+'-01-'+new Date().getFullYear(),
        moment: moment,
        dateFilter: [
          [(new Date().getMonth()+1)+'-01-'+new Date().getFullYear()],
          [(new Date().getMonth()+1)+'-31-'+new Date().getFullYear()]
        ],
        auth: [],
        lenderId: '',
        branchName: '',
        branch: '',
        thisMonth: {
          totalSale: 0,
          totalItems: 0
        },
        loadingChart: true,
        loadingChartAnual: true,
        chartOptionsAnual: {
          chart: {
            type: 'bar',
            height: 350
          },
          
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (value) {
              let val = (value/1).toFixed(2).replace('.', ',')
              return value > 600 ? '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : value
            },
            offsetY: -20,
            style: {
              fontSize: '12px',
              colors: ["#304758"],
              rotate: 180
            }
          },
          title: {
            text: "Gráfica anual",
            align: 'left'
          },
          grid: {
            row: {
              colors: ['#f7fafc', '#f5f5f5'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          xaxis: {
            type: "category",
            categories: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
          },
          tooltip: {
            x: {
              type:'datetime',
              format: 'dd MMM yyyy'
            },
            y: [
              {
                title: {
                  formatter: function (val) {
                    return val+' $'
                  }
                }
              }
            ]
          },
          theme: {
            mode: 'light', 
            palette: 'palette1', 
            monochrome: {
              enabled: false,
              color: '#172b4d',
              shadeTo: 'light',
              shadeIntensity: 0.65
            },
          },
        },
        chartOptions: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: {
                position: 'top', // top, center, bottom
              },
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (value) {
              let val = (value/1).toFixed(2).replace('.', ',')
              return value > 600 ? '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : value
            },
            offsetY: -25,
            style: {
              fontSize: '12px',
              colors: ["#304758"],
              rotate: 180
            }
          },
          title: {
            text: "Gráfica por día",
            align: 'left'
          },
          grid: {
            row: {
              colors: ['#f7fafc', '#f5f5f5'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          xaxis: {
            type: 'datetime'
          }
        },
        prevMonth: {
          totalSale: 0,
          totalItems: 0
        },
        percentTotalSale: 0,
        percentTotalItems: 0,
        paysData: [],
        promedySales: 0,
        totalSale: 0,
        totalServices: 0,
        promedyServices: 0,
        projection: {
          sales: '',
          service: ''
        },
        graphData: [],
        graphDataAnual: [],
        graphType: 'totalSales',
        change: true,
        noChange: false,
        noChangeTwo: false,
        // chartService: {
        //   chart: {
        //     width: "100%",
        //     type: 'pie',
        //   },
        //   labels: [],
        //   legend: {
        //     position: 'right',
        //     offsetY: 0,
        //     height: 230,
        //   },
        //   responsive: [{
        //     breakpoint: 480,
        //     options: {
        //       chart: {
        //         width: 200
        //       },
        //       legend: {
        //         position: 'bottom'
        //       }
        //     }
        //   }]
        // },
        graphDataService: [],
        chartDaily: {
          chart: {
            height: 350,
            type: 'area',
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function (value) {
              let val = (value/1).toFixed(2).replace('.', ',')
              return value > 600 ? '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : value
            },
            offsetY: -20,
            style: {
              fontSize: '12px',
              fontWeight: '300',
              colors: ["#304758"]
            }
          },
          theme: {
              mode: 'light', 
              palette: 'palette1', 
              monochrome: {
                enabled: false,
                color: '#255aee',
                shadeTo: 'light',
                shadeIntensity: 0.65
              },
          },
          stroke: {
            curve: 'smooth'
          },
          title: {
            text: 'Producción diaria',
            align: 'left'
          },
          grid: {
            row: {
              colors: ['#FFFAE2', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          xaxis: {
            type: "category",
            categories: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
          }
        },
        graphDataDaily: [],
        serviceChart: false,
        employeChart: false,
        services: [],
        serviceSelect: '',
        employes: [],
        employeSelect: '',
        thisClick: true,
        workDays: 0,
        salesProjection: 0,
        serviceProjection: 0,
        expenseTotal: 0,
        projection: 0,
        projectioId: ''
      };
    },
    created(){
      this.getToken()
      this.getBranch()
    },
    methods: {
      getToken(){
        const token = localStorage.userToken
        const decoded = jwtDecode(token) 
        this.lenderId = decoded.linkLender
        this.auth = decoded.access
      },
      getBranch(){
        this.branchName = localStorage.branchName  
        this.branch = localStorage.branch
        this.getSales()
        this.getItems()
        // this.getPayData()
        this.getDataSale()
        this.getDataService()
        // this.getDailyGraph()
        this.getChartAnual()
        this.getServices()
        this.getEmployes()
        this.getDataDays()
        this.getExpenseTotal()
        $('#second').css({'display': 'none'})
        this.getPorjection()
        
        // document.getElementById("second").style.display = "none";
      },
      selectDate(dates, dateString){
        this.dateFilter = dateString
        console.log(this.dateFilter)
      },
      calculatedProjection(){
        if (this.projection > 0) {
          console.log(this.totalSale, this.workDays, this.projection)
          this.salesProjection = (this.totalSale / this.workDays) * (parseInt(this.projection))
          this.serviceProjection = (this.totalServices / this.workDays ) * (parseInt(this.projection))
          setTimeout(() => {
            this.updateProjection()
          }, 500);
        }
      },
      async updateProjection(){
        try {
          const projection = await axios.put(endPoint.endpointTarget+'/metrics/updateProjection/'+this.projectioId, {
            days: this.projection
          }, this.configHeader)
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
      async getPorjection(){
        try {
          const projection = await axios.get(endPoint.endpointTarget+'/metrics/getProjection/'+this.branch, this.configHeader)
          this.projection = projection.data.data.days
          this.projectioId = projection.data.data._id
          if (projection.data.status == 'ok') {
            this.calculatedProjection()
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
      async getExpenseTotal(){
        this.serviceState = true
        try {
          const expenses = await axios.get(endPoint.endpointTarget+'/metrics/getExpensesTotal/'+this.branch, this.configHeader)
          this.expenseTotal = expenses.data.total
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
      async getServices(){
        this.serviceState = true
        try {
          const services = await axios.get(endPoint.endpointTarget+'/services/'+this.branch, this.configHeader)
          if (services.data.status == 'ok') {
              this.services = services.data.data
              this.serviceSelect = this.services[0]._id
          }else{
              this.services = []
              this.serviceSelect = ''
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
        try{
          const getByBranch = await axios.get(endPoint.endpointTarget+'/employes/employesbybranch/'+this.branch, this.configHeader)
          if (getByBranch.data.data.length > 0) {
            this.employes = getByBranch.data.data
            this.employeSelect = this.employes[0]._id
          }else{
            this.employes = []
            this.employeSelect = ''
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
      selectType(value){
        this.graphType = value
      },
      selectService(value){
        this.serviceSelect = value 
      },
      selectEmploye(value){
        this.employeSelect = value
      },
      selectTypeAnual(value){
        this.graphAnualType = value
        if (value == "anualServices") {
          this.serviceChart = true
          this.employeChart = false
        }else if (value == "dataEmploye") {
          this.employeChart = true
          this.serviceChart = false
        }else{
          this.serviceChart = false
          this.employeChart = false
        }
      },
      async getDailyGraph(){
        try {
          const getSales = await axios.post(`${endPoint.endpointTarget}/metrics/diaryPromedies`, {
            branch: this.branch,
            dates: this.dateFilter
          }, this.configHeader)
          this.graphDataDaily = getSales.data.series
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
      async getChartAnual(){
        try {
          const getSales = await axios.post(`${endPoint.endpointTarget}/metrics/anualProduction`, {
            branch: this.branch
          }, this.configHeader)
          this.graphDataAnual = getSales.data.series
          this.loadingChartAnual = false
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
      async filterAnualGraph(){
        this.loadingChartAnual = true
        try {
          const getData = await axios.post(`${endPoint.endpointTarget}/metrics/${this.graphAnualType}`, {
            branch: this.branch,
            id: this.graphAnualType == "anualServices" ? this.serviceSelect : this.employeSelect
          }, this.configHeader)
          this.graphDataAnual = getData.data.series
          this.chartOptionsAnual = {
            chart: {
              height: 350,
              type: 'bar',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: true,
              formatter: function (value) {
                let val = (value/1).toFixed(2).replace('.', ',')
                return value > 600 ? '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : value
              },
              offsetY: -20,
              style: {
                fontSize: '12px',
                fontWeight: '300',
                colors: ["#304758"]
              }
            },
            theme: {
              mode: 'light', 
              palette: 'palette1', 
              monochrome: {
                enabled: false,
                color: '#255aee',
                shadeTo: 'light',
                shadeIntensity: 0.65
              },
            },
            title: {
              text: 'Gastos totales',
              align: 'left'
            },
            grid: {
              row: {
                colors: ['#FFFAE2', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            xaxis: {
              type: "category",
              categories: getData.data.categories
            }
          }
          this.$refs.chartApisAnual.updateOptions(this.chartOptionsAnual, false, true, true)
          this.loadingChartAnual = false
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
      async filterGraph(){
        if (this.graphType == "totalPerService" || this.graphType == "totalPerProducts") {
          this.loadingChart = true
          this.change = false
          this.noChange = false
          
          try{
            const getSales = await axios.post(`${endPoint.endpointTarget}/metrics/${this.graphType}`, {
              branch: this.branch,
              dates: this.dateFilter
            }, this.configHeader)
            setTimeout(() => {
              if (this.thisClick) {
                $('.forBug').click()
                this.thisClick = false
              }
            }, 200);
            this.graphDataService = getSales.data.series
            this.chartService = {
              chart: {
                type: 'donut',
                width: '100%'
              },
              type: "donut",
              labels: getSales.data.labels,
              legend: {
                position: 'right',
                offsetY: 0,
                height: 230,
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            }
            this.$refs.chartApisService.updateOptions(this.chartService, true, false, false)
            this.noChangeTwo = true
            
            this.loadingChart = false
          }catch(err){
            if (err.response.status == 401) {
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
        }else if (this.graphType == "diaryPromedies" || this.graphType == "diaryTotals" || this.graphType == "totalExpenses" || this.graphType == "commissionsByEmploye" || this.graphType == "servicesByEmploye" || this.graphType == "totalByEmploye" || this.graphType == "totalsTypesPays") {
          this.loadingChart = true
          this.change = false
          this.noChangeTwo = false
          this.noChange = true
          this.thisClick = true
          try {
            const getSales = await axios.post(`${endPoint.endpointTarget}/metrics/${this.graphType}`, {
              branch: this.branch,
              dates: this.dateFilter
            }, this.configHeader)
            this.graphDataDaily = getSales.data.series
            this.chartDaily = {
              chart: {
                height: 350,
                type: 'bar',
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: true,
                formatter: function (value) {
                  let val = (value/1).toFixed(2).replace('.', ',')
                  return value > 600 ? '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : value
                },
                offsetY: -20,
                style: {
                  fontSize: '12px',
                  fontWeight: '300',
                  colors: ["#304758"]
                }
              },
              theme: {
                mode: 'light', 
                palette: 'palette1', 
                monochrome: {
                  enabled: false,
                  color: '#255aee',
                  shadeTo: 'light',
                  shadeIntensity: 0.65
                },
              },
              title: {
                text: 'Gráficas por categorias',
                align: 'left'
              },
              grid: {
                row: {
                  colors: ['#FFFAE2', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              xaxis: {
                type: "category",
                categories: getSales.data.categories
              }
            }
            this.$refs.chartApisDaily.updateOptions(this.chartDaily, false, true, true)
            this.loadingChart = false
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
          this.loadingChart = true
          this.noChange = false
          this.noChangeTwo = false
          this.change = true
          this.thisClick = true
          try {
            const getSales = await axios.post(`${endPoint.endpointTarget}/metrics/${this.graphType}`, {
              branch: this.branch,
              dates: this.dateFilter
            }, this.configHeader)
            console.log(getSales)
            this.graphData = getSales.data.series
            this.loadingChart = false
            // this.$refs.chartApis.updateOptions(this.chartOptions, false, true)
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
      },
      async getDataSale(){
        try {
          const getSales = await axios.post(`${endPoint.endpointTarget}/metrics/totalSales`, {
            branch: this.branch,
            dates: this.dateFilter
          }, this.configHeader)
          this.totalSale = getSales.data.total
          this.graphData = getSales.data.series
          this.loadingChart = false
          // this.$refs.chartApis.updateOptions(this.chartOptions, false, true)
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
      async getDataDays(){
        try {
          const getDays = await axios.get(`${endPoint.endpointTarget}/metrics/getDays/${this.branch}`, this.configHeader)
          this.promedySales = this.totalSale == 0 || getDays.data.quantity == 0 ? 0 : this.totalSale / getDays.data.quantity
          this.promedyServices = this.totalServices == 0 || getDays.data.quantity == 0 ? 0 : this.totalServices / getDays.data.quantity
          this.workDays = getDays.data.quantity > 0 ? getDays.data.quantity : 1
          // this.$refs.chartApis.updateOptions(this.chartOptions, false, true)
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
      async getDataService(){
        try {
          const getServices = await axios.post(`${endPoint.endpointTarget}/metrics/totalServices`, {
            branch: this.branch,
            dates: this.dateFilter
          }, this.configHeader)
          this.totalServices = getServices.data.total
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
      async getSales(){
        try {
          const getSalesTotals = await axios.get(`${endPoint.endpointTarget}/metrics/compareSales/${this.branch}`, this.configHeader)
          this.thisMonth.totalSale = getSalesTotals.data.data.thisMonth
          this.prevMonth.totalSale = getSalesTotals.data.data.prevMonth
          this.percentTotalSale = this.thisMonth.totalSale > 0 ? ((this.thisMonth.totalSale - this.prevMonth.totalSale) / this.thisMonth.totalSale) * 100 : 0
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
      async getItems(){
        try {
          const getSalesTotals = await axios.get(`${endPoint.endpointTarget}/metrics/compareItems/${this.branch}`, this.configHeader)
          this.thisMonth.totalItems = getSalesTotals.data.data.thisMonth
          this.prevMonth.totalItems = getSalesTotals.data.data.prevMonth
          this.percentTotalItems = this.thisMonth.totalItems > 0 ? ((this.thisMonth.totalItems - this.prevMonth.totalItems) / this.thisMonth.totalItems) * 100 : 0
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
      async getPayData(){
        try{
          const getPayData = await axios.get(`${endPoint.endpointTarget}/metrics/totalsTypesPays/${this.branch}`, this.configHeader)
          this.paysData = getPayData.data.data
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
    }
  };
</script>
<style>
.borderClass div svg{
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
.apexcharts-toolbar div svg{
  box-shadow: none;
}
</style>
