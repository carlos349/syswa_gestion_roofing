<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
                     style="min-height: 50px; background-image: url(img/theme/users.png); background-position: center 15%;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Usuarios</p>
                        <p class="text-white hideText">Sección dedicada a registrar y administrar los accesos necesarios para cada usuario dentro del sistema.</p>
                    </div>
                    <base-button class="float-right mt-7 mr-0" size="sm" :disabled="validRoute('usuarios', 'perfiles') ? false : true" @click="redirect" type="primary">
                        <a-icon type="user" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Perfiles
                    </base-button>
                    <base-button class="float-right mt-7 mr-2" size="sm" :disabled="validRoute('usuarios', 'registrar') ? false : true" @click="modals.modal1 = true , initialState(2)" type="success">
                        <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Registrar
                    </base-button>     
                </div>
            </div>
        </base-header>
        <modal :show.sync="modals.modal1"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-lg">
               <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <a-spin size="large" :spinning="ifRegister">
                <div class="p-3 pt-4">
                    <template>
                        <div style="margin-top:-10% !important" class="text-muted text-center">
                            Datos del usuario
                        </div>
                    </template>
                    <template>
                        <form role="form">
                            <div class="row p-4">
                                <div class="col-md-6">
                                    <a-select class="w-100 mx-auto mb-2"  placeholder="Seleccione la sucursal"
                                    :allowClear="true"
                                    @change="selectBranch">
                                        <a-select-option v-for="branch of branches" :key="branch._id" v-if="branch.active" :value="branch._id">
                                            {{branch.name}}
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <div class="col-md-6">
                                    <!-- <label class="col-12 text-center">Imagen de perfil</label> -->
                                    <input type="file" id="fileProfile" style="padding:2px" placeholder="Imagen de perfil" ref="file" v-on:change="handleFileUpload()" class="ant-input mb-2 mx-auto" >
                                </div>
                                <div class="col-md-6">
                                    <a-input 
                                    v-model="registerUser.name"
                                    placeholder="Nombre"
                                    class="mb-2"
                                    size="large"
                                    v-on:change="validRegister()">
                                        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                                        <i slot="suffix" class="fa fa-asterisk text-danger"></i>
                                    </a-input>
                                </div>
                                <div class="col-md-6">
                                    <a-input 
                                    v-model="registerUser.lastname"
                                    placeholder="Apellido"
                                    class=""
                                    size="large"
                                    v-on:change="validRegister()">
                                        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                                        <i slot="suffix" class="fa fa-asterisk text-danger"></i>
                                    </a-input>
                                </div>
                                <div class="col-md-6">
                                    <a-input 
                                        v-model="registerUser.email"
                                        placeholder="Correo"
                                        size="large"
                                        v-on:keyup="validFields('c')"
                                        class="mb-0">
                                        <a-icon slot="prefix" type="mail" style="color:rgba(0,0,0,.25)" />
                                        <i slot="suffix" class="fa fa-asterisk text-danger"></i>
                                    </a-input>
                                </div>
                                <div class="col-md-6">
                                    <a-form-item
                                    class="m-0"
                                    :validate-status="registerUser.password.length > 8 ? 'success' : 'error'">
                                        <a-input-password 
                                        v-model="registerUser.password"
                                        placeholder="contraseña"
                                        size="large"
                                        :id="registerUser.password.length > 8 ? 'success' : 'error'"
                                        v-on:keyup="validFields('p')"
                                        class="mb-2">
                                            <a-icon slot="prefix" type="key" style="color:rgba(0,0,0,.25)" />
                                            <i slot="suffix" class="fa fa-asterisk text-danger"></i>
                                        </a-input-password>
                                    </a-form-item>
                                </div>
                                <div class="col-md-6">
                                    <a-form-item
                                    :validate-status="registerUser.c ? 'success' : 'error'"
                                    
                                    :help="registerUser.c ? '' : 'Los correos deben coincidir'">
                                        <a-input size="large" :id="registerUser.c ? 'success' : 'error'" v-model="registerUser.emailConfirm" placeholder="Confirmar correo" v-on:keyup="validFields('c')">
                                            <a-icon slot="prefix" type="mail" style="color:rgba(0,0,0,.25)" />
                                        </a-input>
                                    </a-form-item>
                                    
                                </div>
                                <div class="col-md-6">
                                    <a-form-item
                                    :validate-status="registerUser.p && registerUser.password.length > 8 ? 'success' : 'error'"
                                    :help="registerUser.p && registerUser.password.length > 8 ? '' : 'Las contraseñas deben coincidir y tener más de 8 caracteres'">
                                        <a-input-password :id="registerUser.p && registerUser.password.length > 8 ? 'success' : 'error'" size="large" v-model="registerUser.passwordConfirm" placeholder="Confirmar contraseña" v-on:keyup="validFields('p')">
                                            <a-icon slot="prefix" type="key" style="color:rgba(0,0,0,.25)" />
                                        </a-input-password>
                                    </a-form-item>
                                </div>
                            </div>
                            <div class="text-center">
                                <base-button type="primary" v-if="registerUser.valid == false" disabled class="my-2">Registrar</base-button>
                                <base-button type="primary" v-on:click="registerUsers()" v-else class="my-2">Registrar</base-button>
                            </div>
                        </form>
                    </template>
                </div>
            </a-spin>
        </modal>
        <modal :show.sync="modals.modal3"
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
                        <h3>Vincular prestador</h3>
                    </div>
                </template>
                <template>
                    <a-select allowClear class="input-group-alternative w-100 mb-4 mt-2 linkLender" show-search default-value="Seleccione el prestador" placeholder="Seleccione el prestador" @change="selectEmploye" size="large">
                        <a-select-option v-for="lender of lenderNames" :key="lender._id" :value="lender._id">
                            {{lender.firstName}} {{lender.lastName}} ({{lender.document}})
                        </a-select-option>
                    </a-select>
                    <base-button type="default" v-on:click="estatusEdit(profileSelect, false, routesSelect, idSelect)">
                        Vincular
                    </base-button>  
                </template>
            </card>
        </modal>
        <!-- TABLA DE CLIENTES -->
        <a-table :columns="columns" :data-source="users" :scroll="getScreen">
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
            <template slot="date-format" class="text-left" slot-scope="record, column">
                {{column.lastAccess | moment("DD-MM-YYYY")}}
            </template>
            <template slot="status-format" slot-scope="record, column">
                <a-dropdown>
                    <a-menu slot="overlay" >
                        <template>
                            <a-menu-item v-for="profile of accessProfiles" :key="profile.profile" v-on:click="estatusEdit(profile.profile, profile.commission, profile.routes, column._id)"> 
                                <a-icon type="user" style="vertical-align: 1.5px;" />
                                {{profile.profile}} 
                            </a-menu-item>
                        </template>
                    </a-menu>
                    <a-button style="margin-left: 8px; width:95%">
                        <span v-if="column.status == 'Debe asignar'" class="text-danger">
                            {{column.status}} 
                            <a-icon type="info-circle" class=" text-danger" style="vertical-align:1.5px;" />
                        </span>
                        <span v-else>
                            {{column.status}}
                        </span>
                        <a-icon type="down" style="vertical-align:1.5px;" /> 
                    </a-button>
                </a-dropdown>
            </template>
            <template slot="Administrar" slot-scope="record, column">
                <a-tooltip placement="top">
                    <template slot="title">
                        <span>Eliminar</span>
                    </template>
                    <base-button class="ml-3" :disabled="validRoute('usuarios', 'eliminar') ? false : true" size="sm" v-on:click="deleteUser(column._id)" type="warning" icon="fas fa-trash"></base-button>
                </a-tooltip>
            </template>
        </a-table>
    </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import router from '../router'
