<template>
    <nav :style="screen < 768 ? 'padding:0%' : 'padding:2%'" class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white" id="sidenav-main">
        <div class="container-fluid">

            <!--Toggler-->
            <navbar-toggle-button v-if="screen < 768" style="margin-bottom: 3%;" @click.native="showSidebar">
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>
            <navbar-toggle-button v-else @click.native="showSidebar">
                <span class="navbar-toggler-icon"></span>
            </navbar-toggle-button>
            
            <img v-if="screen < 768" style="width:13%;margin-left: 40px;margin-bottom: 3%;" :src="logo" alt="...">
            <img v-else style="width: 155%;margin-left: -52px;margin-top: -48px;margin-bottom: -20%;" :src="logoB" alt="...">
            
            <slot name="mobile-right">
                <ul class="nav align-items-center d-md-none">
                    <li class="nav-item" :disabled="validRoute('sucursales', 'cambiar') ? false : true">
                      <base-dropdown position="right">
                        <a slot="title" class="nav-link" href="#" role="button">
                          <div class="media align-items-center">
                            <a-button type="primary" shape="circle">
                              {{branchName[0]}} 
                            </a-button>
                          </div>
                        </a>
                        <template v-for="branch of branches">
                          <a-button type="link" :key="branch._id+'/'+branch.name" v-if="branch.active" class="dropdown-item" @click="selectBranch(branch._id+'/'+branch.name)">{{branch.name}} </a-button>
                        </template>
                      </base-dropdown>
                    </li>
                    <li class="nav-item">
                      <base-dropdown  position="right">
                          <a slot="title" class="nav-link" href="#" role="button">
                              <div class="media align-items-center">
                                <span class="avatar avatar-sm rounded-circle">
                                  <img alt="Image placeholders" style="width:30px;height:30px;"  v-if="haveImage == ''" src="img/theme/profile-default.png">
                                  <img alt="Image placeholdesr" style="width:30px;height:30px;"  v-else :src="imgUser">
                                  
                                </span>
                              </div>
                          </a>

                          <div class=" dropdown-header noti-title">
                              <h6 class="text-overflow m-0">Bienvenido!</h6>
                          </div>
                          <router-link to="/profile" class="dropdown-item">
                              <i class="ni ni-single-02"></i>
                              <span>Mi perfil</span>
                          </router-link>
                          <router-link v-if="validRoutee('sucursales')" to="/sucursales" class="dropdown-item">
                              <a-icon type="shop" style="vertical-align:1px;" />
                              <span>Sucursales</span>
                          </router-link>
                          <router-link v-if="validRoutee('bodega')" to="/store" class="dropdown-item">
                              <i class="ni ni-box-2"></i>
                              <span>Bodega</span>
                          </router-link>
                          <div class="dropdown-divider"></div>
                          <router-link to="/login" class="dropdown-item">
                              <i class="ni ni-user-run"></i>
                              <span>Cerrar sesión</span>
                          </router-link>
                      </base-dropdown>
                    </li>
                </ul>
            </slot>
            <slot></slot>
            <div v-show="$sidebar.showSidebar" class="navbar-collapse collapse show pt-0" id="sidenav-collapse-main">

                <div class="navbar-collapse-header d-md-none">
                    <div class="row">
                        <div class="col-6 collapse-brand">
                            <router-link to="/">
                                <img :src="logo">
                            </router-link>
                        </div>
                        <div class="col-6 collapse-close">
                            <navbar-toggle-button @click.native="closeSidebar"></navbar-toggle-button>
                        </div>
                    </div>
                </div>

                <ul class="navbar-nav">
                    <slot name="links">
                    </slot>
                </ul>
            </div>
            </div>
    </nav>
</template>
<script>
  import NavbarToggleButton from '@/components/NavbarToggleButton'
  import endPoint from '.../../../config-endpoint/endpoint.js'
  import EventBus from '../EventBus'
  import axios from 'axios'
  import jwtDecode from 'jwt-decode'
  export default {
    name: 'sidebar',
    components: {
      NavbarToggleButton
    },
    data() {
      return {
        haveImage: localStorage.imageUser,
        imgUser: endPoint.imgEndpoint + localStorage.imageUser,
        screen: screen.width,
        auth: [],
        branches: [],
        branchName: localStorage.branchName,
        branch: localStorage.branch
      }
    },
    props: {
      logo: {
        type: String,
        default: 'img/brand/syswa-isotipo.png',
        description: 'Sidebar app logo'
      },
      logoB: {
        type: String,
        default: 'img/brand/syswa-gestion.png',
        description: 'Sidebar app logo'
      },
      autoClose: {
        type: Boolean,
        default: true,
        description: 'Whether sidebar should autoclose on mobile when clicking an item'
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      };
    },
    created(){
      this.getToken()
      this.getBranches()
    },
    methods: {
      closeSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      showSidebar() {
        this.$sidebar.displaySidebar(true)
      },
      validRoutee(route){
        console.log(this.auth, route)
        for (let index = 0; index < this.auth.length; index++) {
          const element = this.auth[index];
          if (element.ruta == route) {
            return true
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
      selectBranch(value){
        console.log(value.split('/')[0] != this.branch)
        if (value.split('/')[0] != this.branch) {
          localStorage.setItem('branch', value.split('/')[0])
          localStorage.setItem('branchName', value.split('/')[1])
          this.branch = value.split('/')[0]
          this.branchName = value.split('/')[1]
          EventBus.$emit('changeBranch', true)
        }
      },
      getToken(){
        const token = localStorage.userToken
        if (token) {
          const decoded = jwtDecode(token)
          this.auth = decoded.access
          this.branch = decoded.branch
          for (const branch of this.branches) {
            console.log(branch._id, this.branch, branch._id == this.branch)
            if (branch._id == this.branch) {
              this.branchName = branch.name
              localStorage.setItem('branch', this.branch)
              localStorage.setItem('branchName', this.branchName)
              break
            }
          }
        }
      },
      async getBranches() {
        const configHeader = {
          headers: {
              "x-database-connect": endPoint.database, 
              "x-access-token": localStorage.userToken
          }
        }
        try {
          const getBranches = await axios.get(endPoint.endpointTarget+'/branches', configHeader)
          if (getBranches.data.status == 'ok') {
            this.branches = getBranches.data.data
            this.getToken()
          }
        }catch(err){console.log(err)}
      }
    },
    mounted() {
      EventBus.$on('loggedin', status => {
        this.getToken()
      })
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false;
      }
    }
  };
</script>
