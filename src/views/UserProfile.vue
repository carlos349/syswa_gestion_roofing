<template>
    <div>
        <base-header class="header pb-5 pt-2  d-flex align-items-center"
                     style="min-height: 300px; background-image: url(img/theme/profile.png); background-size: cover; background-position: center 25%;">
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-7"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">Hola {{model.first_name}}</h1>
                        <p class="text-white mt-0 mb-2 hideText">Este es tu perfil, puedes ver tu progreso trabajando para KKPrettyNails, en las diferentes secciones. Tambien puedes editar tus datos.</p>
                        <base-button size="sm" class="mb-2" type="info" v-on:click="inspector = true">Editar perfil</base-button>
                        <base-button size="sm" class="mb-2" type="info" v-on:click="modals.modal2 = true">Cambiar contraseña</base-button>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--6">
            <div class="row">
                <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">
                    <div class="card card-profile shadow">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image responsiveImageProfile">
                                    <a href="#">
                                        <img style="width:150px; height:150px;" v-if="haveImage == ''" src="img/theme/profile-default.png" class="rounded-circle">
                                        <img style="width:150px; height:150px;" v-else :src="model.image" class="rounded-circle">
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="card-body pt-0 pt-md-4 responsiveName">
                            <div class="row mt-2">
                                <div class="col">
                                    <div class="card-profile-stats d-flex justify-content-center mt-md-5">
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <h3>
                                    {{model.first_name}} {{model.last_name}}
                                </h3>
                                <div class="h5">
                                    <p>{{model.status}}</p>
                                </div>
                            </div>
                            <hr class="my-4" />
                            <p>{{model.email}} <template v-if="model.about != ''">—</template> {{model.about}}</p>
                        </div>
                    </div>
                    <!-- <card v-if="model.linkLender != ''" class="mt-3" shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">Datos del mes</h3>
                                </div>
                            </div>
                        </div>
                        <div class="card-profile-stats d-flex justify-content-center">
                            <div>
                                <span class="heading">{{formatPrice(advancement)}}</span>
                                <span class="description">Adelantos</span>
                            </div>
                            <div>
                                <span class="heading">{{formatPrice(lenderBonus)}}</span>
                                <span class="description">Bonos</span>
                            </div>
                            <div>
                                <span class="heading">{{formatPrice(comision)}}</span>
                                <span class="description">Ingresos</span>
                            </div>
                        </div>
                        <div class="card-profile-stats d-flex justify-content-center" style="padding: 0.18rem;">
                            <div>
                                <span class="heading">{{formatPrice(totalForLender)}}</span>
                                <span class="description">Ingreso total</span>
                            </div>
                        </div>
                    </card> -->
                </div>

                <div class="col-xl-8">
                    <card shadow type="secondary" body-classes="p-0">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-md-2 col-6">
                                    <h3 class="mb-0 text-info" style="cursor:pointer;" :style="selectType == 'Profile' ? 'text-decoration: underline;' : 'text-decoration:none;'" @click="selectMenu('Profile')">Mi perfil</h3>
                                </div>
                                <!-- <div class="col-md-8 col-6" v-if="model.linkLender != ''">
                                    <h3 class="mb-0 text-info" style="cursor:pointer;" :style="selectType == 'Sales' ? 'text-decoration: underline;' : 'text-decoration:none;'" @click="selectMenu('Sales')">Servicios</h3>
                                </div> -->
                            </div>
                        </div>
                        <template v-if="selectType == 'Profile'">
                            <div class="p-2">
                                <form @submit.prevent>
                                    <h6 class="heading-small text-muted mb-4 mt-1">Información de usuario</h6>
                                    <div class="pl-lg-4">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <base-input v-if="inspector"
                                                    alternative=""
                                                    label="Nombre"
                                                    placeholder="Username"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.first_name"
                                                />
                                                <base-input v-else
                                                    disabled alternative=""
                                                    label="Nombre"
                                                    placeholder="Username"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.first_name"
                                                />
                                            </div>
                                            <div class="col-lg-6">
                                                <base-input v-if="inspector"
                                                    alternative=""
                                                    label="Apellido"
                                                    placeholder="jesse@example.com"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.last_name"
                                                />
                                                <base-input v-else
                                                    disabled alternative=""
                                                    label="Apellido"
                                                    placeholder="jesse@example.com"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.last_name"
                                                />
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <base-input v-if="inspector"
                                                    alternative=""
                                                    label="Correo"
                                                    placeholder="First name"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.email"
                                                />
                                                <base-input v-else
                                                    disabled alternative=""
                                                    label="Correo"
                                                    placeholder="Last name"
                                                    input-classes="form-control-alternative"
                                                    v-model="model.email"
                                                />
                                            </div>
                                            <div class="col-lg-6 form-group">
                                                <label><strong>Imagen de perfil</strong></label>
                                                <input v-if="inspector" type="file" id="fileProfile" ref="file" v-on:change="handleFileUpload()" class="form-control mb-3" >
                                                <input v-else type="file" id="fileProfile" ref="file" disabled class="form-control mb-3" >
                                            </div>
                                        </div>
                                    </div>
                                    <hr class="my-4" />
                                    <!-- Description -->
                                    <h6 class="heading-small text-muted mb-2">Sobre ti</h6>
                                    <div class="pl-lg-4">
                                        <div class="form-group">
                                            <base-input alternative="" label="Sobre mi - proximamente">
                                                <textarea v-if="inspector" v-model="model.about" rows="4" class="form-control form-control-alternative" placeholder="Unas palabras sobre ti..."></textarea>
                                                <textarea v-else disabled v-model="model.about" rows="4" class="form-control form-control-alternative" placeholder="Unas palabras sobre ti..."></textarea>
                                            </base-input>
                                        </div>
                                    </div>
                                    <base-button class="float-right" v-if="inspector" type="info" v-on:click="editProfile">Editar</base-button>
                                    <base-button class="float-left" v-if="inspector" type="danger" v-on:click="inspector = false">Cancelar</base-button>
                                </form>
                            </div>
                        </template>
                        <!-- <template v-else>
                            <a-config-provider :locale="es_ES">
                                <template #renderEmpty>
                                    <div style="text-align: center">
                                        <a-icon type="warning" style="font-size: 20px" />
                                        <h2>No posee ventas registradas</h2>
                                    </div>
                                </template>
                                <a-table :columns="columns" :data-source="sales" :scroll="getScreen">
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
                                            <a-tooltip placement="top">
                                                <template slot="title">
                                                    <span>Anular venta</span>
                                                </template>
                                                <base-button size="sm" type="danger" v-on:click="nullSale(column.saleData._id, column.id)">
                                                    <a-icon type="stop" style="vertical-align:1.5px;font-size:1.3em;" />
                                                </base-button>
                                            </a-tooltip>
                                        </template>
                                    </template>
                                </a-table>
                            </a-config-provider>
                        </template> -->
                    </card>
                </div>
            </div>
        </div>
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
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h3>Cambie su contraseña</h3>
                    </div>
                </template>
                <template>
                    <form role="form">
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Antigua contraseña"
                                    v-on:change="validRegister()"
                                    v-model="pass.lastPass"
                                    type="password"
                                    addon-left-icon="ni ni-key-25">
                        </base-input>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Nuevo contraseña"
                                    v-model="pass.newPass"
                                    type="password"
                                    addon-left-icon="ni ni-key-25">
                        </base-input>
                        <base-input alternative
                                    class="mb-3"
                                    placeholder="Repita la contraseña"
                                    v-model="pass.newPassVerify"
                                    :valid="pass.valid"
                                    type="password"
                                    v-on:keyup="validFields"                                    
                                    >
                        </base-input>
                        <base-button v-if="!pass.validAll" type="default" disabled>
                            Cambiar
                        </base-button>  
                        <base-button v-else type="default" v-on:click="EditPass">
                            Cambiar
                        </base-button> 
                    </form>
            </template>
            </card>
        </modal>
    </div>