import endPoint from '../../config-endpoint/endpoint.js'
import jwtDecode from 'jwt-decode'
import EventBus from '../components/EventBus'
// COMPONENTS
import VueBootstrap4Table from 'vue-bootstrap4-table'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import mixinUserToken from '../mixins/mixinUserToken'

export default {
    mixins: [mixinUserToken],
    components: {
        VueBootstrap4Table,
        vueCustomScrollbar
    },
    data() {
      return {
        accessProfiles: [],
        idProfile: '',
        radio: {
            radio1: false
        },
        branches: [],
        configHeader: {
            headers:{
                "x-database-connect": endPoint.database, 
                "x-access-token": localStorage.userToken
            }
        },
        auth: [],
        ifRegister: false,
        registerUser: {
            name:'',
            lastname:'',
            image:'',
            email:'',
            emailConfirm:'',
            password:'',
            passwordConfirm:'',
            branch:'',
            valid:false,
            valid2:false,
            date:'',
            c:'',
            p:''
        },
        searchText: '',
        searchInput: null,
        searchedColumn: '',
        commission:false,
        selectedProfile: 0,
        selectedRoute: '',
        linkLender:'',
        lenderNames: [],
        modals: {
            modal1: false,
            modal2: false,
            modal3: false,
            modal4: false,
            modal5: false,
            modal6: false,
            modal7: false,
            modal8: false,
            message: "",
            icon: '',
            type:''
        },
        users: [],
        columns: [
            {
                title: 'Nombre',
                dataIndex: 'first_name',
                key: 'first_name',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) =>
                    record.first_name
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Apellido',
                dataIndex: 'last_name',
                key: 'last_name',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) =>
                    record.last_name
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Correo',
                dataIndex: 'email',
                key: 'email',
                ellipsis: true,
            },
            {
                title: 'Último acceso',
                dataIndex: 'LastAccess',
                key: 'LastAccess',
                scopedSlots: { customRender: 'date-format' },
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.lastAccess).getTime() - new Date(b.lastAccess).getTime(),
                ellipsis: true,
            },
            {
                title: 'Perfil',
                dataIndex: 'status',
                key: 'status',
                scopedSlots: { customRender: 'status-format' },
                ellipsis: true,
            },
            {
                title: 'Acciones',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: { customRender: 'Administrar' },
            }
        ],
        idSelect: '',
        file: '',
        position:0,
        mail: ''
      };
    },
    created(){
		this.getUsers();
        this.getEmployes()
        this.getToken()
        this.getBranches()
        this.getAccessProfile()
        $(document).ready(function(){
            setTimeout(() => {
               $("input[placeholder='Go to page']").hide(); 
            }, 200);
            
        });
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
            this.emailUser = decoded.email
        },
        selectBranch(value){
            this.registerUser.branch = value
            this.validRegister()
        },
        selectEmploye(key){
            console.log(key)
            this.linkLender = key
            console.log(this.linkLender)
        },
        redirect(){
            router.push({path: '/perfilesAcceso'})
        },
        async updateconfig(){
            try {
                const changeProfile = await axios.put(endPoint.endpointTarget+'/configurations/editProfiles/'+this.idProfile, {
                    profiles: this.accessProfiles
                }, this.configHeader)
                if(changeProfile.data.status == 'ok'){
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        title: 'Cambio exitoso',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            } catch (err) {
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
        async getAccessProfile(){
            try {
                const getProfiles = await axios.get(endPoint.endpointTarget+'/configurations/profiles', this.configHeader)
                if (getProfiles.data.status == 'ok') {
                    this.accessProfiles = getProfiles.data.data[0].profiles
                    this.idProfile = getProfiles.data.data[0]._id
                }
            } catch (error) {
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
        async getBranches(){
            try {
                const getBranches = await axios.get(endPoint.endpointTarget+'/branches', this.configHeader)
                if (getBranches.data.status == 'ok') {
                    this.branches = getBranches.data.data  
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
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },
        handleReset(clearFilters) {
            clearFilters();
            this.searchText = '';
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0]
            console.log(this.file)
        },
        resetFileInput(){
            console.log(this.$refs.file.files)
            this.$refs.file.value = ''
            console.log(this.$refs.file.files)
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
        registerUsers(){
            this.ifRegister = true
            let formData = new FormData();
            formData.append('image', this.file)
            formData.append('first_name', this.registerUser.name)
            formData.append('last_name', this.registerUser.lastname)
            formData.append('email', this.registerUser.email)
            formData.append('password', this.registerUser.password)
            formData.append('branch', this.registerUser.branch)
            const config = {headers: {'Content-Type': 'multipart/form-data', 'x-access-token': localStorage.userToken, "x-database-connect": endPoint.database }}
            axios.post(endPoint.endpointTarget+'/users/registerUser', formData, config)
            .then(res => {
                if (res.data.status == 'ok') {
                    this.$swal({
                        icon: 'success',
                        title: '¡Usuario registrado con éxito!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.modals.modal1 = false
                    this.initialState(1)
                    this.ifRegister = false
                    this.getUsers()
                }else{
                    this.ifRegister = false
                    this.$swal({
                        icon: 'error',
                        title: '¡Usuario ya existe use otro correo!',
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
        async getUsers(){
            try {
                const getUsers = await axios.get(endPoint.endpointTarget+'/users', this.configHeader)
                this.users = getUsers.data.data
                localStorage.setItem('userToken', getUsers.data.token)
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
            try {
                const getEmployes = await axios.get(endPoint.endpointTarget+'/employes', this.configHeader)
                if (getEmployes.data.status == 'ok') {
                    this.lenderNames = getEmployes.data.data
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
            if (this.registerUser.email.split('@')[1]) {
                if (this.registerUser.email.split('@')[1].split('.')[1]) {
                    this.registerUser.valid = this.registerUser.name != '' && this.registerUser.password.length > 8 && this.registerUser.lastname != '' && this.registerUser.c == true && this.registerUser.p == true && this.registerUser.branch != '' ? true : false
                }
            }
        },
        validFields(field){
            if (field == 'c') {
                this.registerUser.c = this.registerUser.email.toLowerCase() == this.registerUser.emailConfirm.toLowerCase() ? true : false
                this.validRegister()
            }
            if (field == 'p') {
                this.registerUser.p = this.registerUser.password == this.registerUser.passwordConfirm ? true : false
                this.validRegister()
            } 
        },
        initialState(val){
            $(".ant-select-selection__clear").click()
            this.registerUser = {
                name:'',
                lastname:'',
                image:'',
                email:'',
                emailConfirm:'',
                password:'',
                passwordConfirm:'',
                branch:'',
                valid:false,
                valid2:false,
                date:'',
                c:'',
                p:''
            }
            console.log(this.$refs.file)
            this.file = ''
            this.$refs.file.value = ''
            if (val == 2) {
                this.tipeForm = 'Registrar'
            }
            if (val == 3) {
                this.tipeForm = 'Editar'
            }
        },
        deleteUser(id){
			this.$swal({
				title: '¿Eliminar usuario?',
				text: '¡Recuerda! No es posible revertir esta acción',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Sí',
				cancelButtonText: 'No, cancelar',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
				if(result.value) {
                    var idDecoded = jwtDecode(localStorage.userToken)
					if(id == idDecoded._id){
                        this.$swal({
                            icon: 'error',
                            title: 'Accion no permitida',
                            text: 'No es posible eliminar su propio usuario',
                            showConfirmButton: true
                        })
					}else{
						axios.delete(endPoint.endpointTarget+'/users/'+id, this.configHeader)
						.then(res => {
                            this.$swal({
                                icon: 'success',
                                title: 'Usuario eliminado con éxito',
                                showConfirmButton: false,
                                timer: 1500
                            })
							this.getUsers()
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
				} else {
					this.$swal({
                        icon: 'info',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 2500
                    })
				}
			})
		},
        estatusEdit(profile, ifcommission, routes, id){
            this.profileSelect = profile
            this.routesSelect = routes
            if (ifcommission) {
                this.modals.modal2 = true
                this.idSelect = id
            }else{
                axios.put(endPoint.endpointTarget+'/users/changestatus/'+id, {
                    status: profile,
                    routes: routes,
                    employe: this.linkLender
                }, this.configHeader)
                .then(res => {
                    this.$swal({
                        icon: 'success',
                        title: 'Estatus editado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    var idDecoded = jwtDecode(localStorage.userToken)
                    if(id == idDecoded._id){
                        EventBus.$emit('loggedin-user', routes)
                    }
                    this.getUsers()
                    this.linkLender = ''
                    $('.linkLender .ant-select-selection__clear').click()
                    this.modals.modal2 = false
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
		},
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 'auto' }
        }
    }
};
</script>
<style lang="scss">
    .has-success::after {
        display: none !important;
    }
    .card-header{
        font-size: 2.5vw;
    }
    .cursor-pointer{
        cursor: pointer;
    }
    .maxHeightRoutes{
        max-height: 450px;
        overflow: scroll;
    }
    // .maxHeightRoutes th .custom-checkbox{
    //     display: none;
    // }
    .maxHeightRoutes .card-header{
        display:none;
    }
    .maxHeightRoutes .card-footer{
        display:none;
    }
    .dropdown-menu{
        z-index: 10000 !important;
    }
    .highlight {
        background-color: rgb(255, 192, 105);
        padding: 0px;
    }
</style>