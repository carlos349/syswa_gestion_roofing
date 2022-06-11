<template>
    <div class="row justify-content-center">
        <div class="col-lg-12 col-md-12">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="btn-wrapper text-center mb-4">
                        <span class="mb-5"><img style="width:30%" src="img/brand/syswa-gestion.png"></span> <br><br>
                    </div>
                    <tabs v-if="loading == false" fill class="flex-column flex-md-row">
                        <card shadow>
                            <tab-pane>
                                <span slot="title">
                                    
                                    <span class="display-4">Syswa</span> 
                                </span>
                                <div class="row mt-2">
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                        Negocio: Syswa
                                        </div>
                                    </base-button>
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                        Fecha de creación: 20-05-2020
                                        </div>
                                    </base-button>
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                        Numero de empleados: 7
                                        </div>
                                    </base-button>
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                        Cantidad de servicios: 10
                                        </div>
                                    </base-button>
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                        Cierre del dia: <span class="text-danger">No realizado</span>
                                        </div>
                                    </base-button>
                                </div>
                                <div class="row mt-4">
                                    <base-button icon="ni ni-ui-04" class="col-md-2 mx-auto" type="default">Editar</base-button>
                                    <base-button icon="ni ni-vector" class="col-md-2 mx-auto" type="primary">Adminsitrar</base-button>
                                    <base-button icon="fas fa-trash" class="col-md-2 mx-auto" type="danger">Eliminar</base-button>
                                    <base-button icon="ni ni-curved-next" class="col-md-2 mx-auto" type="success">Acceder</base-button>
                                </div>                               
                            </tab-pane>
                            <tab-pane>
                                <span slot="title">
                                    <span class="display-4">KKPrettynails</span>  
                                </span>
                                <div class="row mt-2">
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                        Negocio: KKPrettynails
                                        </div>
                                    </base-button>
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                            Nombre: Cristians Sanchez
                                        </div>
                                    </base-button>
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                            Empleado desde: 18-02-2018
                                        </div>
                                    </base-button>
                                    <base-button  class="col-5 mt-2 mx-auto" type="secondary">
                                        <div >
                                        Cargo: Prestador
                                        </div>
                                    </base-button>
                                    
                                </div>
                                <div class="row mt-4">
                                    <base-button icon="ni ni-curved-next" class="col-md-2 mx-auto" type="success">Acceder</base-button>
                                </div>                               
                            </tab-pane>
                            <tab-pane>
                                <span slot="title">
                                    <i class="ni ni-fat-add display-4"></i>
                                </span>
                                <h2 class="text-center mt-2">Nuevo negocio</h2>
                                <div class="row mt-4">
                                    
                                    <div class="col-md-6">
                                        <base-input formClasses="input-group-alternative" placeholder="Nombre del negocio" addon-left-icon="ni ni-shop"></base-input>
                                    </div>
                                    <div class="col-md-6">
                                        <base-input formClasses="input-group-alternative" placeholder="Ubicación" addon-left-icon="ni ni-square-pin"></base-input>
                                    </div>
                                    <div class="col-md-6">
                                        <base-input formClasses="input-group-alternative" placeholder="Riff" addon-left-icon="ni ni-briefcase-24"></base-input>
                                    </div>
                                    <div class="col-md-6">
                                        <base-input formClasses="input-group-alternative" placeholder="Otro dato" addon-left-icon="ni ni-air-baloon"></base-input>
                                    </div>
                                    <base-button icon="ni ni-curved-next" class="col-md-4 mx-auto" type="success">Crear nuevo negocio</base-button>
                                </div>                              
                            </tab-pane>
                        </card>
                    </tabs>
                    
                    <center v-else>
                       <a-spin  class="mx-auto my-5 py-5" /> 
                    </center>
                    
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6">
                    
                </div>
            </div>
        </div>
        <modal :show.sync="modals.modal2"
               body-classes="p-4"
               modal-classes="modal-dialog-centered modal-md">
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                       <h3>Confirme su correo</h3> 
                    </div>
                </template>
                <template>
                    <form role="form">
                        <base-input alternative
                            class="mb-3"
                            placeholder="Correo electronico registrado"
                            addon-left-icon="ni ni-single-copy-04"
                            v-model="emailRenew">
                        </base-input>
                        <div class="text-center">
                            <base-button type="primary" v-on:click="SendNewPass">Enviar</base-button>
                        </div>
                    </form>
                </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal"
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
import jwtDecode from 'jwt-decode'
  export default {
    name: 'login',
    data() {
      return {
        model: {
            email: '',
            password: '',
        },
        modals: {
            modal: false,
            modal2: false,
            message: "",
            icon: '',
            type:''
        },
        emailRenew: '',
        loading: false
      }
    },
    beforeCreate(){
        localStorage.removeItem('userToken')
        localStorage.removeItem('nombre')
        localStorage.removeItem('apellido')
        localStorage.removeItem('image')
        localStorage.removeItem('email')
        localStorage.removeItem('imageUser')
        localStorage.removeItem('status')
    },
    methods: {
        login() {
            this.loading = true
            axios.post(endPoint.endpointTarget+'/users/login', {
                email: this.model.email,
                password: this.model.password
            }).then(res => {
                if(res.data.error == 'pass incorrecto'){
                    this.$swal({
                        type: 'error',
                        title: 'Contraseña incorrecta',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.loading = false
                }else if(res.data.error == 'User does not exist'){
                    this.$swal({
                        type: 'error',
                        title: 'No esta registrado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.loading = false
                }else{
                    localStorage.setItem('userToken', res.data.token)
                    this.email = ''
                    this.password = ''
                    const token = localStorage.userToken
                    const decoded = jwtDecode(token)
                    localStorage.setItem('nombre', decoded.first_name)
                    localStorage.setItem('apellido', decoded.last_name)
                    localStorage.setItem('imageUser', decoded.userImage)
                    localStorage.setItem('showNav', true)
                    localStorage.setItem('_id', decoded._id)
                    localStorage.setItem('status', decoded.status)
                    router.push({path: '/Agendamiento'})
                    console.log(decoded.access)
                    this.emitMethod(decoded.status)
                }
            })
            .catch(err =>{
                this.$swal({
                    type: 'error',
                    title: 'Problemas de conexión',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.loading = false
            })
        },
        emitMethod(status) {
            console.log(status)
            EventBus.$emit('loggedin', status)
            localStorage.setItem('logged-in', status)
        },
        SendNewPass(){
            if (this.emailRenew == '') {
                this.modals = {
                    modal: true,
                    message: "Debe llenar el dato de correo",
                    icon: 'ni ni-fat-remove ni-5x',
                    type: 'danger'
                }
                setTimeout(() => {
                    this.modals = {
                        modal:false,
                        modal2:true,
                        message: "",
                        icon: '',
                        type: ''
                    }
                }, 1500);
            }else{
                axios.post(endPoint.endpointTarget+'/users/sendNewPass', {
                    email: this.emailRenew
                }) 
                .then(res => {
                    if (res.data.status == 'ok') {
                        this.modals = {
                            modal: true,
                            message: "Se le envio un correo, con la contraseña provicional",
                            icon: 'ni ni-check-bold ni-5x',
                            type: 'success'
                        }
                        setTimeout(() => {
                            this.modals = {
                                modal: false,
                                modal2: false,
                                message: "",
                                icon: '',
                                type: ''
                            }
                        }, 2500);
                        this.emailRenew = ''
                    }else{
                        this.modals = {
                            modal: true,
                            message: "El correo no esta registrado",
                            icon: 'ni ni-fat-remove ni-5x',
                            type: 'danger'
                        }
                        setTimeout(() => {
                            this.modals = {
                                modal: false,
                                modal2: true,
                                message: "",
                                icon: '',
                                type: ''
                            }
                        }, 2000);
                    }
                })
            }
        }
    }
  }
</script>
<style>
</style>