</template>
<script>
    import axios from 'axios'
    import router from '../router'
    import endPoint from '../../config-endpoint/endpoint.js'
    import jwtDecode from 'jwt-decode'

    import EventBus from '../components/EventBus'
    import VueBootstrap4Table from 'vue-bootstrap4-table'
    import * as moment from 'moment';
    import 'moment/locale/es';
    moment.locale('es');
    import mixinUserToken from '../mixins/mixinUserToken'
    import mixinES from '../mixins/mixinES'
    export default {
        mixins: [mixinUserToken, mixinES],
        name: 'user-profile',
        components: {
            VueBootstrap4Table
        },
        data() {
            const token = localStorage.userToken
			const decoded = jwtDecode(token)
            return {
                id: decoded._id,
                selectType: 'Profile',
                model: {
                    first_name: '',
                    last_name: '',
                    email: '',
                    access: '',
                    image: '',
                    about: ''
                },
                modals: {
                    modal1: false,
                    modal2: false,
                    message: "",
                    icon: '',
                    type:''
                },
                inspector: false,
                monthLender: 0,
                gainLender: 0,
                file: '',
                pass: {
                    newPass: '',
                    lastPass: '',
                    newPassVerify: '',
                    valid: null,
                    validAll: null
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
                haveImage: '',
                lenderBonus: 0,
                advancement: 0,
                totalForLender: 0,
                sales: [],
                comision: 0,
                fecha: '',
                configHeader: {
                    headers:{
                        "x-database-connect": endPoint.database, 
                        "x-access-token": localStorage.userToken
                    }
                },
            }
        },
        created(){
            this.getData()
            this.getYourSales()
            this.getDataLender()
        },
        methods: {
            validFields(){
                this.pass.valid = this.pass.newPass == this.pass.newPassVerify ? true : false
                this.validRegister()
            },
            validRegister(){
                this.pass.validAll = this.pass.lastPass && this.pass.valid == true ? true : false
            },
            selectMenu(type){
                this.selectType = type
            },
            async getData() {
				try{
					const user = await axios.get(endPoint.endpointTarget+'/users/'+this.id, this.configHeader)
					this.model.first_name = user.data.data.first_name
					this.model.last_name = user.data.data.last_name
					this.model.email = user.data.data.email
					this.model.status = user.data.data.status
                    this.model.access = user.data.data.LastAccess
                    this.model.about = user.data.data.about
					this.model.image = user.data.data.userImage
                    this.model.linkLender = user.data.data.linkLender
                    this.haveImage = user.data.data.userImage
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
				
            },
            async EditPass(){
				if (this.pass.newPassVerify == this.pass.newPass) {
					try{
						const pass = await axios.put(endPoint.endpointTarget+'/users/changePass/'+this.id, {
							newPass:this.pass.newPass,
							lastPass: this.pass.lastPass
						}, this.configHeader)
						if (pass.data.status == 'ok') {
							this.$swal({
                                type: 'success',
                                title: 'Contraseña editada con éxito.',
                                showConfirmButton: false,
                                timer: 1500
                            })
							this.pass.newPass = ''
							this.pass.lastPass = ''
                            this.pass.newPassVerify = ''
                            this.modals.modal2 = false
                            this.inspector = false
						}else{
							this.$swal({
                                type: 'error',
                                title: 'Contraseña incorrecta.',
                                showConfirmButton: false,
                                timer: 1500
                            })
							this.pass.newPass = ''
							this.pass.lastPass = ''
                            this.pass.newPassVerify = ''
                            
						}
					}catch(err)  {
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
                        title: 'Las contraseñas deben conincidir',
                        showConfirmButton: false,
                        timer: 2500
                    })
				}
				
			},
            async getYourSales(){
				const ident = localStorage.userToken
				const decoded = jwtDecode(ident)
				const link = decoded.linkLender
                this.link = decoded.linkLender
				if (link != '') {
                    try {
                        const sales = await axios.get(endPoint.endpointTarget+'/employes/salesbyemploye/'+link, this.configHeader)
                        console.log(sales)
                        this.sales = sales.data.data
                        this.monthLender = sales.data.data.length
                        for (let index = 0; index < sales.data.data.length; index++) {
                            this.gainLender = this.gainLender + sales.data.data[index].commission
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
                    
				}
            }, 
            async getDataLender(){
                const ident = localStorage.userToken
				const decoded = jwtDecode(ident)
				const link = decoded.linkLender
                this.link = decoded.linkLender 
                if (link != '') {
                    try {
                        const employe = await axios.get(endPoint.endpointTarget+'/employes/justonebyid/'+link, this.configHeader)
                        console.log(employe)
                        this.advancement = employe.data.data.advancement
                        this.lenderBonus = employe.data.data.bonus
                        this.comision = employe.data.data.commission
                        const plus = this.advancement + this.lenderBonus
                        this.totalForLender = this.comision - plus
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
                }
            },
            formatPrice(value) {
                let val = (value/1)
                return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            formatDate(date) {
                let dateFormat = new Date(date)
                return moment().format('DD-MM-YYYY');
            },
            handleFileUpload(){
                this.file = this.$refs.file.files[0]
                console.log(this.file)
            },
            async editProfile(){
				let formData = new FormData();
				formData.append('image', this.file)
				formData.append('first_name', this.model.first_name)
				formData.append('last_name', this.model.last_name)
                formData.append('email', this.model.email)
                formData.append('about', this.model.about)
				var dataChange = {
					name: this.model.first_name,
                    lastname: this.model.last_name,
                    image: ''
				}
				try {
					const image = await axios.post(endPoint.endpointTarget+'/users/editData/'+this.id, formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
							"x-access-token": localStorage.userToken,
                            "x-database-connect": endPoint.database
						}
                    })
					this.$swal({
                        icon: 'success',
                        title: 'Usuario editado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.inspector = false
					// this.emitMethod(image.data.status)
					localStorage.setItem('firstname', dataChange.name)
                    localStorage.setItem('lastname', dataChange.lastname)
                    if (image.data.image != '') {
                        localStorage.setItem('imageUser', image.data.image)
                        dataChange.image = image.data.image
                    }
					EventBus.$emit('dataChange', dataChange)
					this.getData()
				} catch(err)  {
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
        },
        computed: {
            getScreen: () => {
                return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 280 }
            }
        }
    };
</script>
