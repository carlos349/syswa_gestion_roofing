<template >
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
            style="min-height: 50px; background-image: url(img/theme/calendar.png); background-size: cover; background-position: center 75%">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
                <div class="row">
                    <div class="col-12">
                        <div class="text-absolute mb-5 col-12">
                            <center v-if="hideText == 'display:none'">
                                <p style="margin-top:-10%" class="display-1 text-white mb-5 text-center mx-auto">Agenda</p>
                            </center>
                            
                            <p v-else class="mb-0 display-2 text-white">Agenda</p>
                            <p class="text-white" :style="hideText">Esta es la sección administrativa de agendamiento, aquí podrás registrar, editar y visualizar tu agenda.</p>
                        </div>
                        <div class="mt-7">
                            <template v-if="showCalendar">
                                <base-button v-if="hideText == 'display:none'" class="float-right mr-0 mb-1 ml-1" size="sm" :disabled="validRoute('agendamiento', 'agendar') ? false : true" @click="setView('schedule'), initialState()"  type="success">
                                    <a-icon type="form" style="vertical-align:1px;font-size:1.6em;" />
                                </base-button>

                                <base-button v-else class="float-right mr-0 mb-1 ml-1" size="sm" :disabled="validRoute('agendamiento', 'agendar') ? false : true" @click="setView('schedule'), initialState()"  type="success">
                                    <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.6em;" />
                                    Agendar
                                </base-button>
                            </template> 
                            <template v-else>
                                <base-button v-if="hideText == 'display:none'" class="float-right mr-0 mb-1 ml-1" size="sm" :disabled="validRoute('agendamiento', 'agendar') ? false : true" @click="setView('calendar'), initialState()"  type="success">
                                    <a-icon type="calendar" style="vertical-align:1px;font-size:1.6em;" />
                                </base-button>

                                <base-button v-else class="float-right mr-0 mb-1 ml-1" size="sm" :disabled="validRoute('agendamiento', 'agendar') ? false : true" @click="setView('calendar'), initialState()"  type="success">
                                    <a-icon type="calendar" class="mr-2" style="vertical-align:1px;font-size:1.6em;" />
                                    Ver calendario
                                </base-button>
                            </template> 
                            <base-button class="float-right mr-0 mb-1 ml-1" size="sm" :disabled="validRoute('agendamiento', 'agendar') ? false : true" @click="modals.modal3 = true, blokedBlock = true"  type="warning">
                                <a-icon type="issues-close" class="mr-2" style="vertical-align:1px;font-size:1.6em;" />
                                Bloqueos
                            </base-button>

                            <base-dropdown v-if="validRoute('agendamiento', 'filtrar')" class="float-right mr-0 qloq" size="sm">
                                <base-button :disabled="validRoute('agendamiento', 'filtrar') ? false : true" slot="title" type="default" class="dropdown-toggle col-md-12 col-sm-6">
                                        {{employeByDate}}
                                </base-button>
                                <li v-on:click="getDatesByEmploye('Todos')">
                                    <base-button class="dropdown-item" href="#">
                                        <img class="avatar avatar-sm rounded-circle float-left" src="https://www.w3schools.com/howto/img_avatar.png" />  <h4 class="mt-2 ml-4 pl-3">Todos</h4>
                                    </base-button>
                                </li>
                                <li v-for="data in employeShow" :key="data"   v-on:click="getDatesByEmploye(data._id, data.img, data.name)">
                                    <base-button v-if="data.img == 'no'" class="dropdown-item" href="#">
                                        <img class="avatar avatar-sm rounded-circle float-left" src="https://www.w3schools.com/howto/img_avatar.png" />  <h4 class="mt-2 ml-4 pl-3">{{data.name}}</h4>
                                    </base-button>
                                    <base-button v-else class="dropdown-item" href="#">
                                        <img class="avatar avatar-sm rounded-circle float-left" :src="data.img" />  <h4 class="mt-2 ml-4 pl-3">{{data.name}}</h4>
                                    </base-button>
                                </li>
                            </base-dropdown>
                        </div>
                    </div>
                </div>
        </base-header>
        <modal :show.sync="modalsDialog.modal2"
               :gradient="modalsDialog.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modalsDialog.icon"></i>
                <h1 class="heading mt-5">{{modalsDialog.message}}</h1>
            </div>
        </modal>
        <a-spin :spinning="spinningView">
        <vue-custom-scrollbar v-if="showCalendar" class="calen" style="height:75vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden">
            <vue-cal
                class="calen"
                :locale="localee"
                :events="events"
                :time-from="startCalendar"
                :time-to="endCalendar"
                :time-step="15"
                active-view="month"
                :disable-views="['years', 'year', 'week']" 
                events-count-on-month-view
                :split-days="splitDays"
                @view-change="validatorLendersDaysSplit('view-change', $event)"
                :hide-weekdays="hideDays"
                :sticky-split-labels="stickySplitLabels"
                :on-event-click="onEventClick"
                :overlaps-per-time-step="true">
                <template v-slot:split-label="{ split }">
                    <a-button type="primary" shape="circle">
                        {{setInitialsName(split.label)}} 
                    </a-button>
                </template>
            </vue-cal>
        </vue-custom-scrollbar>
        <div v-else>
            <card type="secondary" shadow header-classes="bg-white" class="border-0 m-0 px-0">
                
                  <!-- WIZARD -->
                <a-spin :spinning="spinningDate">
                <form-wizard ref="wizard" class="p-0 m-0 aja" :start-index="0" color="#214d88" @on-complete="register" error-color="#f5365c" back-button-text="Atrás" next-button-text="Siguiente" finish-button-text="¡Agendar!">

                    <h2 v-if="registerDae.valid" slot="title">Datos de agendamiento </h2>
                    <h2 v-else slot="title" class="text-danger">¡Debe completar los datos!</h2>
                    
                    <tab-content icon="ni ni-bullet-list-67"  title="Servicios" :before-change="validateFirstStep">
                        <vuescroll :ops="ops" v-on:scroll="scroll()" class="width:100%;" :class="hideText == 'display:none' ? 'mobileForm' : ''">
                            <template>
                                <div class="text-muted text-center p-0 mt-1 pb-2">
                                    Seleccione los servicios
                                </div>
                            </template>
                            
                            <div class="col-12">
                                <center>
                                    <base-button v-on:click="initialState()" type="secondary" class="text-default">
                                        <font-awesome-icon class="mx-auto"  icon="redo-alt" />
                                    </base-button>
                                </center>
                            </div>
                            <div class="row p-0 mt-2">
                                <div class="showDevice row col-md-12 pl-5">
                                    <div style="width:auto;" class="mx-auto col-12">
                                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                            <li v-for="(category, index) of categories" class="nav-item responsiveItem" role="presentation">
                                                <button class="categoryButton text-uppercase responsiveItem" :id="'cat'+index" data-toggle="pill" :href="'#v-pills-'+category._id" role="tab" aria-controls="v-pills-home" aria-selected="true" v-on:click="selectCat('cat'+index)">{{category.name}}</button>
                                            </li>
                                        </ul>   
                                    </div>
                                    <div class="col-md-8 col-12 separateService">
                                        <h2 class="text-center">Servicios</h2>
                                        <vuescroll :ops="ops"  v-on:scroll="scroll()" style="width:100%;height:30vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden;">
                                            <div class="tab-content" id="pills-tabContent">
                                                <div v-for="category of categories" :key="category" class="tab-pane fade" :id="'v-pills-'+category._id" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                    <div class="row pl-2">
                                                        
                                                        <template v-for="(service, index) of services">
                                                            <div :key="service.name" class="col-md-6 px-4" v-if="service.category == category.name && service.active == true">
                                                                <div class="card-service row mt-2" :id="'cardS'+index">
                                                                    <h3 class="name-service w-100 mb-0"> {{service.name}}</h3>
                                                                    <div class="col-12 pl-0">
                                                                        <img src="img/brand/calendar.png" alt="">
                                                                    </div>
                                                                    <p class="ml-1 mb-0 w-100" style="margin-top:-2px;">
                                                                        <a-icon type="clock-circle" style="vertical-align:1.5px;" /> {{fixedHours(service.duration)}}
                                                                    </p>
                                                                    <p class="ml-1 w-100">{{service.additionalName}}</p> 
                                                                    
                                                                    <div class="col-md-6 col-sm-12 mt-2" style="padding: 0px !important;padding-top: 5px !important;">
                                                                        <div class="price-service ">$ {{formatPrice(service.price)}} </div> 
                                                                    </div>
                                                                    <div class="col-md-6 col-sm-12 mt-2" style="padding: 0px !important;margin-top:-5px;">
                                                                        <div class="button-service-group">
                                                                            <button class="button-service-left" ><i class="fa fa-minus" v-on:click="lessService(index, service.name, service.duration, 'cardS'+index, service.price, countServices[index].count)"></i></button>
                                                                            <span class="span-button-service">{{countServices[index].count}}</span>
                                                                            <button class="button-service-right" 
                                                                            v-on:click="plusService(index, service.name, service._id, service.duration, service.commission, service.price, service.employes, service.discount, service.products)"
                                                                            ><i class="fa fa-plus"></i></button>
                                                                        </div> 
                                                                    </div>  
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </div>
                                                </div>
                                            </div>
                                        </vuescroll>
                                    </div> 
                                    <div class="col-md-4 col-12 pt-0">
                                        <h2 class="text-center" style="margin-top:-3px;">Servicios seleccionados</h2>
                                        <vuescroll :ops="ops"  v-on:scroll="scroll()" style="height:30vh;overflow:hidden;overflow-x: hidden;">
                                            <div  class="tab-pane" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                <div class="row pl-3">
                                                    <template v-if="registerDae.serviceSelectds[0]">
                                                        <div v-for="(service, index) in registerDae.serviceSelectds" :key="service._id+'asda'+index" class="w-100 px-4" >
                                                            <div class="card-service row mt-2 mb-2" style="border-bottom: solid 8px #174c8e">
                                                                <h3 class="name-service"> {{service.name}}</h3>
                                                                <div class="col-12 pl-0">
                                                                    <template v-if="ifMicro">
                                                                        <a-tooltip placement="top">
                                                                            <template slot="title">
                                                                                <span>Marque el adicional deseado, en caso de no aplicar marcar opción "NINGUNO" para poder avanzar.</span>
                                                                            </template>
                                                                            <span class="ml-1 mb-0 font-weight-bold" style="font-size: 1.2em;">Adicionales: </span>
                                                                            <div v-for="(micro, indexM) in service.microServices" :key="micro.microService" v-on:click="SelectMicro(index, indexM, micro)" style="display: inline-block; cursor: pointer;margin-left: 4px;margin-top:2px;">
                                                                                <badge :type="micro.checked ? 'primary' : 'secondary'" class="text-default mb-1">
                                                                                    <p style="font-size:1.2em;font-weight: bold;" class="fs-5 mb-0">{{micro.microService}}</p>
                                                                                </badge>
                                                                            </div>
                                                                        </a-tooltip>
                                                                    </template>
                                                                    <img src="img/brand/calendar.png" alt="">
                                                                </div>
                                                                
                                                                <div class="col-md-6 col-sm-12 mt-2" style="padding: 0px !important;padding-top: 5px !important;">
                                                                    <div class="price-service ">$ {{formatPrice(service.price)}}</div> 
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </template>
                                                    <div v-else>
                                                        <h2 class="text-center">No ha seleccionado ningún servicio.</h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </vuescroll>
                                    </div>
                                </div>
                                <div class="showPhone col-md-12">
                                    <base-dropdown class="w-100 mx-auto mb-3 styleDropdown">
                                        <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" slot="title" type="default" class="dropdown-toggle w-100">
                                            {{CatSelected}}
                                        </base-button>
                                        <b v-for="category of categories" :key="category.name" v-on:click="selectCategoryPhone(category.name)" class="dropdown-item w-100" style="color:#fff;"> {{category.name}} </b>
                                    </base-dropdown>
                                    <base-dropdown class="w-100 mx-auto styleDropdown" v-if="servicesPhoneShow">
                                        <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" slot="title" type="default" class="dropdown-toggle w-100">
                                            Servicios 
                                        </base-button>
                                        <template v-for="service of servicesCat">
                                            <b :key="service.name" v-on:click="selectServicePhone(service._id)" v-if="service.active == true" class="dropdown-item w-100" style="color:#fff;"> {{service.name}} </b>
                                        </template>
                                    </base-dropdown>
                                    
                                    <template v-if="registerDae.serviceSelectds[0]">
                                        <h2 class="mt-3 text-center">Servicios seleccionados</h2>
                                        <hr>
                                        <div v-for="(service, index) in registerDae.serviceSelectds" :key="service._id+'asda'+index" class="w-100" >
                                            <div class="card-service mt-4" style="border-bottom: solid 8px #174c8e">
                                                <h2 class="name-service"> {{service.name}}</h2>
                                                <p class="ml-1 mb-0 w-100" style="margin-top:-8px;">
                                                    <a-icon type="clock-circle" style="vertical-align:1.5px;" /> 
                                                    {{fixedHours(service.duration)}}<br>
                                                    {{service.additionalName}}
                                                </p>
                                                <div class="col-12 mt-2 p-0">
                                                    <img style="z-index:0" src="img/brand/calendar.png" alt="">
                                                    <template v-if="ifMicro">
                                                        <a-tooltip placement="top">
                                                            <template slot="title">
                                                                <span>Haga click en los adicionales que desea para este servicio. Se le sumara el costo al total del servicio.</span>
                                                            </template>
                                                            <span class="ml-1 mt-2 mb-0 font-weight-bold" style="font-size: 1.2em;">Adicionales: </span>
                                                            <br>
                                                            <div v-for="(micro, indexM) in service.microServices" :key="micro.microService" v-on:click="SelectMicro(index, indexM, micro)" style="display: inline-block; cursor: pointer;margin-left: 4px;">
                                                                <badge style="z-index:100" :type="micro.checked ? 'primary' : 'secondary'" class="text-default mb-1">
                                                                    <p style="font-size:1.3em;" class="mb-0 text-default">{{micro.microService}}</p>
                                                                </badge>
                                                            </div>
                                                        </a-tooltip>
                                                    </template>
                                                </div>
                                                <div class="row p-1">
                                                    <div class="col-8 mt-4 p-1" >
                                                        <div class="price-service w-100">$ {{formatPrice(service.price)}}</div> 
                                                    </div>
                                                    <div class="col-4 mt-4 p-1" >
                                                        <div style="border: solid 1px #174c8e;float:right;margin-right:5px;" class="price-service w-50"><a-icon style="vertical-align:1px;" type="close" v-on:click="lessServicePhone(index, service.price)" /></div> 
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </vuescroll>
                    </tab-content>
                    
                    <tab-content icon="ni ni-collection" title="Profesionales" :before-change="validateLastStep">
                        <div class="row">
                            <div class="col-md-4 col-sm-12 mx-auto mt-4">
                                <badge type="secondary" style="font-size:.7em !important; margin-top:14px;" class="mb-1 mx-2 w-100">
                                    <span style="font-family:Arial !important;color:#32325d;font-weight:600;" class="w-100">Seleccione fecha</span> 
                                </badge>
                                <base-input class="hideThisShit" :class="device() ? 'ifNoscreen' : 'ifscreen'">
                                    <flat-picker slot-scope="{focus, blur}"
                                        @on-change="openCalendar(), load1 = true"
                                        @on-open="focus"
                                        @on-close="blur"
                                        :config="configDatePicker"
                                        class="form-control datepicker"
                                        v-model="registerDae.date"
                                        placeholder="Seleccione una fecha">
                                    </flat-picker>
                                </base-input>
                                
                            </div>
                            
                                <div class="col-md-8">
                                    <a-spin :spinning="load1">
                                    <vuescroll :ops="ops" class="w-100" style="height:45vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden;">
                                    <div class="row mb-3">
                                        <div class="col-12 text-center mt-2" v-for="(servicesSelect, indexService) of registerDae.serviceSelectds" :key="indexService">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="py-1" style="background-color:#f8fcfd;">
                                                        <badge style="font-size:.7em !important" v-if="servicesSelect.employe != ''" type="secondary" class="mb-1 w-100">
                                                            <span style="color:#32325d;font-weight:600;font-family:Arial !important;">Profesionales</span> <br>
                                                            <span style="color:#32325d;font-weight:600;font-family:Arial !important;" >{{servicesSelect.name}} </span>
                                                        </badge>
                                                        <badge style="font-size:.7em !important" v-else type="default" class="mb-1"><span style="color:#32325d;font-weight:600;font-family:Arial !important;" >Seleccione prestador y horario</span></badge>
                                                        <base-dropdown class="responsiveButtonsPercent styleDropdown">
                                                            <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" v-if="servicesSelect.valid == true" slot="title" type="default" class="dropdown-toggle w-100">
                                                                {{servicesSelect.employe}} 
                                                            </base-button>
                                                            <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" v-if="servicesSelect.valid == false" disabled slot="title" type="default" class="dropdown-toggle w-100">
                                                                {{servicesSelect.employe}} 
                                                            </base-button>
                                                            <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" v-if="servicesSelect.valid == 'none'" disabled slot="title" type="default" class="dropdown-toggle w-100">
                                                                <span style="color:red">Horarios ocupados</span>
                                                            </base-button>
                                                            <template v-for="employe of servicesSelect.employes" >
                                                                <b :key="employe.name" v-if="employe.valid && findDay(employe.days, employe.name)" class="dropdown-item w-100" style="color:#fff;" v-on:click="insertData(indexService, employe.name, employe.days, employe.class, servicesSelect.duration, employe.id, 'check'+indexService, servicesSelect.employes, employe.img)">{{employe.name}}  </b>
                                                            </template>
                                                        </base-dropdown>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 pb-2">
                                                    <div class="py-1" style="background-color:#f8fcfd;">
                                                        <badge type="secondary" style="font-size:.7em !important; margin-top:14px;" class="mb-1 w-100">
                                                        <span style="font-family:Arial !important;color:#32325d;font-weight:600;">Horarios disponibles</span> <br>  
                                                        </badge>
                                                        <base-button v-on:click="openBlocks('block'+indexService)" class="responsiveButtonsPercent" v-if="servicesSelect.valid == true" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="default" >
                                                            <span v-if="servicesSelect.start != ''">{{servicesSelect.start}} / {{servicesSelect.end}} <i style="color:#2dce89;float:right;margin-top:6px;" :id="'check'+indexService" class="fa "></i></span>

                                                            <span v-else>Seleccione una hora <i class="fa fa-angle-down" style="font-size:16px"></i> </span>
                                                        </base-button>
                                                        <base-button class="responsiveButtonsPercent" v-if="servicesSelect.valid == 'none'" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="default" disabled>
                                                            <span style="color:red">Horarios ocupados</span>
                                                        </base-button>
                                                        <base-button class="responsiveButtonsPercent" v-if="servicesSelect.valid == false" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="default" disabled>
                                                        Seleccione una hora
                                                        </base-button>
                                                        <vuescroll :ops="ops" class="mx-auto responsiveButtonsPercent" :id="'block'+indexService" style="height:25vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden">
                                                            <a-spin :spinning="load2">
                                                                <div class="col-12" v-for="(block , index) of servicesSelect.blocks" :key="index">
                                                                    <base-button v-if="block.validator == true" v-on:click="selectBloqMulti(block.employes , block.hour, index, indexService, 'block'+indexService, 'check'+indexService)" size="sm" class="col-12" type="success">
                                                                        <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                                                        <span>Disponible</span>
                                                                    </base-button>
                                                                    <base-button disabled v-else-if="block.validator == false" size="sm" class="col-12" type="danger">
                                                                        <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                                                        <span>Ocupado</span>
                                                                    </base-button>
                                                                    <base-button v-else-if="block.validator == 'select'" size="sm" class="col-12" type="default">
                                                                        <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                                                        <span>Seleccionado</span>
                                                                    </base-button>
                                                                    <base-button v-else size="sm" disabled class="col-12" type="secondary">
                                                                        <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                                                        <span>No seleccionable</span>
                                                                    </base-button>
                                                                </div>
                                                            </a-spin>
                                                        </vuescroll>
                                                    </div>
                                                </div>   
                                            </div>
                                        </div>
                                    </div>
                                </vuescroll>
                                    </a-spin>
                                </div>
                            
                            
                            
                        </div> 
                    </tab-content>
                    <tab-content title="Información" icon="fa fa-question-circle">
                        <vue-custom-scrollbar v-on:scroll.native="fixClient()" class="w-100" style="height:450px;overflow:hidden;overflow-x: hidden;overflow-y:hidden;">
                        <div class="row">
                            <div class="col-md-8 col-sm-12" >
                                <div class="row">
                                    <div class="card-services-information col-lg-6" v-for="(data, index) in registerDae.serviceSelectds" >
                                        <div class="p-3">
                                            <center>
                                            <span class="mb-1 w-100" style="color:#000;font-weight:500;">Servicio {{index + 1}}</span> 
                                            </center>
                                            <base-button slot="title" type="secondary" :class="'w-100 '+'text-center '+'mb-1'" style="color:#1c2021;border:none;background-color: rgb(213, 218, 221)">
                                                <badge class="mx-auto" type="default" style="background-color:#174c8e;"><span style="color:#fff;font-size:1.4em;text-transform:none;">{{data.name}}</span> </badge><br>
                                                <span class="mx-auto" style="font-size:1.2em;">{{data.realEmploye}}</span> <br>
                                                <template v-if="ifMicro">
                                                    <span>
                                                        Adicionales:
                                                        <span v-for="micro in data.microServices" :key="micro">
                                                            <badge v-if="micro.checked" type="secondary" class="text-default mr-1">{{micro.microService}}</badge>
                                                        </span>
                                                    </span>
                                                </template>
                                                <div class="w-100">
                                                    <div class="mx-auto">
                                                        <span style="color:#000;font-weight:600;font-size:.7em;text-transform:none;vertical-align:super" class="mt-3 ml-2">Desde</span>
                                                        <span style="color:#000;font-weight:600;font-size:1.8em;">
                                                            {{data.start}}
                                                        </span>
                                                        <span style="color:#000;font-weight:600;font-size:.7em;text-transform:none;vertical-align:super" class=" mt-3">Hasta</span>
                                                        <span style="color:#000;font-weight:600;font-size:1.8em;" class="">
                                                            {{data.end}}
                                                        </span>
                                                    </div>
                                                    <div class="mx-auto">
                                                        <span style="color:#000;font-weight:600;font-size:1.4em;text-transform:none" class="mt-3 ml-2">Emergencia: </span> 
                                                        <span style="color:#000;font-weight:600;font-size:1.8em;">
                                                            <a-switch  :checked="extraData.emergency" @change="b()"/>
                                                        </span>
                                                        <span style="color:#000;font-weight:600;font-size:1.4em;text-transform:none" class=" mt-3 ml-3">Seguro: </span>
                                                        <span style="color:#000;font-weight:600;font-size:1.8em;" class="">
                                                            <a-switch  :checked="extraData.secure" @change="a()"/>
                                                        </span>
                                                    </div>
                                                    
                                                </div>
                                            </base-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-sm-12 pt-5">
                                <center>
                                    <base-button class="mt-3 responsiveButtonsPercent mx-auto" type="secondary" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;">
                                    Fecha: <strong>{{registerDae.date}}</strong>
                                    </base-button><br>
                                    <base-button class="mt-3 responsiveButtonsPercent mx-auto" type="secondary" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;">
                                        Hora de inicio: <strong v-if="registerDae.serviceSelectds[0]">{{registerDae.serviceSelectds[0].start}}</strong>
                                    </base-button><br>
                                    <base-button class="mt-3 responsiveButtonsPercent mx-auto" type="secondary" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;">
                                        Total: <strong class="text-uppercase">$ {{formatPrice(totalPrice)}}</strong>
                                    </base-button>
                                </center><br>
                            </div>
                        </div>
                        <template>
                            <div class="text-muted text-center">
                                Datos del cliente
                            </div>
                        </template>
                        <center>
                            <a-select
                                v-if="inputClientDate"
                                ref="clientSelect"
                                :show-search="fixSearch"
                                placeholder="Selecciona un cliente"
                                class="mb-2"
                                :class="hideText != 'display:none' ? 'w-50' : 'w-100'"
                                :allowClear="true"
                                option-filter-prop="children"
                                @search="searchClientRegex"
                                :filter-option="filterOption">
                                <a-select-option v-on:click="selectClient('register')" class="text-success" value="register">
                                    Registrar cliente
                                </a-select-option>
                                <a-select-option v-for="client in clients" :key="client" :value="client.firstName + ' ' + client.lastName + ' (' + client.email + ')'" v-on:click="selectClient(client)">
                                    {{client.firstName}} {{client.lastName}} ({{client.email}})
                                </a-select-option>
                            </a-select>
                        </center>
                        
                        <div  class="row">
                            <div class="col-md-3 aggendMin">
                                <base-input v-on:keyup="validRegister()" placeholder="Nombre" v-model="dataClient.firstName" addon-left-icon="ni ni-circle-08"></base-input>
                            </div>
                            <div class="col-md-3 aggendMin">
                                <base-input v-on:keyup="validRegister()" placeholder="Apellido" v-model="dataClient.lastName" addon-left-icon="ni ni-circle-08"></base-input>
                            </div>
                            <div class="col-md-6 aggendMin">
                                <base-input v-on:keyup="validRegister()" placeholder="Correo" v-model="dataClient.email" addon-left-icon="ni ni-key-25"></base-input>
                            </div>
                            
                            <div class="col-md-6">
                                <VuePhoneNumberInput v-if="dataClient.valid && dataClient.phone" v-model="dataClient.phone.formatNational" @update="dataClient.phone = $event, validRegister()"
                                    :default-phoner-number="dataClient.phone.nationalNumber"
                                    :default-country-code="dataClient.phone.countryCode" 
                                    :translations="{
                                        countrySelectorLabel: 'Código de país',
                                        countrySelectorError: 'Elije un país',
                                        phoneNumberLabel: 'Número de teléfono',
                                        example: 'Ejemplo :'
                                    }"
                                />
                                <VuePhoneNumberInput v-else v-model="dataClient.phone.formatNational" @update="dataClient.phone = $event, validRegister()" :default-country-code="dataClient.phone.countryCode" :default-phoner-number="dataClient.phone.nationalNumber"
                                :translations="{
                                    countrySelectorLabel: 'Código de país',
                                    countrySelectorError: 'Elije un país',
                                    phoneNumberLabel: 'Número de teléfono',
                                    example: 'Ejemplo :'
                                }"/>
                            </div>
                            <div class="col-md-6">
                                <base-input placeholder="Instagram" v-model="dataClient.instagram" addon-left-icon="ni ni-fat-add"></base-input>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <base-checkbox v-model="dataClient.discount" class="mt-2">
                                    Descuento de nuevo cliente
                                </base-checkbox>
                            </div>
                            <div class="col-md-3 col-sm-12">
                                <base-input addon-left-icon="ni ni-calendar-grid-58 w-100">
                                    <flat-picker 
                                            slot-scope="{focus, blur}"
                                            @on-open="focus"
                                            @on-close="blur"
                                            @on-change="validRegister()"
                                            :config="configDate"
                                            class="form-control datepicker"
                                            placeholder="Seleccione una fecha"
                                            v-model="dataClient.birthday">
                                    </flat-picker>
                                </base-input>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <vue-single-select
                                    v-model="dataClient.recommender"
                                    :options="clientsNames"
                                    placeholder="Recomendador"
                                ></vue-single-select>
                            </div>
                            <div v-if="dataClient.valid" class="col-md-3 col-sm-12">
                                <base-button size="sm" class="col-12 mt-2" type="secondary">
                                    <span>Participación</span>
                                    <badge type="default">{{dataClient.attends}}</badge>
                                </base-button>
                            </div>
                            <div v-if="dataClient.valid" class="col-md-3 col-sm-12">
                                <base-button size="sm" class="col-12 mt-2" type="secondary">
                                    <span>Recomendaciones</span>
                                    <badge type="default">{{dataClient.recommendations}}</badge>
                                </base-button>
                            </div>
                            <div v-if="dataClient.valid" class="col-md-3 col-sm-12">
                                <base-button size="sm" class="col-12 mt-2" type="secondary">
                                    <span>Ultima atención</span>
                                    <badge type="default">{{formatDate(dataClient.lastAttend)}}</badge>
                                </base-button>
                            </div>
                            <div v-if="dataClient.valid" class="col-md-3 col-sm-12">
                                <base-button size="sm" class="col-12 mt-2" type="secondary">
                                    <span>Cliente desde</span>
                                    <badge type="default">{{formatDate(dataClient.createdAt)}}</badge>
                                </base-button>
                            </div>
                            <div class="col-auto mx-auto mt-4">
                                <base-button  type="default" v-on:click="clientEdit()" v-if="dataClient.valid && dataClient.valid2" class="col-12 mb-5" icon="fas fa-edit">Editar cliente</base-button>
                                
                                <base-button  type="default"  v-if="dataClient.valid && dataClient.valid2 == false" disabled class="col-12 mb-5" icon="fas fa-edit">Editar cliente</base-button>
                                
                                <base-button type="success" disabled v-if="dataClient.valid != true && dataClient.valid2 != true" class="col-12 mb-5" icon="fas fa-user-plus">Registrar cliente</base-button>
                                <base-button type="success" v-on:click="newClient()" v-if="dataClient.valid != true && dataClient.valid2" class="col-12 mb-5" icon="fas fa-user-plus">Registrar cliente</base-button>
                            </div>
                        </div>
                        </vue-custom-scrollbar>
                    </tab-content>
                </form-wizard>
                </a-spin>
                <!-- END WIZARD -->

            </card>
        </div>
        </a-spin>
        <modal :show.sync="dateModals.modal1" style="z-index:1"
               body-classes="p-0"
               :header-classes="selectedEvent.class"
               modal-classes="modal-dialog-centered modal-md">
            <h5 slot="header" class="modal-title" id="modal-title-notification">
                {{dateSplit(selectedEvent.start)}} 
                <span v-if="selectedEvent.typeCreation == 'Web'">(Web)</span>
                <span v-else>(Sistema)</span></h5>   
            <card type="secondary" shadow
                  
                  :body-classes="selectedEvent.class"
                  class="border-0 pt-0">
                  <card shadow>
                    <div class="row mt-4">
                        <div v-if="selectedEvent.employe" style="border-right:1px solid lightgray" class="col-md-6 pr-0 pl-1">
                            <a-avatar v-if="selectedEvent.employe.img != 'no'" shape="square" size="large" :src="selectedEvent.employe.img" />
                            <a-avatar v-else shape="square" size="large" src="img/theme/team-4-800x800.jpg" />
                            <span class="ml-2">{{selectedEvent.employe.name}}</span>
                        </div>
                        <div class="col-md-6">
                            <center>
                                <base-button type="primary" :class="selectedEvent.class">{{selectedEvent.title}}</base-button> 
                            </center>
                        
                        </div>
                    </div>
                  </card>
                
                <tabs v-if="selectedEvent.content != ''" fill class="flex-column flex-md-row">
                    <card shadow>
                        <tab-pane>
                            <span slot="title">
                                <i class="ni ni-collection"></i>
                                Basicos
                            </span>
                            <dt class="text-center">Detalles de la cita</dt>
                            <a-tooltip placement="top">
                                <template slot="title">
                                    <span v-if="selectedEvent.client">
                                        {{selectedEvent.client.email}} 
                                        <span v-if="phoneDateSelect != ''">
                                            - {{phoneDateSelect}}

                                        </span>
                                    </span>
                                </template>
                                <base-button v-if="selectedEvent.client" class="mt-2 col-12" size="sm" type="secondary">
                                    <span >Cliente:</span>
                                    <badge style="font-size:0.8em !important" class="text-default" type="success">{{selectedEvent.client.name}}</badge>
                                </base-button>
                            </a-tooltip>
                            <base-button class="mt-1 col-12" size="sm" type="secondary">
                                <span >Entrada:</span>
                                <badge style="font-size:0.8em !important" class="text-default" type="success">{{dateSplitHours(selectedEvent.start)}}</badge>
                                <span >Salida:</span>
                                <badge style="font-size:0.8em !important" class="text-default" type="success">{{dateSplitHours(selectedEvent.end)}}</badge>
                            </base-button>
                            <base-button v-if="selectedEvent.typePay" class="mt-1 col-12" size="sm" type="secondary">
                                <span >Tipo de pago:</span>
                                <badge style="font-size:0.8em !important" class="text-default" type="success">{{selectedEvent.typePay}}</badge>
                            </base-button>
                            <base-button v-if="selectedEvent.client" class="mt-1 col-12" size="sm" type="secondary">
                                <span >Dirección:</span>
                            </base-button>
                            <base-button v-if="selectedEvent.client" class="mt-1 col-12" size="sm" type="secondary">
                                <a-input v-model="selectedEvent.client.location" placeholder="Derección del cliente..." />
                            </base-button>
                            
                             <base-button v-if="selectedEvent.extraData" class="mt-1 col-12" size="sm" type="secondary">
                                <span >Link de fotos:</span>
                            </base-button>
                            <base-button v-if="selectedEvent.extraData" class="mt-1 col-12" size="sm" type="secondary">
                                <a-input v-model="selectedEvent.extraData.linkPhotos" placeholder="Link de fotos..." />
                            </base-button>
                            
                            <base-button v-if="selectedEvent.extraData" class="mt-1 col-12" size="sm" type="secondary">
                                <span >Etapa:</span>
                            </base-button>
                            <base-button v-if="selectedEvent.extraData" class="mt-1 col-12" size="sm" type="secondary">
                                <a-select
                                ref="select"
                                
                                style="width: 240px"
                                @focus="focus"
                                @change="handleChange"
                                >
                                    <a-select-option value="jack">Opcion 1</a-select-option>
                                    <a-select-option value="lucy">Opcion 2</a-select-option>
                                    <a-select-option value="disabled">Opcion 3</a-select-option>
                                    <a-select-option value="Yiminghe">Opcion 4</a-select-option>
                                </a-select>
                            </base-button>
                            <base-button v-if="selectedEvent.extraData" class="mt-1 col-12" size="sm" type="secondary">
                                <span >Cubierto por el seguro:</span>
                                <badge style="font-size:0.8em !important" class="text-default" type="success">
                                    <span v-if="selectedEvent.extraData.secure == true">SI</span>
                                    <span v-else>NO</span>
                                </badge>
                            </base-button>
                            <base-button v-if="selectedEvent.extraData" class="mt-1 col-12" size="sm" type="secondary">
                                <span >Naturaleza del proyecto:</span>
                                <badge style="font-size:0.8em !important" class="text-default" type="success">{{selectedEvent.extraData.nature}}</badge>
                            </base-button>
                            <base-button v-if="selectedEvent.extraData" class="mt-1 col-12" size="sm" type="secondary">
                                <span >Tipo de material:</span>
                                <badge style="font-size:0.8em !important" class="text-default" type="success">{{selectedEvent.extraData.material}}</badge>
                            </base-button>
                            <base-button v-if="selectedEvent.extraData" class="mt-1 col-12" size="sm" type="secondary">
                                <span >Emergencia:</span>
                                <badge style="font-size:0.8em !important" class="text-default" type="success">
                                    <span v-if="selectedEvent.extraData.emergency == true">SI</span>
                                    <span v-else>NO</span>
                                </badge>
                            </base-button>
                            <base-button class="mt-1 col-12" size="sm" type="secondary">
                                <span >Detalles:</span>
                            </base-button> 
                            <base-input v-if="selectedEvent.extraData" alternative="">
                                <textarea v-model="selectedEvent.extraData.details"  rows="4" class="form-control form-control-alternative" placeholder="Detalles del proyecto..."></textarea>
                            </base-input>
                            <center>
                                <base-button v-on:click="editDateData()" outline size="sm" class="mx-auto col-4" type="default">
                                    <span class="float-left">Editar</span>  
                                    <span style="margin-top:3px" class="fa fa-edit float-right"></span>
                                </base-button> 
                            </center>
                            
                            <!-- <base-button class="mt-1 col-12" size="sm" type="secondary">
                                <span class="text-success" v-if="dateData.discount.discount == true && dateData.discount.type == 'first'" >
                                    Lleva descuento (Primera atención)
                                    <i class="text-success p-1 ni ni-check-bold ni-1x aling-center"> </i>
                                </span>
                                <span class="text-success" v-if="dateData.discount.discount == true && dateData.discount.type == 'recomnd'" >
                                    Lleva descuento (Por recomendación)
                                    <i class="text-success p-1 ni ni-check-bold ni-1x aling-center"> </i>
                                </span>
                                <span class="text-danger" v-if="dateData.discount.discount == false && dateData.discount.type == 'none'" >
                                    No lleva descuento 
                                    <i class="text-danger p-1 ni ni-fat-remove ni-1x aling-center"> </i>
                                </span>
                            </base-button> -->
                            <div v-if="selectedEvent.microServices && selectedEvent.microServices.length > 0">
                                <dt class="mt-3 text-center">Servicios adicionales</dt>
                                <a-tooltip v-for="micro of selectedEvent.microServices" :key="micro" placement="top">
                                    <template slot="title">
                                        <span>Duración: {{micro.duration}} minutos</span> <br>
                                        <span>Precio: $ {{formatPrice(micro.price)}}</span>
                                    </template>
                                    <badge  style="font-size:0.85em; cursor:pointer" class="mt-1 ml-1 text-default" type="primary">{{micro.name}}</badge>
                                </a-tooltip>
                            </div>
                             
                            

                            <base-button v-if="selectedEvent.typepay == 'Transferencia'" class="mt-1 col-12" size="sm" type="default">
                                <a :href="imgEndpoint+'/static/designs/'+selectedEvent.paypdf" target="_blank" download>Descargar comprobante</a>
                            </base-button>
                            <hr/>
                            <template v-if="selectedEvent.imgDesign">
                                <a-spin size="large" :spinning="loadImage">
                                    <dt class="text-center" style="margin-top:-10px;"><b>Imagen del diseño</b> <span v-if="selectedEvent.imgDesign.length >= 3"> (Máximo 3)</span></dt>
                                    <div class="row mt-1" v-if="selectedEvent.imgDesign.length < 3">
                                        <label class="col-md-10" for="file">Seleccione imagen</label>
                                        <input type="file" id="file" ref="file" multiple v-on:change="handleFileUpload()" >
                                        <button class="col-md-2 buttonUpload" v-on:click="uploadImageDesign(selectedEvent._id, selectedEvent)">
                                            <i class="ni ni-send" style="font-size: 1.4em;'"></i>
                                        </button>
                                        <template v-if="nameFile != 'Seleccione imagen'">
                                            <div v-for="(image, index) in nameFile.split(',')" :key="image" class="col-12 border border-3 p-2">
                                                {{image}}
                                                <i v-on:click="removeImage(index)" class="fa fa-times float-right mt-1 text-danger" style="font-size:1.4em;cursor:pointer;"></i>
                                            </div>
                                        </template>
                                    </div>
                                    <div v-if="selectedEvent.imgDesign.length > 0" class="row mt-1">
                                        <div class="col-md-12">
                                            <carousel :perPage="1" :autoplayHoverPause="true" :autoplay="true">
                                                <slide v-for="(images, index) of selectedEvent.imgDesign" :key="images" class="imageHover">
                                                    <img  class="w-100" style="height: 50vh !important;" :src="images" alt="">
                                                    <center>
                                                        <base-button type="danger" class="mt-2" size="sm" v-on:click="deleteImage(selectedEvent.imgDesign, index, selectedEvent._id)">Eliminar imagen</base-button>
                                                    </center>
                                                </slide>
                                            </carousel>
                                        </div>
                                    </div>
                                </a-spin>
                            </template>
                        </tab-pane>
                        <tab-pane>
                            <span slot="title">
                                <i class="ni ni-chart-bar-32"></i>
                                Avanzados
                            </span>
                            <div class="row">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span v-if="editDisabled">No puedes editar una cita caducada</span>
                                    </template>
                                    <div v-if="validRoute('agendamiento', 'editar') && selectedEvent.process == true" v-on:click="dataEdit()" class="col-md-6 mx-auto mt-2">
                                        <center>
                                            <base-button :disabled="editDisabled" outline size="sm" class="mx-auto col-12" type="default">
                                                <span class="float-left">Editar</span>  
                                                <span style="margin-top:3px" class="fa fa-edit float-right"></span>
                                            </base-button>
                                        </center>
                                    </div>
                                </a-tooltip>
                                <!-- <template v-if="validRoute('agendamiento', 'finalizar')">
                                    <div v-if="selectedEvent.process == true" v-on:click="dateModals.modal3 = true, plusMicroFinally()" class="col-md-6 mx-auto mt-2"><center>

                                        <base-button outline size="sm" class="mx-auto col-12" type="default">
                                            <span class="float-left">Finalizar</span>  
                                            <span style="margin-top:3px" class="fa fa-check-square float-right"></span>
                                        </base-button> 
                                    </center>
                                    </div>
                                </template> -->
                                <div class="col-md-6 mx-auto mt-2">
                                    <center>
                                        <div v-if="selectedEvent.process == true && validRoute('agendamiento', 'confirmacion')">
                                            <base-button size="sm" style="cursor:default" v-if="selectedEvent.confirmation" type="success" class="mx-auto col-12">
                                                <i style="margin-top:3px" class="ni ni-check-bold float-right"></i>
                                                <span class="float-left">Confirmada</span> 
                                            </base-button>

                                            <base-button outline size="sm" v-else class="mx-auto col-12" type="primary" v-on:click="sendConfirmation([selectedEvent], selectedEvent.client.name, selectedEvent.client.email, selectedEvent.start, selectedEvent.end, selectedEvent.services, selectedEvent.employe, selectedEvent, false, dateSplit2(selectedEvent.start),selectedEvent.start, selectedEvent.end )">
                                                <i style="margin-top:3px" class="ni ni-send float-right"></i>
                                                <span class="float-left">Confirmación</span>  
                                            </base-button>
                                        </div>   
                                    </center>
                                </div>
                                
                                <div v-if="validRoute('agendamiento', 'eliminar') && selectedEvent.process == true" v-on:click="deleteDate(selectedEvent._id,selectedEvent.cliente, false)" class="col-md-6 mx-auto mt-2">
                                    <center>
                                        <base-button outline size="sm" class=" col-12 mx-auto" type="danger">
                                            <span class="float-left">Borrar</span>  
                                            <span style="margin-top:3px" class="fa fa-trash-alt float-right"></span>
                                        </base-button> 
                                    </center>
                                </div>

                                <div v-if="validRoute('agendamiento', 'eliminar') && selectedEvent.process == true" v-on:click="deleteDate(selectedEvent._id,selectedEvent.cliente, true)" class="col-md-6 mx-auto mt-2">
                                    <center>
                                        <base-button outline size="sm" class=" col-12 mx-auto" type="danger">
                                            <span class="float-left">Cancelar</span>  
                                            <span style="margin-top:3px" class="fa fa-trash-alt float-right"></span>
                                        </base-button> 
                                    </center>
                                </div>

                            </div>
                            
                            <dt class="mt-4 text-center">Histórico de cliente </dt>
                            <vue-custom-scrollbar class="maxHeightHistorical">
                                <a-config-provider :locale="es_ES">
                                    <template #renderEmpty>
                                        <div style="text-align: center">
                                            <a-icon type="warning" style="font-size: 20px" />
                                            <h2>Este cliente no ha sido atendido aun</h2>
                                        </div>
                                    </template>
                                    <a-table class="historicalClientTable" :scroll="{ x: true }" :columns="historyClientColumn" :data-source="dateData.history">
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
                                            {{formatDate(column.createdAt)}}
                                        </template>
                                        <template slot="services" slot-scope="record">
                                            <span v-for="service in record" :key="service">{{service.service}}</span>
                                        </template>
                                        <template slot="total" slot-scope="record, column">
                                            {{column.totals.total | formatPrice}}
                                        </template>
                                    </a-table>
                                </a-config-provider>
                            </vue-custom-scrollbar>
                        </tab-pane>
                    </card>
                </tabs>
            </card>
        </modal>
        <modal :show.sync="dateModals.modal2"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-lg">
               <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <card v-if="dataEditSend.start != ''" type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <div style="margin-top:-5% !important" class="text-center">
                    <base-button type="primary" style="margin-top:-10%;margin-bottom:5%" :class="selectedEvent.class">{{selectedEvent.title}} <br> <i  class="fa fa-clock"></i> {{dataEditSend.start}} / {{dataEditSend.end}}</base-button>
                </div>
                <dd v-if="dateData.fechaEditPick == ''" class="text-danger text-center">Debe seleccionar una fecha</dd>
                <div class="col-12 mx-auto">
                    <base-input addon-left-icon="ni ni-calendar-grid-58">
                        <flat-picker  slot-scope="{focus, blur}"
                            @on-open="focus"
                            @on-close="blur"
                            @on-change="changeDateEdit()"
                            :config="configDatePickerEdit"
                            class="form-control datepicker"
                            v-model="dataEditSend.date"
                            placeholder="Seleccione una fecha">
                        </flat-picker>
                    </base-input>
                </div>
                <center>
                    <div class="row col-12 p-0 m-0">
                        <div style="margin-top: -6px" class="col-md-2 col-3 p-0">
                            <span class="minLess text-danger"> -{{minLessEdit}}</span>
                        </div>
                        <div class="col-md-4 col-3">
                            <a-button v-on:click="changeMin(false)"  type="danger">
                                <a-icon style="vertical-align: unset;" type="minus-circle" /> 
                                <span v-if="hideText != 'display:none'">Restar minutos</span>
                            </a-button>
                        </div>
                        <div class="col-md-4 col-3">
                            <a-button v-on:click="changeMin(true)" class="text-white" style="background-color:#2dce89" type="success">
                                <span v-if="hideText != 'display:none'">Agregar minutos</span>
                                <a-icon style="vertical-align: unset;" type="plus-circle" />
                            </a-button>
                        </div>
                        <div style="margin-top: -8px" class="col-md-2 col-3 p-0">
                             <span class="minAdd"> +{{minAddEdit}}</span>
                        </div>
                        
                    </div>
                    <span class="minAdd text-default"> Duración: {{dataEditSend.duration}} Min</span>
                </center>
                <hr>
                <a-select v-if="editSelectValid" class="col-12 mx-1" :default-value="dataEditSend.originalEmploye.name" >
                    <a-select-option v-for="employe in dataEditSend.service.employes" :key="employe" @click="editEmployeDate(employe)" :value="employe.name">
                        {{employe.name}}
                    </a-select-option>
                </a-select>
                <vuescroll :ops="ops" class="mx-auto responsiveButtonsPercent noScroll col-12 mt-3" v-if="finalBlockEdit"  style="height:25vh; padding-right: 25px;">
                    <a-spin :spinning="spinningEdit">
                        <div class="col-12" v-for="block in finalBlockEdit" :key="block">
                            <base-button v-if="block.validator == true" v-on:click="selectBlockEdit(block.hour)" size="sm" class="col-12" type="success">
                                <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                <span>Disponible</span>
                            </base-button>
                            <base-button disabled v-else-if="block.validator == false" size="sm" class="col-12" type="danger">
                                <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                <span>Ocupado</span>
                            </base-button>
                            <base-button v-else-if="block.validator == 'select'" size="sm" class="col-12" type="default">
                                <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                <span>Seleccionado</span>
                            </base-button>
                            <base-button v-else size="sm" style="cursor:not-allowed" disabled class="col-12" type="secondary">
                                <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                <span>No seleccionable</span>
                            </base-button>
                        </div>
                    </a-spin>
                    
                </vuescroll>
                <div class="text-center">
                    <base-button v-on:click="editDate()" class="mt-3" type="default">Editar</base-button>
                </div>
            </card>
        </modal>
        <modal :show.sync="dateModals.modal3" style="z-index:3"
               modal-classes="modal-dialog-centered modal-xl">
            <h5 slot="header" class="modal-title" id="modal-title-notification">Finalizar cita - {{dateSplit(selectedEvent.start)}}</h5>
            <div class="row">
                <h4 class="w-100" style="margin-top:-10px;">Agregar mas servicios</h4>
                <div class="w-100 mx-auto pb-2">
                    <a-select
                        show-search
                        placeholder="Seleccione el servicio"
                        option-filter-prop="children"
                        class="w-50 thisSelect"
                        :allowClear="true"
                        :filter-option="filterOption">
                        <a-select-option v-for="service of services" :key="service._id" v-on:click="plusServiceFinally(service.name, service.commission, service.price, service.discount, service.products)" :value="service._id">
                            {{service.name}}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="mt-2 mb-2 w-75 mx-auto bg-light" style="height:2px;"></div>
                <div class="col-12 p-1 mb-1">
                    <h4 class="w-100">Servicios actuales</h4>

                    <vuescroll :ops="ops"  v-on:scroll="scroll()" style="height:40vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden;">
                        
                        <div  class="tab-pane" role="tabpanel" aria-labelledby="v-pills-home-tab">
                            <div class="row pl-3">
                                <template>
                                    <div v-for="(service, index) in selectedEvent.services" :key="service"  class="col-md-4 px-4" >
                                        <div class="card-service row mt-2" style="border-bottom: solid 8px #174c8e">
                                            <h3 class="name-serviceF"> {{service.name}}</h3>
                                            <div class="col-12 pl-0">
                                                <template v-if="ifMicro">
                                                    <a-tooltip placement="top">
                                                        <template slot="title">
                                                            <span v-if="hideText != 'display:none'">Marque el adicional deseado, en caso de no aplicar marcar opción "NINGUNO" para poder avanzar.</span>
                                                        </template>
                                                        <span class="ml-1 mb-0 font-weight-bold MicroF" style="font-size: 1.2em;">Adicionales: </span>
                                                        <div v-for="(micro, indexM) in service.microServices" :key="micro.microService" v-on:click="SelectMicroFinally(index, micro, indexM)" style="display: inline-block; cursor: pointer;margin-left: 4px;margin-top:2px;">
                                                            <badge v-if="MALDITOVUE" :type="micro.checked ? 'primary' : 'secondary'" class="text-default mb-1">
                                                                <p style="font-size:1.2em;font-weight: bold;" class="fs-5 mb-0 MF">{{micro.microService}}</p>
                                                            </badge>
                                                        </div>
                                                    </a-tooltip>
                                                </template>
                                                <img src="img/brand/calendar.png" alt="">
                                            </div>
                                            
                                            <div class="col-md-12 col-sm-12 mt-2 row" style="padding: 0px !important;padding-top: 5px !important;">
                                                <div class="price-service FPrice col-6 ml-3">$ {{formatPrice(service.price)}}</div>
                                                <div class="col-2 float-right"> <a-icon style="font-size:1.7em;vertical-align: 1.6px;cursor:pointer;background-color: #f5365c;padding: 3px;border-radius: 5px;color: white;"  @click="deleteServiceFinally(service.index)" type="delete" /> </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </vuescroll>
                    
                </div>
            </div>
            <div class="text-center">
                <base-button v-on:click="endDate(selectedEvent)" :disabled="finallyDisabled" class="mt-3" type="default">Finalizar</base-button>
            </div>
        </modal>
        <a-modal v-model="modals.modal5" style="z-index:10000" :width="widthModals" title="Precio del microservicio" @cancel="changeMicroPrice" :closable="true">
            <template>
                
                <currency-input
                    v-model="microPriceClick"
                    locale="de"
                    class="form-control w-100"
                />
            </template>
            <template slot="footer">
                <base-button type="warning" size="sm" :disabled="microPriceClick >= 0 || microPriceClick != '' ? false : true" v-on:click="changeMicroPrice()" class="my-2">Confirmar</base-button>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal3" title="Horarios bloqueados" :width="widthModals" :closable="true" >
            <template>
                <a-config-provider :locale="es_ES">
                    <template #renderEmpty>
                        <div style="text-align: center">
                            <a-icon type="warning" style="font-size: 20px" />
                            <h2>Sin bloqueos registrados</h2>
                        </div>
                    </template>
                    <a-table :columns="columns" :data-source="datesBlocking" :scroll="getScreen" >
                        <template slot="date-slot" slot-scope="record, column">
                            {{column.dateBlockings | formatDate}}
                        </template>
                        <template slot="delete-slot" slot-scope="record, column">
                            <base-button @click="deleteHour(column._id, column.employe, column.dateBlocking, column.start, column.end)" size="sm" type="danger">
                                <a-icon type="close-circle" style="vertical-align:1px;font-size:1.6em;" />
                            </base-button>
                        </template>
                    </a-table>
                </a-config-provider> 
            </template>
            <template slot="footer">
                <base-button @click="modals.modal3 = false, modals.modal4 = true ,Madeyour()" size="sm" type="default">Bloquear horario</base-button>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal4" title="Registrar bloqueo" :width="widthModals" :closable="true" >
            <template>
                
                <!-- <a-date-picker placeholder="Seleccione fecha" class="w-100 clearBlockingDate" @change="selectDateBlock" format="DD-MM-YYYY" :locale="locale" /> -->
                <label class="mt-2" for="employe">Empleado <span class="text-danger" v-if="blokedBlock == true">Necesitas seleccionar un empleado</span> </label>
                <a-select class="w-100 clearBlockingEmploye" allowClear placeholder="Seleccione empleado" @change="validBlockeBlock">
                    <a-select-option v-for="employe of employeShow" :key="employe._id" @click="selectEmployeHour(employe)" :value="employe._id">
                        {{employe.name}}
                    </a-select-option>
                </a-select>
                <label for="date">Fecha</label>
                <flat-picker 
                    style="padding-top: 15px;padding-bottom: 15px;height:0"
                    :config="configDatePickerBlocked"
                    class="form-control clearBlockingDate"
                    :disabled="blokedBlock"
                    v-model="hourBlocking.dateBlocking"
                    placeholder="Seleccione una fecha">
                </flat-picker>
                <label class="mt-2" for="time">Horarios</label><br>
                <div class="row px-3">
                    <div class="col-6 px-1 pr-0">
                        <a-time-picker class="w-100 clearBlockingTime" :disabled="blokedBlock" @change="selectStartHour" placeholder="Inicio de bloqueo" :minute-step="15" format="HH:mm" />
                    </div>
                    <div class="col-6 px-1 pl-0">
                        <a-time-picker class="w-100 clearBlockingTime" :disabled="blokedBlock" @change="selectEndHour" placeholder="Fin de bloqueo" :minute-step="15" format="HH:mm" />
                    </div>
                </div>
            </template>
            <template slot="footer">
                <base-button @click="blockingHour" size="sm" type="default" :disabled="disableButton">Bloquear</base-button>
            </template>
        </a-modal>
    </div>
