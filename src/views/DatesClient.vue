<template>
    <div class="font">
        <nav class="headerStyles" id="upView">  
            <div class="borderImageBrand">
                <img :src="logoBranch" class="imageBrand" alt="" >
            </div>
        </nav>
        <div class="container-fluid" style="margin-top:8rem;">
            <a-tooltip>
                <template slot="title">
                    Cambiar idioma
                </template>
                <base-button @click="changeLenguage" class="float-right mt-1" style="z-index: 10000;border-radius: 50%;height: 50px;width: 50px;right: 3%;top: 88%;position: fixed;" type="default">
                    <i class="fa fa-flag" style="vertical-align:1px;font-size:1.6em;left: 12px;top: 13px;position: absolute;"></i>
                </base-button>
            </a-tooltip>
            <card shadow>
                <a-spin :spinning="spinningDate">
                    <form-wizard @on-complete="finalFunction" color="#174c8e" :back-button-text="setLenguage.botonBack" :next-button-text="setLenguage.botonNext" :finish-button-text="setLenguage.botonSchedule" ref="wizard"> 
                        <h2 v-if="validWizard" slot="title">{{setLenguage.menu.header}}</h2>
                        <h2 v-else slot="title" class="text-danger">¡{{setLenguage.menu.alert}}!</h2>
                        <tab-content class="mt-4" :title="setLenguage.menu.service" icon="fa fa-layer-group" :before-change="validateFirstStep" >
                            <div v-if="desactive">
                                <center>
                                    <h1 class="text-center w-50 mt-4">
                                        Por motivos de fuerza mayor, no estamos atendiendo en nuestro loca. Una vez se levante la cuarentena retomaremos  los agendamientos.
                                    </h1>
                                </center>
                            </div>  
                            <div v-else class="row">
                                <div class="showDevice col-md-12 row">
                                    <div style="width:auto;" class="col-12 ml-3" >
                                        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                            <li v-for="(category, index) of categories" :key="category.name"  class="nav-item responsiveItem" role="presentation">
                                                <button class="categoryButton text-uppercase responsiveItem" :id="'cat'+index" data-toggle="pill" :href="'#v-pills-'+category._id" role="tab" aria-controls="v-pills-home" aria-selected="true" v-on:click="selectCat('cat'+index)">{{category.name}}</button>
                                            </li>
                                        </ul>   
                                    </div>
                                    <div class="separateService col-md-8">
                                        <div class="tab-content" id="pills-tabContent">
                                            <div v-for="category of categories" :key="category.name" class="tab-pane fade " :id="'v-pills-'+category._id" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                <div class="row mt-2">
                                                    <template v-for="(service, index) of services">
                                                        <div :key="service.name" class="col-md-4 px-2" v-if="service.category == category.name && service.active == true">
                                                            <div class="card-service row mt-2" :id="'cardS'+index">
                                                                <h3 class="name-service w-100"> {{service.name}}</h3>
                                                                <div class="col-12 pl-0">
                                                                    <img src="img/brand/calendar.png" alt="">
                                                                </div>
                                                                <p class="ml-1 mb-0 w-100" style="margin-top:-15px;">
                                                                    <a-icon type="clock-circle" style="vertical-align:1.5px;" /> {{fixedHours(service.duration)}}
                                                                </p>
                                                                <p class="ml-1 w-100">{{service.additionalName}}</p> 
                                                                
                                                                <div class="col-md-6 col-sm-12 mt-1" style="padding: 0px !important;padding-top: 5px !important;">
                                                                    <div class="price-service ">$ {{formatPrice(service.price)}}</div> 
                                                                </div>
                                                                <div class="col-md-6 col-sm-12 mt-1" style="padding: 0px !important;margin-top:-5px;">
                                                                    <div class="button-service-group">
                                                                        <button class="button-service-left" ><i class="fa fa-minus" v-on:click="lessService(index, service.name, service.duration, 'cardS'+index, service.price, serviceCount[index].count)"></i></button>
                                                                        <span class="span-button-service">{{serviceCount[index].count}}</span>
                                                                        <button class="button-service-right" 
                                                                        v-on:click="plusService(index, service.name, service._id, service.duration, service.commission, service.price, service.employes, 'cardS'+index, service.discount)"
                                                                        ><i class="fa fa-plus"></i></button>
                                                                    </div> 
                                                                </div>  
                                                            </div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <h2 style="margin-top:-50px;">{{setLenguage.services.select}}</h2>
                                        <template v-if="registerDate.serviceSelectds[0]">
                                            <div v-for="(service, index) in registerDate.serviceSelectds" :key="service._id+'asda'+index" class="w-100 px-4" >
                                                <div class="card-service row mt-4" style="border-bottom: solid 8px #174c8e">
                                                    <h3 class="name-service"> {{service.name}}</h3>
                                                    <div class="col-12 pl-0">
                                                        <template v-if="ifMicro">
                                                            <a-tooltip placement="top">
                                                                <template slot="title">
                                                                    <span>Marque el adicional deseado, en caso de no aplicar marcar opción "NINGUNO" para poder avanzar.</span>
                                                                </template>
                                                                <span class="ml-1 mb-0 font-weight-bold" style="font-size: 1.2em;">Adicionales: </span>
                                                                <div v-for="(micro, indexM) in service.microServices" :key="micro.microService" v-on:click="SelectMicro(index, indexM, micro)" style="display: inline-block; cursor: pointer;margin-left: 4px;margin-top:2px;">
                                                                    <badge :type="micro.checked ? 'primary' : 'secondary'" class="text-default">
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
                                            <h2 class="text-center">{{setLenguage.services.noSelect}}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div class="showPhone col-md-12 p-0 pb-2">
                                    <base-dropdown class="w-100 mx-auto mb-3 styleDropdown">
                                        <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" slot="title" type="default" class="dropdown-toggle w-100">
                                            {{CatSelected}}
                                        </base-button>
                                        <b v-for="category of categories" :key="category.name" v-on:click="selectCategoryPhone(category.name)" class="dropdown-item w-100" style="color:#fff;"> {{category.name}} </b>
                                    </base-dropdown>
                                    <base-dropdown class="w-100 mx-auto styleDropdown" v-if="servicesPhoneShow">
                                        <base-button style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" slot="title" type="default" class="dropdown-toggle w-100">
                                            {{setLenguage.services.services}} 
                                        </base-button>
                                        <template v-for="service of servicesCat">
                                            <b :key="service.name" v-on:click="selectServicePhone(service._id)" v-if="service.active == true" class="dropdown-item w-100" style="color:#fff;"> {{service.name}} </b>
                                        </template>
                                    </base-dropdown>
                                    
                                    <template v-if="registerDate.serviceSelectds[0]">
                                        <h2 class="mt-3 text-center">{{setLenguage.services.select}}</h2>
                                        <hr>
                                        <div v-for="(service, index) in registerDate.serviceSelectds" :key="service._id+'asda'+index" class="w-100" >
                                            <div class="card-service mt-4" style="border-bottom: solid 8px #174c8e">
                                                <h2 class="name-service"> {{service.name}}</h2>
                                                <p class="ml-1 mb-0 w-100" style="margin-top:-8px;">
                                                    <a-icon type="clock-circle" style="vertical-align:1.5px;" /> 
                                                    {{fixedHours(service.duration)}}<br>
                                                    {{service.additionalName}}
                                                </p>
                                                <div class="col-12 mt-2 p-0">
                                                    <template v-if="ifMicro">
                                                        <a-tooltip placement="top">
                                                            <template slot="title">
                                                                <span>Haga click en los adicionales que desea para este servicio. Se le sumara el costo al total del servicio.</span>
                                                            </template>
                                                            <span class="ml-1 mt-2 mb-0 font-weight-bold" style="font-size: 1.2em;">Adicionales: </span>
                                                            <br>
                                                            <div v-for="(micro, indexM) in service.microServices" :key="micro.microService" v-on:click="SelectMicro(index, indexM, micro)" style="display: inline-block; cursor: pointer;margin-left: 4px;">
                                                                <badge style="z-index:100" :type="micro.checked ? 'primary' : 'secondary'" class="text-default mb-1">
                                                                    <p style="font-size:1.2em;font-weight: bold;" class="fs-5 mb-0">{{micro.microService}}</p>
                                                                </badge>
                                                            </div>
                                                        </a-tooltip>
                                                    </template>
                                                    <img style="z-index:0" src="img/brand/calendar.png" alt="">
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
                        </tab-content>
                        <tab-content :title="setLenguage.menu.professional" icon="fa fa-users" :before-change="validateLastStep">
                            <div class="row">
                                <div class="col-md-4" style="margin-top:16px;">
                                    <div class="w-75 mx-auto" >
                                        <badge type="secondary" style="font-size:.7em !important; margin-top:14px;" class="mb-1 mx-2 w-100">
                                            <span style="font-family:Arial !important;color:#32325d;font-weight:600;" class="w-100">{{setLenguage.professionals.date}}</span> 
                                        </badge>
                                        <base-input class="hideThisShit"  style="cursor:pointer;" >
                                            <flat-picker 
                                                    @on-change="openCalendar"
                                                    slot-scope="{focus, blur}"
                                                    @on-open="focus"
                                                    @on-close="blur"
                                                    :config="configDate"
                                                    placeholder="Seleccione una fecha" 
                                                    class="form-control date-client datepicker pl-3"
                                                    aria-placeholder="Seleccione una fecha"
                                                    v-model="dates.simple">
                                            </flat-picker>
                                        </base-input>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="row mb-3">
                                        <div class="col-12 text-center mt-2" v-for="(servicesSelect, indexService) of registerDate.serviceSelectds" :key="servicesSelect.servicio" >
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="py-1" style="background-color:#f8fcfd;">
                                                        <badge style="font-size:.7em !important" v-if="servicesSelect.lender != ''" type="secondary" class="mb-1 mx-4">
                                                            <span style="color:#32325d;font-weight:600;font-family:Arial !important;">{{setLenguage.professionals.professional}}</span> <br>
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
                                                                <span style="color:red">{{setLenguage.professionals.hoursBusy}}</span>
                                                            </base-button>
                                                            <template v-for="employe of servicesSelect.employes" >
                                                                <b :key="employe.name" v-if="employe.valid && verifyValidOnline(employe.id) && findDay(employe.days, employe.name)" class="dropdown-item w-100" style="color:#fff;" v-on:click="insertData(indexService, employe.name, employe.days, employe.class, servicesSelect.duration, employe.id, 'check'+indexService, servicesSelect.employes, employe.img)">{{employe.name}}  </b>
                                                            </template>
                                                        </base-dropdown>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 pb-2">
                                                    <div class="py-1" style="background-color:#f8fcfd;">
                                                        <badge type="secondary" style="font-size:.7em !important; margin-top:14px;" class="mb-1 mx-2 w-100">
                                                        <span style="font-family:Arial !important;color:#32325d;font-weight:600;" class="w-100">{{setLenguage.professionals.hours}}</span> 
                                                        </badge>
                                                        <base-button v-on:click="openBlocks('block'+indexService)" class="responsiveButtonsPercent" v-if="servicesSelect.valid == true" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="default" >
                                                            <span v-if="servicesSelect.start != ''">{{servicesSelect.start}} / {{servicesSelect.end}} <i style="color:#2dce89;float:right;margin-top:6px;" :id="'check'+indexService" class="fa "></i>
                                                            </span>
                                                            <span v-else>{{setLenguage.professionals.selectHour}} <i class="fa fa-angle-down" style="font-size:16px"></i> </span>
                                                        </base-button>
                                                        <base-button class="responsiveButtonsPercent" v-if="servicesSelect.valid == false" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="default" disabled>
                                                        {{setLenguage.professionals.selectHour}}
                                                        </base-button>
                                                        <base-button class="responsiveButtonsPercent" v-if="servicesSelect.valid == 'none'" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="default" disabled>
                                                        <span style="color:red">{{setLenguage.professionals.hoursBusy}}</span>
                                                        
                                                        </base-button>
                                                        <vue-custom-scrollbar class="mx-auto responsiveButtonsPercent" :id="'block'+indexService" style="max-height:25vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden;background-color:#fff;">
                                                            <div class="col-12" v-for="(block , index) of servicesSelect.blocks" :key="block.hour">
                                                                <base-button v-if="block.validator == true" v-on:click="selectBloqMulti(block.employes, block.hour, index, indexService,'block'+indexService, 'check'+indexService)" size="sm" class="col-12" type="success">
                                                                    <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                                                    <span>{{setLenguage.professionals.available}}</span>
                                                                </base-button>
                                                                <base-button disabled v-else-if="block.validator == false" size="sm" class="col-12" type="danger">
                                                                    <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                                                    <span>{{setLenguage.professionals.busy}}</span>
                                                                </base-button>
                                                                <base-button v-else-if="block.validator == 'select'" size="sm" class="col-12" type="default">
                                                                    <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                                                    <span>{{setLenguage.professionals.selected}}</span>
                                                                </base-button>
                                                                <base-button style="cursor:not-allowed" v-else size="sm" disabled class="col-12" type="secondary">
                                                                    <badge style="font-size:1em !important" type="white" class="text-default col-5 float-left">{{block.hour}}</badge>
                                                                    <span>{{setLenguage.professionals.noSelect}}</span>
                                                                </base-button>
                                                            </div>
                                                        </vue-custom-scrollbar>
                                                    </div>
                                                </div>   
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </tab-content>
                        <!-- employes: lendersName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, id: '', blocksFirst: [], blocks: [], name: service, microServices: microsService  microServiceSelect -->
                        <tab-content :title="setLenguage.menu.information" icon="fa fa-question-circle">
                            <div class="row">
                                <div class="col-md-8 col-sm-12" >
                                    <div class="row">
                                        <div class="card-services-information col-lg-6" v-for="(data, index) in registerDate.serviceSelectds" :key="data.servicio" >
                                            <div class="p-3">
                                                <center>
                                                <span class="mb-1 w-100" style="color:#000;font-weight:500;">{{setLenguage.information.countService}} {{index + 1}}</span> 
                                                </center>
                                                
                                                    <base-button type="secondary" class="w-100 text-center mb-1" style="background-color:#d5dadd;color:#1c2021;border:none">
                                                        <badge class="mx-auto ml-2" type="default" style="background-color:#174c8e;">
                                                            
                                                            <span style="color:#fff;font-size:1.4em;text-transform:none;">{{data.name}}
                                                                
                                                            </span>
                                                        </badge><br>
                                                        <span class="mx-auto" style="font-size:1.2em;">{{data.realEmploye}}</span>
                                                    </base-button>
                                                
                                                <div style="background-color:#f8fcfd;">
                                                    <badge type="secondary" class="w-100" style="margin-top:-5px;font-weigth:600;font-family: Open Sans, sans-serif;line-height: .2;">
                                                        <span style="color:#000;font-weight:600;font-size:.96em;text-transform:none;">{{setLenguage.information.start}}</span> 
                                                    </badge>
                                                    <badge type="secondary" class="w-100" style="margin-top:-5px;font-weigth:600;font-family: Open Sans, sans-serif;line-height: .2;">
                                                        <span style="color:#000;font-weight:600;font-size:2.8em;">{{data.start}}</span> 
                                                    </badge>
                                                    <badge type="secondary" class="w-100" style="margin-top:-5px;font-weigth:600;font-family: Open Sans, sans-serif;line-height: .2;">
                                                        <span style="color:#000;font-weight:600;font-size:.96em;text-transform:none;">{{setLenguage.information.end}}</span> 
                                                    </badge>
                                                    <badge type="secondary" class="w-100" style="margin-top:-5px;font-weigth:600;font-family: Open Sans, sans-serif;line-height: .2;">
                                                        <span style="color:#000;font-weight:600;font-size:2.8em;">{{data.end}}</span> 
                                                    </badge>
                                                    <badge type="secondary" class="w-100" style="margin-top:-5px;font-weigth:600;font-family: Open Sans, sans-serif;line-height: .2;">
                                                        <span style="color:#000;font-weight:600;font-size:.96em;text-transform:none;">{{setLenguage.information.insurance}}</span> 
                                                    </badge>
                                                    <badge type="secondary" class="w-100" style="margin-top:-5px;font-weigth:600;font-family: Open Sans, sans-serif;line-height: .2;">
                                                        <span style="color:#000;font-weight:600;font-size:2.8em;"><a-switch  :checked="extraData.secure" @change="a()"/></span> 
                                                    </badge>
                                                    <badge type="secondary" class="w-100" style="margin-top:-5px;font-weigth:600;font-family: Open Sans, sans-serif;line-height: .2;">
                                                        <span style="color:#000;font-weight:600;font-size:.96em;text-transform:none;">{{setLenguage.information.emergency}}</span> 
                                                    </badge>
                                                    <badge type="secondary" class="w-100" style="margin-top:-5px;font-weigth:600;font-family: Open Sans, sans-serif;line-height: .2;">
                                                        <span style="color:#000;font-weight:600;font-size:2.8em;"><a-switch  :checked="extraData.emergency" @change="b()"/></span> 
                                                    </badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-12 pt-5">
                                    <center>
                                        <!-- <base-dropdown class="mt-1 responsiveButtonsPercent mx-auto styleDropdown">
                                            <base-button slot="title" type="succes" class="dropdown-toggle w-100 dropdownPay" style="border-radius:14px; border: 1px solid #174c8e">
                                                Selecciona un tipo de pago
                                            </base-button>
                                            <b class="dropdown-item w-100" style="color:white;" v-on:click="selectPay('Presencial efectivo')">Presencial efectivo</b>
                                            <b class="dropdown-item w-100" style="color:white;" v-on:click="selectPay('Presencial Débito')">Presencial Débito</b>
                                            <b class="dropdown-item w-100" style="color:white;" v-on:click="selectPay('Presencial Crédito')">Presencial Crédito</b>
                                        </base-dropdown><br> -->
                                        <base-button class="mt-3 responsiveButtonsPercent mx-auto" type="secondary" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;">
                                            {{setLenguage.information.date}}: <strong>{{dates.simple}}</strong>
                                        </base-button><br>
                                        <base-button class="mt-3 responsiveButtonsPercent mx-auto" type="secondary" style="border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;">
                                            {{setLenguage.information.initHour}}: <strong v-if="registerDate.serviceSelectds[0]">{{registerDate.serviceSelectds[0].start}}</strong>
                                        </base-button>
                                    </center><br>
                                </div>
                            </div>
                        </tab-content>
                    </form-wizard>
                </a-spin>
            </card>
        </div>
        <nav class="navbar navbar-expand-lg navbar-light bg-Secondary row m-0 p-0">
            <div  id="navbarTogglerDemo01" class="mx-auto col-6 m-0">
               <a href="http://syswa.net">
                    <img src="img/brand/syswa-gestion.png" class="logoSyswaFooter" alt="" style="">
                </a>
            </div>
            <span class="navbar-text col-6 m-0" style="float: right !important;">
                © {{year}} | <a href="http://www.syswa.com" class="font-weight-bold ml-1" target="_blank">SYSWA</a> {{setLenguage.allRightReserves}}
            </span>
        </nav>
        <modal :show.sync="modals.modal0">
            <template v-slot:header>
                <h5 class="modal-title" id="exampleModalLabel"></h5>
            </template>
            <div class="text-center">
                <i class="ni ni-check-bold ni-5x text-success"></i>
                <h2>¡Bienvenido(a) {{nameClient}}!</h2><br> 
                <h4>Ya puedes agendar tu cita</h4><br>
                <h4>{{dataMessageClient}}</h4><br>
                <h5>¡Comparte tu link de referido y recibe descuento por cada recomendación!</h5>
            </div>
            <template class="p-3">
                <div class="row p-3">
                    <div class="col-md-6 col-12 mb-3">
                        <center>
                            <base-button class="mx-auto" type="secondary" v-on:click="aCopiar()">Copiar link de referido</base-button>
                        </center>
                    </div>
                    <div class="col-md-6 col-12">
                        <center>
                            <base-button class="mx-auto" type="primary" @click="modals.modal0 = false">Continuar</base-button> 
                        </center>
                        
                    </div>
                </div>
            </template>
        </modal>
        <modal :show.sync="modals.modal2"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
               <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-4 py-lg-4"
                  class="border-0">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h3>{{setLenguage.finalInfo.title}}</h3>
                    </div>
                </template>
                <template>
                    <form role="form">
                        <div class="row">
                            <label v-if="registerUser.pay == 'Transferencia'" for="pay">Comprobante de pago</label>
                            <input alternative
                                v-if="registerUser.pay == 'Transferencia'"
                                type="file"
                                ref="file" class="form-control mb-1"
                                v-on:change="handleFileUpload()">
                            <hr style="margin-bottom:5px !important;margin-top:10px !important;" v-if="registerUser.pay == 'Transferencia'">
                            <div class="card-info">
                                <div>
                                    <p v-if="registerUser.pay == 'Transferencia'">
                                        Al finalizar su agendamiento usted debe considerar que su hora está tomada con pago mediante <b style="font-weight:600;">transferencia electrónica por validar.</b> 
                                        <br><br>
                                        Una vez validado su pago le llegará un correo donde debe confirmar su cita.
                                    </p>
                                </div>
                            </div> 
                            <div v-if="registerUser.pay == 'Transferencia'">
                                <base-button style="float:right;margin-top:-10px;border-radius:14px;background-color:#174c8e;color:#fff;border:none;" v-if="validRegister" type="success" v-on:click="finallyAgend()">
                                    Finalizar agenda
                                </base-button>  
                                <base-button style="float:right;margin-top:-10px;border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" v-else type="default" disabled>
                                    Finalizar agenda
                                </base-button>
                            </div>
                        </div>
                    </form>
                </template>
            </card>
        </modal>
        <a-modal v-model="modals.modal6" class="modal-sm" size="xs" :footer="null" @cancel="returnModal" :closable="false" >
            <template slot="footer">
                <br><br><br>
            </template>
            <template>
                <div class="text-muted text-center">
                    <h3>{{setLenguage.modal.header}}</h3>
                </div>
            </template>
            <template>
                <div v-if="ifUserRegister">
                    <div>
                        <base-input alternative
                            type="text"
                            v-on:keyup="validFields()"
                            :placeholder="setLenguage.modal.firstNameField"
                            v-model="registerUser.firstName"
                            addon-left-icon="fa fa-user">
                        </base-input>
                    </div>
                    <span style="color:red;position:absolute;right:35px;top:70px;z-index:1;">*</span>
                    <base-input alternative
                        type="text"
                        v-on:keyup="validFields()"
                        :placeholder="setLenguage.modal.lastNameField"
                        v-model="registerUser.lastName"
                        addon-left-icon="fa fa-user">
                    </base-input>
                    <span style="color:red;position:absolute;right:35px;top:140px;z-index:1;">*</span>
                    <base-input alternative
                        type="email"
                        v-on:keyup="validFields()"
                        :placeholder="setLenguage.modal.emailField.placeholder"
                        v-model="registerUser.email"
                        addon-left-icon="ni ni-email-83">
                    </base-input>
                    <span style="color:red;position:absolute;right:35px;top:205px;z-index:1;">*</span>
                    <div class="col-12 p-0">
                        <VuePhoneNumberInput v-model="registerUser.phone.formatNational" @update="phoneData = $event, registerUser.phone = $event, validFields()" 
                        :default-phoner-number="registerUser.phone.nationalNumber"
                        :default-country-code="registerUser.phone.countryCode"
                        :translations="{
                            countrySelectorLabel: setLenguage.modal.phoneField.countrySelectorLabel,
                            countrySelectorError: setLenguage.modal.phoneField.countrySelectorError,
                            phoneNumberLabel: setLenguage.modal.phoneField.phoneNumberLabel,
                            example: setLenguage.modal.phoneField.example
                        }"/>
                    </div>
                    <label for="date" class="w-100 mt-2">{{setLenguage.modal.birthDateField.label}} </label>

                    <base-input alternative
                        type="text"
                        v-on:keyup="validFields()"
                        placeholder="DIRECCION"
                        v-model="extraData.location"
                        addon-left-icon="ni ni-fat-add">
                    </base-input>

                    <span style="color:red;position:absolute;right:35px;top:270px;z-index:1;">*</span>
                    <div class="col-12">
                        <div class="row">
                            <div class="col-12 col-md-6 col-lg-6">
                                <base-button class="mt-4" style="width:200px;border-radius:14px;color:white;border:none;" type="primary" v-on:click="ifUserRegister = false">
                                    {{setLenguage.modal.botonBack}}
                                </base-button>
                            </div>
                            <div class="col-12 col-md-6 col-lg-6">
                                <base-button v-if="validRegister" class="mt-4" style="width:200px;border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="success" v-on:click="registerClients">
                                    {{setLenguage.modal.botonRegister}}
                                </base-button>
                                <base-button v-else class="mt-4" style="width:200px;border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="success" disabled>
                                    {{setLenguage.modal.botonRegister}}
                                </base-button>
                            </div>
                        </div>
                    </div>
                    
                    
                    
                </div>
                <div class="card p-3" v-else>
                    <label for="branche">{{setLenguage.modal.emailField.label}}</label>
                    <base-input alternative
                        type="email"
                        v-on:keyup="validVerifyFunc()"
                        :placeholder="setLenguage.modal.emailField.placeholder"
                        v-model="registerUser.email"
                        addon-left-icon="ni ni-email-83">
                    </base-input>
                    <label for="branche">{{setLenguage.modal.branchField.label}}</label>
                    <a-select allowClear :placeholder="setLenguage.modal.branchField.placeholder" class="input-group-alternative clearClass" style="width: 100%" size="large">
                        <template v-for="branch in branches">
                            <a-select-option :key="branch._id" @click="selectBranch(branch)"  :value="branch.name" v-if="branch.active">
                                {{branch.name}}
                            </a-select-option>
                        </template>
                    </a-select>
                    <div class="row">
                        <div class="col-md-12">
                            <base-button v-if="validVerify" class="mt-4 float-right" style="width:200px;border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="success" v-on:click="verifyData">
                                {{setLenguage.modal.botonConfirm}}
                            </base-button>
                            <base-button v-else class="mt-4 float-right" style="width:200px;border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="success" disabled>
                                {{setLenguage.modal.botonConfirm}}
                            </base-button>
                        </div>
                    </div>
                </div>
            </template>
        </a-modal>
        <a-modal v-model="modals.modal4" class="modalFinal" @cancel="location" :closable="false" >
            <template>
                <div class="text-muted text-center">
                    <h3>{{setLenguage.finalInfo.title}}</h3>
                </div>
            </template>
            <template>
                <div class="card-info text-justify">
                    <hr>
                    <div>
                        <p style="font-weight:500;">

                            {{setLenguage.finalInfo.message}} <br><br>
                            {{setLenguage.finalInfo.message2}} <br><br>
                            {{setLenguage.finalInfo.message3}}
                            <!-- ¡Listo! Hemos enviado la cita a tu correo electrónico con todos los detalles del agendamiento.
                            <b style="font-weight:600;">Por favor verificar que todo esté correcto</b>y en caso de haber algún error o no poder asistir debes presionar el botón de Cancelar para dejar sin efecto el agendamiento.
                            <br><br>
                            Una vez tomada la hora, el día previo a la cita te llegará un correo de confirmación y es importante que le des al botón de <b style="font-weight:600;">Confirmar</b> la hora tomada, de lo contrario entenderemos que no asistirás. <br><br>
                            Si dicho correo electrónico de agendamiento no llega, recuerda revisar la caja de spam o correo no deseado. En caso de no encontrar la información por favor ponte en contacto con nosotros a través de nuestras redes de atención o al WhatsApp y verificaremos de inmediato. -->
                            
                        </p>
                        <hr class="mt-2 mb-2">
                        <p class="text-center">{{setLenguage.finalInfo.phone}}</p>
                    </div>
                </div>     
            </template>
            <template slot="footer">
                <base-button style="width:200px;border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="success" v-on:click="location">
                    {{setLenguage.finalInfo.boton}}
                </base-button>
            </template>
        </a-modal>
        <modal :show.sync="modals.modal5"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-lg">
               <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-4 py-lg-4"
                  class="border-0">
                <template>
                    <div class="text-muted text-center mb-3">
                        <h3>Formulario de compra</h3>
                    </div>
                </template>
                <template>
                    <div class="row">
                        <div class="col-md-7 borderRight">
                            <div class="card-info-data text-justify">
                                <div>
                                    <p style="font-size:0.9em;">
                                        <b style="font-weight:600;">Los datos de transferencia son:</b>
                                        <br><br>
                                        <b style="font-weight:600;">Nombre:</b> Katriel Capacho<br>
                                        <b style="font-weight:600;">Banco:</b> Banco estado<br>
                                        <b style="font-weight:600;">Cuenta rut:</b> 262530322<br>
                                        <b style="font-weight:600;">Rut:</b> 26253022-1<br>
                                        <b style="font-weight:600;">Correo: </b>kkprettynails@gmail.com
                                    </p><br>
                                    <h3 class="text-center">El monto a trasferir es:</h3>
                                    <h2 class="text-center font-weight-bold">$ {{this.formatPrice(totalPrice)}}</h2>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5 pt-3">
                            <div class="card-info text-center">
                                <div>
                                    <p style="font-size:0.9em;line-height:1.4em;">
                                        <b style="font-weight:600;">Importante.</b>
                                        <br><br>
                                        Al realizar el pago mediante transferencia electrónica deberás adjuntar este comprobante en el formulario de pago que se mostrará a continuación. 
                                    </p>
                                </div>
                            </div>
                            <base-button class="w-100" style="margin-top:55px;border-radius:14px;background-color:#d5dadd;color:#1c2021;border:none;" type="success" v-on:click="modals.modal5 = false, modals.modal2 = true">
                                Continuar
                            </base-button>
                        </div>
                    </div>
                </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal3"
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
    // backend
    import axios from 'axios'
    import router from '../router'
    import endPoint from '../../config-endpoint/endpoint.js'
    import jwtDecode from 'jwt-decode'
    import io from 'socket.io-client';
    import VueClipboard from 'vue-clipboard2';

    //frontend
    import flatPicker from "vue-flatpickr-component";
    import {Spanish} from 'flatpickr/dist/l10n/es.js';
    import {English} from 'flatpickr/dist/l10n/default.js';
    import locale_es from 'ant-design-vue/es/date-picker/locale/es_ES';
    import locale_en from 'ant-design-vue/es/date-picker/locale/en_US';
    
    import vueCustomScrollbar from 'vue-custom-scrollbar'
    import VuePhoneNumberInput from 'vue-phone-number-input';
    import es_ES from '../lang/es_ES.json';
    import en_US from '../lang/en_US.json';
    import 'vue-phone-number-input/dist/vue-phone-number-input.css';
    const dateNow = new Date()
    export default {
        components: {
            flatPicker,
            vueCustomScrollbar,
            VuePhoneNumberInput,
            VueClipboard
        },
        data(){
            return {
                socket: io(endPoint.endpointTarget),
                desactive: false,
                ifUserRegister: false,
                branch: '',
                branches: [],
                locale: locale_en,
                es_ES,
                en_US,
                setLenguage: en_US,
                branchName: '',
                dateFormat: 'DD/MM/YYYY',
                day: 0,
                configDate: {
                    inline: true,
                    allowInput: false,
                    dateFormat: 'd-m-Y',
                    locale: English, // locale for this instance only
                    minDate: new Date(),
                    "disable": [
                        function(date) {
                            return false;
                        }
                    ] 
                           
                },
                extraData:{
                    linkPhotos: '',
                    secure: false,
                    nature: '',
                    material: '',
                    emergency: false,
                    details: '',
                    phase: 'default'
                },
                validPay:false,
                progress:false,
                spinningDate: false,
                dates:{
                    simple: ''
                },
                servicesCat: [],
                serviceSelected: [],
                servicesPhoneShow:false,
                CatSelected: 'Categorias',
                finalDate: '',
                phoneData: null,                
                registerUser: {
                    name: '',
                    firstName: '',
                    email: '',
                    lastName: '',
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
                    pay: 'Presencial efectivo',
                    pdf: 'danger',
                    birthday: ''
                },
                radioDomingos:{
                    radio1:'rad1',
                    radio2:'rad2'
                },
                totalPrice: 0,
                validWizard: true,
                year: new Date().getFullYear(),
                modals: {
                    modal0:false,
                    modal1: false,
                    modal2: false,
                    modal3: false,
                    modal4: false,
                    modal5: false,
                    modal6: true,
                    message: "Disculpa, las citas todavia no están habilitadas",
                    icon: 'ni ni-fat-remove ni-5x',
                    type:''
                },
                arrayLendersSelect: [],
                checkboxes: {
                    Wantlender: false
                },
                blockHour: [],
                readyChange: false,
                registerDate: {
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
                    end: ''
                },
                getDay: 0,
                logoBranch:'https://syswa-gestion.s3.sa-east-1.amazonaws.com/predeterminado.png',
                lenders: [],
                services: [],
                serviceCount: [],
                servicePhoneCount: [],
                posibleLenders: [],
                ifLender: false,
                ifServices: false,
                validSchedule: false,
                validHour:false,
                readyAddDesign:true,
                blockHour:[],
                finalyLenders:[],
                categories: [],
                active: {
                    'background-color': '#0b1526'
                },
                extraData: {
                    location: ''
                },
                linkForCopy:'',
                showLenderSection: false,
                noOneLender: false,
                selectServiceForHour: {},
                validRegister: false,
                client: '',
                file: '',
                ifDisabled: false,
                availableslenders: [],
                configHeader: {
                    headers: {
                        "x-database-connect": endPoint.database
                    }
                },
                ref: '',
                microServices: [],
                selectedMicro: [],
                safe: [],
                ifMicro: false,
                itFirst: true,
                validVerify: false,
                configurationsBranch: new Object(),
                inBlackList: false,
                blockToBlackList: [],
                idForRefer:'',
                nameClient:'',
                dataMessageClient: ''
            }
        },
        created(){
            this.getBranches()
            this.device()
            // this.$swal({
            //     icon: 'success',
            //     title: 'Agendamiento en mantenimiento.',
            //     html: '<p>Para agendamiento contacta al <br> +56 9 7262 8949</p>',
            //     showConfirmButton: true
            // })
        },
        methods: {
            handleFileUpload(){
                this.file = this.$refs.file.files[0]
                this.validRegister = true
            },
            selectBranch(value){
                if (value) {
                    this.branch = value._id
                    this.branchName = value.name
                    axios.get(`${endPoint.endpointTarget}/configurations/${this.branch}`, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.configurationsBranch = res.data.data
                            if (this.configurationsBranch.bussinessLogo != '') {
                                this.logoBranch = this.configurationsBranch.bussinessLogo
                            }
                            
                            if (this.configurationsBranch.datesPolitics.onlineDates) {
                                this.validVerifyFunc()
                                this.configDate.maxDate = new Date().setMonth(new Date().getMonth() + this.configurationsBranch.datesPolitics.limitTimeDate)
                            }else{
                                $('.clearClass .ant-select-selection__clear').click()
                                this.$swal.fire({
                                    icon: 'error',
                                    html: `<h2>La sucursal <strong>${this.branchName}</strong> no se encuentra habilitada en este momento</h2> <br> <p>En caso de dudas, consulte al <strong>${res.data.data.businessPhone.formatInternational}</strong> </p>`
                                })
                            }
                            const blockHours = this.configurationsBranch.blockHour
                            this.configDate.disable = [
                                function(date) {
                                    // var days = 10
                                    // for (const element of blockHours) {
                                    //     if (element.day === date.getDay()) {
                                    //         days = element.status ? element.day : 10
                                    //     }
                                    // }
                                    // console.log(days)
                                    return blockHours[date.getDay()].status == true ? false : true;
                                }
                            ]
                        }
                    }).catch(err => {
                        if (!err.response) {
                            this.$swal({
                                icon: 'error',
                                title: 'Error de conexión',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                }
            },
            
            selectBirthday(date, dateString){
                this.registerUser.birthday = date._d
                this.validFields()
            },
            SelectMicro(index, indexM, microServices) {
                console.log(microServices)
                if (this.registerDate.serviceSelectds[index].microServices[indexM].microService == 'Ninguno') {
                    this.registerDate.serviceSelectds[index].microServices.forEach(element => {
                        if (element.checked && element.microService != 'Ninguno') {
                            element.checked = false
                            this.registerDate.serviceSelectds[index].duration = parseFloat(this.registerDate.serviceSelectds[index].duration) - parseFloat(element.duration)
                        }
                    });
                    this.registerDate.serviceSelectds[index].microServices[0].checked = true
                }else{
                    if (this.registerDate.serviceSelectds[index].microServices[indexM].checked) {
                        this.registerDate.serviceSelectds[index].microServices[indexM].checked = false    
                        this.registerDate.serviceSelectds[index].duration = parseFloat(this.registerDate.serviceSelectds[index].duration) - parseFloat(microServices.duration)
                    }else{
                        this.registerDate.serviceSelectds[index].microServices[0].checked = false
                        this.registerDate.serviceSelectds[index].microServices[indexM].checked = true
                        this.registerDate.serviceSelectds[index].duration = parseFloat(this.registerDate.serviceSelectds[index].duration) + parseFloat(microServices.duration)
                    }
                }
            },
            aCopiar(){
                this.$clipboard(this.linkForCopy)
                this.$swal({
                    icon: 'success',
                    title: '¡Copiado!',
                    showConfirmButton: false,
                    timer: 2000
                })
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
                        console.log(this.microServices)
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
                    }
                }
            },
            async verifyData(){
                try{
                    const findClient = await axios.get(endPoint.endpointTarget+'/clients/findOneWithoutToken/'+this.registerUser.mail, this.configHeader)
                    if (findClient.data.status == 'ok') {
                        this.registerUser = {
                            firstName: findClient.data.data.firstName,
                            email: findClient.data.data.email,
                            lastName: findClient.data.data.lastName,
                            id: findClient.data.data._id,
                            location: findClient.data.data.extraData ? findClient.data.data.extraData.location : "",
                            name: findClient.data.data.firstName + ' ' + findClient.data.data.lastName,
                            phone: findClient.data.data.phone.formatInternational,
                            pay: 'Presencial efectivo',
                            pdf: 'danger'
                        }
                        this.idForRefer = findClient.data.data._id
                        this.dataMessageClient = ""
                        
                        try {
                            const verifyBlackList = await axios.post(endPoint.endpointTarget+'/clients/verifyBlackList', {
                                clientId: findClient.data.data._id,
                                branch: this.branch
                            }, this.configHeader)
                            if (verifyBlackList.data.status == 'in black list') {
                                this.inBlackList = true
                                this.blockToBlackList = verifyBlackList.data.data
                            }
                            console.log(verifyBlackList)
                        }catch(err){
                            if (!err.response) {
                                this.$swal({
                                    icon: 'error',
                                    title: this.setLenguage.connectionError,
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            }
                        }
                        this.getServices()
                        this.getCategories()
                        this.getEmployes()
                        this.getMicroServices()
                        if (this.configurationsBranch.notificationDiscount) {
                            this.linkForCopy= this.configurationsBranch.bussinessRoute+"/agendamientocliente?ref="+this.idForRefer
                            this.modals.modal0 = true
                            this.nameClient = findClient.data.data.firstName
                        }else{
                            this.$swal({
                                icon: 'success',
                                title: `¡${this.setLenguage.welcomeMessage.title} ${findClient.data.data.firstName}!`,
                                text: this.setLenguage.welcomeMessage.message,
                                showConfirmButton: true
                            })
                        }
                        this.modals.modal6 = false
                    }else{
                        this.$swal({
                            title: `${this.setLenguage.modal.messageNotRegister1} ${this.registerUser.mail} ${this.setLenguage.modal.messageNotRegister2}.`,
                            text: this.setLenguage.modal.messageNotRegister3,
                            type: 'warning',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: this.setLenguage.modal.continue,
                            cancelButtonText: this.setLenguage.modal.botonVerify,
                            showCloseButton: true,
                            showLoaderOnConfirm: true
                        }).then((result) => {
                            if (result.value) {
                                this.ifUserRegister = true
                            }
                        })
                    }
                }catch(err){
                    console.log(err)
                    if (!err.response) {
                        this.$swal({
                            icon: 'error',
                            title: this.setLenguage.connectionError,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }
            },
            returnModal(){
                this.$swal({
                    type: 'error',
                    icon: 'info',
                    title: this.setLenguage.modal.clickOutside.title,
                    text: this.setLenguage.modal.clickOutside.message,
                    showConfirmButton: true
                })
                setTimeout(() => {
                    this.modals.modal6 = true
                }, 1550);
            },
            async getBranches(){
                if (this.$route.query.ref) {
                    this.ref = this.$route.query.ref
                }
                try{
                    const branches = await axios.get(endPoint.endpointTarget+'/branches', this.configHeader)
                    if (branches.data.status == 'ok') {
                        var branchess = branches.data.data
                        try{
                            const config = await axios.get(endPoint.endpointTarget+'/configurations', this.configHeader)
                            console.log(config)
                            for (const key in config.data.data) {
                                const element = config.data.data[key];
                                for (const keyTwo in branchess) {
                                    const elementTwo = branchess[keyTwo];
                                    if (element.branch == elementTwo._id && element.datesPolitics.onlineDates == false) {
                                        branchess.splice(keyTwo, 1)
                                    }
                                }
                            }
                        }catch(err){
                            console.log(err)
                        }
                        this.branches = branchess
                    }
                }catch(err){
                    if (!err.response) {
                        this.$swal({
                            icon: 'error',
                            title: this.setLenguage.connectionError,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }
            },
            location(){
                this.$swal({
                    icon: 'success',
                    title: '¡'+this.setLenguage.createdSuccesfuly+'!',
                    showConfirmButton: false,
                    timer: 3000
                })

                setTimeout(() => {
                    if (endPoint.siteRedirect == "") {
                        location.reload()
                    }else{
                        window.location = endPoint.siteRedirect
                    }
                }, 3000);
                
            },
            finalFunction(){
                this.finallyAgend()
                // if (this.validPay) {
                //     if (this.registerUser.pay == 'Transferencia') {
                //         this.modals.modal5 = true
                //     }else{
                //         this.finallyAgend()
                //     }
                // }else{
                //     $('.dropdownPay').css({'color': 'red'})
                //     this.$swal({
                //         icon: 'error',
                //         title: 'Por favor, Seleccione el tipo de pago',
                //         showConfirmButton: false,
                //         timer: 3000
                //     })
                // }
            },
            formatPrice(value) {
                let val = (value/1)
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            soWhat(type){
                $('#pills-service').hide()
                $('#pills-date').hide()
                $('#pills-lender').hide()
                $('#pills-hour').hide()
                $('#pills-'+type).show(2000)
            },
            formatPhone(){
                var number = this.registerUser.phone.replace(/[^\d]/g, '')
                if (number.length == 9) {
                    number = number.replace(/(\d{1})(\d{4})/, "$1-$2-");
                } else if (number.length == 10) {
                    number = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
                }
                this.registerUser.phone = number
            },
            validVerifyFunc(){
                const split = this.registerUser.email.split('@')
                var splitTwo = ''
                
                this.registerUser.mail = this.registerUser.email.toLowerCase()
                
                if (split.length == 2) {
                    splitTwo = split[1].split('.')
                }
                if (this.registerUser.email != '' && this.branch != '') {
                    if (split.length == 2) {
                        if (splitTwo.length >= 2) {
                            this.validVerify = true
                        }else{
                            this.validVerify = false
                        }
                    }else{
                        this.validVerify = false
                    }
                }else{
                    this.validVerify = false
                }
            },
            validFields(){
                const split = this.registerUser.email.split('@')
                var splitTwo = ''

                this.registerUser.mail = this.registerUser.email.toLowerCase()
                
                if (split.length == 2) {
                    splitTwo = split[1].split('.')
                }
                
                if (this.registerUser.email != '' && this.registerUser.firstName != '' && this.registerUser.lastName != '' && this.phoneData.isValid && this.extraData.location != '') {
                    if (split.length == 2) {
                        if (splitTwo.length >= 2) {
                            this.validRegister = true
                        }else{
                            this.validRegister = false
                        }
                    }else{
                        this.validRegister = false
                    }
                }else{
                    this.validRegister = false
                }
            },
            dateSplit2(value){
                var formatDate = value.split('-')
                return formatDate[1]+'-'+formatDate[0]+'-'+formatDate[2]
            },
            sendConfirmation(id, name, mail, start, end, services, lender, data){
                const nameFormat = name
                var dateFormat = this.finalDate
                console.log(dateFormat)
                dateFormat = this.dateSplit2(dateFormat)
                console.log(dateFormat)
                axios.post(endPoint.endpointTarget+'/mails/dateMail', {
                    name: nameFormat,
                    branch: this.branchName,
                    branchId: this.branch,
                    data: data,
                    id: id,
                    date: dateFormat,
                    email: mail,
                    servicesFinal: data.serviceSelectds,
                    valid: true
                }, this.configHeader)
                .then(res => {
                    if (res.data.status == 'ok') {
                        console.log(res.data.status)
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
                    }
                })
            },
            finallyAgend(){
                this.ifDisabled = true
                this.spinningDate = true
                var employeFinal = ''
                var hourFinal = ''
                for (let index = 0; index < this.registerDate.serviceSelectds.length; index++) {
                    const element = this.registerDate.serviceSelectds[index];
                    if (index > 0){
                        employeFinal = employeFinal+' - '+element.realEmploye
                        hourFinal = hourFinal+' - '+element.start+'Hrs'
                    }else{
                        employeFinal = element.realEmploye
                        hourFinal = element.start+'Hrs'
                    }
                }
                axios.post(endPoint.endpointTarget+'/dates/verifyDate', {
                    dataDate: this.registerDate,
                    date: this.finalDate,
                    branch: this.branch
                }, this.configHeader)
                .then(res => {
                    if(res.data.status == true){
                        this.spinningDate = false
                        this.$swal({
                            icon: 'error',
                            title: '¡Disculpe! el horario fue tomado recientemente, vuelva a agendar su cita.',
                            showConfirmButton: false,
                            timer: 3000
                        })
                        this.$refs.wizard.prevTab()
                        for (let index = 0; index < this.registerDate.serviceSelectds.length; index++) {
                            const element = this.registerDate.serviceSelectds[index];
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
                                branch: this.branch,
                                online:true
                            }, this.configHeader)
                            .then(res => {
                                this.getDay = res.data.day
                                this.availableslenders = res.data.array
                                axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                    date: this.finalDate,
                                    employes: res.data.array,
                                    timedate: this.registerDate.serviceSelectds[0].duration,
                                    employesServices: this.registerDate.serviceSelectds[0].employes,
                                    branch: this.branch,
                                    online:true
                                }, this.configHeader)
                                .then(res => {
                                    this.readyChange = true
                                    this.registerDate.serviceSelectds[0].valid = true
                                    this.registerDate.serviceSelectds[0].blocks = res.data.data
                                    this.registerDate.block = res.data.data
                                    console.log(this.registerDate.serviceSelectds[0].blocks)
                                    $('#block0').show('slow')
                                }).catch(err =>{
                                    if (!err.response) {
                                        this.$swal({
                                            icon: 'error',
                                            title: 'Error de conexión',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    }else if (err.response.status == 401) {
                                        
                                    }
                                }) 
                            }).catch(err =>{
                                if (!err.response) {
                                    this.$swal({
                                        icon: 'error',
                                        title: 'Error de conexión',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                }
                            }) 
                        }, 200);
                    }else{
                        var blockEdit = []
                        if (this.registerDate.serviceSelectds[this.registerDate.serviceSelectds.length - 1].blocksFirst.length > 0) {
                            blockEdit = this.registerDate.serviceSelectds[this.registerDate.serviceSelectds.length - 1].blocksFirst
                        }else{
                            blockEdit = this.registerDate.serviceSelectds[this.registerDate.serviceSelectds.length - 1].blocks
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
                                    dataDate: this.registerDate,
                                    branch: this.branch,
                                    date: this.finalDate,
                                    client: this.registerUser,
                                    block: blockEdit,
                                    extraData: this.extraData,
                                    blockId: this.idDatesBlocks,
                                    typeCreation: 'Web',
                                    pdf: res.data.nameFile,
                                    ifClient: true
                                }, this.configHeader)
                                .then(res => {
                                    if (res.data.status == "cita creada") {
                                        this.spinningDate = false
                                        this.sendConfirmation(res.data.id, this.registerUser.name, this.registerUser.email, hourFinal, this.registerDate.serviceSelectds[0].end, this.registerDate.serviceSelectds, employeFinal, this.registerDate)
                                        this.modals.modal2 = false
                                        this.modals.modal4 = true
                                        axios.post(endPoint.endpointTarget+'/notifications', {
                                            userName:'Cliente: '+this.registerUser.name,
                                            userImage: '',
                                            detail: 'Creo cita desde agendamiento (web) '+this.finalDate,
                                            branch: this.branch,
                                            link: 'agendamiento'
                                        }, this.configHeader)
                                        .then(res => {
                                            this.socket.emit('sendNotification', res.data.data)
                                        })
                                        $("#overlay").toggle()
                                        this.ifDisabled = false
                                    }    
                                }).catch(err =>{
                                    if (!err.response) {
                                        this.$swal({
                                            icon: 'error',
                                            title: 'Error de conexión',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    }
                                })   
                            })
                        }else{
                            axios.post(endPoint.endpointTarget+'/dates/noOneLender', {
                                dataDate: this.registerDate,
                                branch: this.branch,
                                date: this.finalDate,
                                client: this.registerUser,
                                block: blockEdit,
                                extraData: this.extraData,
                                blockId: this.idDatesBlocks,
                                typeCreation: 'Web',
                                pdf: 'not',
                                ifClient: true
                            }, this.configHeader)
                            .then(res => {
                                if (res.data.status == "ok") {
                                    this.spinningDate = false
                                    this.ifDisabled = false
                                    this.sendConfirmation(res.data.id, this.registerUser.name, this.registerUser.email, hourFinal, this.registerDate.serviceSelectds[0].end, this.registerDate.serviceSelectds, employeFinal, this.registerDate)
                                    this.modals.modal2 = false
                                    this.modals.modal4 = true
                                    axios.post(endPoint.endpointTarget+'/notifications', {
                                        userName:'Cliente: '+this.registerUser.name,
                                        userImage: '',
                                        detail: 'Creo cita desde agendamiento (web) '+this.finalDate,
                                        branch: this.branch,
                                        link: 'agendamiento'
                                    }, this.configHeader)
                                    .then(res => {
                                        this.socket.emit('sendNotification', res.data.data)
                                    })
                                    $("#overlay").toggle()
                                }    
                            }).catch(err =>{
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
                    }
                })
            },
            async getServices(){
                try {
                    const services = await axios.get(endPoint.endpointTarget+'/services/servicesForClients/'+this.branch, this.configHeader)
                    if (services.data.status == 'ok') {
                        this.services = services.data.data 
                        for (let index = 0; index < this.services.length; index++) {
                            this.serviceCount.push({count: 0})
                        }
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
                    }
                }
            },
            Copy(){
                console.log("hola")
            },
            async getCategories(){
                try {
                    const categories = await axios.get(endPoint.endpointTarget+'/services/getCategoriesForClients/'+this.branch, this.configHeader)
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
                    }
                }
            },
            changeLenguage(){
                if (this.setLenguage.lenguage  == "EN") {
                    this.setLenguage = this.es_ES
                    this.configDate.locale = Spanish
                    this.locale = locale_es
                }else{
                    this.setLenguage = this.en_US
                    this.configDate.locale = English
                    this.locale = locale_en
                }
            },
            async getEmployes(){
                try{
                    const getByBranch = await axios.get(endPoint.endpointTarget+'/employes/employesbybranchForClients/'+this.branch, this.configHeader)
                    if (getByBranch.data.data.length > 0) {
                        this.lenders = getByBranch.data.data
                    }
                }catch(err){
                    if (!err.response) {
                        this.$swal({
                            icon: 'error',
                            title: 'Error de conexión',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }
            },
            validMultiLender(index, lender, time, resTime, check){
                $('#'+check).removeClass('fa-check')
                this.registerDate.employeSelect = ''
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
            verifyValidOnline(id){
                if (id) {
                    var valid = false
                    this.availableslenders.forEach(element => {
                        if (element.id == id) {
                            if (element.validOnline) {
                                valid = true
                            }
                        }
                    });
                    if (valid) {
                        return true
                    }else{
                        return false
                    }
                }else{
                    return true
                }
                
            },
            insertData(index, lender, restTime, Class, duration, lendeId, check, lenders, lenderImg){
                if (lender == 'Primera disponible') {
                    if (index == 0) {
                        for (let i = 0; i < this.registerDate.serviceSelectds.length; i++) {
                            const element = this.registerDate.serviceSelectds[i];
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
                                branch: this.branch,
                                online: true
                            }, this.configHeader)
                            .then(res => {
                                this.getDay = res.data.day
                                this.availableslenders = res.data.array
                                axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                    date: this.finalDate,
                                    employes: res.data.array,
                                    timedate: this.registerDate.serviceSelectds[0].duration,
                                    employesServices: this.registerDate.serviceSelectds[0].employes,
                                    branch: this.branch,
                                    online:true
                                }, this.configHeader)
                                .then(res => {
                                    this.readyChange = true
                                    this.registerDate.serviceSelectds[0].valid = true
                                    this.registerDate.serviceSelectds[0].blocks = res.data.data
                                    this.registerDate.block = res.data.data
                                    $('#block0').show('slow')
                                }).catch(err =>{
                                    if (!err.response) {
                                        this.$swal({
                                            icon: 'error',
                                            title: 'Error de conexión',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                    }
                                })
                            }).catch(err =>{
                                if (!err.response) {
                                    this.$swal({
                                        icon: 'error',
                                        title: 'Error de conexión',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                }
                            })
                        }, 200);
                    }else{
                        for (let i = index; i < this.registerDate.serviceSelectds.length; i++) {
                            const element = this.registerDate.serviceSelectds[i];
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
                        if (this.registerDate.serviceSelectds[index - 1].blocksFirst.length > 0) {
                            axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                                block: this.registerDate.serviceSelectds[index - 1].blocksFirst,
                                timedate: this.registerDate.serviceSelectds[index].duration,
                                employesServices: this.registerDate.serviceSelectds[index].employes,
                                online: true,
                                employes: this.availableslenders,
                                firstBlock: true
                            })
                            .then(res => {
                                this.registerDate.serviceSelectds[index].valid = true
                                this.registerDate.serviceSelectds[index].blocks = res.data.data
                                this.registerDate.serviceSelectds[index].blocksFirst = []
                            }).catch(err =>{
                                if (!err.response) {
                                    this.$swal({
                                        icon: 'error',
                                        title: 'Error de conexión',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                }
                            })
                        }else{
                            axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                                block: this.registerDate.serviceSelectds[index - 1].blocks,
                                timedate: this.registerDate.serviceSelectds[index].duration,
                                employesServices: this.registerDate.serviceSelectds[index].employes,
                                online: true,
                                employes: this.availableslenders,
                                firstBlock: true
                            })
                            .then(res => {
                                this.registerDate.serviceSelectds[index].valid = true
                                this.registerDate.serviceSelectds[index].blocks = res.data.data
                                this.registerDate.serviceSelectds[index].blocksFirst = []
                            }).catch(err =>{
                                if (!err.response) {
                                    this.$swal({
                                        icon: 'error',
                                        title: 'Error de conexión',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                }
                            })
                        }
                    }
                }else{
                    for (let keyTwo = 0; keyTwo < this.registerDate.serviceSelectds[index].blocks.length; keyTwo++) {
                        const block = this.registerDate.serviceSelectds[index].blocks[keyTwo];
                        if (block.validator == 'select' && block.employes){
                            block.validator = true
                            if (this.registerDate.serviceSelectds[index].blocks[keyTwo + 1]) {
                                if (this.registerDate.serviceSelectds[index].blocks[keyTwo + 1].validator == 'select') {
                                    block.employes.unshift({
                                        id: this.registerDate.serviceSelectds[index].employeId,
                                        name: this.registerDate.serviceSelectds[index].realEmploye,
                                        position: 1,
                                        class: this.registerDate.serviceSelectds[index].class,
                                        valid: true,
                                        img: this.registerDate.serviceSelectds[index].employeImg
                                    })
                                }
                            }
                            for (const key in block.employeBlocked) {
                                const employeBlocked = block.employeBlocked[key]
                                if (employeBlocked.employe == this.registerDate.serviceSelectds[index].employeId) {
                                    block.employeBlocked.splice(key, 1)
                                }
                            }
                        }
                    }

                    if (this.registerDate.serviceSelectds[index].blocksFirst.length > 0) {
                        for (let j = index + 1; j < this.registerDate.serviceSelectds.length; j++) {
                            const element = this.registerDate.serviceSelectds[j];
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
                        this.registerDate.serviceSelectds[index].start = ''
                        this.registerDate.serviceSelectds[index].end = ''
                        this.registerDate.serviceSelectds[index].employe = lender
                        this.registerDate.serviceSelectds[index].employeId = lendeId
                        this.registerDate.serviceSelectds[index].employeImg = lendeId
                        this.registerDate.serviceSelectds[index].realEmploye = lender
                        this.registerDate.serviceSelectds[index].days = restTime
                        this.registerDate.serviceSelectds[index].class = Class
                        this.registerDate.serviceSelectds[index].itFirst = false
                        this.validHour = false
                        
                        axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                            block: this.registerDate.serviceSelectds[index].blocksFirst,
                            timedate: this.registerDate.serviceSelectds[index].duration,
                            employeSelect: lendeId,
                            employes: this.availableslenders,
                            employeObject: {
                                name: this.registerDate.serviceSelectds[index].realEmploye,
                                id: this.registerDate.serviceSelectds[index].employeId,
                                position: 1,
                                class: this.registerDate.serviceSelectds[index].class,
                                valid: true,
                                img: this.registerDate.serviceSelectds[index].employeImg
                            },
                            firstBlock: false,
                            online: true
                        }, this.configHeader)
                        .then(res => {
                            if (res.data.status == 'ok') {
                                this.registerDate.serviceSelectds[index].blocks = res.data.blockEmploye
                                this.registerDate.serviceSelectds[index].blocksFirst = res.data.data
                                this.registerDate.serviceSelectds[index].itFirst = false
                                setTimeout(() => {
                                    $('#block'+index).show('slow')
                                }, 500);
                                setTimeout(() => {
                                    $('#check'+index).addClass('fa-check')
                                }, 500);
                            }
                        }).catch(err =>{
                            if (!err.response) {
                                this.$swal({
                                    icon: 'error',
                                    title: 'Error de conexión',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            }
                        })
                    }else{
                        for (let j = index + 1; j < this.registerDate.serviceSelectds.length; j++) {
                            const element = this.registerDate.serviceSelectds[j];
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
                        this.registerDate.serviceSelectds[index].start = ''
                        this.registerDate.serviceSelectds[index].end = ''
                        this.registerDate.serviceSelectds[index].employe = lender
                        this.registerDate.serviceSelectds[index].employeId = lendeId
                        this.registerDate.serviceSelectds[index].employeImg = lenderImg
                        this.registerDate.serviceSelectds[index].realEmploye = lender
                        this.registerDate.serviceSelectds[index].days = restTime
                        this.registerDate.serviceSelectds[index].class = Class
                        this.registerDate.serviceSelectds[index].itFirst = false
                        this.validHour = false
                        
                        axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                            block: this.registerDate.serviceSelectds[index].blocks,
                            timedate: this.registerDate.serviceSelectds[index].duration,
                            employeSelect: lendeId,
                            employes: this.availableslenders,
                            employeObject: {
                                name: this.registerDate.serviceSelectds[index].realEmploye,
                                id: this.registerDate.serviceSelectds[index].employeId,
                                position: 1,
                                class: this.registerDate.serviceSelectds[index].class,
                                valid: true,
                                img: this.registerDate.serviceSelectds[index].employeImg
                            },
                            online:true,
                            firstBlock: false
                        }, this.configHeader)
                        .then(res => {
                            if (res.data.status == 'ok') {
                                this.registerDate.serviceSelectds[index].blocks = res.data.blockEmploye
                                this.registerDate.serviceSelectds[index].blocksFirst = res.data.data
                                this.registerDate.serviceSelectds[index].itFirst = false
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
                            }
                        })
                    }
                }
            },
            selectHourService(index, lender, time, resTime){
                const finalTime =  this.registerDate.design == 'si' ? time + 15 : time
                this.registerDate.serviceSelectds[index].lenderSelectData = {
                    employe: lender,
                    date: this.finalDate,
                    time: finalTime,
                    resTime: resTime,
                    index: index
                }
                axios.post(endPoint.endpointTarget+'/citas/getBlocks', this.registerDate.serviceSelectds[index].lenderSelectData)
                .then(res => { 
                    if (this.registerDate.serviceSelectds[index].validAfter) {
                       for (let j = index + 1; j < this.registerDate.serviceSelectds.length; j++) {
                            const element = this.registerDate.serviceSelectds[j];
                            element.start = ''
                            element.end = ''
                            element.sort = ''
                            element.class = ''
                            element.realLender = ''
                            element.blocks = []
                            element.days = ''
                            element.class = ''
                            element.valid = false
                            this.arrayLendersSelect = []
                        } 
                    }
                    var editBlock = false
                    var indexEdit = 0
                    const q = index - 1 
                    for (let j = 0; j <= q; j++) {
                        const element = this.registerDate.serviceSelectds[j];
                        
                        if (element.realLender == lender) {
                            editBlock = true
                            indexEdit = j
                        }
                    }
                    if (editBlock) {
                        this.registerDate.serviceSelectds[index].blocks = this.registerDate.serviceSelectds[indexEdit].blocks
                        axios.post(endPoint.endpointTarget+'/citas/editBlocks', {
                            array: this.registerDate.serviceSelectds[index].blocks,
                            time: this.registerDate.serviceSelectds[index].lenderSelectData.time
                        })
                        .then(res => {
                            this.arrayLendersSelect.push({index: index, lender: lender}) 
                            this.registerDate.serviceSelectds[index].blocks = res.data
                            this.registerDate.serviceSelectds[index].validAfter = true
                        }).catch(err => {
                            if (!err.response) {
                                this.$swal({
                                    icon: 'error',
                                    title: 'Error de conexión',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            }
                        })
                    }else{
                        this.registerDate.serviceSelectds[index].blocks = res.data
                        this.arrayLendersSelect.push({index: index, lender: lender})
                        this.registerDate.serviceSelectds[index].validAfter = true
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
                    }
                })
            },
            validLender(){
                this.generateLender()
                if (this.registerDate.serviceSelectds.length > 0 && this.finalDate != '') {
                    this.validWizard = true
                    this.ifLender = true
                    return true
                }else{
                    this.validWizard = false
                    this.ifLender = false
                    return false
                }
            },
            selectLender(nombre, clas, restTime, id){
                this.registerDate.class = clas
                this.registerDate.employeSelect = nombre
                this.registerDate.employeResTime = restTime
                $('.frame').css({'background-color':'#fff'})
                $('.frame h3').css({'color':'#32325d'})
                $('.'+id).css({'background-color':'#32325d'})
                $('.'+id+'h3').css({'color':'#fff'})
                this.validSchedule = true
                this.noOneLender = false
                this.validHour = false
                for (let i = 0; i < this.registerDate.serviceSelectds.length; i++) {
                    const element = this.registerDate.serviceSelectds[i];
                    element.start = ''
                    element.end = ''
                    element.sort = ''
                    element.realLender = ''
                    element.employe = 'Primera disponible'
                    element.employeId = '',
                    element.realEmploye = 'Primera disponible'
                    element.employeImg = ''
                    element.blocks = []
                    element.restTime = ''
                    element.class = ''
                }
            },
            insertDate(){
                if (this.noOneLender) {
                    if (this.registerDate.design == 'si' && this.readyAddDesign) {
                        this.registerDate.duration = this.registerDate.duration + 15
                        this.readyAddDesign = false
                    }
                }else{
                    if (this.registerDate.design == 'si' && this.readyAddDesign) {
                        this.registerDate.duration = this.registerDate.duration + 15
                        this.readyAddDesign = false
                    }
                    this.blockHour = []
                    axios.post(endPoint.endpointTarget+'/citas/getBlocks', {
                        employe: this.registerDate.employeSelect,
                        date: this.finalDate,
                        time: this.registerDate.duration,
                        resTime:this.registerDate.employeResTime
                    })
                    .then(res => { 
                        this.blockHour = res.data 
                        this.progress = true
                    })
                    .catch(err => {
                        if (!err.response) {
                            this.$swal({
                                icon: 'error',
                                title: 'Error de conexión',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                }
            },
            plusServicePhone(index, service, id, duration, commission, price, employes, discount, products, additionalName){
                this.ifServices = true
                for (const employe of employes) {
                    employe.valid = true
                }
                var lendersName = [{name: 'Primera disponible', days: '', class: '', valid:true, validOnline:true}, ...employes]

                if (this.ifMicro) {
                    var microsService = [{checked: false, duration: 0, microService: "Ninguno", price: 0, position: index}]
                    for (const micro of this.microServices) {
                        microsService.push({checked: micro.checked, duration: micro.duration, microService: micro.microService, price: micro.price, position: index})
                    }
                    this.registerDate.serviceSelectds.push({employes: lendersName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', employeImg: '', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, blocksFirst: [], id: '', blocks: [], name: service, service_id: id, microServices: microsService, microServiceSelect: [], additionalName: additionalName})
                }else{
                    this.registerDate.serviceSelectds.push({employes: lendersName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', employeImg: '', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, blocksFirst: [], id: '', blocks: [], name: service, service_id: id,
                    microServices: [], microServiceSelect: [], additionalName: additionalName})
                }

                this.validHour = false  
                this.totalPrice = this.totalPrice + price
            },
            lessServicePhone(index, price){
                this.registerDate.serviceSelectds.splice(index, 1)
                if (this.registerDate.serviceSelectds.length == 0) {
                    this.ifServices = false
                    this.validLender()
                    this.validSchedule = false
                    this.posibleLenders = []
                }
                this.validHour = false
                this.totalPrice = this.totalPrice - price
            },
            plusService(index, service, id, duration, commission, price, employes, card, discount){
                $('#'+card).css({'border-bottom': 'solid 8px #174c8e'})
                this.ifServices = true
                this.serviceCount[index].count++
                for (const employe of employes) {
                    employe.valid = true
                }
                var lendersName = [{name: 'Primera disponible', days: '', class: '', valid:true, validOnline: true}, ...employes]
                if (this.ifMicro) {
                    var microsService = [{checked: false, duration: 0, microService: "Ninguno", price: 0, position: index}]
                    for (const micro of this.microServices) {
                        microsService.push({checked: micro.checked, duration: micro.duration, microService: micro.microService, price: micro.price, position: index})
                    }
                    this.registerDate.serviceSelectds.push({employes: lendersName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', employeImg: '', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, id: '', blocksFirst: [], blocks: [], name: service, service_id: id, microServices: microsService, microServiceSelect: []})
                }else{
                    this.registerDate.serviceSelectds.push({employes: lendersName, commission: commission, duration: duration, price: price, start: '', end:'', sort: 0, employe: 'Primero disponible', employeImg: '', realEmploye: '', valid: false, validAfter: false, discount: discount, itFirst: true, id: '', blocksFirst: [], blocks: [], name: service, service_id: id,
                    microServices: [], microServiceSelect: []})
                }
                this.validHour = false  
                this.totalPrice = this.totalPrice + price
            },
            lessService(index, service, time, card, precio, count){
                if (count > 0) {
                    if (this.serviceCount[index].count > 0) {
                        this.serviceCount[index].count--
                        if (this.serviceCount[index].count == 0) {
                            $('#'+card).css({'border-bottom': 'solid 8px #e2e3de'})
                        }
                    }
                    for (var i = 0; i < this.registerDate.serviceSelectds.length; i++) {
                        if (this.registerDate.serviceSelectds[i].name == service ) {
                            this.registerDate.serviceSelectds.splice(i, 1)
                            break
                        }
                    }
                    if (this.registerDate.serviceSelectds.length == 0) {
                        this.ifServices = false
                        this.validLender()
                        this.validSchedule = false
                        this.posibleLenders = []
                    }
                    this.validHour = false
                    this.totalPrice = this.totalPrice - precio
                } 
            },
            generateLender(){
                this.finalyLenders = []
                for (let index = 0; index < this.lenders.length; index++) {
                    const element = this.lenders[index];
                    for (let i = 0; i < this.posibleLenders.length; i++) {
                        if(element._id == this.posibleLenders[i]){
                            this.finalyLenders.push({nombre:element.nombre, _id:element._id, class: element.class, restTime: element.restTime})
                        }
                    }
                }
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
            selectBloqMulti(lenders, hora, i, indexService, open, check){
                var oldEmploye = {
                    name: this.registerDate.serviceSelectds[indexService].employe,
                    id: this.registerDate.serviceSelectds[indexService].employeId,
                    class: this.registerDate.serviceSelectds[indexService].class,
                    valid: true,
                    img: this.registerDate.serviceSelectds[indexService].employeImg
                }
                for (let j = indexService + 1; j < this.registerDate.serviceSelectds.length; j++) {
                    const element = this.registerDate.serviceSelectds[j];
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
                    var sortSp = this.registerDate.serviceSelectds[indexService].blocks[i].hour.split(":") 
                    this.registerDate.serviceSelectds[indexService].start = this.registerDate.serviceSelectds[indexService].blocks[i].hour
                    this.registerDate.serviceSelectds[indexService].sort = sortSp[0]+sortSp[1]

                    for (let j = 0; j < this.registerDate.serviceSelectds[indexService].blocks[i].employes.length; j++) {
                        const element = this.registerDate.serviceSelectds[indexService].blocks[i].employes[j];
                        if (element.valid == true) {
                            this.registerDate.serviceSelectds[indexService].class = element.class
                            this.registerDate.serviceSelectds[indexService].realEmploye = element.name
                            this.registerDate.serviceSelectds[indexService].employeId = element.id
                            this.registerDate.serviceSelectds[indexService].employe = element.name
                            this.registerDate.serviceSelectds[indexService].employeImg = element.img
                            break
                        }
                    }
                    var employeForBlock = {
                        name: this.registerDate.serviceSelectds[indexService].employe,
                        id: this.registerDate.serviceSelectds[indexService].employeId,
                        class: this.registerDate.serviceSelectds[indexService].class,
                        valid: false,
                        img: this.registerDate.serviceSelectds[indexService].employeImg
                    }
                    axios.post(endPoint.endpointTarget+'/dates/selectDatesBlocks', {
                        date: this.finalDate,
                        timedate: this.registerDate.serviceSelectds[indexService].duration,
                        hour: this.registerDate.serviceSelectds[indexService].start,
                        employe: employeForBlock,
                        oldEmploye: oldEmploye,
                        block: this.registerDate.serviceSelectds[indexService].blocks,
                        branch: this.branch,
                        ifFirstClick: this.registerDate.serviceSelectds[indexService].itFirst,
                        firstBlock: true
                    }, this.configHeader)
                    .then(res => {
                        this.registerDate.serviceSelectds[indexService].blocks = res.data.data
                        this.registerDate.serviceSelectds[indexService].itFirst = false
                        this.registerDate.serviceSelectds[indexService].end = res.data.end
                        const finalIndex = parseFloat(indexService) + parseFloat(1)
                        if (this.registerDate.serviceSelectds[finalIndex]) {
                            axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                                block: this.registerDate.serviceSelectds[indexService].blocks,
                                timedate: this.registerDate.serviceSelectds[finalIndex].duration,
                                employesServices: this.registerDate.serviceSelectds[finalIndex].employes,
                                employes: this.availableslenders,
                                firstBlock: true,
                                online: true
                            })
                            .then(res => {
                                this.registerDate.serviceSelectds[finalIndex].valid = true
                                this.registerDate.serviceSelectds[finalIndex].blocks = res.data.data
                            }).catch(err =>{
                                if (!err.response) {
                                    this.$swal({
                                        icon: 'error',
                                        title: 'Error de conexión',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
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
                        }
                    })
                    
                    setTimeout(() => {
                        $('#'+check).addClass('fa-check')
                    }, 500);
                }
                else{
                    var sortSp = this.registerDate.serviceSelectds[indexService].blocks[i].hour.split(":") 
                    this.registerDate.serviceSelectds[indexService].start = this.registerDate.serviceSelectds[indexService].blocks[i].hour
                    this.registerDate.serviceSelectds[indexService].sort = sortSp[0]+sortSp[1]
                    var employeForBlock = {
                        name: this.registerDate.serviceSelectds[indexService].employe,
                        id: this.registerDate.serviceSelectds[indexService].employeId,
                        class: this.registerDate.serviceSelectds[indexService].class,
                        valid: false,
                        img: this.registerDate.serviceSelectds[indexService].employeImg
                    }
                    axios.post(endPoint.endpointTarget+'/dates/selectDatesBlocks', {
                        date: this.finalDate,
                        timedate: this.registerDate.serviceSelectds[indexService].duration,
                        hour: this.registerDate.serviceSelectds[indexService].start,
                        employe: employeForBlock,
                        block: this.registerDate.serviceSelectds[indexService].blocks,
                        blockFirst: this.registerDate.serviceSelectds[indexService].blocksFirst,
                        branch: this.branch,
                        ifFirstClick: this.registerDate.serviceSelectds[indexService].itFirst,
                        firstBlock: false
                    }, this.configHeader)
                    .then(res => {
                        this.registerDate.serviceSelectds[indexService].blocks = res.data.data
                        this.registerDate.serviceSelectds[indexService].blocksFirst = res.data.blockFirst
                        this.registerDate.serviceSelectds[indexService].itFirst = false
                        this.registerDate.serviceSelectds[indexService].end = res.data.end
                        const finalIndex = parseFloat(indexService) + parseFloat(1)
                        if (this.registerDate.serviceSelectds[finalIndex]) {
                            axios.post(endPoint.endpointTarget+'/dates/editBlocksFirst', {
                                block: res.data.blockFirst,
                                employes: this.availableslenders,
                                timedate: this.registerDate.serviceSelectds[finalIndex].duration,
                                employesServices: this.registerDate.serviceSelectds[finalIndex].employes,
                                firstBlock: true,
                                online: true
                            })
                            .then(res => {
                                this.registerDate.serviceSelectds[finalIndex].valid = true
                                this.registerDate.serviceSelectds[finalIndex].blocks = res.data.data
                                console.log(res)
                            })
                        }else{
                            this.validHour = true
                        }
                    }).catch(err =>{
                        if (!err.response) {
                            this.$swal({
                                icon: 'error',
                                title: 'Error de conexión',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                    setTimeout(() => {
                        $('#'+check).addClass('fa-check')
                    }, 500);
                }
            },
            validateFirstStep() {
                window.scrollTo(0, 0);
                var validService = false
                if (this.ifMicro) {
                    for (const service of this.registerDate.serviceSelectds) {
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
                    if ( this.dates.simple != '') {
                        for (let index = 0; index < this.registerDate.serviceSelectds.length; index++) {
                            const element = this.registerDate.serviceSelectds[index];
                                if (element.valid == false) {
                                    element.valid = true
                                    this.insertData(index, 'Primera disponible', '', '', element.duration, 'check'+index, element.lenders)
                                    break
                                }
                        }
                    }
                    if (this.dates.simple != '') {
                        setTimeout(() => {
                            this.openCalendar()
                        }, 1000);
                        
                    }
                    return this.ifServices
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe seleccionar un Adicional, en caso de no desear, por favor marque como NINGUNO',
                        showConfirmButton: false,
                        timer: 3000
                    })
                    this.validWizard = false
                    return false
                }
                
            },
            validateLastStep() {
                window.scrollTo(0, 0);
                if (this.validHour) {
                    this.validWizard = true
                    this.registerDate.serviceSelectds.forEach(element => {
                        element.microServiceSelect = []
                    });
                    for (const micro of this.registerDate.serviceSelectds) {
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
            openCalendar(){ 
                // this.configDate.inline = false
                if (this.inBlackList) {
                    setTimeout(() => {
                        this.readyChange = true
                        this.registerDate.serviceSelectds[0].valid = true
                        this.registerDate.serviceSelectds[0].blocks = this.blockToBlackList
                    }, 500);
                }else{
                    setTimeout(() => {
                        if (this.dates.simple != '') {
                            console.log("y aqui?")
                            const split = this.dates.simple.split('-')
                            this.finalDate = split[1]+'-'+split[0]+'-'+split[2]
                            const restDay = new Date(this.finalDate+' 10:00')
                            this.getDay = restDay.getDay()
                            var onlySunday = split[0]+'-'+split[1]
                            if (this.getDay == 0 && onlySunday != "13-12" && onlySunday != "20-12") {
                                this.$swal({
                                    icon: 'error',
                                    title: 'Disculpa, No laboramos Sábados y Domingos.',
                                    showConfirmButton: false,
                                    timer: 3000
                                })
                                this.dates.simple = ''
                            }else{
                                if (this.readyChange) {
                                    for (let index = 0; index < this.registerDate.serviceSelectds.length; index++) {
                                        const element = this.registerDate.serviceSelectds[index];
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
                                            branch: this.branch,
                                            online: true
                                        }, this.configHeader)
                                        .then(res => {
                                            this.getDay = res.data.day
                                            this.availableslenders = res.data.array
                                            axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                                date: this.finalDate,
                                                employes: res.data.array,
                                                timedate: this.registerDate.serviceSelectds[0].duration,
                                                employesServices: this.registerDate.serviceSelectds[0].employes,
                                                branch: this.branch,
                                                online: true
                                            }, this.configHeader)
                                            .then(res => {
                                                this.idDatesBlocks = res.data.id
                                                console.log(this.idDatesBlocks)
                                                this.readyChange = true
                                                this.registerDate.serviceSelectds[0].valid = true
                                                this.registerDate.serviceSelectds[0].blocks = res.data.data
                                                this.registerDate.block = res.data.data
                                                console.log(this.registerDate.serviceSelectds[0].blocks)
                                                $('#block0').show('slow')
                                            })
                                        }).catch(err => {
                                            if (!err.response) {
                                                this.$swal({
                                                    icon: 'error',
                                                    title: 'Error de conexión',
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                })
                                            }
                                        })
                                    }, 200); 
                                }else{
                                    setTimeout(() => {
                                        axios.post(endPoint.endpointTarget+'/dates/availableslenders', {
                                            date: this.finalDate,
                                            branch: this.branch,
                                            online: true
                                        }, this.configHeader)
                                        .then(res => {
                                            this.getDay = res.data.day
                                            this.availableslenders = res.data.array
                                            axios.post(endPoint.endpointTarget+'/dates/blocksHoursFirst', {
                                                date: this.finalDate,
                                                employes: res.data.array,
                                                timedate: this.registerDate.serviceSelectds[0].duration,
                                                employesServices: this.registerDate.serviceSelectds[0].employes,
                                                branch: this.branch,
                                                online: true
                                            }, this.configHeader)
                                            .then(res => {
                                                this.idDatesBlocks = res.data.id
                                                console.log(this.idDatesBlocks)
                                                this.readyChange = true
                                                this.registerDate.serviceSelectds[0].valid = true
                                                this.registerDate.serviceSelectds[0].blocks = res.data.data
                                                this.registerDate.block = res.data.data
                                                console.log(this.registerDate.serviceSelectds[0].blocks)
                                            }).catch(err => {
                                                if (!err.response) {
                                                    this.$swal({
                                                        icon: 'error',
                                                        title: 'Error de conexión',
                                                        showConfirmButton: false,
                                                        timer: 1500
                                                    })
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
                }
                console.log(this.registerDate.serviceSelectds)
            },
            fixedHours(duration){
                const hours = parseInt(duration / 60) + ' hr'
                const minutes = duration - (parseInt(duration / 60) * 60 )  + ' min'

                return hours+' '+minutes
            },
            openBlocks(open){
                $('#'+open).toggle('slow')
            },
            selectPay(pay){
                $('.dropdownPay').text(pay)
                $('.dropdownPay').css({'color':'#090909'})
                this.registerUser.pay = pay
                this.validPay = true
            },
            selectDesign(type){
                if (type == 'first') {
                    $('.spanSelect').css({'background-color':'#fff', 'color':'#090909'})
                    $('#yes').css({'background-color':'#7a91cb'})
                    this.registerDate.design = 'si'
                }else{
                    $('.spanSelect').css({'background-color':'#fff', 'color':'#090909'})
                    $('#not').css({'background-color':'#7a91cb'})
                    this.registerDate.design = 'no'
                }
            },
            selectCat(cat){
                $('.categoryButton').css({'padding':'10px', 'background-color': '#d5dadd', 'color': '#434a54', 'box-shadow':'0px 0px 0px 0px rgba(0,0,0,0)'})
                $('#'+cat).css({'padding-top':'14px', 'background-color': '#174c8e', 'color': '#fff', '-webkit-box-shadow':'0px 9px 25px -7px rgba(0,0,0,0.75)', 'box-shadow':'0px 9px 25px -7px rgba(0,0,0,0.75)'})
            }, 
            async selectCategoryPhone(name){
                for (let j = 0; j < this.serviceSelected.length; j++) {
                    const element = this.serviceSelected[j];
                    if (element.set == false) {
                        this.serviceSelected.splice(j, 1)
                        this.servicePhoneCount.splice(j, 1)
                    }
                }
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
                    this.configDate.inline = true
                }
            },
            async selectServicePhone(id){
                for (let j = 0; j < this.serviceSelected.length; j++) {
                    const element = this.serviceSelected[j];
                    if (element.set == false) {
                        this.serviceSelected.splice(j, 1)
                        this.servicePhoneCount.splice(j, 1)
                    }
                }
                try {
                    const service = await axios.get(endPoint.endpointTarget+'/services/getServiceInfo/'+id, this.configHeader)
                    if (service.data.status == 'ok') {
                        service.data.data.set = false
                        
                        this.serviceSelected.unshift(service.data.data)
                        this.servicePhoneCount.unshift({count: 0})
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
                    }
                }
            },
            registerClients(){
                axios.post(endPoint.endpointTarget+'/clients', {
                    firstName: this.registerUser.firstName,
                    lastName: this.registerUser.lastName,
                    email: this.registerUser.email,
                    extraData: this.extraData,
                    recommender: this.ref,
                    idRecomender: this.ref,
                    phone: this.phoneData,
                    birthday: this.registerUser.birthday,
                    instagram: null
                }, this.configHeader)
                .then(res => {
                    if (res.data.status == 'client create') {
                        this.$swal({
                            icon: 'success',
                            title: this.setLenguage.modal.registerSuccess,
                            showConfirmButton: false,
                            timer: 2500
                        })
                        this.registerUser.name = this.registerUser.firstName + ' ' + this.registerUser.lastName
                        this.registerUser.id = res.data.data._id
                        this.registerUser.phone = this.phoneData.formatInternational
                        this.getServices()
                        this.getCategories()
                        this.getEmployes()
                        this.getMicroServices()
                        this.modals.modal6 = false
                        // EventBus.$emit('reloadClients', 'reload')
                    }else{
                        this.$swal({
                            icon: 'error',
                            title: 'El cliente ya existe',
                            showConfirmButton: true,
                        })
                        this.ifUserRegister = false
                    }
                }).catch(err => {
                    if (!err.response) {
                        this.$swal({
                            icon: 'error',
                            title: this.setLenguage.modal.existClient,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                })
            },
        }
    }
</script>
<style>
.separateService{
    border-right: solid 2px #e2e3de;
}
.date-info ul{
    color:#32325d;
    font-weight: 600;
}
.btn-sevices{
    background-color: #174c8e;
    border:solid 2px #174c8e;
    border-radius: 5px;
    color: #fff;
    font-weight: 600;
    font-size: 1em;
    /* margin-left: 2px; */
    
    transition: all ease .5s;
    /* letter-spacing: .1em; */
}
.btn-sevices:hover{
    background-color: #fff;
    border:solid 2px #174c8e;
    color: #174c8e;
}
#lenderSection{
    display: none;
}
.btn-header{
    background-color: #fff;
    border:solid .8px #0086e5;
    border-radius: 5px;
    color: #32325d;
    padding-left: 2px;
    font-weight: 400;
    text-align:left;
    font-size:.9rem;
    /* margin-right: 5px; */
    width: 100%;
    transition: all ease .5s;
    letter-spacing: .01em;
}
.btnDate:focus{
    outline:none !important;
}
.frame{
    cursor: pointer;
    background-color: #fff;
    border-top: solid 2px #32325d; 
    border-right: solid 2px #32325d; 
    border-left: solid 2px #32325d;
    transition: all ease .5s; 
    padding-bottom: 5px;
    padding-top: -25px;
}
.frame:hover{
    background-color: #32325d;
}
.frame h3{
    transition: all ease .5s;
}
.frame:hover h3{
    color:#fff; 
}
.date-client{
    background-color: #fff !important;
    border-left: 1px solid #cad1d7 !important;
    font-weight: 600 !important;
}
.frameTable{
    background-color: #172b4d;
    border-radius: 10px;
    padding: 20px 0;
}
.frameTable .tablesServiceAgend{
    width: 100%;
    border: none;
}
.frameTable .theadServiceAgend{
    background-color: #1c345d;
    width: 100%;
    padding: 0 10px;
}
.frameTable .tr-service, .thServiceAgend{
    color: #416ab0;
}
.frameTable .tr-service, .tdServiceAgend{
    border-bottom: solid 1px #1c345d;
    color: #fff;
    padding: 10px;
}
.top-0{
    margin-top:10% !important;
}
.headerStyles{
    background-image: url('/img/theme/Banner.png');
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    width: 100%;
    margin-bottom: 100px;
    z-index: 1;
    max-height:80px;
}
.borderImageBrand{
    height:110px;
    width:110px;
    margin-top: 15px;
    margin-left: 25px;
    padding: 10px;
    border-radius: 50%;
    background-color: #fff;
}
.imageBrand{
    height:90px;
    width:90px;
}
.inactiveButton{
    background-color: #959595 !important;
}
.activeButton{
    background-color: #174c8e !important;
}
.categoryButton{
    background-color: #d5dadd;
    border:none;
    color: #434a54;
    padding: 10px;
    border-radius: 15px;
    font-family: Open Sans, sans-serif;
    font-weight: 600;
    font-size:1em;
    transition: all 0.5s ease-out;
}
.categoryButton:hover{
    background-color: #174c8e;
    color: #fff;
}
button:focus{
    outline: none !important;
}
.card-service{
    padding: 10px 10px;
    background-color: #e2e3de;
    border-radius: 10px;
    width: 100%;
    transition: all 0.5s ease-out;
    overflow: hidden;
    min-height: 145px;
    border-bottom: solid 8px #e2e3de;
}
.card-service:hover{
    background-color: #D4D8D4;
}
.price-service{
    background-color: #fff;
    padding: 4px;
    width: 80%;
    letter-spacing: .02em; 
    text-align:center;
    border-radius: 20px;
    font-weight: 600;
    color: #090909;
    font-size: 1.2em;
}
.name-service{
    font-size: 1.2em;
    line-height: normal;
    max-width: 80%;
    letter-spacing: .02em; 
    margin-left:4px; 
    margin-bottom: 10px;
    font-weight: 500;
}
.name-service{
    color: #090909;
}

.card-service img{
    width: 80px;
    position: absolute;
    top:-50px;
    right: -50px;
}
.stepTitle {
    font-weight: 600;
}
.wizard-progress-bar{
    color:#eff2f7 !important;
    background-color:#eff2f7 !important;
}
/* .wizard-icon-container{
    background: rgb(2,0,36);
    background: linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(225,233,246,1) 0%, rgba(173,190,230,1) 100%);
    
}
.wizard-icon-container i{
color: #174c8e;
}
.wizard-icon-circle{
    border-color: #adbee6 !important;
} */
.button-service-group{
    float: right;
    background-color: #fff;
    border-radius: 18px;
    margin-top:3px;
    padding: 4px;
}
.span-button-service{
    padding: 5px;
    margin-top: 5px;
    background-color: transparent;
    font-weight: 600;
    color: #090909;
    font-size: 1.2em;
}
.button-service-left{
    border:none;
    border-radius: 20px;
    padding: 2px 6px;
    background-color: #fff;
    color: #090909;
    border: solid .5px #090909;
    font-weight: 400;
    font-size: 1rem;
    transition: all 0.5s ease-out;
    margin-right:5px;
}
.button-service-right{
    border:none;
    border-radius: 20px;
    padding: 2px 6px;
    background-color: #fff;
    border: solid .5px #090909;
    color: #090909;
    font-weight: 400;
    font-size: 1rem;
    transition: all 0.4s ease-out;
    margin-left: 5px;
}
.button-service-left i{
    transition: all 0.4s ease-out;
}
.button-service-right i{
    transition: all 0.5s ease-out;
}
.button-service-left:hover i{
    transform: rotate(360deg);
}
.button-service-right:hover i{
    transform: rotate(180deg);
}
.button-service-left:focus{
    outline: none;
}
.button-service-right:focus{
    outline: none;
}
.card-info-data{
    width: 100%;
    padding: 4px;
    background-color: #d5dadd;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 16px -11px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 16px -11px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 16px -11px rgba(0,0,0,0.75);
}
.card-info-data div{
    width: 100%;
    padding: 10px;
    background-color: #fefefe;
    padding-top: 20px;
    border-radius: 5px;
}
.card-info{
    width: 100%;
    padding: 4px;
    border-radius: 5px;
}
.card-info div{
    width: 100%;
    padding: 10px;
    padding-top: 4px;
    border-radius: 5px;
}
.card-info div p{
    font-size: .9em;
    line-height: 1.2em;
}
.spanSelect{
    cursor:pointer;
    border-radius: 50%; 
    transition: all 0.4s ease-out;
}
.spanSelect:nth-child(1n){
    padding: 8px 12px;
}
.spanSelect:nth-child(2n){
    padding: 10px 10px;
}
.spanSelect:hover{
    background-color: #7a91cb;
    color:#fff;
}
.card-services-information{
    padding: 20px;
}
.wizard-header h2{
    font-size: 1.6em;
}
.responsiveButtonsPercent{
    width: 75%;
}
.styleDropdown .dropdown-menu{
    background-color:#2dce89;
    width: 80%;
    left: 10%;
    cursor:pointer;
}
.styleDropdown .dropdown-item{
    transition: all 0.4s ease-out;
}
.styleDropdown .dropdown-item:hover{
    background-color: #96e6c4 !important; 
    color:#090909 !important;  
}
.borderRight{
    border-right: solid 1px #e0e5e8;
}
.showPhone{
    display: none;
}
.logoSyswaFooter{
    height:140px;
    width:220px
}
.spanRefer{
    padding: 5px;
    border: 1px solid #172b4d;
    border-radius: 5px;
    background-color: #e9ecef;
    font-size:14px;
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
        top:-40px;
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
    .spanRefer{
        
        font-size:.3em;
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
     
}
#overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
  cursor: pointer;
}
.codigoNum .form-control{
    padding: 5px;
}
.buttonMicro{
    margin-top:15px;
    border-radius:14px;
    background-color:#e5fbf7;
    color:#090909;
    border:none;
    transition: all 0.4s ease-out;
} 
.buttonMicro:hover{
    -webkit-box-shadow: 0px 0px 26px -21px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 26px -21px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 26px -21px rgba(0,0,0,0.75);
    transition: all 0.4s ease-out;
}
.wizard-btn{
    margin-top: 20px;
}
.hideThisShit input{
    display: none;
}
.hideThisShit .flatpickr-calendar.inline{
    margin-left:auto !important;   
}
 
</style>