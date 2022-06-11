<template>
    <div class="row justify-content-center">
        <div v-if="ifStart" class="col-lg-12 col-md-12">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 pt-0 pb-4">
                    <div class="btn-wrapper text-center">
                        <span class="mb-1"><img style="width:30%" src="img/brand/syswa-gestion.png"></span> <br><br>
                    </div>
                    <div class="stepsBar">
                        <a-steps>
                            <a-step :status="status.branch" title="Sucursal">
                                <a-icon slot="icon" :type="status.branch == 'process' ? 'loading' : 'shop'" />
                            </a-step>
                            <a-step :status="status.date" title="Agenda">
                                <a-icon slot="icon" :type="status.date == 'process' ? 'loading' : 'calendar'" />
                            </a-step>
                            <a-step :status="status.sale" title="Ventas">
                                <a-icon slot="icon" :type="status.sale == 'process' ? 'loading' : 'credit-card'" />
                            </a-step>
                            <a-step :status="status.final" title="Paso final">
                                <a-icon slot="icon" :type="status.final == 'process' ? 'loading' : 'smile-o'" />
                            </a-step> 
                        </a-steps>
                    </div>
                    <div class="stepsBox">
                        <div v-if="process == 'branch'" class="branch">
                            <h1 class="text-uppercase text-center mb-4 mt-1">
                                ¡Bienvenido!
                            </h1>
                            <div class="row">
                                <div class="col-md-6 col-sm-12">
                                    <a-tooltip placement="topLeft">
                                        <template slot="title">
                                            <span>Este sería el nombre de su primera sucursal, de tener mas puede registrarla ya pasado este registro inicial.</span>
                                        </template>
                                        <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.05em;" type="question-circle" />
                                    </a-tooltip>

                                    <label class="ml-2" for="credentials">
                                        Nombre de la sucursal
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Nombre de la sucursal"
                                        addon-left-icon="ni ni-shop"
                                        v-model="modelStart.businessName"
                                        :valid="modelStart.businessName.length >= 4 ? true : false">
                                    </base-input>
                                </div>
                                <div class="col-md-6 col-sm-12 row pr-0">
                                    <label class="ml-4 mb-0 pb-0 w-100" style="margin-bottom:-20px !important" for="credentials">
                                        Número de contacto
                                    </label>
                                    <div class="col-12 pl-3 pr-0 mt-0 pt-0">
                                        <VuePhoneNumberInput v-model="modelStart.businessPhone" @update="phoneData = $event"
                                        default-country-code="US" 
                                        :translations="{
                                            countrySelectorLabel: 'Código de país',
                                            countrySelectorError: 'Elije un país',
                                            phoneNumberLabel: 'Número de teléfono',
                                            example: 'Ejemplo :'
                                        }"/>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <a-tooltip>
                                        <template slot="title">
                                            Debe ser un correo valido
                                        </template>
                                        <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.05em;" type="question-circle" />
                                    </a-tooltip>
                                    <label class="ml-2" for="branch">
                                        Correo
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Correo de la sucursal"
                                        addon-left-icon="ni ni-email-83"
                                        @keyup="verifyEmail()"
                                        v-model="modelStart.email"
                                        :valid="verifyEmailVar">
                                    </base-input>
                                </div>
                                <a-tooltip placement="top">
                                    <template slot="title">
                                    <span>Luego de crear la sucursal podras agregar tu logo en configuraciones</span>
                                    </template>
                                    <div class="col-md-6 col-sm-12">
                                        <label class="ml-2" for="branch">
                                            Logo de la sucursal
                                        </label><br>
                                        <input type="file" id="fileProfile" disabled ref="file" v-on:change="handleFileUpload()" placeholder="seleccione logo" class="form-control input-group-alternative" />
                                    </div>
                                </a-tooltip>
                                
                                <div class="col-md-6 col-sm-12">
                                    <label class="ml-2 w-100" for="credentials">
                                        Dirección del local
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Dirección"
                                        addon-left-icon="fa fa-location-arrow"
                                        v-model="modelStart.businessLocation"
                                        :valid="modelStart.businessLocation.length >= 2 ? true : false">
                                    </base-input>
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <label class="ml-2 w-100" for="credentials">
                                        Tipo de negocio
                                    </label>
                                    <a-select
                                            show-search
                                            placeholder="Seleccionar negocio"
                                            option-filter-prop="children"
                                            style="width: 100%;height: 43px;"
                                            class="input-group-alternative"
                                            size="large"
                                            v-model="modelStart.businessType"
                                            :filter-option="filterOption"
                                            @change="handleChange"
                                        >
                                        <a-select-option value="Spa de uñas">
                                            Spa de uñas
                                        </a-select-option>
                                        <a-select-option value="Barberia">
                                            Barberia
                                        </a-select-option>
                                        <a-select-option value="Peluqueria">
                                            Peluquería
                                        </a-select-option>
                                        <a-select-option value="Contratista">
                                            Contratista
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                            <base-button outline type="default" class="float-right mt-2" v-on:click="nextStep('branch')">
                                Siguiente
                            </base-button>
                        </div>
                        
                        <div v-else-if="process == 'date'" class="data">
                            <h1 class="text-uppercase text-center">
                                Horario
                            </h1>
                            <hr class="w-50">
                            <h3 class="text-weigth-bold text-center">
                                <a-tooltip placement="topLeft">
                                    <template slot="title">
                                        <span>Seleccione los días y horarios de apertura y cierre de su negocio.</span>
                                    </template>
                                    <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                                </a-tooltip>
                                Configura tu horario
                            </h3>
                            <div class="row pl-8 pr-4">
                                <div class="col-2">
                                    <base-button :type="days.monday" size="sm" class="mt-2 w-100" v-on:click="salectDay('monday')">
                                        Lunes
                                    </base-button>
                                    <base-button :type="days.tuesday" size="sm" class="mt-2 w-100" v-on:click="salectDay('tuesday')">
                                        Martes
                                    </base-button>
                                    <base-button :type="days.wednesday" size="sm" class="mt-2 w-100" v-on:click="salectDay('wednesday')">
                                        Miércoles
                                    </base-button>
                                    <base-button :type="days.thursday" size="sm" class="mt-2 w-100" v-on:click="salectDay('thursday')">
                                        Jueves
                                    </base-button>
                                    <base-button :type="days.friday" size="sm" class="mt-2 w-100" v-on:click="salectDay('friday')">
                                        Viernes
                                    </base-button>
                                    <base-button :type="days.saturday" size="sm" class="mt-2 w-100" v-on:click="salectDay('saturday')">
                                        Sábado
                                    </base-button>
                                    <base-button :type="days.sunday" size="sm" class="mt-2 w-100" v-on:click="salectDay('sunday')">
                                        Domingo
                                    </base-button>
                                </div>
                                <div class="col-10">
                                    <a-select :disabled="modelStart.blockHour[1].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[1].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[1].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[1].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[2].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[2].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[2].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[2].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    
                                    <a-select :disabled="modelStart.blockHour[3].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[3].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[3].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[3].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[4].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[4].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[4].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[4].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[5].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[5].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[5].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[5].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[6].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[6].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[6].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[6].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>

                                    <a-select :disabled="modelStart.blockHour[0].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Desde" v-model="modelStart.blockHour[0].start">
                                        <a-select-option v-for="i in fromArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                    <a-select :disabled="modelStart.blockHour[0].status == true ? false : true" style="width:40%" class="mx-2 mt-1 input-group-alternative" placeholder="Hasta" v-model="modelStart.blockHour[0].end">
                                        <a-select-option v-for="i in toArray" :key="i">
                                            {{i}}
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                            <base-button outline type="default" class="float-left mt-3" v-on:click="prevStep('date')">
                                Anterior
                            </base-button>
                            <base-button outline type="default" class="float-right mt-3" v-on:click="nextStep('date')">
                                Siguiente
                            </base-button>
                        </div>
                        <div v-else-if="process == 'sale'" class="data">
                            <h1 class="text-uppercase text-center">
                                Tipos de pago
                            </h1>
                            <hr class="w-50">
                            <h3 class="text-weigth-bold text-center">
                                <a-tooltip placement="topLeft">
                                    <template slot="title">
                                        <span>Para registrar un método de pago debes escribirlo, darle click en <b>ingresar</b> o presionando la tecla <b>enter</b>.</span>
                                    </template>
                                    <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                                </a-tooltip>
                                Crea tus tipos de pago
                            </h3>
                            <div class="row">
                                <div class="col-md-4">
                                    <label for="currency">
                                        Escriba su tipo de pago
                                    </label>
                                    <div class="row pr-2">
                                        <div class="col-10 pr-0">
                                            <base-input class="input-group-alternative"
                                                placeholder="Tipo de pago"
                                                addon-left-icon="fa fa-plus"
                                                v-model="typePay"
                                                v-on:keyup.enter="insertTypePay">
                                            </base-input>
                                        </div>
                                        <div class="col-2">
                                            <a-tooltip placement="topLeft">
                                                <template slot="title">
                                                    <span>Ingresar método de pago.</span>
                                                </template>
                                                <base-button outline type="default" class="p-2 px-3 mt-1" v-on:click="insertTypePay">
                                                    <a-icon style="vertical-align: 1px;" type="plus" />
                                                </base-button>
                                            </a-tooltip>
                                        </div>
                                    </div>
                                    <label class="mt-4" for="currency">
                                        Seleccione su moneda local
                                    </label>
                                    <a-select class="input-group-alternative" default-value="CLP" style="width: 100%;height: 43px;" @change="selectCurrency" size="large">
                                        <a-select-option value="USD">
                                            USD
                                        </a-select-option>
                                        <a-select-option value="EUR">
                                            EUR
                                        </a-select-option>
                                        <a-select-option value="CLP" >
                                            CLP
                                        </a-select-option>
                                        <a-select-option value="COP">
                                            COP
                                        </a-select-option>
                                        <a-select-option value="ARG">
                                            ARG
                                        </a-select-option>
                                        <a-select-option value="VES">
                                            VES
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <a-config-provider :locale="es_ES">
                                    <template  #renderEmpty>
                                        <div style="text-align: center">
                                            <a-icon type="warning" style="font-size: 20px" />
                                            <p>No se han agregado metodos de pago</p>
                                        </div>
                                    </template>
                                    <div class="col-md-8 mt-4" style="overflow: hidden;overflow-y:scroll; max-height: 200px;">
                                        <a-list size="small" bordered :data-source="modelStart.typesPay">
                                            <a-list-item slot="renderItem" slot-scope="item, index">
                                                {{ item }} 
                                                <base-button outline type="default" v-if="item != 'Efectivo'" size="sm" class="float-right" v-on:click="removeTypePay(index)" style="margin-top: -3px;">
                                                    <i class="fa fa-times"></i>
                                                </base-button>
                                            </a-list-item>
                                        </a-list>
                                    </div>
                                </a-config-provider>
                            </div>
                            <base-button outline type="default" class="float-left mt-3" v-on:click="prevStep('sale')">
                                Anterior
                            </base-button>
                            <base-button outline type="default" class="float-right mt-3" v-on:click="nextStep('sale')">
                                Siguiente
                            </base-button>
                        </div>
                        <div v-else-if="process == 'final'" class="data">
                            <h1 class="text-uppercase text-center">
                                Usuario de ingreso
                            </h1>
                            <hr class="w-50">
                            <h3 class="text-weigth-bold text-center">
                                <a-tooltip placement="topLeft">
                                    <template slot="title">
                                        <span>Registra los datos con los que accederas al sistema.</span>
                                    </template>
                                    <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                                </a-tooltip>
                                Crear usuario de ingreso
                            </h3>
                            <div class="row">
                                <div class="col-md-4">
                                    <label for="first_name">
                                        Nombres
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Nombres"
                                        addon-left-icon="ni ni-circle-08"
                                        v-model="modelStart.first_name"
                                        :valid="modelStart.first_name.length >= 3 ? true : false">
                                    </base-input>
                                </div>
                                <div class="col-md-4">
                                    <label for="last_name">
                                        Apellidos
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Apellidos"
                                        addon-left-icon="ni ni-circle-08"
                                        v-model="modelStart.last_name"
                                        :valid="modelStart.last_name.length >= 3 ? true : false">
                                    </base-input>
                                </div>
                                <div class="col-md-4">
                                    <a-tooltip placement="topLeft">
                                        <template slot="title">
                                            <span>Introducir las credenciales otorgadas. De no poseerse, comuníquese con soporte técnico.</span>
                                        </template>
                                        <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                                    </a-tooltip>
                                    <label class="ml-2" for="credentials">
                                        Credencial de ingreso
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Credencial"
                                        addon-left-icon="ni ni-key-25"
                                        v-model="modelStart.credential"
                                        :valid="modelStart.credential.length == 20 ? true : false">
                                    </base-input>
                                </div>
                                <div class="col-md-6">
                                    <label for="email">
                                        Correo
                                    </label>
                                    <base-input class="input-group-alternative"
                                        placeholder="Correo"
                                        autocomplete="off"
                                        addon-left-icon="ni ni-email-83"
                                        v-model="modelStart.email"
                                        :valid="validEmail()">
                                    </base-input>
                                </div>
                                <div class="col-md-6 row pr-0">
                                    <div class="col-10 pr-0">
                                        <label for="password">
                                            <a-tooltip placement="topLeft">
                                                <template slot="title">
                                                    <span>Su contraseña debe contener más de 8 caracteres.</span>
                                                </template>
                                                <a-icon class="mr-2" style="cursor: pointer;vertical-align: 0.1em;" type="question-circle" />
                                            </a-tooltip>
                                            Contraseña
                                        </label>
                                        <base-input class="input-group-alternative"
                                            placeholder="Contraseña"
                                            autocomplete="off"
                                            :type="typePass"
                                            addon-left-icon="fa fa-unlock-alt"
                                            v-model="modelStart.password"
                                            :valid="modelStart.password.length > 8 ? true : false"
                                        >
                                        </base-input>
                                    </div>
                                    <div class="col-2 pr-0">
                                        <base-button outline type="default" style="margin-top:30px;float:right;" v-on:click="viewPass">
                                            <a-icon style="vertical-align: 1px;" type="eye" />
                                        </base-button>
                                        
                                    </div>
                                </div>
                            </div>
                            <base-button outline type="default" class="float-left mt-3" v-on:click="prevStep('final')">
                                Anterior
                            </base-button>
                            <base-button outline type="default" class="float-right mt-3" v-on:click="finishProcess()">
                                Finalizar
                            </base-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6">
                    
                </div>
            </div>
        </div>
        <div v-else class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="btn-wrapper text-center mb-4">
                        <span class="mb-5"><img style="width:30%" src="img/brand/syswa-isotipo.png"></span> <br><br>
                    </div>
                    <form v-if="loading == false" class="mt-3" role="form">
                        <div class="row">
                            <div class="col-12 p-1">
                                <base-input class="input-group-alternative w-100 mt-4 mb-3"
                                    placeholder="Correo"
                                    addon-left-icon="ni ni-email-83"
                                    v-model="model.email">
                                </base-input>
                            </div>
                            <div class="col-10 p-1">
                                <base-input class="input-group-alternative"
                                    placeholder="Contraseña"
                                    :type="typePass"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.password">
                                </base-input>
                            </div>
                            <div class="col-2 p-1">
                                <base-button outline type="default" style="float:right;" v-on:click="viewPass">
                                    <a-icon style="vertical-align: 1px;font-size:1.4em;" type="eye" />
                                </base-button>
                            </div>
                        </div>
                        <div class="text-center">
                            <base-button type="default" v-on:click="login()" class="my-2">Ingresar</base-button> <br>
                            <a v-on:click="modals.modal2 = true"><dt>¿Has olvidado la contraseña?</dt></a> 
                        </div>
                    </form>
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
               <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                        <a-icon style="font-size: 10em; margin-bottom:30px" type="lock" />
                       <h3>¿Tienes problemas para entrar?</h3>
                       <p><em>Introduce tu correo y te enviaremos un enlace para que vuelvas a entrar a tu cuenta.</em></p> 
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
                            <base-button type="primary" :disabled="emailRenew.includes('@') ? false : true" v-on:click="SendNewPass">Enviar enlace de acceso</base-button>
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
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinES],
    name: 'login',
    components: {
        VuePhoneNumberInput
    },
    data() {
      return {
            ifStart: false,
            phoneData: {isValid: false},
            days: {
                monday: 'danger',
                tuesday: 'danger',
                wednesday: 'danger',
                thursday: 'danger',
                friday: 'danger',
                saturday: 'danger',
                sunday: 'danger'
            },
            status: {
                branch: 'process',
                date: 'wait',
                sale: 'wait',
                final: 'wait'
            },
            verifyEmailVar: false,
            process: 'branch',
            typePass: 'password',
            typePay: '',
            modelStart: {
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                credential: '',
                branch: '',
                businessName: '',
                businessPhoneCode: '+56',
                businessPhone: '',
                businessType: 'Seleccione',
                businessLocation: '',
                blockHour: [
                    {
                        day: 0,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 1,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 2,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 3,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 4,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 5,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    },
                    {
                        day: 6,
                        start: '10:00',
                        end: '20:00',
                        status: false,
                        time: 0
                    }
                ],
                currency: 'CLP',
                typesPay: ['Efectivo']
            },
            fromArray: [
                '6:00',
                '6:30',
                '7:00',
                '7:30',
                '8:00',
                '8:30',
                '9:00',
                '9:30',
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                '12:30',
                '13:00',
                '13:30',
                '14:00',
                '14:30',
                '15:00',
            ],
            toArray: [
                '12:00',
                '12:30',
                '13:00',
                '13:30',
                '14:00',
                '14:30',
                '15:00',
                '15:30',
                '16:00',
                '16:30',
                '17:00',
                '17:30',
                '18:00',
                '18:30',
                '19:00',
                '19:30',
                '20:00',
                '20:30',
                '21:00',
                '21:30',
                '22:00',
                '22:30',
                '23:00',
            ],
            model: {
                email: '',
                password: '',
            },
            configHeader: {
                headers:{"x-database-connect": endPoint.database}
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
        localStorage.removeItem('firstname')
        localStorage.removeItem('lastname')
        localStorage.removeItem('image')
        localStorage.removeItem('email')
        localStorage.removeItem('imageUser')
        localStorage.removeItem('status')
        localStorage.removeItem('branch')
        localStorage.removeItem('branchName')
    },
    created(){
        this.getBranches()
    },
    methods: {
        selectCurrency(value){
            this.currency = value
        },
        filterOption(input, option) {
            return (
                option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
        },
        viewPass(){
            this.typePass = this.typePass == 'password' ? '' : 'password'
        },
        verifyEmail(){
            if (this.modelStart.email.split('@')[1]) {
                if (this.modelStart.email.split('@')[1].split('.')[0]) {
                    this.verifyEmailVar = true
                }else{
                    this.verifyEmailVar = false
                }
            }else{
                this.verifyEmailVar = false
            }
            console.log(this.verifyEmailVar)
        },
        calculatedHour(){
          for (const day of this.modelStart.blockHour) {
            var SumHours, SumMinutes, TotalMinutes
              if (day.status) {
                SumHours  = (parseInt(day.end.split(':')[0] - parseInt(day.start.split(':')[0])) * 60)
                SumMinutes = parseInt(day.start.split(':')[1]) - parseInt(day.end.split(':')[1])
                TotalMinutes = SumHours + SumMinutes
                day.time = TotalMinutes
              }
          }
        },
        handleFileUpload(){
            this.file = this.$refs.file.files[0]
        },
        async finishProcess(){
            this.calculatedHour()
            if (this.modelStart.first_name.length >= 4 && this.modelStart.last_name.length >= 4 && this.modelStart.credential.length == 20 && this.validEmail() && this.modelStart.password.length > 8) {
                try {
                    const registerBranch = await axios.post(endPoint.endpointTarget+'/branches/createBranchCertificate', {
                        branch: this.modelStart.businessName,
                        secretKey: this.modelStart.credential
                    }, this.configHeader)
                    console.log(registerBranch.data.status)
                    if (registerBranch.data.status == 'ok') {
                        try {
                            var formData = new FormData()
                            formData.append('image', this.file)
                            const config = {headers: {'Content-Type': 'multipart/form-data', 'x-access-token': localStorage.userToken, "x-database-connect": endPoint.database }}
                            try {
                                const registerConf = await axios.post(endPoint.endpointTarget+'/configurations/createConfigCertificate', {
                                    branch: registerBranch.data.data._id,
                                    secretKey: this.modelStart.credential,
                                    blockHour: this.modelStart.blockHour,
                                    businessName: this.modelStart.businessName,
                                    businessPhone: this.phoneData,
                                    email: this.modelStart.email,
                                    'route': endPoint.url,
                                    file:'',
                                    businessType: this.modelStart.businessType,
                                    businessLocation: this.modelStart.businessLocation,
                                    typesPay: this.modelStart.typesPay,
                                    currency: this.modelStart.currency
                                }, this.configHeader)
                                if (registerConf.data.status == 'ok') {
                                    const registerUser = await axios.post(endPoint.endpointTarget+'/users/createUserCertificate', {
                                        branch: registerBranch.data.data._id,
                                        secretKey: this.modelStart.credential,
                                        first_name: this.modelStart.first_name,
                                        last_name: this.modelStart.last_name,
                                        email: this.modelStart.email,
                                        password: this.modelStart.password
                                    }, this.configHeader)
                                    if (registerUser) {
                                        const registerFirstProfile = await axios.post(endPoint.endpointTarget+'/configurations/addFirstProfile', {
                                            secretKey: this.modelStart.credential
                                        }, this.configHeader)
                                        this.$swal({
                                            type: 'success',
                                            icon: 'success',
                                            title: 'Registro exitoso',
                                            showConfirmButton: false,
                                            timer: 1500
                                        })
                                        try{
                                            const welcome = await axios.post(endPoint.endpointTarget+'/mails/welcome', {
                                                firstName: this.modelStart.first_name,
                                                email: this.modelStart.email
                                            }, this.configHeader)
                                            
                                        }catch(err){
                                            console.log(err)
                                        }
                                        
                                        setTimeout(() => {
                                            location.reload()
                                        }, 2000);
                                    }
                                }
                            }catch(err){
                                console.log(err)
                            }
                        }catch(err){console.log(err)}
                    }
                }catch(err){console.log(err)}
            }else{
                this.$swal({
                    type: 'error',
                    icon: 'error',
                    title: 'Debe llenar los campos correctamente.',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        },
        validEmail(){
            const valid = this.modelStart.email.split('@')
            if(valid.length > 1){
                console.log(valid[1].includes('.'))
                return valid[1].includes('.')
            }else{
                return false
            }
        },
        handleChange(value) {
            this.modelStart.businessType = value
        },
        insertTypePay(){
            if (this.modelStart.typesPay.length < 8) {
                if (this.typePay.length > 4) {
                    var findType = this.modelStart.typesPay.find(type => type == this.typePay)
                    console.log(findType)
                    if (findType == undefined) {
                        this.modelStart.typesPay.push(this.typePay)
                        this.typePay = ''
                    }else{
                        this.$swal({
                            icon: 'error',
                            title: 'Tipo de pago duplicado.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                }else if (this.typePay.length < 4) {
                    this.$swal({
                        icon: 'error',
                        title: 'El método de pago debe estar compuesto por mas de 4 caracteres',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe llenar el tipo de pago',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else{
                this.$swal({
                    icon: 'error',
                    title: 'No puede ingresar mas de 8 métodos de pago.',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        },
        alertsMessages(message){
            this.$swal({
                icon: 'info',
                title: message,
                showConfirmButton: true,
            })
        },
        removeTypePay(index){
            this.modelStart.typesPay.splice(index, 1)
        },
        salectDay(day){
            if (day == 'monday') {
                this.modelStart.blockHour[1].status = this.days.monday == 'success' ? false : true
                this.days.monday = this.days.monday == 'success' ? 'danger' : 'success'
            }else if (day == 'tuesday') {
                this.modelStart.blockHour[2].status = this.days.tuesday == 'success' ? false : true
                this.days.tuesday = this.days.tuesday == 'success' ? 'danger' : 'success'
            }else if (day == 'wednesday') {
                this.modelStart.blockHour[3].status = this.days.wednesday == 'success' ? false : true
                this.days.wednesday = this.days.wednesday == 'success' ? 'danger' : 'success'
            }else if (day == 'thursday') {
                this.modelStart.blockHour[4].status = this.days.thursday == 'success' ? false : true
                this.days.thursday = this.days.thursday == 'success' ? 'danger' : 'success'
            }else if (day == 'friday') {
                this.modelStart.blockHour[5].status = this.days.friday == 'success' ? false : true
                this.days.friday = this.days.friday == 'success' ? 'danger' : 'success'
            }else if (day == 'saturday') {
                this.modelStart.blockHour[6].status = this.days.saturday == 'success' ? false : true
                this.days.saturday = this.days.saturday == 'success' ? 'danger' : 'success'
            }else if (day == 'sunday') {
                this.modelStart.blockHour[0].status = this.days.sunday == 'success' ? false : true
                this.days.sunday = this.days.sunday == 'success' ? 'danger' : 'success'
            }
        },
        nextStep(step){
            if (step == 'branch') {
                if (this.modelStart.businessName.length >= 4 && this.phoneData.isValid && this.modelStart.businessLocation.length >= 2 && this.modelStart.businessType != 'Seleccione' && this.verifyEmailVar) {
                    this.status.branch = 'finish'
                    this.status.date = 'process'
                    this.process = 'date'
                }else if(!this.verifyEmailVar){
                    this.$swal({
                        icon: 'error',
                        title: 'El correo es invalido',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (this.phoneData.isValid == false) {
                    this.$swal({
                        icon: 'error',
                        title: 'Debe escribir un número de teléfono valido',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if (this.modelStart.businessLocation.length < 2) {
                    this.$swal({
                        icon: 'error',
                        title: 'La dirección debe contener más de 2 caractéres',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                else{
                    this.$swal({
                        icon: 'error',
                        title: 'Llene todos los campos.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                console.log(this.modelStart.businessType)
            }else if(step == 'date'){
                const findDate = this.modelStart.blockHour.find(status => status.status == true)
                console.log(findDate)
                if (findDate != undefined) {
                    this.status.date = 'finish'
                    this.status.sale = 'process'
                    this.process = 'sale'
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe seleccionar mínimo un día.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else if(step == 'sale'){
                if (this.modelStart.typesPay.length > 0) {
                    this.status.sale = 'finish'
                    this.status.final = 'process'
                    this.process = 'final'
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'Debe crear mínimo un tipo de pago.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else if(step == 'final'){
                this.status.branch = 'finish'
            }
        },
        formatPhone(){
            var number = this.modelStart.businessPhone.replace(/[^\d]/g, '')
            if (number.length == 9) {
                number = number.replace(/(\d{1})(\d{4})/, "$1-$2-");
            } 
            // else if (number.length == 10) {
            //     number = number.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
            // }
            this.modelStart.businessPhone = number
        },
        prevStep(step){
            if (step == 'date') {
                this.status.branch = 'process'
                this.status.date = 'wait'
                this.process = 'branch'
            }else if(step == 'sale'){
                this.status.date = 'process'
                this.status.sale = 'wait'
                this.process = 'date'
            }else if(step == 'final'){
                this.status.sale = 'process'
                this.status.final = 'wait'
                this.process = 'sale'
            }
        },
        async getBranches(){
            try {
                const getBranches = await axios.get(endPoint.endpointTarget+'/branches/count', this.configHeader)
                if (getBranches.data.data == 0) {
                    this.ifStart = true  
                }
            }catch(err){console.log(err)}
        },
        login() {
            this.loading = true
            axios.post(endPoint.endpointTarget+'/users/login', {
                email: this.model.email,
                password: this.model.password
            }, this.configHeader).then(res => {
                if(res.data.error == 'pass incorrecto' || res.data.error == 'User does not exist'){
                    this.$swal({
                        type: 'error',
                        title: 'Usuario o Contraseña incorrecta',
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
                    localStorage.setItem('firstname', decoded.first_name)
                    localStorage.setItem('_id', decoded._id)
                    localStorage.setItem('lastname', decoded.last_name)
                    localStorage.setItem('email', decoded.email)
                    localStorage.setItem('imageUser', decoded.userImage)
                    localStorage.setItem('showNav', true)
                    localStorage.setItem('status', decoded.status)
                    localStorage.setItem('branch', decoded.branch)
                    router.push({path: '/Agendamiento'})
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
        async emitMethod(status) {
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