</template>
<script>
// COMPONENTS
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/i18n/es.js'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {Spanish} from 'flatpickr/dist/l10n/es.js';
import vueCustomScrollbar from 'vue-custom-scrollbar'
import vuescroll from 'vuescroll';
import EventBus from '../components/EventBus'
import io from 'socket.io-client';
import { Carousel, Slide } from 'vue-carousel';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import locale from 'ant-design-vue/es/date-picker/locale/es_ES';
import moment from 'moment'
//Back - End 
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import router from '../router'
import mixinUserToken from '../mixins/mixinUserToken'
import mixinHideText from '../mixins/mixinHideText'
import BaseButton from '../components/BaseButton.vue'
import es_ES from 'ant-design-vue/lib/locale-provider/es_ES';
import 'moment/locale/es';
moment.locale('es');
import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinUserToken, mixinES, mixinHideText],
    components: {
        VueCal,
        VueBootstrap4Table,
        flatPicker,
        vueCustomScrollbar,
        Carousel,
        Slide,
        VuePhoneNumberInput,
        vuescroll,
        BaseButton
    },
    data() {
      return {
        configHeader: {
            headers:{
                "x-database-connect": endPoint.database,
                'x-access-token':localStorage.userToken
            }
        },
        hourBlocking: {
            dateBlocking: '',
            employe: {},
            start: '',
            end: ''
        },
        extraData:{
            linkPhotos: '',
            secure: false,
            nature: '',
            material: '',
            emergency: false,
            details: '',
            phase: ''
        },
        es_ES,
        spinningDate: false,
        locale,
        blokedBlock: true,
        showCurrencyMicro:true,
        datesBlocking: [],
        minAddEdit:0,
        minLessEdit:0,
        moment,
        disableButton: false,
        phoneDateSelect: '',
        prueba: 'primary',
        imgEndpoint: endPoint.endpointTarget,
        auth:[],
        socket : io(endPoint.endpointTarget),
        status: localStorage.getItem('status'),
        countServices:[],
        employes:[],
        blockHour:[],
        blockHourEdit:[],
        finalDate:'',
        idDatesBlocks:'',
        readyChange: false,
        validHour: false,
        getDay: 0,
        loading:false,
        arrayLendersSelect: [],
        registerDae: {
            employeSelect: '',
            date: '',
            duration: 0,
            restTime:'',
            class: '',
            client: '',
            employeResTime: '',
            serviceSelectds: [],
            design:'nada',
            start: '',
            sort: '',
            end: '',
            valid: true
        },
        inputClientDate: true,
        editDisabled: true,
        blockCountValid:0,
        blockCountArray:[],
        radioDomingos:{
            radio1:'rad1',
            radio2:'rad2'
        },
        ifServices: false,
        validWizard: false,
        validSelectClient: false,
        registerDate: {
            services:[],
            servicesShow:[],
            employePerService:[],
            employe:[],
            employeSelect:"Seleccione un empleado",
            employeClass:null,
            employeResTime:null,
            client:null,
            duration:0,
            design:null,
            block:null,
            start:null,
            end:null,
            sort:null,
            date:null,
            valid:true,
            valid2:true,
            valid3:false
        },
        ops:{
            rail: {
                background: '#01a99a',
                opacity: 0,
                size: '9px',
                specifyBorderRadius: false,
                gutterOfEnds: null,
                gutterOfSide: '0px',
                keepShow: false
            },
            bar: {
                showDelay: 1500,
                onlyShowBarOnScroll: true,
                keepShow: false,
                background: '#c1c1c1',
                opacity: .5,
                specifyBorderRadius: false,
                minSize: 0,
                size: '6px',
                disable: false
            },
            scrollPanel: {
                scrollingX: false,
                scrollingY: true,
            }
        },
        fixSearch: true,
        searchText: '',
        searchInput: null,
        searchedColumn: '',
        historyClientColumn: [
            {
                title: 'Fecha',
                dataIndex: 'createdAt',
                fixed:'left',
                key: 'createdAt',
                scopedSlots: { customRender: 'date-format' },
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                ellipsis: true,
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                ellipsis: true,
                scopedSlots: { customRender: 'total' },
                sorter: (a, b) => a.total - b.total,
            }
        ],
        columns: [
            { 
                title: 'Fecha',
                dataIndex: 'dateBlocking',
                key: 'dateBlocking',
                scopedSlots: { customRender: 'date-slot' } 
            },
            { 
                title: 'Empleado',
                dataIndex: 'employe.name',
                key: 'employe.name'
            },
            { 
                title: 'Desde',
                dataIndex: 'start',
                key: 'start'
            },
            { 
                title: 'Hasta',
                dataIndex: 'end',
                key: 'end' 
            },
            { 
                title: 'Eliminar',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: { customRender: 'delete-slot' } 
            }
        ],
        microPriceClick: 0,
        microPriceIndex:'',
        columnsDatesClosed: [{
                label: "Fecha",
                name: "date",
                slot_name: "format-date",
                sort: true,
            },
            {
                label: "Cliente",
                name: "client",
                sort: false,
            },
            {
                label: "Prestador",
                name: "employe",
                sort: false,
            },
            {
                label: "Total",
                name: "total",
                slot_name: "format-total",
            },
        ],
        configDatesClosed: {
            card_title: "Tabla de finalizadas",
            checkbox_rows: true,
            rows_selectable : true,
            highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
            rows_selectable: true,
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
        classes: {
            table: "table-bordered table-striped"
        },
        articulo:'',
        compradorArticulo:'',
        medioPagoArticulo:'',
        estadoArticulo:'',
        idArticulo:'',
        codeArticulo:'',
        totalArticulo:'',
        haveCode:false,
        validHour: false,
        totalPrice: 0,
        modalsDialog: {
            modal2: false,
            type: '',
            icon: '',
            message: '', 
        },
        dataClient:{
            firstName: '',
            lastName: '',
            email: '',
            phone: {
                "countryCode": "CL", 
                "isValid": false, 
                "phoneNumber": "", 
                "countryCallingCode": "", 
                "formattedNumber": "", 
                "nationalNumber": "", 
                "formatInternational": "", 
                "formatNational": "", 
                "uri": "", 
                "e164": ""
            },
            instagram: '',
            attends: '',
            recommender: '',
            recommendations: '',
            birthday: '',
            lastAttend: '',
            historical: '',
            createdAt: '',
            idRecommender:'',
            valid: false,
            valid2: false
        },
        dateClient: {},
        configDate: {
            allowInput: true, 
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'm-d-Y'
        },
        dateMax:'',
        configDatePicker: {
            inline: true,
            allowInput: false,
            dateFormat: 'd-m-Y',
            locale: Spanish, // locale for this instance only
            minDate: new Date(),
            "disable": [
                    function(date) {
                        // return true to disable
                        return false;

                    }
                ]          
        },
        configDatePickerBlocked: {
            allowInput: true,
            dateFormat: 'd-m-Y',
            locale: Spanish, // locale for this instance only
            minDate: new Date(),
            enable: []        
        },
        loadImage: false,
        configDatePickerEdit: {
            allowInput: true,
            altInput: true,
            altFormat: 'd-m-Y',
            dateFormat: 'm-d-Y',
            locale: Spanish, // locale for this instance only
            minDate: new Date(),
            maxDate: '', 
            "disable": [
                function(date) {
                    // return true to disable
                    return false;

                },
                
            ] 
        },
        socketValidator: true,
        availableEmployesEdit:[],
        blockFirstEdit:[],
        validEditBlock:false,
        finalBlockEdit:[],
        dateData: {
        history:[],
        discount:{discount:false,type:'none'},
        clientEdit: null,
        fechaEdit: null,
        startEdit: null,
        endEdit: null,
        lenderEdit: null,
        classFinalEdit: null,
        duracionEdit: null,
        dateEditId: null,
        resTimeFinalEdit:null,
        fechaEditPick:null
        },
        selectedDates:{
            client:'',
            closedArray:[],
            services:[],
            clientSplit:'',
            employes:'',
            design:0,
            comision:0,
            totaLocal:0,
            total:0,
            discount:0,
            discountSplit:[],
            discountBetter:[],
            employeDiscount:[],
            endDatesId:[],
            clientIds:[],
            ifrecomend:0
        },
        employeByDate: 'Filtrar por empleado', 
        clients:[],
        closedDates:[],
        employeShow:[],
        services:[],
        localee: 'es',
        filter: false,
        events: [],
        lender:"",
        imgLender:endPoint.imgEndpoint+localStorage.imageUser,
        users:[],
        img1:'',
        img2:'',
        design:'',
        selectedEvent: {},
        payCash:0,
        payTransfer:0,
        payOthers:0,
        payDebit:0,
        payCredit:0,
        payOrder:0,
        servicesFinish:[],
        MALDITOVUE: true,
        modals: {
            modal1:false,
            modal2: false,
            modal3: false,
            modal4: false,
            modal5: false,
            message: "",
            icon: '',
            type:''
        },
        dateModals: {
            modal1:false,
            modal2:false,
            modal3:false,
            modal4:false,
            modal5:false,
            modal6:false,
            modal7:false
        },
        finallyDisabled: false,
        categories: [],
        radio: {
        radio1: "radio1",
        radio2: "radio3"
        },
        spinningEdit: false,
        CatSelected: 'Categorias',
        endId:'',
        endServices:[],
        endClient: '',
        endEmploye: '',
        endId:'',
        dataEditSend: {
            date: "",
            employe: {},
            start: "",
            end: "",
            duration: "",
            service: "",
            idBlock: "",
            isFirst: true,
            _id: ""
        },
        serviciosSelecionadosDates:[],
        endClient:[],
        endEmploye:[],
        designEndDate:0,
        clientsNames:[],
        lengthClosedDates:0,
        file: '',
        nameFile:'Seleccione imagen',
        lenders: [],
        EndDateServices: [],
        loadingEnds:true,
        editSelectValid:true,
        availableslenders: [],
        columnsEndSelectedDates: [
            
            { title: 'Empleado', dataIndex: 'employe', key: 'employe' },
            { title: 'Cliente', dataIndex: 'client', key: 'cliente' },
            { title: 'Diseño', dataIndex: 'design', key: 'design', scopedSlots: { customRender: 'diseño' } },
            
            { title: 'Descuento', dataIndex: 'descuento', key: 'descuento', scopedSlots: { customRender: 'descuento' } },
            { title: 'Total', dataIndex: 'total', key: 'total', scopedSlots: { customRender: 'total' } },
        ],
        stickySplitLabels: true,
        minCellWidth: 400,
        minSplitWidth: 0,
        splitDays: [],
        load1:false,
        load2:false,
        load3:false,
        load4:false,
        load5:false,
        delay:1500,
        configHeader: {
            headers: {
                "x-database-connect": endPoint.database, 
                "x-access-token": localStorage.userToken
            }
        },
        employeForSearchEdit:'',
        branch: '',
        branchName: '',
        ifMicro:false,
        microServices:[],
        configurations: {},
        startCalendar: 0,
        endCalendar: 0,
        hideDays: [],
        servicesCat: [],
        serviceSelected: [],
        servicesPhoneShow:false,
        showCalendar: true,
        spinningView: false
      };
    },
    created(){
        this.getToken()
        // this.validatorLender()
        // this.getClients()
        // this.getServices()
        // this.getUsers()
        this.getBranch()
        this.device()
        this.getUserData()
        // this.getClosed()
        // this.getCategories()
        
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        getToken(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)  
            this.auth = decoded.access
            console.log(localStorage.firstname)
        },
        selectDateBlock(date, dateString){
            this.hourBlocking.dateBlocking = dateString
        },
        selectStartHour(value){
            this.hourBlocking.start = moment(value).format("HH:mm")
        },
        selectEndHour(value){
            this.hourBlocking.end = moment(value).format("HH:mm")
        },
        selectEmployeHour(employe){
            this.hourBlocking.employe = {
                name: employe.name,
                document: employe.document,
                id: employe._id
            }
            this.configDatePickerBlocked.enable = []
            for (let i = 0; i < employe.days.length; i++) {
                const element = employe.days[i];
                this.configDatePickerBlocked.enable.push(
                    function(date) {
                        return (date.getDay() === element.day );
                    } 
                )    
            }
            this.blokedBlock = false
        },
        setView(view){
            if (view == 'calendar') {
                this.spinningView = true
                setTimeout(() => {
                    this.showCalendar = true
                    this.spinningView = false
                }, 500);
            }else{
                this.spinningView = true
                setTimeout(() => {
                    this.showCalendar = false
                    this.spinningView = false
                }, 500);
            }
        },
        async getBlockingHours(){
            try {
                const getDeletes = await axios.get(`${endPoint.endpointTarget}/dates/deleteBlockingHours/${this.branch}`, this.configHeader)
                try {
                    const blockHour = await axios.get(`${endPoint.endpointTarget}/dates/getBlockingHours/${this.branch}`, this.configHeader)
                    if (blockHour.data.status == 'ok') {
                        this.datesBlocking = blockHour.data.data
                    }else{
                        this.datesBlocking = []
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
        async selectCategoryPhone(name){
            // for (let j = 0; j < this.serviceSelected.length; j++) {
            //     const element = this.serviceSelected[j];
            //     if (element.set == false) {
            //         this.serviceSelected.splice(j, 1)
            //         this.servicePhoneCount.splice(j, 1)
            //     }
            // }
            this.servicesPhoneShow = false
            this.servicesCat = []
            try {
                const services = await  axios.post(endPoint.endpointTarget+'/services/servicesByCategory', {
                    name: name,
                    branch: this.branch
                }, this.configHeader)
                if (services.data.status == 'ok') {
                    this.servicesPhoneShow = true
                    this.servicesCat = services.data.data
                    this.CatSelected = name
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Categoria sin servicios.',
                        showConfirmButton: false,
                        timer: 2500
                    })
                }
            }catch (err){
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
        validObject (){
            if (this.serviceSelected.length === 0) {
                return false
            }else{
                return true
            }
        },
        device(){
            if (screen.width < 768) {
                this.configDatePicker.inline = true
                return true
            }else{
                return false
            }
        },
        async editDateData(){
            try{
                const editDate = await axios.post(endPoint.endpointTarget+'/dates/editDataDate',{
                    id: this.selectedEvent._id,
                    location: this.selectedEvent.client.location,
                    link: this.selectedEvent.extraData.linkPhotos,
                    details: this.selectedEvent.extraData.details
                }, this.configHeader)

                if (editDate) {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        toast: true,
                        position: 'top-end',
                        title: 'Cambio exitoso',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.getDates()
                    this.dateModals.modal1 = false
                }
            }catch(err){
                console.log(err)
            }
        },
        async selectServicePhone(id){
            try {
                const service = await axios.get(endPoint.endpointTarget+'/services/getServiceInfo/'+id, this.configHeader)
                if (service.data.status == 'ok') {
                    service.data.data.set = false
                    this.serviceSelected.unshift(service.data.data)
                    this.plusServicePhone(new Date().getTime(), service.data.data.name, service.data.data._id, service.data.data.duration, service.data.data.commission, service.data.data.price, service.data.data.employes, service.data.data.discount, service.data.data.products, service.data.data.additionalName)
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Error técnico.',
                        showConfirmButton: false,
                        timer: 2500
                    })
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
        plusServicePhone(index, service, id, duration, commission, price, employes, discount, products, additionalName){
            this.ifServices = true
            for (const employe of employes) {
                employe.valid = true
            }
            var lendersName = [{name: 'Primera disponible', days: '', class: '', valid:true}, ...employes]

            if (this.ifMicro) {
                var microsService = [{checked: false, duration: 0, microService: "Ninguno", price: 0, position: index}]
                for (const micro of this.microServices) {
                    microsService.push({checked: micro.checked, duration: micro.duration, microService: micro.microService, price: micro.price, position: index})
                }
                this.registerDae.serviceSelectds.push({employes: lendersName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', employeImg: '', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, blocksFirst: [], id: '', blocks: [], name: service, service_id: id, additionalName: additionalName, microServices: microsService, microServiceSelect: [], products: products})
            }else{
                this.registerDae.serviceSelectds.push({employes: lendersName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', employeImg: '', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, blocksFirst: [], id: '', blocks: [], name: service, service_id: id, additionalName: additionalName, microServices: [], microServiceSelect: [], products: products})
            }
            this.totalPrice = this.totalPrice + price
            this.validHour = false
        },
        lessServicePhone(index, price){
            this.registerDae.serviceSelectds.splice(index, 1)
            if (this.registerDae.serviceSelectds.length == 0) {
                this.ifServices = false
                this.validLender()
                this.validSchedule = false
                this.posibleLenders = []
            }
            this.validHour = false
        },
        lessService(index, service, time, card, price, count){
            if (count > 0) {
                if (this.countServices[index].count > 0) {
                    this.countServices[index].count--
                    if (this.countServices[index].count == 0) {
                        $('#'+card).css({'border-bottom': 'solid 8px #e2e3de'})
                    }
                }
                for (var i = 0; i < this.registerDae.serviceSelectds.length; i++) {
                    if (this.registerDae.serviceSelectds[i].name == service ) {
                        this.registerDae.serviceSelectds.splice(i, 1)
                        break
                    }
                }
                if (this.registerDae.serviceSelectds.length == 0) {
                    this.ifServices = false
                    this.validLender()
                    this.validSchedule = false
                    this.posibleLenders = []
                }
                this.validHour = false
                this.totalPrice = this.totalPrice - price
            }
        },
        async deleteHour(id, employe, dateBlocking, start, end){
            try {
                const blockHour = await axios.post(`${endPoint.endpointTarget}/dates/deleteBlockingHour`, {
                    id: id,
                    branch: this.branch,
                    dateBlocking: dateBlocking,
                    employe: employe,
                    start: start,
                    end: end
                }, this.configHeader)
                if (blockHour.data.status == 'ok') {
                    axios.get(endPoint.endpointTarget+'/employes/justonebyid/'+employe.id, this.configHeader)
                    .then(res => {
                        if(res.data.status == "ok"){
                            console.log(res.data.validOnline)
                            axios.put(endPoint.endpointTarget+'/employes', {
                                id:employe.id,
                                firstName: res.data.data.firstName,
                                document: res.data.data.document,
                                lastName: res.data.data.lastName,
                                days: res.data.data.days,
                                validOnline: res.data.data.validOnline,
                                branch: this.branch,
                                validBlocked:true,
                                dayValid: true
                            }, this.configHeader)
                            .then(res => {
                                if(res.data.status == "employe edited"){
                                    this.$swal({
                                        icon: 'success',
                                        title: 'Bloqueo eliminado con éxito',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    this.getBlockingHours()
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
        async blockingHour(){
            this.disableButton = true
            if (this.hourBlocking.dateBlocking != '' && this.hourBlocking.employe.name && this.hourBlocking.start != '' &&  this.hourBlocking.end != '') {
                var splitDate = this.hourBlocking.dateBlocking.split('-')
                try {console.log("PARA CUANDO DE ERROR bloquear")
                    console.log(this.hourBlocking.dateBlocking)
                    const generateLenders = await axios.post(endPoint.endpointTarget+'/dates/availableslenders',{
                        date: splitDate[1]+'-'+splitDate[0]+'-'+splitDate[2],
                        branch: this.branch
                    }, this.configHeader)
                    try {
                        const blockHour = await axios.post(`${endPoint.endpointTarget}/dates/createBlockingHour`, {
                            branch: this.branch,
                            dateBlocking: this.hourBlocking.dateBlocking,
                            employe: this.hourBlocking.employe,
                            start: this.hourBlocking.start,
                            end: this.hourBlocking.end,
                            employes: generateLenders.data.array
                        }, this.configHeader)
                        if (blockHour.data.status == 'ok') {
                            this.$swal({
                                icon: 'success',
                                title: 'Bloqueo creado con éxito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getBlockingHours()
                            this.hourBlocking = {
                                dateBlocking: '',
                                employe: {},
                                start: '',
                                end: ''
                            }
                            this.modals.modal4 = false
                            this.modals.modal3 = true
                            this.disableButton = false

                            $('.clearBlockingTime .ant-time-picker-clear').click()
                            $('.clearBlockingDate .ant-calendar-picker-clear').click()
                            $('.clearBlockingEmploye .ant-select-selection__clear').click()
                        }else{
                            this.$swal({
                                icon: 'error',
                                title: 'Bloqueo ocupado',
                                text: 'Las horas seleccionadas ya estan ocupadas por este empleado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.disableButton = false
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
                        this.disableButton = false
                    }
                }catch(err){
                    if (!err.response) {
                        this.$swal({
                            icon: 'error',
                            title: 'Error de conexión8',
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
                    this.disableButton = false
                }
            }else{
                this.$swal({
                    icon: 'error',
                    title: 'Debe llenar todos los datos',
                    showConfirmButton: false,
                    timer: 2000
                })
                this.disableButton = false
            }
        },
        getBranch(){
            this.branchName = localStorage.branchName  
            this.branch = localStorage.branch
            // this.getUsers()
            this.getConfiguration()
            this.getClients()
            this.getMicroServices()
            this.getServices()
            this.getCategories()
            this.getEmployes()
            this.getDates()
            this.getBlockingHours()
        },
        getUserData(){
            this.firstNameUser = localStorage.firstname  
            this.lastNameUser = localStorage.lastname
            this.imgUser = localStorage.imgUser
            this.idUser = localStorage._id
        },
        async getMicroServices(){
            try {
                const getMicro = await axios.get(endPoint.endpointTarget+'/configurations/getMicroservice/'+this.branch, this.configHeader)
                if (getMicro.data.status == 'ok') {
                    this.microServices = getMicro.data.data
                    for (const micro of this.microServices ) {
                        micro.checked = false
                    }
                    this.ifMicro = true
                }else{
                    this.ifMicro = false
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
        async searchClientRegex(value) {
            if (value != '') {
                this.clients = []
                try {
                    const getClient = await axios.get(endPoint.endpointTarget+'/clients/regex/'+ value, this.configHeader)
                    if (getClient.data.status == 'ok') {
                        this.clients = getClient.data.data
                    }
                }catch(err){
                    
                }
            }else{
                this.clients = []
            }
            
        },
        async getConfiguration(){
            try {
                const getConfig = await axios.get(endPoint.endpointTarget+'/configurations/'+this.branch, this.configHeader)
                if (getConfig.data.status == 'ok') {
                    this.configurations = getConfig.data.data
                    var daysBlock = []
                    for (const days of this.configurations.blockHour) {
                        if (!days.status) {
                            daysBlock.push(days.day == 0 ? 7 : days.day)
                        }
                    }
                    this.hideDays = daysBlock
                }else{
                    this.configurations = {}
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
            this.configDatePicker.maxDate = new Date().setMonth(new Date().getMonth() + this.configurations.datesPolitics.limitTimeDate)
            const blockHours = this.configurations.blockHour
            this.configDatePicker.disable = [
                function(date) {
                    return blockHours[date.getDay()].status == true ? false : true;
                }
            ]
            this.configDatePickerEdit.disable = [
                function(date) {
                    return blockHours[date.getDay()].status == true ? false : true;
                }
            ]
        },
        validatorLendersDaysSplit(change, event){
            this.splitDays = []
            if (event.view == 'day') {
                var splitStart = this.configurations.blockHour[new Date(event.startDate).getDay()].start.split(':')
                var splitEnd = this.configurations.blockHour[new Date(event.startDate).getDay()].end.split(':')
                var start = parseFloat(splitStart[0]+splitStart[1]) * 0.60
                var end = parseFloat(splitEnd[0]+splitEnd[1]) * 0.60
                this.startCalendar = parseInt(splitStart[1]) == 30 ? start + 12 : start
                this.endCalendar = end
                for (let index = 0; index < this.employeShow.length; index++) {
                    const name = this.employeShow[index];
                    for (let j = 0; j < event.events.length; j++) {
                        const element = event.events[j]
                        if (element.employe.id == name._id) {
                            this.splitDays.push({id: name._id, class: name.class+'Split', label: name.name, img: name.img})
                            break
                        }
                    }
                }
            }
        },
        validatorLender(){
            const token = localStorage.userToken
            const decoded = jwtDecode(token)
            const split = decoded.linkLender.split("/")
            this.lender = split[0]
            this.status = decoded.status
        },
        handleScroll(event){
            if (event.target.documentElement.scrollTop > 140){
                $(".buttons").addClass("fixed-top")
            }
            else {
                $(".buttons").removeClass("fixed-top")
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
        async getDates() {
            if (!this.validRoute('agendamiento', 'todas')) {
                this.events = []
                const token = this.configHeader.headers["x-access-token"]
                const decoded = jwtDecode(token)
                if (decoded.linkLender == '') {
                    this.$swal.fire({
                        icon: 'error',
                        title: 'No cuenta con permisos',
                        text: 'Para visualizar la agenda contacte a su supervisor'
                    })
                }else{
                    try {
                        const employe = await axios.get(endPoint.endpointTarget+'/employes/justonebyid/'+decoded.linkLender, this.configHeader)
                        this.getDatesByEmploye(employe.data.data._id, decoded.userImage == '' ? 'no' : decoded.userImage, employe.data.data.firstName+' '+employe.data.data.lastName)
                    }catch(err){
                        
                    }
                }
            }else{
                this.events = []
                try {
                    const dates = await axios.get(endPoint.endpointTarget+'/dates/'+this.branch, this.configHeader)
                    this.events = dates.data.data
                }catch(err){
                    
                }
            }
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
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
        getEmployes(){
  			axios.get(endPoint.endpointTarget+'/employes/UsersEmployes/'+this.branch, this.configHeader)
  			.then(res => {
                this.employeShow = res.data.data
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
        async getServices(){
            try {
                const services = await axios.get(endPoint.endpointTarget+'/services/'+this.branch, this.configHeader)
                if (services.data.status == 'ok') {
                    this.services = services.data.data 
                    console.log(this.services)
                    services.data.data.forEach(element => {this.countServices.push({count: 0})});
                }else{
                    this.services = []
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
        async getCategories(){
            try {
                const categories = await axios.get(endPoint.endpointTarget+'/services/getCategories/'+this.branch, this.configHeader)
                if (categories.data.status == 'ok') {
                    this.categories = categories.data.data
                }else{
                    this.categories = []
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
        async getClients(){
            try {
                const getAllClients = await axios.get(endPoint.endpointTarget+'/clients', this.configHeader)
                if (getAllClients.data.data.length > 0) {

                    for (let index = 0; index < getAllClients.data.data.length; index++) {
                        this.clientsNames.push(getAllClients.data.data[index].firstName + " / " + getAllClients.data.data[index].email)
                    }
                }
            }catch (err) {
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
        formatPhone(){
            var number = this.dateClient.infoOne.replace(/[^\d]/g, '')
            if (number.length == 9) {
                number = number.replace(/(\d{1})(\d{4})/, "$1-$2-");
            } else if (number.length == 10) {
                number = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            }
            this.dateClient.infoOne = number
        },
        clientEdit(){
            var ifCheck = null
            var firstName = this.MaysPrimera(this.dataClient.firstName)
            var lastName = this.MaysPrimera(this.dataClient.lastName)

            axios.put(endPoint.endpointTarget+'/clients/'+this.dataClient._id, {
                firstName: this.dataClient.firstName,
                lastName: this.dataClient.lastName,
                email: this.dataClient.email,
                phone: this.dataClient.phone,
                instagram: this.dataClient.instagram,
                birthday: this.dataClient.birthday
            },this.configHeader)
            .then(res => {
                if (res.data.status == 'update client') {
                    this.$swal({
							type: 'success',
                            icon: 'success',
							title: 'Cliente editado con éxito',
							showConfirmButton: false,
							timer: 1500
						})
                        this.clients = []
                        this.inputClientDate = false
                        this.dataClient.firstName = ''
                        this.dataClient.lastName = ''
                        this.dataClient.email = ''
                        this.dataClient.phone = ''
                        this.dataClient.instagram = ''
                        this.dataClient.birthday = ''
                        this.dataClient.valid2 = false
                        setTimeout(() => {
                            this.inputClientDate = true
                        }, 200);
                    // setTimeout(() => {
                    //     this.getClients();
                    //     // EventBus.$emit('reloadClients', 'reload')
                    // }, 1500);
                }else{
                    this.modals = {
                        modal2: true,
                        message: "El email ya existe",
                        icon: 'ni ni-fat-remove ni-5x',
                        type: 'danger'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1: true,
                            modal2: false,
                            modal3:false,
                            message: "",
                            icon: '',
                            type: ''
                        }
                    }, 1500);
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
        selectCat(cat){
            $('.categoryButton').css({'padding':'10px', 'background-color': '#d5dadd', 'color': '#434a54', 'box-shadow':'0px 0px 0px 0px rgba(0,0,0,0)'})
            $('#'+cat).css({'padding-top':'14px', 'background-color': '#174c8e', 'color': '#fff', '-webkit-box-shadow':'0px 9px 25px -7px rgba(0,0,0,0.75)', 'box-shadow':'0px 9px 25px -7px rgba(0,0,0,0.75)'})
        },
        selectCatFinally(cat){
            $('.categoryButtonFinally').css({'padding':'10px', 'background-color': '#d5dadd', 'color': '#434a54', 'box-shadow':'0px 0px 0px 0px rgba(0,0,0,0)'})
            $('#'+cat).css({'padding-top':'14px', 'background-color': '#174c8e', 'color': '#fff', '-webkit-box-shadow':'0px 9px 25px -7px rgba(0,0,0,0.75)', 'box-shadow':'0px 9px 25px -7px rgba(0,0,0,0.75)'})
        }, 
        plusService(index, service, id, duration, commission, price, employes, discount, products){
            this.ifServices = true
            this.countServices[index].count++
            this.registerDae.duration = this.registerDae.duration + parseFloat(duration)
            for (const employe of employes) {
                employe.valid = true
            }
            var employesName = [{name: 'Primera disponible', days: '', class: '', valid:true}, ...employes]
            if (this.ifMicro) {
                var microsService = [{checked: false, duration: 0, microService: "Ninguno", price: 0, position: index}]
                for (const micro of this.microServices) {
                    microsService.push({checked: micro.checked, duration: micro.duration, microService: micro.microService, price: micro.price, position: index})
                }
                this.registerDae.serviceSelectds.push({employes: employesName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', employeImg: '', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, blocksFirst: [], id: '', blocks: [], name: service, service_id: id, microServices: microsService, microServiceSelect: [], products: products})
            }else{
                this.registerDae.serviceSelectds.push({employes: employesName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', employeImg: '', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, blocksFirst: [], id: '', blocks: [], name: service, service_id: id, microServices: [], microServiceSelect: [], products: products})
            }
            this.totalPrice = this.totalPrice + price
            this.validHour = false  
        },
        Madeyour(){
            $('.ant-select-selection__clear').click()
        },
        a(){
            if (this.extraData.secure == false) {
                this.extraData.secure = true
            }else{
                this.extraData.secure = false
            }
             
        },
        b(){
            if (this.extraData.emergency == false) {
                this.extraData.emergency = true
            }else{
                this.extraData.emergency = false
            }
             
        },
        plusMicroFinally(){
            $('.thisSelect .ant-select-selection__clear').click()
            this.showCurrencyMicro = true
            this.selectedEvent.services[0].microServiceSelect = this.selectedEvent.microServices
            this.microPrice(this.selectedEvent.services, 0)
            var microServices = [{checked: false, microService: "Ninguno"}]
            for (const micro of this.microServices) {
                var valid = true
                this.selectedEvent.services[0].microServiceSelect.forEach(element => {
                    if (element.name == micro.microService) {
                        microServices.push({checked: true, duration: micro.duration, microService: micro.microService, price: micro.price})
                        valid = false
                    }
                    if (element.name == 'Ninguno') {
                        microServices[0].checked = true
                    }
                });
                if (valid) {
                    microServices.push({checked: micro.checked, duration: micro.duration, microService: micro.microService, price: micro.price})
                }
            }
            this.selectedEvent.services[0].microServices = microServices
        },
        plusServiceFinally(name, commission, price, discount, products){
            var microServices = [{checked: false, microService: "Ninguno"}]
            for (const micro of this.microServices) {
                microServices.push({checked: micro.checked, duration: micro.duration, microService: micro.microService, price: micro.price})
            }
            this.selectedEvent.services.push({name: name, commission: commission, price: price, discount: discount, products: products, index:this.selectedEvent.services.length, microServices: microServices, microServiceSelect:[]})
        },
        deleteServiceFinally(i){
            if (this.selectedEvent.services.length > 1) {
                this.selectedEvent.services.forEach((element, index) => {
                    if (i == element.index) {
                        this.selectedEvent.services.splice(index, 1)
                    }
                }); 
            }else{
                this.$swal({
                    icon: 'error',
                    title: 'Debe haber al menos 1 servicio',
                    text: 'Se debe seleccionar al menos un servicio para poder eliminar otro',
                    showConfirmButton: true,
                    confirmButtonText: 'OK'
                })
            }
        },
        SelectMicroFinally(index, micro, indexM){
            if (micro.microService == 'Ninguno') {
                this.selectedEvent.services[index].microServices.forEach(element => {
                    element.checked = false
                });
                this.selectedEvent.services[index].microServices[0].checked = true
                this.selectedEvent.services[index].microServiceSelect = []
            }else{
                if (this.selectedEvent.services[index].microServices[indexM].checked) {
                    this.selectedEvent.services[index].microServices[indexM].checked = false
                }else{
                    this.selectedEvent.services[index].microServices[indexM].checked = true
                    this.selectedEvent.services[index].microServices[0].checked = false
                }
                var valid = true
                for (let i = 0; i < this.selectedEvent.services[index].microServiceSelect.length; i++) {
                    const element = this.selectedEvent.services[index].microServiceSelect[i];
                    if (element.name == micro.microService) {
                        this.selectedEvent.services[index].microServiceSelect.splice(i, 1)
                        valid = false
                        break
                    }
                }
                if (valid) {
                    this.microPriceClick = micro.price
                    this.microPriceIndex = {
                        name: micro.microService, 
                        duration: micro.duration,
                        index: index,
                    }
                    this.modals.modal5 = true
                }
            }
            this.MALDITOVUE = false
            this.MALDITOVUE = true
            this.microPrice(this.selectedEvent.services, index)
        },
        changeMicroPrice(){
            this.selectedEvent.services[this.microPriceIndex.index].microServiceSelect.push({name: this.microPriceIndex.name, duration: this.microPriceIndex.duration, price:this.microPriceClick})
            this.modals.modal5 = false
        },
        validateWizardOne(){
            if (this.registerDate.services != '' && this.registerDate.design != false) { 
                this.registerDate.valid = true
                for (let i = 0; i < this.registerDate.employePerService.length; i++) {
                    for (let c = 0; c < this.employes.length; c++) {
                        if (this.employes[c]._id == this.registerDate.employePerService[i] ) {
                        this.registerDate.employe.push(this.employes[c])
                        }               
                    }
                }
                if (this.registerDate.design == 'si' && this.registerDate.valid3 == false) {
                    this.registerDate.duration = parseFloat(this.registerDate.duration) + 15
                    this.registerDate.valid3 = true
                }
                if (this.registerDate.design == 'no' && this.registerDate.valid3 ==true) {
                    this.registerDate.duration = parseFloat(this.registerDate.duration) - 15
                    this.registerDate.valid3 = false
                }
                this.blockHour = []
                this.registerDate.employeSelect = 'Seleccione un empleado'
                this.img1 = ''
                return true
            }
            else{
                this.registerDate.valid = false
                this.modals = {
                    modal1:true,
                    modal2: true,
                    message: "¡Debe completar todos los datos!",
                    icon: 'ni ni-fat-remove ni-5x',
                    type: 'danger'
                }
                setTimeout(() => {
                    this.modals = {
                        modal1:true,  
                        modal2: false,
                        message: '',
                        icon: '',
                        type: ''
                    }
                }, 1500); 
                return false
            } 
        },
        validateWizardTwo(){
            if (this.registerDate.client != null && this.registerDate.date != null) { 
                this.registerDate.valid = true
                this.blockHour = []
                this.registerDate.employeSelect = 'Seleccione un empleado'
                this.img1 = ''
                return true
            }
            else{
                this.registerDate.valid = false
                this.modals = {
                    modal1:true,
                    modal2: true,
                    message: "¡Debe completar todos los datos!",
                    icon: 'ni ni-fat-remove ni-5x',
                    type: 'danger'
                }
                setTimeout(() => {
                    this.modals = {
                        modal1:true,  
                        modal2: false,
                        message: '',
                        icon: '',
                        type: ''
                    }
                }, 1500); 
                return false
            } 
        },
        validateWizardThree(){
               if (this.registerDate.employeSelect != 'Seleccione un empleado' && this.registerDate.start != null) { 
                   this.registerDate.valid = true
                   return true
               }
               else{
                   this.registerDate.valid = false
                   this.modals = {
                        modal1:true,
                        modal2: true,
                        message: "¡Debe completar todos los datos!",
                        icon: 'ni ni-fat-remove ni-5x',
                        type: 'danger'
                    }
                    setTimeout(() => {
                        this.modals = {
                            modal1:true,  
                            modal2: false,
                            message: '',
                            icon: '',
                            type: ''
                        }
                    }, 1500); 
                   return false
               } 
        },
        initialState(){
            $(".ant-select-selection__clear").click()
            this.modals.modal3 = false
            this.$refs.wizard.reset()
            this.registerDate = {
                services:[],
                servicesShow:[],
                employePerService:[],
                employe:[],
                employeSelect:"Seleccione un empleado",
                employeClass:null,
                employeResTime:null,
                client:null,
                block:null,
                duration:0,
                design:false,
                date:null,
                sort:null,
                valid:true,
                valid2:true,
                valid3:false
            }
            this.readyChange = false
            this.validHour = false
            this.getDay = 0
            this.ifServices = false
            this.validWizard = false
            this.registerDae = {
                employeSelect: '',
                date: '',
                duration: 0,
                restTime:'',
                class: '',
                employeResTime: '',
                serviceSelectds: [],
                design:'nada',
                start: '',
                sort: '',
                end: '',
                valid: true
            },
            this.dateClient = {
                name:'',
                id:'',
                phone:'',
                email:'',
                location: ''
            }
            this.dataClient ={
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                instagram: '',
                attends: '',
                recommender: '',
                recommendations: '',
                birthday: '',
                lastAttend: '',
                historical: '',
                createdAt: '',
                idRecommender:'',
                valid: false,
                valid2: false
            }
            this.totalPrice = 0
            this.img1 = ''
            this.blockHour = []
            for (let index = 0; index < this.countServices.length; index++) {
                this.countServices[index].count = 0
            }
        },
        changeMin(valid){
            setTimeout(() => {
                this.spinningEdit = true
            }, 5);
            if (valid) {
                if (this.minLessEdit > 0) {
                    this.minLessEdit = this.minLessEdit - 15
                    this.dataEditSend.duration = this.dataEditSend.duration + 15
                }else{
                    this.minAddEdit = this.minAddEdit + 15
                    this.dataEditSend.duration = this.dataEditSend.duration + 15
                }
            }else{
                if (this.dataEditSend.duration == 15) {
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'No se pueden restar mas minutos',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    if (this.minAddEdit > 0) {
                        this.minAddEdit = this.minAddEdit - 15
                        this.dataEditSend.duration = this.dataEditSend.duration - 15
                    }else{
                        this.minLessEdit = this.minLessEdit + 15
                        this.dataEditSend.duration = this.dataEditSend.duration - 15
                    }
                } 
            }
            setTimeout(() => {
                this.searchBlockEdit()
            }, 500);
        },
        editEmployeDate(value){
            this.dataEditSend.employe = value
            if (this.dataEditSend.employe.id == this.dataEditSend.originalEmploye.id) {
                this.changeDateEdit()
            }else{
                this.searchBlockEdit()
            }
            
        },
        searchBlockEdit(){
            setTimeout(() => {
                this.spinningEdit = true
            }, 5);
            
            this.blockFirstEdit.forEach(element => {
                if (element.validator == 'select') {
                    element.validator = true
                }
            });
            axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                block: this.blockFirstEdit,
                timedate: this.dataEditSend.duration,
                employeSelect: this.dataEditSend.employe.id,
                firstBlock: false
            })
            .then(res => {
                this.finalBlockEdit = res.data.blockEmploye
                this.validEditBlock = true
                setTimeout(() => {
                    this.spinningEdit = false
                }, 1000);
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
        selectClient(value){
            console.log("este")
            console.log(value)
            if (value == 'register') {
                this.dataClient.valid = false
                this.dateClient.valid2 = false
            }else{
                this.dataClient.valid = true
                this.dateClient.valid2 = false
                this.validSelectClient = true
                this.dateClient = {
                    name: value.firstName + ' ' + value.lastName,
                    id: value._id,
                    location : value.extraData.location,
                    email: value.email,
                    phone: value.phone
                }
                this.dataClient = {
                    _id: value._id,
                    firstName: value.firstName,
                    lastName: value.lastName,
                    email: value.email,
                    phone: value.phone,
                    location : value.extraData.location,
                    instagram: value.instagram,
                    attends: value.attends,
                    recommender: value.recommender,
                    recommendations: value.recommendations,
                    birthday: value.birthday,
                    lastAttend: value.lastAttend,
                    createdAt: value.createdAt,
                    valid: true,
                    valid2: true 
                }
                console.log(this.dataClient)
            } 
        },
        validRegister(){
            setTimeout(() => {
                if (this.dataClient.firstName.length > 2 && this.dataClient.lastName.length > 2 && this.dataClient.email != '' && this.dataClient.phone.isValid && this.dataClient.birthday != '') {
                    if (this.dataClient.email.split('@').length == 2) {
                        if (this.dataClient.email.split('@')[1].split('.').length >= 2) {
                            this.dataClient.valid2 = true
                        }else{
                            this.dataClient.valid2 = false
                        }
                    }else{
                        this.dataClient.valid2 = false
                    }
                }
                else{
                    this.dataClient.valid2 = false
                }
                  console.log(this.dataClient.valid)
                console.log(this.dataClient.valid2)
            }, 200);
            
        },
        formatDate(date) {
            let dateFormat = new Date(date)
			return dateFormat.getDate()+"-"+(dateFormat.getMonth() + 1)+"-"+dateFormat.getFullYear()+' ('+dateFormat.getHours()+":"+('0'+dateFormat.getMinutes()).slice(-2)+")"
        },
        formatDatesGood(date) {
            let dateFormat = new Date(date)
			return dateFormat.getDate()+"-"+dateFormat.getMonth()+"-"+dateFormat.getFullYear()
        },
        MaysPrimera(string){
			return string.charAt(0).toUpperCase() + string.slice(1);
        },
        selectEmploye(nombre,clase,restTime,img){
            this.registerDate.employeSelect = nombre
            this.registerDate.employeClass = clase
            this.registerDate.employeResTime = restTime
            if (img != 'no') {
                this.img1 = img
            }
            else {
                this.img1 = "https://www.w3schools.com/howto/img_avatar.png"
            }
            this.insertDate()
        },
        insertDate(){
            this.blockHour = []
            axios.post(endPoint.endpointTarget+'/citas/getBlocks', {
                employe: this.registerDate.employeSelect,
                date: this.registerDate.date,
                time: this.registerDate.duration,
                resTime:this.registerDate.employeResTime
            })
            .then(res => { this.blockHour = res.data })
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
        sendConfirmationn(id, name, mail, start, end, services, lender){
            this.$swal({
                icon: 'info',
                title: '¿Desea enviar confirmación?',
                text: 'Correo del cliente '+mail,
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No, cancelar acción',
                showCloseButton: true,
                showLoaderOnConfirm: true
            })
            .then((result) => {
                if(result.value) {
                    const nameFormat = name
                    const contactFormat = mail
                    const startFormat = start
                    const endFormat = end
                    const dateFormat = this.finalDate
                    
                    axios.post(endPoint.endpointTarget+'/citas/sendConfirmation/'+id, {
                        name: nameFormat,
                        contact: contactFormat,
                        start: startFormat,
                        end: endFormat,
                        date: dateFormat,
                        service: services,
                        lenders: lender,
                        payment: 'No especificado'
                    })
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.$swal({
                                icon: 'success',
                                title: 'Envío exitoso!',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
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
                }else{

                }
            })
        },
        validBlockeBlock(value){
            this.blokedBlock = value == undefined ? true : false
        },
        register(){
            this.spinningDate = true
            if (this.dataClient.valid && this.validSelectClient) {
                this.ifDisabled = true
                var employeFinal = ''
                var hourFinal = ''
                for (let index = 0; index < this.registerDae.serviceSelectds.length; index++) {
                    const element = this.registerDae.serviceSelectds[index];
                    if (index > 0){
                        employeFinal = employeFinal+' - '+element.realEmploye
                        hourFinal = hourFinal+' - '+element.start+'Hrs'
                    }else{
                        employeFinal = element.realEmploye
                        hourFinal = element.start+'Hrs'
                    }
                }
                axios.post(endPoint.endpointTarget+'/dates/verifyDate', {
                    dataDate: this.registerDae,
                    date: this.finalDate,
                    branch: this.branch
                }, this.configHeader)
                .then(res => {
                    if(res.data.status == true){
                        this.spinningDate = false
                        this.$swal({
                            icon: 'error',
                            title: '¡Disculpe!',
                            text: 'El horario fue tomado recientemente, vuelva a agendar su cita.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.$refs.wizard.prevTab()
                        for (let index = 0; index < this.registerDae.serviceSelectds.length; index++) {
                            const element = this.registerDae.serviceSelectds[index];
                            element.start = ''
                            element.end = ''
                            element.sort = ''
                            element.class = ''
                            element.blocks = []
                            element.blocksFirst = []
                            element.valid = false
                            element.employe = 'Primera disponible'
                            element.employeImg = ''
                            element.employeId = ''
                            element.realEmploye = 'Primera disponible'
                        }
                        this.validHour = false
                        setTimeout(() => {
                            axios.post(endPoint.endpointTarget+'/dates/availableslenders',{
                                date: this.finalDate,
                                branch: this.branch
                            }, this.configHeader)
                            .then(res => {
                                this.getDay = res.data.day
                                this.availableslenders = res.data.array
                                axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                    date: this.finalDate,
                                    employes: res.data.array,
                                    timedate: this.registerDae.serviceSelectds[0].duration,
                                    employesServices: this.registerDae.serviceSelectds[0].employes,
                                    branch: this.branch
                                }, this.configHeader)
                                .then(res => {
                                    this.readyChange = true
                                    this.registerDae.serviceSelectds[0].valid = true
                                    this.registerDae.serviceSelectds[0].blocks = res.data.data
                                    this.registerDae.block = res.data.data
                                    $('#block0').toggle('slow')
                                })
                            })
                        }, 200);
                    }else{
                        var blockEdit = []
                        if (this.registerDae.serviceSelectds[this.registerDae.serviceSelectds.length - 1].blocksFirst.length > 0) {
                            blockEdit = this.registerDae.serviceSelectds[this.registerDae.serviceSelectds.length - 1].blocksFirst
                        }else{
                            blockEdit = this.registerDae.serviceSelectds[this.registerDae.serviceSelectds.length - 1].blocks
                        }
                        if (this.file != '') {
                            let formData = new FormData();
                            formData.append('file', this.file)
                            axios.post(endPoint.endpointTarget+'/citas/uploadPdf', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }, this.configHeader)
                            .then(res => {
                                axios.post(endPoint.endpointTarget+'/dates/noOneLender', {
                                    dataDate: this.registerDae,
                                    branch: this.branch,
                                    date: this.finalDate,
                                    client: this.dateClient,
                                    block: blockEdit,
                                    blockId: this.idDatesBlocks,
                                    extraData: this.extraData,
                                    typeCreation: 'system',
                                    pdf: res.data.nameFile,
                                    ifClient: true
                                }, this.configHeader)
                                .then(res => {
                                    if (res.data.status == "ok") {
                                        this.spinningDate = false
                                        this.$swal({
                                            type: 'success',
                                            icon: 'success',
                                            title: 'Cita creada con éxito',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        
                                        this.$refs.wizard.reset()
                                        setTimeout(() => {
                                            this.showCalendar = true
                                        }, 1000);
                                        $(".ant-select-selection__clear").click()
                                        var splitFinally = this.finalDate.split("-")
                                        this.finalDate = splitFinally[1]+"-"+splitFinally[0]+"-"+splitFinally[2]
                                        axios.post(endPoint.endpointTarget+'/notifications', {
                                            userName:'Usuario: '+localStorage.firstname + " " + localStorage.lastname,
                                            userImage: '',
                                            detail: 'Creo cita a '+this.dateClient.name+' desde agendamiento (Sistema) '+this.finalDate,
                                            branch: this.branch,
                                            link: 'agendamiento'
                                        }, this.configHeader)
                                        .then(res => {
                                            this.socket.emit('sendNotification', res.data.data)
                                        })
                                        this.initialState()
                                        
                                        this.sendConfirmation(res.data.id, this.registerUser.name, this.registerUser.email, hourFinal, this.registerDae.serviceSelectds[0].end, this.registerDae.serviceSelectds, employeFinal,this.registerDae,true)
                                        this.modals.modal2 = false
                                        this.finalDate = ''
                                        this.ifDisabled = false
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
                        }else{
                            axios.post(endPoint.endpointTarget+'/dates/noOneLender', {
                                dataDate: this.registerDae,
                                branch: this.branch,
                                date: this.finalDate,
                                client: this.dateClient,
                                block: blockEdit,
                                blockId: this.idDatesBlocks,
                                extraData: this.extraData,
                                typeCreation: 'system',
                                pdf: 'not',
                                ifClient: true
                            }, this.configHeader)
                            .then(res => {
                                if (res.data.status == "ok") {
                                    this.spinningDate = false
                                    var splitFinally = this.finalDate.split("-")
                                    this.finalDate = splitFinally[1]+"-"+splitFinally[0]+"-"+splitFinally[2]
                                    this.sendConfirmation(res.data.id, this.dateClient.name, this.dateClient.email, hourFinal, this.registerDae.serviceSelectds[0].end, this.registerDate.serviceSelectds, employeFinal, this.registerDae, true)
                                    this.$swal({
                                        type: 'success',
                                        icon: 'success',
                                        title: 'Cita creada con éxito',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    this.ifDisabled = false
                                    this.$refs.wizard.reset()
                                    axios.post(endPoint.endpointTarget+'/notifications', {
                                        userName:'Empleado: '+localStorage.firstname + " " + localStorage.lastname,
                                        userImage: '',
                                        detail: 'Creo cita a '+this.dateClient.name+' desde agendamiento (Sistema) '+this.finalDate,
                                        branch: this.branch,
                                        link: 'agendamiento'
                                    }, this.configHeader)
                                    .then(res => {
                                        this.socket.emit('sendNotification', res.data.data)
                                    })
                                    setTimeout(() => {
                                        this.showCalendar = true
                                        
                                    }, 1000);
                                    this.initialState()
                                    this.modals.modal2 = false
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
                        }
                    }
                }).catch(err => {
                    this.spinningDate = false
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
            }else{
                this.spinningDate = false
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Debe elegir un cliente',
                    showConfirmButton: false,
                    timer: 1500
                })
            }        
                  
        },
        newClient(){
            var ifCheck = null
            var firstName = this.MaysPrimera(this.dataClient.firstName)
            var lastName = this.MaysPrimera(this.dataClient.lastName)

            if (this.dataClient.discount) {
                ifCheck = 0
            }
            else{
                ifCheck = 1
            }
            var date = this.dataClient.birthday
            if (this.dataClient.birthday.split('-')[1]) {
                var split = this.dataClient.birthday.split('-')
                date = split[1]+'-'+split[0]+'-'+split[2]
            }
            const phone = this.dataClient.phone
            axios.post(endPoint.endpointTarget+'/clients', {
                firstName:this.dataClient.firstName,
                lastName: this.dataClient.lastName,
                email:this.dataClient.email,
                recommender:this.dataClient.recommender,
                idRecomender:this.dataClient.idRecommender,
                phone:this.dataClient.phone,
                birthday: date,
                instagram:this.dataClient.instagram,
                ifCheck: ifCheck
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'client create') {
                    this.$swal({
                        type: 'success',
                        icon: 'success',
                        title: 'Se registro el cliente con éxito, ya puede continuar',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.dateClient = {
                        name: res.data.data.firstName + ' ' + res.data.data.lastName,
                        id: res.data.data._id,
                        location: res.data.extraData.location,
                        email: res.data.data.email,
                        phone: res.data.data.phone
                    }
                    // setTimeout(() => {
                    //     // this.getClients()
                    //     // EventBus.$emit('reloadClients', 'reload')
                    // }, 1500);
                    
                }else{
                    this.$swal({
                        type: 'error',
                        title: 'El cliente ya existe',
                        showConfirmButton: false,
                        timer: 1500
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
        pruebaSe(){
            $(".ant-select-selection__clear").click()
        },
        getDatesByEmploye(id, img, name){
            if (id == "Todos") {
                this.getDates()
                this.filter = false
                this.employeByDate = "Filtrar por empleado"
            }
            else{
                this.events = []
                if (img != 'no') {
                    this.img2 = img
                }
                else {
                    this.img2 = "https://www.w3schools.com/howto/img_avatar.png"
                }
                axios.get(endPoint.endpointTarget+'/dates/getDatesbyemploye/'+ id, this.configHeader)
                .then(res => {
                    if (res.data.status == 'ok') {
                        this.events = res.data.data
                    }else{
                        this.$swal({
                            type: 'error',
                            icon: 'error',
                            title: 'Empleado sin citas asignadas',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    this.employeByDate = name
                    this.filter = true
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
            }
        },
        onEventClick(event, e){
            console.log("Evento")
            console.log(event)
            // this.configDatePickerEdit.minDate = ''
            this.selectedEvent = event
            this.originalEmploye = this.selectedEvent.employe
            var start = this.selectedEvent.start
            axios.get(endPoint.endpointTarget+'/dates/getDate/'+this.selectedEvent._id, this.configHeader)
            .then(res => {
                this.selectedEvent.createdAt = new Date(res.data.data.createdAt).format('MM-DD-YYYY')
            })
            
            this.dateModals.modal1 = true
            if (new Date(this.selectedEvent.start).valueOf() < new Date().valueOf()) {
                this.editDisabled = true
            }else{
                this.editDisabled = false
            }
            axios.get(endPoint.endpointTarget+'/clients/findOne/'+this.selectedEvent.client.id, this.configHeader)
            .then(res => {
                if (res.data.data.attends == 0) {
                    this.dateData.discount.discount = true
                    this.dateData.discount.type = 'first'
                }
                else if(res.data.data.recommendations > 0) {
                    this.dateData.discount.discount = true
                    this.dateData.discount.type = 'recomnd'
                }else{
                    this.dateData.discount.discount = false
                    this.dateData.discount.type = 'none'
                }
                this.phoneDateSelect = res.data.data.phone.formatInternational
                this.dateData.history = []
                this.dateData.history = res.data.data.historical
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
            e.stopPropagation()
            // setTimeout(() => {
                
            //     this.selectedEvent.createdAt = event.createdAt
            //     this.configDatePickerEdit.minDate = new Date()
            //     console.log(this.selectedEvent)
            //     console.log("AQUI")
            
            // }, 2000);
        },
        dateSplit(value){
            const date = new Date(value).format('DD MM YYYY')
            var formatDate = date.split(' ')
            return formatDate[0]+'-'+formatDate[1]+'-'+formatDate[2]
        },
        dateSplit2(value){
            const date = new Date(value).format('DD MM YYYY')
            var formatDate = date.split(' ')
            return formatDate[0]+'-'+formatDate[1]+'-'+formatDate[2]
        },
        dateSplitHours(value){
            const date = new Date(value).format('DD-MM-YYYY HH:mm')
            var formatTime = date.split(' ')[1]
            return formatTime
        },
        formatName(name){
            if (name) {
                var sp = name.split(" / ")
                return sp[0]
            } 
        },
        formatContact(contact){
            if (contact) {
                var sp = contact.split(" / ")
                if (sp[2]) {
                    return sp[1]+' / '+sp[2]
                }else{
                    return sp[1]
                }
            }
        },
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        formatDateTwo(date) {
            let dateFormat = new Date(date+' 10:00')
            return (dateFormat.getMonth() + 1)+"-"+dateFormat.getDate()+"-"+dateFormat.getFullYear()
        },
        dataEdit(){
            axios.get(endPoint.endpointTarget+'/dates/getDate/'+this.selectedEvent._id, this.configHeader)
            .then(res => {
                this.configDatePickerEdit.minDate = ""
                this.dataEditSend = {
                    date: this.$options.filters.formatDateEdit(res.data.data.createdAt),
                    employe: res.data.data.employe,
                    originalEmploye: res.data.data.employe,
                    start: res.data.data.start.split(" ")[1],
                    end: res.data.data.end.split(" ")[1],
                    duration: res.data.data.duration,
                    service: res.data.service,
                    idBlock: "",
                    isFirst: true,
                    _id: this.selectedEvent._id
                }
                console.log("este")
                console.log(this.dataEditSend)
                this.editSelectValid = false
                setTimeout(() => {
                    this.editSelectValid = true
                }, 100);
                this.dataEditSend.service.employes.forEach((element, i) => {
                    if (element.name == 'Primera disponible') {
                        this.dataEditSend.service.employes.splice(i, 1)
                    }
                });
                setTimeout(() => {
                    axios.post(endPoint.endpointTarget+'/dates/availableslenders',{
                        date: this.dataEditSend.date,
                        branch: this.branch
                    }, this.configHeader)
                    .then(res => {
                        console.log(res)
                        this.availableEmployesEdit = res.data.array
                        axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                            date: this.dataEditSend.date,
                            employes: res.data.array,
                            timedate: this.dataEditSend.duration,
                            employesServices: this.dataEditSend.service.employes,
                            branch: this.branch
                        }, this.configHeader)
                        .then(res => {
                            this.blockFirstEdit = res.data.data
                            this.dataEditSend.idBlock = res.data.id
                            axios.post(endPoint.endpointTarget+'/dates/editdateblockbefore',{
                                block: this.blockFirstEdit,
                                originalEmploye: this.dataEditSend.originalEmploye.id,
                                employe: this.dataEditSend.employe,
                                start: this.dataEditSend.start,
                                end: this.dataEditSend.end
                            }, this.configHeader)
                            .then(res => {
                                this.blockFirstEdit = res.data.data
                                this.searchBlockEdit()
                                this.dateModals.modal2 = true
                                this.configDatePickerEdit.minDate = new Date()
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
                    }).catch(err => {
                        if (!err.response) {
                            this.$swal({
                                icon: 'error',
                                title: 'Error de conexión6',
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
                }, 200);
            }).catch(err => {

            }) 
            // if (this.originalEmploye.id != this.selectedEvent.employe.id) {
            //     this.selectedEvent.employe = this.originalEmploye
            // }
            
            // if (this.selectedEvent.createdAt.includes("T")) {
            //     this.selectedEvent.createdAt = this.selectedEvent.createdAt.split("T")[0].split("-")[1] + "-" + this.selectedEvent.createdAt.split("T")[0].split("-")[2] + "-" + this.selectedEvent.createdAt.split("T")[0].split("-")[0]
            //     console.log(this.selectedEvent.createdAt)
            // }
            // console.log(this.selectedEvent.createdAt)

            
            // this.selectedEvent.isFirst = true
            // this.employeForSearchEdit = this.selectedEvent.employe.id
            // this.minLessEdit = 0
            // this.minAddEdit = 0
            // this.finalBlockEdit = []
            // this.validEditBlock = false
            
            
        },
        changeDateEdit(){
            setTimeout(() => {
                this.spinningEdit = true
            }, 5);
            setTimeout(() => {
                const finalDate = this.dataEditSend.date
                // console.log(new Date(this.selectedEvent.start))
                if (finalDate != '') {
                    setTimeout(() => {
                        axios.post(endPoint.endpointTarget+'/dates/availableslenders',{
                            date: this.dataEditSend.date,
                            branch: this.branch
                        }, this.configHeader)
                        .then(res => {
                            this.availableEmployesEdit = res.data.array
                            axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                date: this.dataEditSend.date,
                                employes: res.data.array,
                                timedate: this.dataEditSend.duration,
                                employesServices: this.dataEditSend.service.employes,
                                branch: this.branch
                            }, this.configHeader)
                            .then(res => {
                                if (new Date(finalDate).getMonth() == new Date(this.selectedEvent.createdAt).getMonth() && new Date(finalDate).getDate() == new Date(this.selectedEvent.createdAt).getDate()) {
                                    this.blockFirstEdit = res.data.data
                                    this.dataEditSend.idBlock = res.data.id
                                    axios.post(endPoint.endpointTarget+'/dates/editdateblockbefore',{
                                        block: this.blockFirstEdit,
                                        originalEmploye: this.originalEmploye.id,
                                        employe: this.dataEditSend.employe,
                                        start: this.dataEditSend.start,
                                        end: this.dataEditSend.end
                                    }, this.configHeader)
                                    .then(res => {
                                        this.blockFirstEdit = res.data.data
                                        this.searchBlockEdit()
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
                                }else{
                                   this.dataEditSend.idBlock = res.data.id
                                    this.blockFirstEdit = res.data.data
                                    this.blockFirstEdit.forEach(element => {
                                        if (element.validator == 'select') {
                                            element.validator = true
                                        }
                                    })
                                    axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                                        block: this.blockFirstEdit,
                                        timedate: this.dataEditSend.duration,
                                        employeSelect: this.dataEditSend.employe.id,
                                        firstBlock: false
                                    })
                                    .then(res => {
                                        this.finalBlockEdit = res.data.blockEmploye
                                        this.validEditBlock = true
                                        this.searchBlockEdit()
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
                                }
                                
                            }).catch(err => {
                                if (!err.response) {
                                    this.$swal({
                                        icon: 'error',
                                        title: 'Error de conexión1',
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
                        }).catch(err => {
                            if (!err.response) {
                                this.$swal({
                                    icon: 'error',
                                    title: 'Error de conexión5',
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
                    }, 500);
                }
            }, 200);
        },
        selectEmployeEdit(name, date){
            const getDay = new Date(date+' 10:00').getDay()
            for (let index = 0; index < this.employes.length; index++) {
                if (this.employes[index].nombre == name) {
                    var rest = ''
                    for (let j = 0; j < this.employes[index].days.length; j++) {
                        const element = this.employes[index].days[j];
                        if (element.day == getDay) {
                            rest = element.hours[0]+'/'+element.hours[1]
                        }
                    }
                    this.dateData.lenderEdit = this.employes[index].nombre
                    this.dateData.classFinalEdit = this.employes[index].class
                    this.dateData.resTimeFinalEdit = rest
                    this.insertDateTwo()
                    break
                }
            } 
        },
        insertDateTwo(){
            setTimeout(() => {
                if (this.dateData.fechaEditPick != null) {
                    this.blockHourEdit = []
                    axios.post(endPoint.endpointTarget+'/citas/getBlocks', {
                        employe: this.dateData.lenderEdit,
                        date: this.dateData.fechaEditPick,
                        time: this.dateData.duracionEdit,
                        resTime:this.dateData.resTimeFinalEdit
                    })
                    .then(res => {
                        this.blockHourEdit = res.data
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
                }
                else {
                    this.blockHourEdit = []
                    axios.post(endPoint.endpointTarget+'/citas/getBlocks', {
                        employe: this.dateData.lenderEdit,
                        date: this.dateData.fechaEdit ,
                        time: this.dateData.duracionEdit,
                        resTime:this.dateData.resTimeFinalEdit
                    })
                    .then(res => {
                        this.blockHourEdit = res.data
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
                } 
            }, 200);
        },
        editDate(){
            console.log(this.dataEditSend)
            var valid = false
            if (this.validEditBlock) {
                this.finalBlockEdit.forEach(element => {
                    if (element.validator == 'select') {
                        valid = true
                    }
                });
                if (valid == false) {
                    this.$swal({
                        type: 'error',
                        icon: 'error',
                        title: 'Disculpe, debe elegir un horario',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else{
                valid = true
            }
            if(valid){
                axios.post(endPoint.endpointTarget+'/dates/editdate', {
                    data: this.dataEditSend,
                    blocks : this.blockFirstEdit
                }, this.configHeader)
                .then(res => {
                    if (res.data.status == 'ok') {
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            title: 'Cita editada',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        
                        var idArray = [{_id: this.dataEditSend._id}]
                        this.dataEditSend.service.microServiceSelect = this.selectedEvent.microServices
                        this.dataEditSend.service.start = this.dataEditSend.start
                        this.dataEditSend.service.end = this.dataEditSend.end
                        this.dataEditSend.service.employe = this.dataEditSend.employe.name
                        this.dataEditSend.serviceSelectds = [this.dataEditSend.service]
                        var split = this.dataEditSend.date.split("-")
                        console.log(split)
                        const dateNew = split[1]+"-"+split[0]+'-'+split[2]
                        console.log(this.dataEditSend.serviceSelectds)  
                        this.finalDate = ""
                        setTimeout(() => {
                            this.sendConfirmation(idArray, this.selectedEvent.client.name, this.selectedEvent.client.email, this.dataEditSend.start, this.dataEditSend.end, this.registerDate.serviceSelectds, this.dataEditSend.employe, this.dataEditSend, true, dateNew)
                        }, 2000);
                        

                        
                        axios.post(endPoint.endpointTarget+'/notifications', {
                            branch: this.branch,
                            userName: this.firstNameUser + " " + this.lastNameUser,
                            userImage: this.imgUser,
                            detail:'Editó una cita con servicio: ' + this.dataEditSend.service.name + ' para el día '+ dateNew + ' con empleado: ' + this.dataEditSend.employe.name + ' y cliente: ' + this.selectedEvent.client.name,
                            link: 'agendamiento'
                        }, this.configHeader)
                        .then(res => {
                            this.socket.emit('sendNotification', res.data.data)
                        }) 
                        this.dateModals.modal2 = false
                        this.dateModals.modal1 = false
                        this.getDates()
                    }else{
                        this.$swal({
                            type: 'error',
                            icon: 'error',
                            title: 'Problemas tecnicos',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }).catch(err => {
                    if (!err.response) {
                        this.$swal({
                            icon: 'error',
                            title: 'Error de conexión editar',
                            text: err,
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
        initialDate(val){
            this.$refs.table.$children[0].unSelectAllItems()
            $('.desMarc').prop('checked' , false)
            if (val == 1) {
                this.selectedDates = {
                    client:'',
                    closedArray:[],
                    services:[],
                    clientSplit:'',
                    employes:'',
                    design:0,
                    comision:0,
                    totaLocal:0,
                    total:0,
                    discount:0,
                    discountSplit:[],
                    discountBetter:[],
                    employeDiscount:[],
                    endDatesId:[],
                    clientIds:[]
                }
                this.payCash = 0
                this.payTransfer = 0
                this.payOthers = 0
                this.payDebit = 0
                this.payCredit = 0
                this.payOrder = 0
                this.haveCode == false
            }
            else {
               this.selectedDates = {
                    client:'',
                    closedArray:[],
                    services:[],
                    clientSplit:'',
                    employes:'',
                    design:0,
                    comision:0,
                    totaLocal:0,
                    total:0,
                    discount:0,
                    discountSplit:[],
                    discountBetter:[],
                    employeDiscount:[],
                    endDatesId:[],
                    clientIds:[]
                }
                this.closedDates = []
                this.payCash = 0
                this.payTransfer = 0
                this.payOthers = 0
                this.payDebit = 0
                this.payCredit = 0 
            }
            
        },
        endDate(data){
            this.finallyDisabled = true
            var valid = false
            const dataFinal = data
            for (const element of data.services) {
                if (element.microServiceSelect && element.microServiceSelect.length == 0) {
                    valid = true
                    break
                }
            }
            if (valid) {
                valid = false
                this.$swal({
                    icon: 'warning',
                    title: '¿Uno o mas de los servicios agregados se finalizaran sin servicios adicionales, deseas continuar?',
                    text: 'No puedes revertir esta acción',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No, evitar acción',
                    showCloseButton: true,
                    showLoaderOnConfirm: true
                })
                .then((result) => {
                    if(result.value) {
                        axios.post(endPoint.endpointTarget+'/dates/endDate/'+data._id, {
                            service:dataFinal.services,
                            client:dataFinal.client,
                            branch:this.branch,
                            employe: dataFinal.employe
                        }, this.configHeader)
                        .then(res => {
                            if (res.data.status == 'ok') {
                                this.$swal({
                                    type: 'success',
                                    icon: 'success',
                                    title: 'Cita finalizada con éxito',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                                
                                EventBus.$emit('reloadFinallyDates', 'reload') 
                                this.dateModals.modal1 = false
                                this.dateModals.modal3 = false
                                this.finallyDisabled = false
                                axios.post(endPoint.endpointTarget+'/notifications', {
                                    branch: this.branch,
                                    userName:this.firstNameUser + " " + this.lastNameUser,
                                    userImage:this.imgUser,
                                    detail:'Finalizó una cita',
                                    link: 'agendamiento'
                                }, this.configHeader)
                                .then(res => {
                                    this.socket.emit('sendNotification', res.data.data)
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
                    }
                    else{
                        this.$swal({
                            type: 'info',
                            icon: 'info',
                            title: 'Acción cancelada',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.finallyDisabled = false
                    }
                })
            }else {
                axios.post(endPoint.endpointTarget+'/dates/endDate/'+data._id, {
                    service:data.services,
                    client:data.client,
                    branch:this.branch,
                    employe: data.employe,
                    microServices: data.microServices
                }, this.configHeader)
                .then(res => {
                    if (res.data.status == 'ok') {
                        this.$swal({
                            type: 'success',
                            icon: 'success',
                            title: 'Cita finalizada con éxito',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        EventBus.$emit('reloadFinallyDates', 'reload')
                        this.dateModals.modal1 = false
                        this.dateModals.modal3 = false
                        this.finallyDisabled = false
                        axios.post(endPoint.endpointTarget+'/notifications', {
                            branch: this.branch,
                            userName:this.firstNameUser + " " + this.lastNameUser,
                            userImage:this.imgUser,
                            detail:'Finalizó una cita',
                            link: 'agendamiento'
                        },this.configHeader)
                        .then(res => {
                            this.socketValidator = false
                            this.socket.emit('sendNotification', res.data.data)
                            this.socketValidator = true
                            
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
            }
        },
        deleteDate(id,cliente, validEmail){
            this.$swal({
                icon:'warning',
                title: validEmail ? '¿Desea cancelar cita?' : '¿Desea eliminar cita?',
                text: validEmail ? '¡Recuerda! Se procederá a cancelar del calendario y no se podrá revertir esta acción' : '¡Recuerda! Se procederá a eliminar del calendario y no se podrá revertir esta acción',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No, cancelar',
                showCloseButton: true,
                showLoaderOnConfirm: true
            })
            .then((result) => {
                if(result.value) {
                    axios.delete(endPoint.endpointTarget+'/dates/' + id, this.configHeader)
                    .then(res => {
                        if(res.data.status == 'deleted'){
                            if (validEmail) {
                                var micro = ''
                                res.data.data.microServices.forEach((element,index)=> {
                                    if (res.data.data.microServices[index + 1]) {
                                        micro = micro + element.name + ' - '
                                    }else{
                                        micro = micro + element.name
                                    }
                                });
                                axios.post(endPoint.endpointTarget+'/mails/responseDate', {
                                    client: res.data.data.content,
                                    clientMail: res.data.data.client.email,
                                    email: res.data.branchEmail,
                                    branchName: res.data.branchName,
                                    start: res.data.data.start.split(" ")[1],
                                    end: res.data.data.end.split(" ")[1],
                                    date: res.data.data.start.split(" ")[0],
                                    employe: res.data.data.employe.name,
                                    service: res.data.data.title,
                                    micro: micro,
                                    logo: res.data.logo,
                                    confirmed: false,
                                    system: true,
                                    user: localStorage.firstname + ' ' + localStorage.lastname + ' (' + localStorage.email + ')'
                                }, this.configHeader)
                                .then(res => {
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                            }

                            this.$swal({
                                type: 'success',
                                icon: 'success',
                                title: 'Cita eliminada',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.events = []
                            this.dateModals.modal1 = false
                            this.getDates();
                            axios.post(endPoint.endpointTarget+'/notifications', {
                                branch: this.branch,
                                userName:this.firstNameUser + " " + this.lastNameUser,
                                userImage:this.imgUser,
                                detail:`Eliminó la cita de ${res.data.data.client.name} para el dia: ${new Date(res.data.data.start.split(" ")[0]).format('DD-MM-YYYY')} con empleado: ${res.data.data.employe.name} ( ${new Date().format('DD-MM-YYYY')} )`,
                                link: 'agendamiento'
                            }, this.configHeader)
                            .then(respo => {
                                this.socket.emit('sendNotification', respo.data.data)
                            }) 
                        }
                    }).catch(err => {
                        console.log(err)
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
                else{
                    this.$swal({
                        type: 'info',
                        icon: 'info',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }) 
        },
        closeDate(id){
            axios.put(endPoint.endpointTarget+'/citas/closeDate/'+id)
            .then(res => {
                if (res.data.status == 'ok') {
                    this.selectedEvent.process = false
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
        ProccessSelectedDates(){
            this.dateModals.modal4 = false 
            this.selectedDates.total = 0      
            for (let index = 0; index < this.selectedDates.closedArray.length; index++) {
                this.selectedDates.closedArray[index].payCash = 0
                this.selectedDates.closedArray[index].payTransfer = 0
                this.selectedDates.closedArray[index].payOthers = 0
                this.selectedDates.closedArray[index].payCredit = 0
                this.selectedDates.closedArray[index].payDebit = 0
                this.selectedDates.closedArray[index].payOrder = 0
                this.selectedDates.closedArray[index].porqueSi = []
                this.selectedDates.closedArray[index].porqueSi.push({NoEntendi:"Bueh"})
                const position = this.selectedDates.closedArray[index]
                const des = parseFloat(this.selectedDates.closedArray[index].design) / parseFloat(2)
                position.total = position.descuento > 0 ? position.total - (position.total / 100 * position.descuento) : position.total
                position.totalLocal = position.descuento > 0 ? position.totalLocal - (position.totalLocal / 100 * position.descuento) + parseFloat(des) : parseFloat(position.totalLocal) + parseFloat(des)
                position.ifrecomend= position.descuento == 15 ? 1 : 0
                position.comision = position.descuento > 0 ? position.comision - (position.comision / 100 * position.descuento) + parseFloat(des) : parseFloat(position.comision) + parseFloat(des)
            }
            for (let i = 0; i < this.selectedDates.closedArray.length; i++) {
                this.selectedDates.total = parseFloat(this.selectedDates.total) + parseFloat(this.selectedDates.closedArray[i].total)
                this.selectedDates.design = parseFloat(this.selectedDates.design) + this.selectedDates.closedArray[i].design
            }  
            this.dateModals.modal5 = true
        },
        hundredPorcent(tipo, index){
            var service = this.selectedDates.closedArray[index].services[0].servicio
            this.selectedDates.closedArray[index].services[0].servicio = " "
            if (tipo == "efectivo") {
                this.selectedDates.closedArray[index].payCash = 0
                this.selectedDates.closedArray[index].payTransfer = 0
                this.selectedDates.closedArray[index].payOthers = 0
                this.selectedDates.closedArray[index].payCredit = 0
                this.selectedDates.closedArray[index].payDebit = 0
                this.selectedDates.closedArray[index].payCash = parseFloat(this.selectedDates.closedArray[index].total) - parseFloat(this.selectedDates.closedArray[index].payOrder)
                $(".inputsVenta").removeClass("allSelected")
            }
            if (tipo == "trasnferencia") {
                this.selectedDates.closedArray[index].payCash = 0
                this.selectedDates.closedArray[index].payTransfer = 0
                this.selectedDates.closedArray[index].payOthers = 0
                this.selectedDates.closedArray[index].payCredit = 0
                this.selectedDates.closedArray[index].payDebit = 0
                this.selectedDates.closedArray[index].payTransfer = parseFloat(this.selectedDates.closedArray[index].total) - parseFloat(this.selectedDates.closedArray[index].payOrder)
                $(".inputsVenta").removeClass("allSelected")
            }
            if (tipo == "others") {
                this.selectedDates.closedArray[index].payCash = 0
                this.selectedDates.closedArray[index].payTransfer = 0
                this.selectedDates.closedArray[index].payOthers = 0
                this.selectedDates.closedArray[index].payCredit = 0
                this.selectedDates.closedArray[index].payDebit = 0
                this.selectedDates.closedArray[index].payOthers = parseFloat(this.selectedDates.closedArray[index].total) - parseFloat(this.selectedDates.closedArray[index].payOrder)
                $(".inputsVenta").removeClass("allSelected")
            }
            if (tipo == "credit") {
                this.selectedDates.closedArray[index].payCash = 0
                this.selectedDates.closedArray[index].payTransfer = 0
                this.selectedDates.closedArray[index].payOthers = 0
                this.selectedDates.closedArray[index].payCredit = 0
                this.selectedDates.closedArray[index].payDebit = 0
                this.selectedDates.closedArray[index].payCredit = parseFloat(this.selectedDates.closedArray[index].total) - parseFloat(this.selectedDates.closedArray[index].payOrder)
                $(".inputsVenta").removeClass("allSelected")
            }
            if (tipo == "debit") {
                this.selectedDates.closedArray[index].payCash = 0
                this.selectedDates.closedArray[index].payTransfer = 0
                this.selectedDates.closedArray[index].payOthers = 0
                this.selectedDates.closedArray[index].payCredit = 0
                this.selectedDates.closedArray[index].payDebit = 0
                this.selectedDates.closedArray[index].payDebit = parseFloat(this.selectedDates.closedArray[index].total) - parseFloat(this.selectedDates.closedArray[index].payOrder)
                $(".inputsVenta").removeClass("allSelected")
            }
            if (tipo == "allEfectivo") {
                for (let i = 0; i < this.selectedDates.closedArray.length; i++) {
                    this.selectedDates.closedArray[i].payCash = 0
                    this.selectedDates.closedArray[i].payTransfer = 0
                    this.selectedDates.closedArray[i].payOthers = 0
                    this.selectedDates.closedArray[i].payCredit = 0
                    this.selectedDates.closedArray[i].payDebit = 0
                    this.selectedDates.closedArray[i].payCash = parseFloat(this.selectedDates.closedArray[i].total) - parseFloat(this.selectedDates.closedArray[i].payOrder)  
                }
                $(".inputsVenta").removeClass("allSelected")
                $("."+tipo).addClass("allSelected")
                
            }
            if (tipo == "allTransferencia") {
                for (let i = 0; i < this.selectedDates.closedArray.length; i++) {
                    this.selectedDates.closedArray[i].payCash = 0
                    this.selectedDates.closedArray[i].payTransfer = 0
                    this.selectedDates.closedArray[i].payOthers = 0
                    this.selectedDates.closedArray[i].payCredit = 0
                    this.selectedDates.closedArray[i].payDebit = 0
                    this.selectedDates.closedArray[i].payTransfer = parseFloat(this.selectedDates.closedArray[i].total) - parseFloat(this.selectedDates.closedArray[i].payOrder)  
                }
                $(".inputsVenta").removeClass("allSelected")
                $("."+tipo).addClass("allSelected")
                
            }
            if (tipo == "allOthers") {
                for (let i = 0; i < this.selectedDates.closedArray.length; i++) {
                    this.selectedDates.closedArray[i].payCash = 0
                    this.selectedDates.closedArray[i].payTransfer = 0
                    this.selectedDates.closedArray[i].payOthers = 0
                    this.selectedDates.closedArray[i].payCredit = 0
                    this.selectedDates.closedArray[i].payDebit = 0
                    this.selectedDates.closedArray[i].payOthers = parseFloat(this.selectedDates.closedArray[i].total) - parseFloat(this.selectedDates.closedArray[i].payOrder)  
                }
                $(".inputsVenta").removeClass("allSelected")
                $("."+tipo).addClass("allSelected")
                
            }
            if (tipo == "allCredit") {
                for (let i = 0; i < this.selectedDates.closedArray.length; i++) {
                    this.selectedDates.closedArray[i].payCash = 0
                    this.selectedDates.closedArray[i].payTransfer = 0
                    this.selectedDates.closedArray[i].payOthers = 0
                    this.selectedDates.closedArray[i].payCredit = 0
                    this.selectedDates.closedArray[i].payDebit = 0
                    this.selectedDates.closedArray[i].payCredit = parseFloat(this.selectedDates.closedArray[i].total) - parseFloat(this.selectedDates.closedArray[i].payOrder)  
                }
                $(".inputsVenta").removeClass("allSelected")
                $("."+tipo).addClass("allSelected")
                
            }
            if (tipo == "allDebit") {
                for (let i = 0; i < this.selectedDates.closedArray.length; i++) {
                    this.selectedDates.closedArray[i].payCash = 0
                    this.selectedDates.closedArray[i].payTransfer = 0
                    this.selectedDates.closedArray[i].payOthers = 0
                    this.selectedDates.closedArray[i].payCredit = 0
                    this.selectedDates.closedArray[i].payDebit = 0
                    this.selectedDates.closedArray[i].payDebit = parseFloat(this.selectedDates.closedArray[i].total) - parseFloat(this.selectedDates.closedArray[i].payOrder)  
                }
                $(".inputsVenta").removeClass("allSelected")
                $("."+tipo).addClass("allSelected")
            }
            this.selectedDates.closedArray[index].services[0].servicio = service
        },
        hundredMouseOver(tipo){
			$("."+tipo).toggle()
		},
		hundredMouseNonOver(tipo){
			$("."+tipo).toggle()
        },
        findDay(days, lender){
            if (lender != 'Primera disponible') {
                if (days.length > 0) {
                    var entry = 0
                    for (let index = 0; index < days.length; index++) {
                        const element = days[index];
                        if (element.day == this.getDay ) {
                            entry = 1
                            return true
                            break
                        }
                    }
                    return false
                }else{
                    return false
                }
            }else{
                return true
            }
            
        },
        findDayEdit(days, date){
            const getDay = new Date(date+' 10:00').getDay()
            if (days.length > 0) {
                var entry = 0
                for (let index = 0; index < days.length; index++) {
                    const element = days[index];
                    if (element.day == getDay ) {
                        entry = 1
                        return true
                        break
                    }
                }
                return false
            }else{
                return false
            }
        },
        processSelected(){
            let totalFormadePago = 0
            for (let e = 0; e < this.selectedDates.closedArray.length; e++) {
                const element = this.selectedDates.closedArray[e];
                if (element.payCash == '') {
				    element.payCash = 0
                }
                if (element.payOthers == '') {
                    element.payOthers = 0
                }
                if (element.payTransfer == '') {
                    element.payTransfer = 0
                }
                if (element.payDebit == '') {
                    element.payDebit = 0
                }
                if (element.payCredit == '') {
                    element.payCredit = 0
                }
                if (element.payOrder == '') {
                    element.payOrder = 0
                }
                totalFormadePago = parseFloat(totalFormadePago)+ parseFloat(element.payCash) + parseFloat(element.payOthers) + parseFloat(element.payTransfer) + parseFloat(element.payDebit) + parseFloat(element.payCredit) + parseFloat(element.payOrder)
            }
            
            if (this.selectedDates.discount == '') {
            this.selectedDates.discount = 0
            }
            if (this.selectedDates.design == '') {
            this.selectedDates.design = 0
            }
            

            if (this.selectedDates.total == totalFormadePago) {
                axios.post(endPoint.endpointTarget+'/ventas/processEndDates', {
                    arrayClosedDates:this.selectedDates.closedArray
                })
                .then(res => {
                    if (res.data.status == "Venta registrada") {
                        if (this.haveCode == true) {
                            axios.get(endPoint.endpointTarget+'/pedidos/useCode/'+this.idArticulo)
                            .then( res =>{})
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
                        this.initialDate()
                        this.dateModals.modal5 = false
                        this.modalsDialog = {
                            modal2: true,
                            message: "¡Venta procesada!",
                            icon: 'ni ni-check-bold ni-5x',
                            type: 'success'
                        }
                        
                        this.getClosed()
                        axios.post(endPoint.endpointTarget+'/notifications', {
                            branch: this.branch,
                            userName:this.firstNameUser + " " + this.lastNameUser,
                            userImage:this.imgUser,
                            detail:'Procesó citas finalizadas',
                            link: 'agendamiento'
                        })
                        .then(res => {
                            this.socket.emit('sendNotification', res.data.data)
                        })
                        setTimeout(() => {
                            this.modalsDialog = {
                                modal2: false,
                                message: "",
                                icon: '',
                                type: ''
                            }
                        }, 1500);
                    }
                    else if(res.data.status == "no-cash"){
                            this.dateModals.modal5 = false
							this.modalsDialog = {
                                modal2: true,
                                message: "Primero debe registrar un fondo de caja",
                                icon: 'ni ni-fat-remove ni-5x',
                                type: 'danger'
                            }
                            setTimeout(() => {
                                this.dateModals.modal5 = true
                                this.modalsDialog = {
                                    modal2: false,
                                    message: "",
                                    icon: '',
                                    type: ''
                                }
                            }, 1500);
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
            }
            else{
                this.$swal({
                    type: 'error',
                    title: 'Total no coincide, asegurate de seleccionar bien los montos en cada servicio',
                    showConfirmButton: false,
                    timer: 2000
                })
                if (this.payCash == 0) {
                    this.payCash = ''
                }
                if (this.payTransfer == 0) {
                    this.payTransfer = ''
                }
                if (this.payOthers == 0) {
                    this.payOthers = ''
                }
                if (this.payDebit == 0) {
                    this.payDebit = ''
                }
                if (this.payCredit == 0) {
                    this.payCredit = ''
                }
            }
        },
        microPrice(service, index){
            
            this.selectedEvent.services[index].microPrice = 0
            this.selectedEvent.services[index].microServiceSelect.forEach(element => {
                this.selectedEvent.services[index].microPrice = parseFloat(this.selectedEvent.services[index].microPrice) + parseFloat(element.price)
            });
            this.showCurrencyMicro = false
            this.showCurrencyMicro = true
        },
        conteoServicioDate(esto, servicio, precio, comision, discount, index){
            const conteo = $("#"+index+esto).text()
            const conteoTotal = parseFloat(conteo) + 1
            let valid = true
            $("#"+index+esto).text(conteoTotal)
            const servicios = {'servicio': servicio, 'comision': comision, 'precio': precio, 'discount': discount}
            this.serviciosSelecionadosDates.push(servicios)
            this.EndDateServices.push({name: servicio, id: esto, index: index,valid: true})
        },
        discountServiceDate(esto, index, nombre, valid){
            let conteo = $("#"+index+esto).text()
            let conteoTotal = conteo
            let forLenght = this.serviciosSelecionadosDates
            if (parseFloat(conteo) > 0) {
                if (valid) {
                   for (let d = 0; d < 20; d++) {
                        for (let c = 0; c < forLenght.length; c++) {
                            if (this.serviciosSelecionadosDates[c].servicio == nombre) {
                                this.serviciosSelecionadosDates.splice(c, 1)
                                conteoTotal = parseFloat(conteoTotal) - 1
                            }
                            
                        }
                    } 
                }
                else{
                    for (let c = 0; c < forLenght.length; c++) {
                        if (this.serviciosSelecionadosDates[c].servicio == nombre) {
                            this.serviciosSelecionadosDates.splice(c, 1)
                            conteoTotal = parseFloat(conteoTotal) - 1
                            break
                        }
                        
                    }
                }
                $("#"+index+esto).text(conteoTotal)
                if (valid) {
                    for (let t = 0; t < 15; t++) {
                        for (let i = 0; i < this.EndDateServices.length; i++) {
                            const element = this.EndDateServices[i];
                            if (element.name == nombre) {
                                this.EndDateServices.splice(i, 1)
                            }
                        } 
                    }
                }
                else{
                    for (let i = 0; i < this.EndDateServices.length; i++) {
                        const element = this.EndDateServices[i];
                        if (element.name == nombre) {
                            this.EndDateServices.splice(i, 1)
                            break
                        }
                    }
                }
            }
        },
        removeImage(index){
            // this.file.splice(index, 1)
            if (this.file.length > 1) {
                var nameFiles = this.nameFile.split(',')
                nameFiles.splice(index, 1)
                for (const key in nameFiles) {
                    this.nameFile = key == 0 ? nameFiles[key] : this.nameFile +','+nameFiles[key]
                }
                var array = []
                for (const file of this.file) {
                    array.push(file)
                }
                array.splice(index, 1)
                this.file = array
            }else{
                this.file = []
                this.nameFile = 'Seleccione imagen'
            }
        },
        handleFileUpload(){
            const LengthImage = this.selectedEvent.imgDesign.length + this.$refs.file.files.length
            if (LengthImage > 3) {
                
            }else{
                this.file = this.$refs.file.files
                if (this.file.length == 3) {
                    this.nameFile = this.file[0].name+', '+this.file[1].name+', '+this.file[2].name
                }else if (this.file.length == 2) {
                    this.nameFile = this.file[0].name+', '+this.file[1].name
                }else{
                    this.nameFile = this.file[0].name
                }
            }            
        },
        uploadImageDesign(id, event){
            this.loadImage = true
            let formData = new FormData();
            for (let index = 0; index < this.file.length; index++) {
                const element = this.file[index];
                formData.append('image', this.file[index])
            }
            
            formData.append('imagePrev', this.selectedEvent.imgDesign)
            const header = {
                headers:{
                    "x-database-connect": endPoint.database,
                    'x-access-token':localStorage.userToken,
                    'Content-Type': 'multipart/form-data'
                }
            }
            axios.put(endPoint.endpointTarget+'/dates/uploadDesign/'+id, formData, header)
            .then(res => {
                if (res.data.status == 'ok') {
                    this.loadImage = false
                    this.selectedEvent.imgDesign = res.data.image
                    this.selectedEvent.imageLength = res.data.image.length
                    this.file = []
                    this.nameFile = 'Seleccione imagen'
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
        deleteImage(images, index, id){
            this.loadImage = true
            images.splice(index, 1)
            axios.put(endPoint.endpointTarget+'/dates/removeImage/'+id, {
                images: images
            }, this.configHeader)
            .then(res => {
                this.loadImage = false
                this.selectedEvent.imgDesign = images
                this.selectedEvent.imageLength = this.selectedEvent.imageLength - 1
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
        endingDate(){
            const id = this.endId
            axios.post(endPoint.endpointTarget+'/citas/endDate/'+id, {
                services:this.serviciosSelecionadosDates,
                client:this.endClient,
                employe:this.endEmploye,
                design: this.designEndDate
            })
            .then(res => {
                if (res.data.status == 'ok') {
                    this.getDates();
                    setTimeout(() => {
                    if (this.employeByDate != 'Filtrar por empleado') {
                        this.getCitasByEmploye()
                    }
                    }, 500);
                    this.getClosed()
                    this.$swal({
                        type: 'success',
                        title: 'Cita finalizada con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.dateModals.modal1 = false
                    this.dateModals.modal3 = false
                    this.designEndDate = ''
                    this.serviciosSelecionadosDates = []
                    this.endClient = ''
                    this.endEmploye = ''
                    this.designEndDate = ''
                    $('.conteoServ').text('0')
                    axios.post(endPoint.endpointTarget+'/notifications', {
                        branch: this.branch,
                        userName:this.firstNameUser + " " + this.lastNameUser,
                        userImage:this.imgUser,
                        detail:'Finalizó una cita',
                        link: 'agendamiento'
                    }, this.configHeader)
                    .then(res => {
                        this.socket.emit('sendNotification', res.data.data)
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
        selected(value){
            const selectArray = {
                id: value.selected_item._id,
                services: value.selected_item.services,
                client: value.selected_item.client,
                employe: value.selected_item.employe,
                design: value.selected_item.design,
                comision: value.selected_item.comision,
                totalLocal: value.selected_item.totalLocal,
                total: value.selected_item.total,
                descuento: value.selected_item.descuento,
                date: value.selected_item.date,
                ifrecomend:0,
                typeDiscount: 'Descuento'
            }
            if (selectArray.services[0].discount === false) {
                const split = selectArray.client.split(' / ')
                axios.get(endPoint.endpointTarget+'/clients/dataDiscount/' + split[1])
                .then(res => {
                    if (selectArray.services[0].discount == false) {
                        if(res.data[0].birthday){
                            var birthday = new Date(res.data[0].birthday).getMonth()
                            var monthNow = new Date().getMonth()
                            if (birthday == monthNow) {
                                selectArray.descuento = 10
                                selectArray.typeDiscount = 'Descuento por mes de cumpleaños'
                            }else if (res.data[0].recomendaciones > 0) {
                                selectArray.descuento = 15
                                selectArray.typeDiscount = 'Descuento por recomendación'
                            }else if (res.data[0].participacion == 0) {
                                selectArray.descuento = 10
                                selectArray.typeDiscount = 'Descuento por primera atención'
                            }
                        }else if (res.data[0].recomendaciones > 0) {
                            selectArray.descuento = 15
                            selectArray.typeDiscount = 'Descuento por recomendación'
                        }else if (res.data[0].participacion == 0) {
                            selectArray.descuento = 10
                            selectArray.typeDiscount = 'Descuento por primera atención'
                        }
                    }
                    this.selectedDates.closedArray.push(selectArray)
                })
                .catch(err => {
                    console.log(err)
                })
            }else{
                selectArray.descuento = 0
                this.selectedDates.closedArray.push(selectArray)
            }
        },
        unSelected(value){
        
            for (let i = 0; i < this.selectedDates.closedArray.length; i++) {
                if (this.selectedDates.closedArray[i].id == value.unselected_item._id) {
                    this.selectedDates.closedArray.splice(i, 1)
                    break
                }
            }
        },
        selectedAll(value){
            
            var selectArray = {}
            for (let index = 0; index < value.selected_items.length; index++) {
                selectArray = {
                    id: value.selected_items[index]._id,
                    services: value.selected_items[index].services,
                    client: value.selected_items[index].client,
                    employe: value.selected_items[index].employe,
                    design: value.selected_items[index].design,
                    comision: value.selected_items[index].comision,
                    totalLocal: value.selected_items[index].totalLocal,
                    total: value.selected_items[index].total,
                    descuento: value.selected_items[index].descuento,
                    date: value.selected_items[index].date,
                }
                this.selectedDates.closedArray.push(selectArray)
            }
        },
        unSelectedAll(value){
            this.selectedDates.closedArray = []
        },
        processDate(id, type){
            EventBus.$emit('processDate', id)
            this.dateModals.modal1 = false
            setTimeout(() => {
                $('#processButton').click()
            }, 500);
        },
        scroll(){
            
        },
        myFunction() {
			var input, filter, table, tr, td, i, txtValue;
			input = document.getElementById("myInput");
			filter = input.value.toUpperCase();
			table = document.getElementById("myTable");
			tr = table.getElementsByTagName("tr");
			for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[0];
			if (td) {
				txtValue = td.textContent || td.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
				tr[i].style.display = "";
				} else {
				tr[i].style.display = "none";
				}
			}
			}
        },
        // res.data.id, this.dateClient.name, this.dateClient.email, hourFinal, this.registerDae.serviceSelectds[0].end, this.registerDate.serviceSelectds, employeFinal, this.registerDae, true
        sendConfirmation(id, name, mail, start, end, services, lender, data, valid, date, startG, endG){
            var startGood = new Date(startG).getHours() + ':' + (new Date(startG).getMinutes() == 0 ? '00' : new Date(startG).getMinutes())
            var endGood = new Date(endG).getHours() + ':' + (new Date(endG).getMinutes() == 0 ? '00' : new Date(endG).getMinutes())
            const nameFormat = name
            var dateFormat = ''
            var servicesFinal = []
            console.log(date)
            console.log(valid)
            if (valid) {
                dateFormat = this.finalDate == "" ? start : this.finalDate
                servicesFinal = data.serviceSelectds
            }else{
                dateFormat = date
                servicesFinal = data.services
                servicesFinal[0].start = startGood
                servicesFinal[0].end = endGood
                servicesFinal[0].employe = data.employe.name
            }
            console.log("final")
            console.log(this.finalDate)
            console.log(this.finalDate == "" ? date : this.finalDate)

            axios.post(endPoint.endpointTarget+'/mails/dateMail', {
                name: nameFormat,
                branch: this.branchName,
                branchId: this.branch,
                data: data,
                id: id,
                date: this.finalDate == "" ? date : this.finalDate,
                email: mail,
                servicesFinal: servicesFinal,
                valid: valid
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    console.log(res.data.status)
                }
                if (valid == false) {
                    this.$swal({
                        icon: 'success',
                        title: 'Correo enviado con éxito',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }).catch(err => {
                if (!err.response) {
                    this.$swal({
                        icon: 'error',
                        title: 'Error de conexión confirm',
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
        openCalendar(){
            setTimeout(() => {
                      if (this.registerDae.date != "") {
                        const split = this.registerDae.date.split('-')
                        this.finalDate = split[1]+'-'+split[0]+'-'+split[2]
                        const restDay = new Date(this.finalDate+' 10:00')
                        this.getDay = restDay.getDay()
                        var onlySunday = split[0]+'-'+split[1]
                        if (this.getDay == 0 && onlySunday != "13-12" && onlySunday != "20-12") {
                            this.modals = {
                                modal3: true,
                                message: "Disculpa, No laboramos Sábados y Domingos.",
                                icon: 'ni ni-fat-remove ni-5x',
                                type: 'danger'
                            }
                            setTimeout(() => {
                                this.modals = {
                                    modal1:false,
                                    modal2:false,
                                    modal3: false,
                                    modal4: false,
                                    modal5: false,
                                    message: "",
                                    icon: '',
                                    type: ''
                                }
                                this.registerDae.date = ''
                            }, 3000);
                        }else{
                            if (this.readyChange) {
                                for (let index = 0; index < this.registerDae.serviceSelectds.length; index++) {
                                    const element = this.registerDae.serviceSelectds[index];
                                    element.start = ''
                                    element.end = ''
                                    element.sort = ''
                                    element.class = ''
                                    element.blocks = []
                                    element.blocksFirst = []
                                    element.valid = false
                                    element.employe = 'Primera disponible'
                                    element.employeImg = ''
                                    element.employeId = ''
                                    element.realEmploye = 'Primera disponible'
                                }
                                this.validHour = false
                                setTimeout(() => {
                                    axios.post(endPoint.endpointTarget+'/dates/availableslenders',{
                                        date: this.finalDate,
                                        branch: this.branch
                                    }, this.configHeader)
                                    .then(res => {
                                        this.getDay = res.data.day
                                        this.availableslenders = res.data.array
                                        axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                            date: this.finalDate,
                                            employes: res.data.array,
                                            timedate: this.registerDae.serviceSelectds[0].duration,
                                            employesServices: this.registerDae.serviceSelectds[0].employes,
                                            branch: this.branch
                                        }, this.configHeader)
                                        .then(res => {
                                            this.idDatesBlocks = res.data.id
                                            this.readyChange = true
                                            this.registerDae.serviceSelectds[0].valid = true
                                            this.registerDae.serviceSelectds[0].blocks = res.data.data
                                            this.registerDae.block = res.data.data
                                            $('#block0').show('slow')
                                            this.load1 = false
                                        }).catch(err => {
                                            if (!err.response) {
                                                this.$swal({
                                                    icon: 'error',
                                                    title: 'Error de conexión4',
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
                                }, 200); 
                            }else{
                                setTimeout(() => {
                                    axios.post(endPoint.endpointTarget+'/dates/availableslenders', {
                                        date: this.finalDate,
                                        branch: this.branch
                                    }, this.configHeader)
                                    .then(res => {
                                        this.getDay = res.data.day
                                        this.availableslenders = res.data.array
                                        axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                            date: this.finalDate,
                                            employes: res.data.array,
                                            timedate: this.registerDae.serviceSelectds[0].duration,
                                            employesServices: this.registerDae.serviceSelectds[0].employes,
                                            branch: this.branch
                                        }, this.configHeader)
                                        .then(res => {
                                            this.idDatesBlocks = res.data.id
                                            this.readyChange = true
                                            this.registerDae.serviceSelectds[0].valid = true
                                            this.registerDae.serviceSelectds[0].blocks = res.data.data
                                            this.registerDae.block = res.data.data
                                            this.load1 = false
                                        }).catch(err => {
                                            if (!err.response) {
                                                this.$swal({
                                                    icon: 'error',
                                                    title: 'Error de conexión2',
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
                                    }).catch(err => {
                                        if (!err.response) {
                                            this.$swal({
                                                icon: 'error',
                                                title: 'Error de conexión3',
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
                                }, 200); 
                            }
                        }
                        }
                        setTimeout(() => {
                            $('#block0').show('slow')
                        }, 200);
                    }, 200);       
            
        },
        validMultiLender(index, lender, time, resTime, check){
            $('#'+check).removeClass('fa-check')
            this.registerDae.employeSelect = ''
            this.validSchedule = false
            this.noOneLender = true
            var rest = ''
            for (let index = 0; index < resTime.length; index++) {
                const element = resTime[index];
                if (element.day == this.getDay) {
                    rest = element.hours[0]+'/'+element.hours[1]
                }
            }
            this.selectHourService(index, lender, time, rest)
        },
        selectHourService(index, lender, time, resTime){
            const finalTime =  this.registerDae.design == 'si' ? time + 15 : time
            this.registerDae.serviceSelectds[index].lenderSelectData = {
                employe: lender,
                date: this.finalDate,
                time: finalTime,
                resTime: resTime,
                index: index
            }
            axios.post(endPoint.endpointTarget+'/citas/getBlocks', this.registerDae.serviceSelectds[index].lenderSelectData)
            .then(res => { 
                if (this.registerDae.serviceSelectds[index].validAfter) {
                    for (let j = index + 1; j < this.registerDae.serviceSelectds.length; j++) {
                        const element = this.registerDae.serviceSelectds[j];
                        element.start = ''
                        element.end = ''
                        element.sort = ''
                        element.realLender = ''
                        element.blocks = []
                        element.days = ''
                        element.class = ''
                        element.valid = false
                        this.arrayLendersSelect = []
                    } 
                }
                // var editBlock = false
                // var indexEdit = 0
                // if (index > 0) {
                //     for (let i = 0; i < this.arrayLendersSelect.length; i++) {
                //         const element = this.arrayLendersSelect[i];
                //         if (element.lender == lender) {
                            
                            
                //         }
                //     }
                // }
                var editBlock = false
                var indexEdit = 0
                const q = index - 1 
                for (let j = 0; j <= q; j++) {
                    const element = this.registerDae.serviceSelectds[j];
                    
                    if (element.realLender == lender) {
                        editBlock = true
                        indexEdit = j
                    }
                }
                if (editBlock) {
                    
                    this.registerDae.serviceSelectds[index].blocks = this.registerDae.serviceSelectds[indexEdit].blocks
                    axios.post(endPoint.endpointTarget+'/citas/editBlocks', {
                        array: this.registerDae.serviceSelectds[index].blocks,
                        time: this.registerDae.serviceSelectds[index].lenderSelectData.time
                    })
                    .then(res => {
                        this.arrayLendersSelect.push({index: index, lender: lender}) 
                        this.registerDae.serviceSelectds[index].blocks = res.data
                        this.registerDae.serviceSelectds[index].validAfter = true
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
                }else{
                    this.registerDae.serviceSelectds[index].blocks = res.data
                    this.arrayLendersSelect.push({index: index, lender: lender}) 
                   
                    this.registerDae.serviceSelectds[index].validAfter = true
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
        selectBloqMulti(lenders, hora, i, indexService, open, check){
            var oldEmploye = ''
            oldEmploye = {
                name: this.registerDae.serviceSelectds[indexService].employe,
                id: this.registerDae.serviceSelectds[indexService].employeId,
                class: this.registerDae.serviceSelectds[indexService].class,
                valid: true,
                img: this.registerDae.serviceSelectds[indexService].employeImg
            }
            for (let j = indexService + 1; j < this.registerDae.serviceSelectds.length; j++) {
                const element = this.registerDae.serviceSelectds[j];
                element.start = ''
                element.end = ''
                element.sort = ''
                element.class = ''
                element.blocks = []
                element.blocksFirst = []
                element.valid = false
                element.employe = 'Primera disponible'
                element.employeId = ''
                element.realEmploye = 'Primera disponible'
                element.employeImg = ''
                element.itFirst = true
            }
            setTimeout(() => {
                $('#'+open).toggle('slow')
            }, 500);

            if (lenders) {
                var sortSp = this.registerDae.serviceSelectds[indexService].blocks[i].hour.split(":") 
                this.registerDae.serviceSelectds[indexService].start = this.registerDae.serviceSelectds[indexService].blocks[i].hour
                this.registerDae.serviceSelectds[indexService].sort = sortSp[0]+sortSp[1]

                for (let j = 0; j < this.registerDae.serviceSelectds[indexService].blocks[i].employes.length; j++) {
                    const element = this.registerDae.serviceSelectds[indexService].blocks[i].employes[j];
                    if (element.valid == true) {
                        this.registerDae.serviceSelectds[indexService].class = element.class
                        this.registerDae.serviceSelectds[indexService].realEmploye = element.name
                        this.registerDae.serviceSelectds[indexService].employeId = element.id
                        this.registerDae.serviceSelectds[indexService].employe = element.name
                        this.registerDae.serviceSelectds[indexService].employeImg = element.img
                        break
                    }
                }
                var employeForBlock = {
                    name: this.registerDae.serviceSelectds[indexService].employe,
                    id: this.registerDae.serviceSelectds[indexService].employeId,
                    class: this.registerDae.serviceSelectds[indexService].class,
                    valid: false,
                    img: this.registerDae.serviceSelectds[indexService].employeImg
                }
                axios.post(endPoint.endpointTarget+'/dates/selectDatesBlocks', {
                    date: this.finalDate,
                    timedate: this.registerDae.serviceSelectds[indexService].duration,
                    hour: this.registerDae.serviceSelectds[indexService].start,
                    employe: employeForBlock,
                    oldEmploye: oldEmploye,
                    block: this.registerDae.serviceSelectds[indexService].blocks,
                    branch: this.branch,
                    ifFirstClick: this.registerDae.serviceSelectds[indexService].itFirst,
                    firstBlock: true
                }, this.configHeader)
                .then(res => {
                    this.registerDae.serviceSelectds[indexService].blocks = res.data.data
                    this.registerDae.serviceSelectds[indexService].itFirst = false
                    this.registerDae.serviceSelectds[indexService].end = res.data.end
                    const finalIndex = parseFloat(indexService) + parseFloat(1)
                    if (this.registerDae.serviceSelectds[finalIndex]) {
                        axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                            block: this.registerDae.serviceSelectds[indexService].blocks,
                            timedate: this.registerDae.serviceSelectds[finalIndex].duration,
                            employesServices: this.registerDae.serviceSelectds[finalIndex].employes,
                            firstBlock: true
                        })
                        .then(res => {
                            this.registerDae.serviceSelectds[finalIndex].valid = true
                            this.registerDae.serviceSelectds[finalIndex].blocks = res.data.data
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
                    }else{
                        this.validHour = true
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
                
                setTimeout(() => {
                    $('#'+check).addClass('fa-check')
                }, 500);
            }
            else{
                var sortSp = this.registerDae.serviceSelectds[indexService].blocks[i].hour.split(":") 
                this.registerDae.serviceSelectds[indexService].start = this.registerDae.serviceSelectds[indexService].blocks[i].hour
                this.registerDae.serviceSelectds[indexService].sort = sortSp[0]+sortSp[1]
                var employeForBlock = {
                    name: this.registerDae.serviceSelectds[indexService].employe,
                    id: this.registerDae.serviceSelectds[indexService].employeId,
                    class: this.registerDae.serviceSelectds[indexService].class,
                    valid: false,
                    img: this.registerDae.serviceSelectds[indexService].employeImg
                }
                axios.post(endPoint.endpointTarget+'/dates/selectDatesBlocks', {
                    date: this.finalDate,
                    timedate: this.registerDae.serviceSelectds[indexService].duration,
                    hour: this.registerDae.serviceSelectds[indexService].start,
                    employe: employeForBlock,
                    block: this.registerDae.serviceSelectds[indexService].blocks,
                    blockFirst: this.registerDae.serviceSelectds[indexService].blocksFirst,
                    branch: this.branch,
                    ifFirstClick: this.registerDae.serviceSelectds[indexService].itFirst,
                    firstBlock: false
                }, this.configHeader)
                .then(res => {
                    this.registerDae.serviceSelectds[indexService].blocks = res.data.data
                    this.registerDae.serviceSelectds[indexService].blocksFirst = res.data.blockFirst
                    this.registerDae.serviceSelectds[indexService].itFirst = false
                    this.registerDae.serviceSelectds[indexService].end = res.data.end
                    const finalIndex = parseFloat(indexService) + parseFloat(1)
                    if (this.registerDae.serviceSelectds[finalIndex]) {
                        axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                            block: res.data.blockFirst,
                            timedate: this.registerDae.serviceSelectds[finalIndex].duration,
                            employesServices: this.registerDae.serviceSelectds[finalIndex].employes,
                            firstBlock: true
                        })
                        .then(res => {
                            this.registerDae.serviceSelectds[finalIndex].valid = true
                            this.registerDae.serviceSelectds[finalIndex].blocks = res.data.data
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
                    }else{
                        this.validHour = true
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
                setTimeout(() => {
                    $('#'+check).addClass('fa-check')
                }, 500);
            }
            
        },
        selectBlockEdit(hour){
            axios.post(endPoint.endpointTarget+'/dates/selectDatesBlocks', {
                date: this.dataEditSend.date,
                timedate: this.dataEditSend.duration,
                hour: hour,
                employe: {
                    id: this.employeForSearchEdit,
                },
                block: this.finalBlockEdit,
                blockFirst: this.blockFirstEdit,
                branch: this.branch,
                ifFirstClick: this.dataEditSend.isFirst,
                firstBlock: false
            }, this.configHeader)
            .then(res => {
                this.dataEditSend.isFirst = false
                this.finalBlockEdit = res.data.data
                this.blockFirstEdit = res.data.blockFirst
                this.dataEditSend.start = hour
                this.dataEditSend.end = res.data.end
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
        insertData(index, lender, restTime, Class, duration, lendeId, check, lenders, lenderImg){
            console.log("hola")
            this.load2 = true
            if (lender == 'Primera disponible') {
                if (index == 0) {
                    for (let i = 0; i < this.registerDae.serviceSelectds.length; i++) {
                        const element = this.registerDae.serviceSelectds[i];
                        element.start = ''
                        element.end = ''
                        element.sort = ''
                        element.class = ''
                        element.blocks = []
                        element.blocksFirst = []
                        element.valid = false
                        element.employe = 'Primera disponible'
                        element.realEmploye = 'Primera disponible'
                        element.employeImg = ''
                        element.employeId = ''
                    }
                    this.validHour = false
                    setTimeout(() => {
                        axios.post(endPoint.endpointTarget+'/dates/availableslenders',{
                            date: this.finalDate,
                            branch: this.branch
                        }, this.configHeader)
                        .then(res => {
                            this.getDay = res.data.day
                            this.availableslenders = res.data.array
                            axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                date: this.finalDate,
                                employes: res.data.array,
                                timedate: this.registerDae.serviceSelectds[0].duration,
                                employesServices: this.registerDae.serviceSelectds[0].employes,
                                branch: this.branch
                            }, this.configHeader)
                            .then(res => {
                                this.readyChange = true
                                this.load2 = false
                                this.registerDae.serviceSelectds[0].valid = true
                                this.registerDae.serviceSelectds[0].blocks = res.data.data
                                this.registerDae.block = res.data.data
                                $('#block0').show('slow')
                            })
                        }).catch(err => {
                            if (!err.response) {
                                this.$swal({
                                    icon: 'error',
                                    title: 'Error de conexión 1',
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
                    }, 200);
                }else{
                    for (let i = index; i < this.registerDae.serviceSelectds.length; i++) {
                        const element = this.registerDae.serviceSelectds[i];
                        element.start = ''
                        element.end = ''
                        element.sort = ''
                        element.class = ''
                        element.blocks = []
                        element.blocksFirst = []
                        element.valid = false
                        element.employe = 'Primera disponible'
                        element.realEmploye = 'Primera disponible'
                        element.employeImg = ''
                        element.employeId = ''
                    }
                    this.validHour = false
                    if (this.registerDae.serviceSelectds[index - 1].blocksFirst.length > 0) {
                        axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                            block: this.registerDae.serviceSelectds[index - 1].blocksFirst,
                            timedate: this.registerDae.serviceSelectds[index].duration,
                            employesServices: this.registerDae.serviceSelectds[index].employes,
                            firstBlock: true
                        })
                        .then(res => {
                            this.load2 = false
                            this.registerDae.serviceSelectds[index].valid = true
                            this.registerDae.serviceSelectds[index].blocks = res.data.data
                            this.registerDae.serviceSelectds[index].blocksFirst = []
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
                    }else{
                        axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                            block: this.registerDae.serviceSelectds[index - 1].blocks,
                            timedate: this.registerDae.serviceSelectds[index].duration,
                            employesServices: this.registerDae.serviceSelectds[index].employes,
                            firstBlock: true
                        })
                        .then(res => {
                            this.load2 = false
                            this.registerDae.serviceSelectds[index].valid = true
                            this.registerDae.serviceSelectds[index].blocks = res.data.data
                            this.registerDae.serviceSelectds[index].blocksFirst = []
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
                    }
                }
            }else{
                
                for (let keyTwo = 0; keyTwo < this.registerDae.serviceSelectds[index].blocks.length; keyTwo++) {
                    const block = this.registerDae.serviceSelectds[index].blocks[keyTwo];
                    if (block.validator == 'select' && block.employes){
                        block.validator = true
                        if (this.registerDae.serviceSelectds[index].blocks[keyTwo + 1]) {
                            if (this.registerDae.serviceSelectds[index].blocks[keyTwo + 1].validator == 'select') {
                                block.employes.unshift({
                                    id: this.registerDae.serviceSelectds[index].employeId,
                                    name: this.registerDae.serviceSelectds[index].realEmploye,
                                    position: 1,
                                    class: this.registerDae.serviceSelectds[index].class,
                                    valid: true,
                                    img: this.registerDae.serviceSelectds[index].employeImg
                                })
                            }
                        }
                        for (const key in block.employeBlocked) {
                            const employeBlocked = block.employeBlocked[key]
                            if (employeBlocked.employe == this.registerDae.serviceSelectds[index].employeId) {
                                block.employeBlocked.splice(key, 1)
                            }
                        }
                    }
                }
                if (this.registerDae.serviceSelectds[index].blocksFirst.length > 0) {
                    for (let j = index + 1; j < this.registerDae.serviceSelectds.length; j++) {
                        const element = this.registerDae.serviceSelectds[j];
                        element.start = ''
                        element.end = ''
                        element.sort = ''
                        element.class = ''
                        element.blocks = []
                        element.blocksFirst = []
                        element.valid = false
                        element.employe = 'Primera disponible'
                        element.employeId = ''
                        element.realEmploye = 'Primera disponible'
                        element.employeImg = ''
                        element.itFirst = true
                    }
                    this.registerDae.serviceSelectds[index].start = ''
                    this.registerDae.serviceSelectds[index].end = ''
                    this.registerDae.serviceSelectds[index].employe = lender
                    this.registerDae.serviceSelectds[index].employeId = lendeId
                    this.registerDae.serviceSelectds[index].employeImg = lendeId
                    this.registerDae.serviceSelectds[index].realEmploye = lender
                    this.registerDae.serviceSelectds[index].days = restTime
                    this.registerDae.serviceSelectds[index].class = Class
                    this.registerDae.serviceSelectds[index].itFirst = false
                    this.validHour = false
                    
                    axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                        block: this.registerDae.serviceSelectds[index].blocksFirst,
                        timedate: this.registerDae.serviceSelectds[index].duration,
                        employeSelect: lendeId,
                        employeObject: {
                            name: this.registerDae.serviceSelectds[index].realEmploye,
                            id: this.registerDae.serviceSelectds[index].employeId,
                            position: 1,
                            class: this.registerDae.serviceSelectds[index].class,
                            valid: true,
                            img: this.registerDae.serviceSelectds[index].employeImg
                        },
                        firstBlock: false
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.load2 = false
                            this.registerDae.serviceSelectds[index].blocks = res.data.blockEmploye
                            this.registerDae.serviceSelectds[index].blocksFirst = res.data.data
                            this.registerDae.serviceSelectds[index].itFirst = false
                            setTimeout(() => {
                                $('#block'+index).show('slow')
                            }, 500);
                            setTimeout(() => {
                                $('#check'+index).addClass('fa-check')
                            }, 500);
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
                }else{
                    for (let j = index + 1; j < this.registerDae.serviceSelectds.length; j++) {
                        const element = this.registerDae.serviceSelectds[j];
                        element.start = ''
                        element.end = ''
                        element.sort = ''
                        element.class = ''
                        element.blocks = []
                        element.blocksFirst = []
                        element.valid = false
                        element.employe = 'Primera disponible'
                        element.employeId = ''
                        element.realEmploye = 'Primera disponible'
                        element.employeImg = ''
                        element.itFirst = true
                    }
                    this.registerDae.serviceSelectds[index].start = ''
                    this.registerDae.serviceSelectds[index].end = ''
                    this.registerDae.serviceSelectds[index].employe = lender
                    this.registerDae.serviceSelectds[index].employeId = lendeId
                    this.registerDae.serviceSelectds[index].employeImg = lenderImg
                    this.registerDae.serviceSelectds[index].realEmploye = lender
                    this.registerDae.serviceSelectds[index].days = restTime
                    this.registerDae.serviceSelectds[index].class = Class
                    this.registerDae.serviceSelectds[index].itFirst = false
                    this.validHour = false
                    
                    axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                        block: this.registerDae.serviceSelectds[index].blocks,
                        timedate: this.registerDae.serviceSelectds[index].duration,
                        employeSelect: lendeId,
                        employeObject: {
                            name: this.registerDae.serviceSelectds[index].realEmploye,
                            id: this.registerDae.serviceSelectds[index].employeId,
                            position: 1,
                            class: this.registerDae.serviceSelectds[index].class,
                            valid: true,
                            img: this.registerDae.serviceSelectds[index].employeImg
                        },
                        firstBlock: false
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.load2 = false
                            this.registerDae.serviceSelectds[index].blocks = res.data.blockEmploye
                            this.registerDae.serviceSelectds[index].blocksFirst = res.data.data
                            this.registerDae.serviceSelectds[index].itFirst = false
                            setTimeout(() => {
                                $('#block'+index).show('slow')
                            }, 500);
                            setTimeout(() => {
                                $('#check'+index).addClass('fa-check')
                            }, 500);
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
                }
            }
        },
        fixedHours(duration){
            const hours = parseInt(duration / 60) + ' hr'
            const minutes = duration - (parseInt(duration / 60) * 60 )  + ' min'
            return hours+' '+minutes
        },
        openBlocks(open,indexService){
            $('#'+open).toggle('slow')
            
        },
        validateFirstStep() {
            window.scrollTo(0, 0);
            var validService = false
            if (this.ifMicro) {
                for (const service of this.registerDae.serviceSelectds) {
                    var validMicro = false
                    for (const micro of service.microServices) {
                        if (micro.checked) {
                            validMicro = true
                        }
                    }
                    if (validMicro) {
                        validService = true
                    }else{
                        validService = false
                        break
                    }
                }
            }else{
                validService = true
            }
            if (this.ifServices && validService) {
                this.validWizard = true
                for (let l = 0; l < 20; l++) {
                    $('#block'+l).toggle('slow')
                }
                if ( this.registerDae.date != '') {
                    for (let index = 0; index < this.registerDae.serviceSelectds.length; index++) {
                        const element = this.registerDae.serviceSelectds[index];
                        if (element.valid == false) {
                            element.valid = true
                            this.insertData(index, 'Primera disponible', '', '', element.duration, 'check'+index, element.lenders)
                            break
                        }
                    }
                }
                if (this.registerDae.date != '' && this.registerDae.date != "undefined--undefined") {
                    setTimeout(() => {
                        this.openCalendar()
                    }, 1000);
                    
                }
                return this.ifServices
            }else{
                this.$swal({
                    icon: 'error',
                    title: 'Seleccione adicional',
                    text: 'En caso de no desear, marque como ninguno',
                    showConfirmButton: true
                })
                this.validWizard = false
                return false
            }
        },
        setInitialsName(name){
            if (name.split(" ").length >= 2) {
                console.log(name.split(" "))
                return name.split(" ")[0][0]+name.split(" ")[1][0]
            }else{
                return name[0]
            }
            
        },
        validateLastStep() {

            if (this.validHour) {
                this.validWizard = true
                this.registerDae.valid = true
                for (const micro of this.registerDae.serviceSelectds) {
                    for (const selects of micro.microServices) {
                        if (selects.checked) {
                            micro.microServiceSelect.push({name: selects.microService, duration: selects.duration, price: selects.price})
                        }
                    }
                }
                return this.validHour
            }else{
                this.validWizard = false
                return this.validHour
            }  
        },
        changePrice(pos){
            
            this.loading = true
            let discount = this.selectedDates.closedArray[pos].descuento
            this.selectedDates.closedArray[pos].comision = 0
            this.selectedDates.closedArray[pos].totalLocal = 0
            this.selectedDates.design = 0
            let design = this.selectedDates.closedArray[pos].design
            let comisionDesign = (parseFloat(design) / parseFloat(2))
            
            this.selectedDates.closedArray[pos].total = 0
            this.selectedDates.total = 0
            for (let index = 0; index < this.selectedDates.closedArray[pos].services.length; index++) {
                
                if (!this.selectedDates.closedArray[pos].services[index].descuento) {
                        
                        if (discount == 0) {
                            const comision = (parseFloat(this.selectedDates.closedArray[pos].services[index].comision) * parseFloat(this.selectedDates.closedArray[pos].services[index].precio)) / 100
                            this.selectedDates.closedArray[pos].comision = parseFloat(this.selectedDates.closedArray[pos].comision) + parseFloat(comision) 
                            this.selectedDates.closedArray[pos].total = parseFloat(this.selectedDates.closedArray[pos].total) + parseFloat(this.selectedDates.closedArray[pos].services[index].precio)
                        }
                        else{
                            const descuento = parseFloat(discount) / 100
                        
                            const porcentaje = 1 - parseFloat(descuento)
                            
                            const precioConDescuento = parseFloat(this.selectedDates.closedArray[pos].services[index].precio) * parseFloat(porcentaje)
                            const comision = (parseFloat(this.selectedDates.closedArray[pos].services[index].comision) * parseFloat(precioConDescuento)) / 100
                            this.selectedDates.closedArray[pos].comision = parseFloat(this.selectedDates.closedArray[pos].comision) + parseFloat(comision) 
                    
                            this.selectedDates.closedArray[pos].total = parseFloat(this.selectedDates.closedArray[pos].total) + parseFloat(precioConDescuento)
                        }
                }
                else{ 
                    const comision = (parseFloat(this.selectedDates.closedArray[pos].services[index].comision) * parseFloat(this.selectedDates.closedArray[pos].services[index].precio)) / 100
                    this.selectedDates.closedArray[pos].comision = parseFloat(this.selectedDates.closedArray[pos].comision) + parseFloat(comision) 
                    this.selectedDates.closedArray[pos].total = parseFloat(this.selectedDates.closedArray[pos].total) + parseFloat(this.selectedDates.closedArray[pos].services[index].precio)
                    
                }
                
            } 
            this.selectedDates.closedArray[pos].comision = parseFloat(this.selectedDates.closedArray[pos].comision) + parseFloat(comisionDesign)
            this.selectedDates.closedArray[pos].total = parseFloat(this.selectedDates.closedArray[pos].total) + parseFloat(design)  
            this.selectedDates.closedArray[pos].totalLocal = parseFloat(this.selectedDates.closedArray[pos].total) - parseFloat(this.selectedDates.closedArray[pos].comision)
            
            for (let i = 0; i < this.selectedDates.closedArray.length; i++) {
                this.selectedDates.total = parseFloat(this.selectedDates.total) + parseFloat(this.selectedDates.closedArray[i].total)
                this.selectedDates.design = parseFloat(this.selectedDates.design) + this.selectedDates.closedArray[i].design
            }
            
            
            
            this.loading = false
        },
        cleanDiscount(i){
            setTimeout(() => {
                if (this.selectedDates.closedArray[i].descuento == 0) {
                    this.selectedDates.closedArray[i].descuento = ''
                }
            }, 100);
            
        },
        noBlank(){
            
            if (this.loading == true) {
                this.loading = false
            }
            for (let d = 0; d < this.selectedDates.closedArray.length; d++) {
                if (this.selectedDates.closedArray[d].descuento == '') {
                    this.selectedDates.closedArray[d].descuento = 0
                }
            }
        },
        noCero(){
            this.loading = true
        },
        discPerEmploye(employe){
            let valid = true
            for (let index = 0; index < this.selectedDates.closedArray[employe].services.length; index++) {
                if (this.selectedDates.closedArray[employe].services[index].discount == false ) {
                    valid = false
                }
                
            }
            return valid
        },
        validCode(){
            axios.get(endPoint.endpointTarget+'/pedidos/validCode/'+this.codeArticulo)
            .then( res =>{
                if (res.data) {
                    this.articulo = res.data.articulo
                    this.estadoArticulo = res.data.estado
                    this.idArticulo = res.data._id
                    this.compradorArticulo = res.data.cliente
                    this.medioPagoArticulo = res.data.tipoPago
                    this.totalArticulo = res.data.total
                    this.dateModals.modal7 = true
                }
                else{
                    this.$swal({
                        type: 'error',
                        title: 'Código no existe',
                        showConfirmButton: false,
                        timer: 1500
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
        verifyCode(){
            this.$swal({
					type: 'warning',
					title: '¿Seguro que desea verificar el código?',
					showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonColor: '#2dce89',
                    cancelButtonColor: '#f5365c',
                    confirmButtonText: 'Si',
                    cancelButtonText: 'No'
				}).then((result) => {
                    if (result.value) {
                            var remp = this.totalArticulo.replace('.', "")
                            var remp1 = remp.replace(',00', "")
                            var remp2 = remp1.replace('$ ', "")
                            this.payOrder = remp2
                            this.haveCode = true
                            this.dateModals.modal6 = false
                            this.dateModals.modal7 = false
                            
                    }
                })
        },
        fixClient(){
            this.fixSearch = false
            setTimeout(() => {
                this.fixSearch = true
            }, 100);
        },
        SelectMicro(index, indexM, microServices) { 
            if (this.registerDae.serviceSelectds[index].microServices[indexM].microService == 'Ninguno') {
                this.registerDae.serviceSelectds[index].microServices.forEach(element => {
                    if (element.checked && element.microService != 'Ninguno') {
                        element.checked = false
                        this.registerDae.serviceSelectds[index].duration = parseFloat(this.registerDae.serviceSelectds[index].duration) - parseFloat(element.duration)
                    }
                });
                this.registerDae.serviceSelectds[index].microServices[0].checked = true
            }else{
                if (this.registerDae.serviceSelectds[index].microServices[indexM].checked) {
                    this.registerDae.serviceSelectds[index].microServices[indexM].checked = false    
                    this.registerDae.serviceSelectds[index].duration = parseFloat(this.registerDae.serviceSelectds[index].duration) - parseFloat(microServices.duration)
                }else{
                    this.registerDae.serviceSelectds[index].microServices[0].checked = false
                    this.registerDae.serviceSelectds[index].microServices[indexM].checked = true
                    this.registerDae.serviceSelectds[index].duration = parseFloat(this.registerDae.serviceSelectds[index].duration) + parseFloat(microServices.duration)
                }
            }
        },
    },
    computed: {
        ifSticky: () => {
            return this.$refs.aggend
        },
        widthModalDate: () => {
            return screen.width < 780 ? "100%" : "100%"
        },
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 280 }
        },
        widthModals: () => {
            return screen.width < 780 ? '95%' : '50%'
        }
    },
    mounted (){
        this.socket.on('notify', (data) => {
            this.getDates()
        });
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
    }
  };
</script>
<style>
    .dropAgend .dropdown-menu{
        width: 100%;
        max-height: 30vh;
        overflow:hidden;
        overflow-x: hidden;
        overflow-y:scroll;
    }
    .vuecal__flex .vuecal__menu{
        color: #0a0a0a !important
    }
    .vuecal__arrow {
        color: white;
    }
    .vuecal__menu {background-color:transparent;border: none !important;border-radius: 5px 5px 0 0; }
    .vuecal__menu button{background-color:rgba(7, 7, 7, 0.116);outline: none}
    .vuecal__menu li {border-bottom-color: #fff;color: #fff;}
    .vuecal__menu li.active {background-color: rgba(255, 255, 255, 0.15);}
    .vuecal__title-bar {background-color: #172b4d;color: #fff !important}
    .vuecal__event-title{
        font-size: 1.3em;
        font-weight: 400;
    }
    .vuecal__event-time{
        font-size: 1em;
        font-weight: 600;
    }
    .vuecal__event-content{
        font-size: 1.1em;
        font-weight: 400;
        font-style: italic;
    }
    .vuecal__title button{
        color: white !important
    }
    .vuecal__split-days-headers{
        height: 3em !important;
    }
    .day-split-header {
        background-color: rgba(23, 43, 77, 0.7);
    }
    .vuecal__cell--selected{
        z-index: 0 !important;
    }
    .vuecal__cell--selected .vuecal__cell-content{
        z-index: 0 !important;
    }
    .vuecal__body{
        background-color:white;
    }
    .vuecal__time-column .vuecal__time-cell{color:white;height:1vh;}
    .vuecal__event{color:#fff;cursor:pointer;z-index: 0 !important;}
    .vuecal__event:hover{
        opacity: .8;
    }
    /* Dot indicator */
    .vuecal__cell-events-count {
        width: 19px;
        min-width: 0;
        height: 17px;
        padding: 2px;
        font-size: 12px;
        background-color: #172b4d; 
    }
    .vuecal__header{background-color: rgba(238, 238, 238, 0.623);border-radius: 5px 5px 0 0;}
    .vuecal__cell.today div .vuecal__cell-events-count, .vuecal__cell.current {background-color: #353535 !important;}
    .vuecal:not(.vuecal--day-view) .vuecal__cell.selected {background-color: rgba(235, 255, 245, 0.4);}
    .vuecal__cell.selected:before {border-color: rgba(66, 185, 131, 0.5);}
    .vuecal__cell-date{color:#000;font-family: 'Raleway', sans-serif;
    font-weight:400;}
    .vuecal__heading span{color:#000;font-family: 'Raleway', sans-serif;
    font-weight:400;}
    .vuecal--green-theme .vuecal__title-bar {
        background-color: #1F5673;
    }
    .vuecal__time-column .vuecal__time-cell{
        color: #0F2027
    }
    .vuecal__event.lunch {
        background: repeating-linear-gradient(45deg, #172b4d3b, #172b4d36 10px, #f2f2f2 10px, #f9fafb 15px);/* IE 10+ */
        color: #172b4d;
        font-size: 2.5em;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .vuecal__event.lunch .vuecal__event-time {display: none;align-items: center;}
    .vuecal__cell-split.class1Split {background-color: rgba(234, 197, 190, 0.1);}
    .vuecal__cell-split.class2Split {background-color: rgb(188, 209, 255, 0.1);}
    .vuecal__cell-split.class3Split {background-color: rgb(221, 239, 189, 0.1);}
    .vuecal__cell-split.class4Split {background-color: rgb(205, 242, 226, 0.1);}
    .vuecal__cell-split.class5Split {background-color: rgb(183, 232, 205, 0.1);}
    .vuecal__cell-split.class6Split {background-color: rgb(192, 229, 221, 0.1);}
    .vuecal__cell-split.class7Split {background-color: rgb(242, 230, 230, 0.1);}
    .vuecal__cell-split.class8Split {background-color: rgb(255, 214, 214, 0.1);}
    .vuecal__cell-split.class9Split {background-color: rgb(255, 209, 186, 0.1);}
    .vuecal__cell-split.class10Split {background-color: rgb(255, 243, 181, 0.1);}
    .class0 {
        background:#eb765e7a;
        border: 3px solid #eb755e;
        color: black;
    }
    .class1 {
        background:#eac5be8a;
        border: 3px solid #EAC5BE;
        color: black;
    }
    .class2 {
    background:#bcd1ff80;
    border: 3px solid #BCD1FF;
    color: black;
    }
    .class3 {
    background:#ddefbd85;
    border: 3px solid #DDEFBD;
    color: black;
    }
    .class4 {
    background:#cdf2e28f;
    border: 3px solid #CDF2E2;
    color: black;
    }
    .class5 {
    background:#b7e8cd8c;
    border: 3px solid #B7E8CD;
    color: black;
    }
    .class6 {
    background:#c0e5dd86;
    border: 3px solid #C0E5DD;
    color: black;
    }
    .class7 {
    background:#f2e6e683;
    border: 3px solid #F2E6E6;
    color: black;
    }
    .class8 {
    background:#ffd6d681;
    border: 3px solid #FFD6D6;
    color: black;
    }
    .class9 {
    background:#ffd1ba83;
    border: 3px solid #FFD1BA;
    color: black;
    }
    .class10 {
    background:#fff3b58c;
    border: 3px solid #FFF3B5;
    color: black;
    }
    .class11 {
    background:#efebd085;
    border: 3px solid #EFEBD0;
    color: black;
    }
    .class12 {
    background:#ffe5e58a;
    border: 3px solid #FFE5E5;
    color: black;
    }
    .class13 {
    background:#a2cea18c;
    border: 3px solid #A2CEA1;
    color: black;
    }
    .class14 {
    background:#9fc1898a;
    border: 3px solid #9EC189;
    color: black;
    }
    .class15 {
    background:#adc9d888;
    border: 3px solid #ADC9D8;
    color: black;
    }
    .class16 {
    background:#b0e09888;
    border: 3px solid #B0E098;
    color: black;
    }
    .class17 {
    background:#e8fccf83;
    border: 3px solid #E8FCCF;
    color: black;
    }
    .class18 {
    background:#bbccea8f;
    border: 3px solid #BBCCEA;
    color: black;
    }
    .class19 {
    background:#a2bff28a;
    border: 3px solid #A2BFF2;
    color: black;
    }
    .class20 {
    background:#d6ffdf8a;
    border: 3px solid #D6FFDF;
    color: black;
    }
    .class21 {
    background:#c2c8e88e;
    border: 3px solid #C2C8E8;
    color: black;
    }
    .class22 {
    background:#ebd4cb85;
    border: 3px solid #EBD4CB;
    color: black;
    }
    .class23 {
    background:#eac5be8a;
    border: 3px solid #EAC5BE;
    color: black;
    }
    .class24 {
    background:#a4d6ca8c;
    border: 3px solid #A4D6CA;
    color: black;
    }
    .class25 {
    background:#caf7e283;
    border: 3px solid #CAF7E2;
    color: black;
    }
    .class26 {
    background:#caf7e273;
    border: 3px solid #CAF7E2;
    color: black;
    }
    .class27 {
    background:#6ea08b81;
    border: 3px solid #6EA08B;
    color: black;
    }
    .class28 {
    background:#ebd8d07e;
    border: 3px solid #EBD8D0;
    color: black;
    }
    .class29 {
    background:#d3ab9e7e;
    border: 3px solid #D3AB9E;
    color: black;
    }
    .class30 {
    background:#caf7e280;
    border: 3px solid #CAF7E2;
    color: black;
    }
    .cursor-pointer{
        cursor: pointer;
    }
    .maxHeightHistorical{
    max-height: 150px;
    overflow: hidden;
    overflow-y: scroll;
    }
    .listDatesEnd{
        max-height: 60vh;
        height: auto;
    }
   
    .vue-form-wizard .wizard-btn{
        min-width: 100px !important;
    }
    .fixed-top{
        margin-left:30%;
    }
    .fixed-top .drop{
        flex: 0 0 30% !important;
    }
    .calen::-webkit-scrollbar {
        width: 8px !important;     /* Tamaño del scroll en vertical */
        height: 8px !important;    /* Tamaño del scroll en horizontal */
        display: none !important;  /* Ocultar scroll */
    }
    .form-control{
        color: #2F2F2F !important;
    }
    .inputFind{
        padding: 2px 10px;
        border:none;
        border-radius: 5px;
        margin-top:-5px;
        font-size: .8rem;
    }
    #file {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    label[for="file"] {
        font-size: 12px;
        font-weight: 600;
        color: #0095ff;
        border: solid 2px #e9ecef;
        background-color: #fff;
        display: inline-block;
        transition: all .5s;
        cursor: pointer;
        padding: 8.1px !important;
        text-decoration-line: underline;
        text-transform: uppercase;
        width: 100%;
        text-align: center;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }
    .hoverDelete:hover{
        opacity: .8;
        cursor: pointer;
    }
    .buttonUpload{
        border:none;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        color:#fff;
        background-color: #2dce89;
        height: 37px !important;
    }
    .menuVerRedoAgenda{
	transition: all 0.3s ease-out;
	overflow: hidden;
    }

    .navSCodeAgenda{
        cursor: pointer;
        width: 18%;
        top: -20%;
        right: 82%;
        z-index: 1;
        border-bottom: 2px solid #0000005c;
        background-color: white;
        position: absolute;
        border-radius: 5px 5px 0 0;
    }
    .borderOnly .modal-content{
        border-radius: 0 0.4375rem 0.4375rem 0.4375rem !important;
    }
    .allSelected{
        background-color: #263c59;
    }
    .ps__rail-y{
        z-index: 10000000 !important;
    }
    .ps__thumb-y{
        height: 44px !important;
    }
    .qloq button{
        padding: 5px !important;
        margin-right: 30px !important;
    }
    .none{
        display: none;
    }
    .mobileForm{
        height:60vh !important;
        overflow:hidden !important;
        overflow-x: hidden !important;
        overflow-y:hidden !important;
    }
    .minAdd{
        font-size: 2em;
        vertical-align: sub;
        margin-left: 5px;
        color: #2dce89;
    }
    .minLess{
        font-size: 2em;
        vertical-align: sub;
        margin-right: 5px;
    } 
    .wizard-tab-content{
        padding-bottom: 10px;
    }
    .showPhone{
        display: none;
    }
    @media only screen and (max-width: 468px)
    {
        .styleDropdown .dropdown-menu{
            width: 100%;
            left: 0%;
        }
        .styleDropdown .dropdown-item{
            font-size:0.600rem !important;
        }
        .name-service{
            font-size: 1em;
            z-index:1;
            max-width: 85%;
            margin-bottom:20px;
        }
        .card-service img{
            top:-210px;
        }
        .responsiveItem{
            width: 100%;
        }
        .borderImageBrand{
            margin-left:35%;
        }
        .showDevice{
            display: none !important;
        }
        .showPhone{
            display: block;
        }
        .card-services-information {
            padding: 0;
        }
        .logoSyswaFooter{
            height:110px;
            width:180px
        }
        .flatpickr-calendar {
            left: 0 !important;
        }
        .vue-form-wizard .wizard-btn {
            min-width: 70px !important;
            font-size: .65em;
        }
    }
    @media only screen and (max-width: 768px)
    {
        .card-service{
            margin-top:10px;
        }
        .responsiveButtonsPercent{
            width: 100% !important;
        }
        .wizard-btn{
        min-width: 80px !important;  
        }
        .borderRight{
            border:none;
        }
        .flatpickr-calendar {
            left: 0 !important;
        }
        .vuecal__event-title{
            font-size: 1em;
        }
        .vuecal__event-time{
            font-size: 0.8em;
        }
        .vuecal__event-content{
            font-size: 0.9em;
        }
        .day-split-header{
            font-size: 0.8em;
        }
        .avatar-sm {
            width: 26px;
            height: 26px;
            font-size: 0.875rem;
            margin-top: -3px;
            margin-left: 3px;
        }
        .name-serviceF {
            font-size: 1.4em;
            margin-bottom: 5px !important;
        }
        .MicroF{
            font-size: 1em !important;
        }
        .MF{
            font-size: 0.9em !important;
        }
        .FPrice{
            font-size: 0.9em;
        }
    }
    .vue-form-wizard .wizard-tab-content{
        padding: 0px !important;
    }
    .wizard-btn{
        margin-top: 20px;
    }
    .hideThisShit input{
        display: none;
    }
    .ifscreen .flatpickr-calendar.inline{
        margin-left: 18% !important;
    }
    .ifNoscreen .flatpickr-calendar.inline{
        margin-left: -2% !important;
    }
</style>
