<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <side-bar  :background-color="sidebarBackground" short-title="Syswa" title="Syswa">
      <template slot="links">
        <sidebar-item v-if="validRoute('agendamiento')" :link="{name: 'Agendamiento', icon: 'ni ni-calendar-grid-58 text-blue', path: '/Agendamiento'}"/>
        <sidebar-item v-if="validRoute('empleados')" :link="{name: 'Empleados', icon: 'ni ni-badge text-info', path: '/Empleados'}"/>
        <sidebar-item v-if="validRoute('usuarios')" :link="{name: 'Usuarios', icon: 'ni ni-key-25 text-red', path: '/Usuarios'}"/>
        <sidebar-item v-if="validRoute('servicios')" :link="{name: 'Servicios', icon: 'ni ni-bullet-list-67 text-orange', path: '/Servicios'}"/>
        <sidebar-item v-if="validRoute('clientes')" :link="{name: 'Clientes', icon: 'ni ni-circle-08 text-default', path: '/Clientes'}"/>
      </template>
    </side-bar>
    <div class="main-content" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>

      <div @click="toggleSidebar">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <content-footer v-if="!$route.meta.hideFooter"></content-footer>
      </div>
    </div>
    <a-modal v-model="modals.modal1" class="modal-lg px-0 pb-0 modalProcess" size="lg" :footer="null" :closable="true" >
      <card type="secondary" shadow
          header-classes="bg-white "
          body-classes="pb-0 pt-1"
          class="border-0">
        <template>
            <procesar></procesar>
        </template>
      </card>
    </a-modal>
  </div>
</template>
<script>
  import DashboardNavbar from './DashboardNavbar.vue';
  import ContentFooter from './ContentFooter.vue';
  import { FadeTransition } from 'vue2-transitions';
  import Procesar from "../components/Process"
  import axios from 'axios'
  import jwtDecode from 'jwt-decode'
  import endPoint from '../../config-endpoint/endpoint.js'
  import EventBus from '../components/EventBus'
  
  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      FadeTransition,
      'Procesar': Procesar
    },
    data() {
      return {
        sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
        auth: [], 
        modals: {
          modal1: false
        }
      };
    },
    created(){
      this.getToken()
    },
    methods: {
      getToken(){
        const token = localStorage.userToken
        if (token) {
          const decoded = jwtDecode(token)
          this.auth = decoded.access
        }
      },
      openModal(){
        this.toggleSidebar()
        EventBus.$emit('openModal', 'reload')
      },
      changeAccess(status){
        this.auth = status 
      },
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      validRoute(route){
        for (let index = 0; index < this.auth.length; index++) {
          const element = this.auth[index];
          if (element.ruta == route) {
            return true
          }
        }
      }
    },
    mounted() {
      EventBus.$on('loggedin', status => {
        this.getToken()
      })
      EventBus.$on('loggedin-user', status => {
        this.changeAccess(status)
      })
      
    }
  };
</script>
<style lang="scss">
@media (min-width: 992px){
  .modal-lg {
      max-width: 600px !important;
  }
}

@media (max-width: 692px){
  .modal-lg {
      max-width: 400px !important;
  }
  #processButton{
    width:60% ;
  }
  img{
    margin-top:15px;
  }
  .navbar-toggler{
    margin-top: 15px
  }
}
 table  .text-center{
      text-align: left !important;
  }
  .form-control{
      color: #2F2F2F !important;
  }
  form .text-danger{
    font-size: .5em;
  }
  form .text-default{
    font-size: .5em;
  }
  .modalProcess div .ant-modal{
    width: 80% !important;
    top: 10px !important;
  }
  .ant-modal-body{
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
</style>
