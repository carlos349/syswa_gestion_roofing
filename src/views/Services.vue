<template>
    <div>
        <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center"
            style="min-height: 50px; background-image: url(img/theme/services.png); background-size: cover; background-position: center 50%;">
            <!-- Mask -->
            <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
            <!-- Header container -->
            <div class="row">
                <div class="col-12">
                    <div class="text-absolute">
                        <p class="mb-0 display-2 text-white">Servicios</p>
                        <p class="text-white hideText">Sección dedicada a registrar, editar, eliminar o activar e inactivar servicios de su negocio.</p>
                    </div>
                    <base-button class="float-right mt-7 mr-0" size="sm" v-if="validRoute('servicios', 'ingresar')" @click="modals.modal5 = true" type="primary">
                        <a-icon type="unordered-list" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Categorías
                    </base-button>
                    <base-button class="float-right mt-7 mr-0" size="sm" v-else @click="modals.modal5 = true" type="primary" disabled>
                        <a-icon type="unordered-list" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Categorías
                    </base-button>
                    <base-button class="float-right mt-7 mr-2" size="sm" v-if="validRoute('servicios', 'ingresar')" @click="validCreate(), clean()" type="success">
                        <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Nuevo
                    </base-button>
                    <base-button class="float-right mt-7 mr-2" size="sm" v-else @click="modals.modal1 = true, clean()" type="success" disabled>
                        <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                        Nuevo
                    </base-button>
                </div>
            </div>
        </base-header>
        <!-- MODAL REGISTRAR -->

        <modal :show.sync="modals.modal1"
               body-classes=""
               modal-classes="modal-dialog-centered modal-lg">
               <h6 slot="header" class="modal-title" id="modal-title-default"></h6>
            <!-- <card type="secondary" shadow
                  header-classes="bg-white"
                  body-classes="px-lg-5 pt-5"
                  class="border-0"> -->
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                       <h3>Datos del servicio </h3> 
                    </div>
                </template>
                <template>
                    <form role="form">
                        <div class="row m-0">
                            <div class="col-md-12 mb-0">
                                <base-input alternative
                                    class="w-100"
                                    placeholder="Nombre del servicio"
                                    maxlenght="25"
                                    addon-left-icon="fa fa-font"
                                    v-model="serviceRegister"
                                    addon-right-icon="fa fa-asterisk text-danger" >
                                </base-input>
                            </div>
                            <div class="col-md-12 mt-0 mb-2">
                                <textarea class="form-control w-100 mt-0"  alternative
                                    placeholder="Descripción del servicio"
                                    
                                    v-model="serviceAditionalRegister">
                                </textarea>
                            </div>
                            <div class="col-md-4">
                                <base-input alternative
                                    max-count="100"
                                    placeholder="Comisión (%)"
                                    addon-left-icon="fa fa-percent"
                                    v-model="comissionRegister"
                                    addon-right-icon="fa fa-asterisk text-danger" >
                                </base-input>
                            </div>
                            <div class="col-md-4">
                                <currency-input
                                    v-model="priceRegister"
                                    locale="de"
                                    placeholder="Costo"
                                    class="form-control w-100"
                                />

                            </div>
                            <div class="col-md-4 marginIf">
                                <select class="form-control mb-3" v-model="categoryRegister">
                                    <option style="color:black;">Categoría</option>
                                    <option style="color:black;" v-for="category of categories" :key="category.name">{{category.name}}</option>
                                </select>
                            </div>
                            
                            <div class="col-md-6 row ml-1 mb-3" style="margin-top:-10px;"> 
                                <label class="ml-5 mb-3">
                                    Tiempo del servicio
                                </label>
                                <div class="col-6 px-1" style="margin-top:-10px;">
                                    <a-select default-value="0" v-model="timeHoursRegister">
                                        <a-select-option value="0">
                                            0 hr
                                        </a-select-option>
                                        <a-select-option value="1">
                                            1 hr
                                        </a-select-option>
                                        <a-select-option value="2">
                                            2 hr
                                        </a-select-option>
                                        <a-select-option value="3">
                                            3 hr
                                        </a-select-option>
                                        <a-select-option value="4">
                                            4 hr
                                        </a-select-option>
                                        <a-select-option value="5">
                                            5 hr
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <div class="col-6 px-1" style="margin-top:-10px;">
                                    <a-select default-value="0" v-model="timeMinutesRegister">
                                        <a-select-option value="0">
                                            0 min
                                        </a-select-option>
                                        <a-select-option value="15">
                                            15 min
                                        </a-select-option>
                                        <a-select-option value="30">
                                            30 min
                                        </a-select-option>
                                        <a-select-option value="45">
                                            45 min
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                            <div style="margin-top:-10px" class="row col-sm-6 mx-auto">
                                <h3 class="w-100 text-center">¿Aplica descuento?</h3>
                                <base-radio name="false" value="true" inline class="mb-3 mx-auto" v-model="addDiscount"> <b>Si</b> </base-radio>
                                <base-radio name="true" value="false" checked inline class="mb-3 mx-auto" v-model="addDiscount"> <b>No</b> </base-radio> 
                            </div>
                            <div class="col-12 row">
                                <div class="col-md-6 pt-4 pl-3">
                                    <p class="mx-auto font-weight-normal mt-2"> <strong class="mr-2">Aplica abono </strong> <a-switch class="mr-2" :checked="payment" @click="checkPayment()"/></p>
                                </div>
                                <div class="col-md-6">
                                    <label for="">Monto mínimo de abono</label>
                                    <currency-input
                                        v-model="paymentAmount"
                                        locale="de"
                                        :disabled="payment ? false : true"
                                        placeholder="Abono minimo"
                                        class="form-control w-100"
                                    />
                                </div>
                            </div>
                        </div>
                        <tabs fill class="flex-column flex-md-row">
                            <tab-pane>
                                <span slot="title">
                                    <i class="fa fa-user-check">
                                        Empleados
                                    </i>
                                </span>
                                <vue-custom-scrollbar ref="tableC" class="maxHeight">
                                    <vue-bootstrap4-table :rows="lenders" :columns="columnsLender" :classes="classes" :config="configLender" :footer="false" >
                                        <template slot="validationnnn" slot-scope="props">
                                            <center>
                                                <base-button v-on:click="unSelected(props.row._id, props.row.vbt_id)" class="w-25" size="sm" type="success" icon="ni ni-check-bold" v-if="props.row.valid == true">
                                                </base-button>
                                                <base-button v-on:click="selected(props.row, props.row.vbt_id)" class="w-25" size="sm" type="danger" icon="fa fa-ban" v-else>
                                                </base-button>
                                            </center>
                                         </template>
                                    </vue-bootstrap4-table>
                                </vue-custom-scrollbar >
                            </tab-pane>

                            <tab-pane title="Profile">
                                <span slot="title">
                                    <i class="fa fa-box-open">
                                        Productos
                                    </i>
                                </span>
                                <vue-custom-scrollbar class="maxHeight">
                                    <div class="p-4">
                                        <base-button v-for="(data, index) in rowsItems" :key="data" v-on:click="itemsFunction(index, 1)" class="col-12 mb-1" type="secondary">
                                            <div class="row">
                                                <div class="col-8">
                                                    <base-checkbox  class="float-left" v-model="itemsBox[index].check">{{data.product}}</base-checkbox>
                                                </div>
                                                <div class="col-4">
                                                    <badge v-if="itemsBox[index].count != ''" style="font-size:.8em !important" class="float-right text-default" type="success">{{itemsBox[index].count}} {{data.measure}}</badge>
                                                </div>
                                            </div>
                                        </base-button>
                                    </div>
                                </vue-custom-scrollbar>
                            </tab-pane>
                        </tabs>
                        <div class="text-center">
                            <base-button type="primary" class="my-4" v-on:click="registerService">Registrar</base-button>
                        </div>
                    </form>
                </template>
            <!-- </card> -->
        </modal>
        <modal :show.sync="modals.modal2"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-lg">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                       <h3>Datos del servicio</h3> 
                    </div>
                </template>
                <template>
                    <form role="form">
                        <div class="row m-0">
                            <div class="col-md-12">
                                <base-input alternative
                                    class="w-100 mb-2"
                                    placeholder="Nombre"
                                    addon-left-icon="fa fa-font"
                                    v-model="serviceEdit"
                                >
                                </base-input>
                            </div>
                            <div class="col-md-12 mt-0 mb-2">
                                <textarea class="form-control w-100 mt-0"  alternative
                                    placeholder="Descripción del servicio"
                                    
                                    v-model="servicesAdditionalEdit">
                                </textarea>
                            </div>
                            <div class="col-md-4">
                                <base-input alternative
                                    type="text"
                                    placeholder="Comisión"
                                    class="w-100"
                                    addon-left-icon="fa fa-percent"
                                    v-model="comissionEdit"
                                    addon-right-icon="fa fa-asterisk text-danger" >
                                </base-input>
                            </div>
                            <div class="col-md-4">
                                <currency-input 
                                    v-model="priceEdit"
                                    locale="de"
                                    addon-left-icon="ni ni-time-alarm"
                                    class="form-control mx-auto w-100"
                                    addon-right-icon="fa fa-asterisk text-danger" 
                                />
                            </div>
                            <div class="col-md-4 marginIf">
                                <select class="form-control mx-auto mb-3" v-model="editCategoryServicer">
                                    <option style="color:black;" v-for="category of categories" :key="category.name">{{category.name}}</option>
                                </select>
                            </div>
                            <div class="col-md-6 row ml-1 mb-3" style="margin-top:-10px;"> 
                                <label class="ml-5 mb-3">
                                    Tiempo del servicio
                                </label>
                                <div class="col-6 px-1" style="margin-top:-10px;">
                                    <a-select default-value="0" v-model="editTimeHoursRegister">
                                        <a-select-option value="0">
                                            0 hr
                                        </a-select-option>
                                        <a-select-option value="1">
                                            1 hr
                                        </a-select-option>
                                        <a-select-option value="2">
                                            2 hr
                                        </a-select-option>
                                        <a-select-option value="3">
                                            3 hr
                                        </a-select-option>
                                        <a-select-option value="4">
                                            4 hr
                                        </a-select-option>
                                        <a-select-option value="5">
                                            5 hr
                                        </a-select-option>
                                    </a-select>
                                </div>
                                <div class="col-6 px-1" style="margin-top:-10px;">
                                    <a-select default-value="0" v-model="editTimeMinutesRegister">
                                        <a-select-option value="0">
                                            0 min
                                        </a-select-option>
                                        <a-select-option value="15">
                                            15 min
                                        </a-select-option>
                                        <a-select-option value="30">
                                            30 min
                                        </a-select-option>
                                        <a-select-option value="45">
                                            45 min
                                        </a-select-option>
                                    </a-select>
                                </div>
                            </div>
                            <div class="row mx-auto col-md-6" style="margin-top:-2%">
                                <h3 class="w-100 text-center">¿Aplica descuento?</h3>
                                <base-radio name="false"  inline class="mb-3 mx-auto" v-model="addDiscountEdit"> <b>Si</b> </base-radio>
                                <base-radio name="true"  inline class="mb-3 mx-auto" v-model="addDiscountEdit"> <b>No</b> </base-radio> 
                            </div>
                            <div class="col-12 row">
                                <div class="col-6 pt-4 pl-5">
                                    <p class="mx-auto font-weight-normal mt-2"> <strong class="mr-2">Aplica abono </strong> <a-switch class="mr-2" :checked="editPayment" @click="checkPaymentEdit()"/></p>
                                </div>
                                <div class="col-6">
                                    <label for="">Monto mínimo de abono</label>
                                    <currency-input
                                        v-model="editPaymentAmount"
                                        locale="de"
                                        :disabled="editPayment ? false : true"
                                        placeholder="Abono minimo"
                                        class="form-control w-100"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <tabs fill class="flex-column flex-md-row">
                            <tab-pane>
                                <span slot="title">
                                    <i class="fa fa-user-check">
                                        Empleados
                                    </i>
                                </span>
                                <vue-custom-scrollbar ref="table" class="maxHeight">
                                    <vue-bootstrap4-table :rows="lenders" :columns="columnsLender" :classes="classes" :config="configLender" >
                                        <template slot="validationnnn" slot-scope="props">
                                            <center>
                                                <base-button v-on:click="unSelected(props.row._id, props.row.vbt_id)" class="w-25" size="sm" type="success" icon="ni ni-check-bold" v-if="props.row.valid">
                                                </base-button>
                                                <base-button v-on:click="selected(props.row, props.row.vbt_id)" class="w-25" size="sm" type="danger" icon="fa fa-ban" v-else></base-button>
                                            </center>
                                         </template>
                                        <!-- <base-button v-on:click="addService(props.row.vbt_id)" class="w-25" size="sm" type="danger" icon="fa fa-ban" v-else></base-button> -->
                                    </vue-bootstrap4-table>
                                </vue-custom-scrollbar >
                            </tab-pane>

                            <tab-pane title="Profile">
                                <span slot="title">
                                    <i class="fa fa-box-open">
                                        Productos
                                    </i>
                                </span>

                                <vue-custom-scrollbar class="maxHeight">
                                    <div class="p-4">
                                        <base-button v-for="(data, index) in rowsItems" :key="data" v-on:click="itemsFunction(index,2)" class="col-12 mb-1" type="secondary">
                                            <div class="row">
                                                <div class="col-8">
                                                    <base-checkbox  class="float-left" v-model="itemsBox[index].check">{{data.product}}</base-checkbox>
                                                </div>
                                                <div class="col-4">
                                                    <badge v-if="itemsBox[index].count != ''" style="font-size:.8em !important" class="float-right text-default" type="success">{{itemsBox[index].count}} {{data.measure}}</badge>
                                                </div>
                                            </div>
                                        </base-button>
                                    </div>
                                    <!-- <vue-bootstrap4-table :rows="rowsItems" :columns="columnsItem" :classes="classes" :config="configLender" v-on:on-select-row="selectedItem" v-on:on-all-select-rows="selectedAllItem" v-on:on-unselect-row="unSelectedItem" v-on:on-all-unselect-rows="unSelectedAllItem" >
                                    </vue-bootstrap4-table> -->
                                </vue-custom-scrollbar > 
                            </tab-pane>
                        </tabs>
                        <div class="text-center">
                            
                            <base-button type="primary" class="my-4" v-on:click="editService">Editar</base-button>
                        </div>
                    </form>
                </template>
            </card>
        </modal>
        <a-config-provider :locale="es_ES">
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2>{{alertTable}}</h2>
                </div>
            </template>
            <a-table :columns="columns" :loading="serviceState" :data-source="services" :scroll="getScreen">
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
                
                <template slot="actionButtons" class="mx-auto" slot-scope="record, column">
                    <a-tooltip placement="left">
                        <template slot="title">
                        <span>Editar</span>
                        </template>
                        <base-button v-if="validRoute('servicios', 'editar')" icon="fa fa-edit" size="sm" type="default" class="text-center" v-on:click="dataEdit(column._id, column.employes, column.name, column.duration, column.discount, column.commission, column.price, column.products, column.category, column.branch, column.prepayment, column.additionalName)"></base-button>
                        <base-button v-else icon="fa fa-edit" size="sm" type="default" disabled class="text-center" ></base-button>
                    </a-tooltip>
    
                    <a-tooltip placement="leftBottom">
                        <template slot="title">
                        <span>Activar / Desactivar</span>
                        </template>
                        <template v-if="validRoute('servicios', 'activaciones')">
                            <base-button class="text-center" v-if="column.active" icon="ni ni-check-bold" size="sm" type="success" v-on:click="changeStatus(column._id)"></base-button>
                            <base-button class="text-center" v-else size="sm" type="danger" v-on:click="changeStatus(column._id)">
                                <a-icon type="close" style="vertical-align:1px;" />
                            </base-button> 
                
                        </template>
                        <template v-else>
                            <base-button class="text-center" v-if="column.active" icon="ni ni-check-bold" size="sm" type="success" disabled></base-button>
                            <base-button class="text-center" v-else icon="ni ni-fat-remove" size="sm" type="danger" disabled></base-button> 
                        </template>
                    </a-tooltip>

                    <a-tooltip placement="leftBottom">
                        <template slot="title">
                            <span>Eliminar</span>
                        </template>
                        <base-button v-if="validRoute('servicios', 'editar')" size="sm" type="danger" class="text-center" v-on:click="deleteService(column._id)">
                        <a-icon type="delete" style="vertical-align:1px;" />
                        </base-button>
                        <base-button v-else size="sm" type="danger" disabled class="text-center" >
                        <a-icon type="delete" style="vertical-align:1px;" /></base-button>
                    </a-tooltip>
                </template>
                <template slot="format-price" slot-scope="record, column">
                    {{formatPrice(column.price)}}
                </template>
                <template slot="format-time" slot-scope="record, column">
                    {{column.duration}}Min
                </template>
                <template slot="format-commission" slot-scope="record, column">
                    {{column.commission}}%
                </template>
                <template slot="prepayment-slot" slot-scope="record, column">
                    {{column.prepayment.ifPrepayment ? 'Si' : 'No'}}
                </template>
                <template slot="discount-slot" slot-scope="record, column">
                    {{!column.discount ? 'Si' : 'No'}}
                </template>
            </a-table>
        </a-config-provider> 
        <modal :show.sync="modals.modal3"
               :gradient="modals.type"
               modal-classes="modal-danger modal-dialog-centered">
            <div class="py-3 text-center">
                <i :class="modals.icon"></i>
                <h1 class="heading mt-5">{{modals.message}}</h1>
            </div>
        </modal>
        <modal :show.sync="modals.modal4"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-lg">
            <card type="secondary" shadow
                  header-classes="bg-white pb-2"
                  body-classes="px-lg-2 py-lg-3"
                  class="border-0">
                <template>
                    <div class="text-muted text-center mb-2">
                        <small>Cantidad</small>
                    </div>
                </template>
                <template>
                    <center>
                        <div class="row mx-auto">
                            <div class="col-7">
                                <base-input  alternative
                                    placeholder="Cantidad por uso"
                                    v-model="countModal"
                                    type="number"
                                    addon-left-icon="fa fa-list-ol">
                                </base-input>
                            </div>
                            <div class="col-5">
                                <base-input  alternative
                                    placeholder="Cantidad por uso"
                                    v-model="unitPerItem"
                                    class="pl-2"
                                    readonly
                                    >
                                </base-input>
                            </div>
                            <!-- <div class="col-5 text-center mt-2">
                                {{unitPerItem}}
                            </div> -->
                        </div>
                    </center>
                    <div class="text-center">
                        <base-button type="primary" v-on:click="selectedItem" class="my-1">Registrar</base-button>
                    </div>
                </template>
            </card>
        </modal>
        <modal :show.sync="modals.modal5"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-lg">
               <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
            <card type="secondary" shadow
                  header-classes="bg-white pb-2"
                  body-classes="px-lg-5 py-lg-3"
                  class="border-0">
                <template>
                    <div style="margin-top:-15% !important" class="text-muted text-center mb-3">
                       <h3>Categorías - {{this.branchName}}</h3> 
                    </div>
                </template>
                <template>
                    <vue-bootstrap4-table :rows="categories" :columns="columnsCategories" class="class_categories" :classes="classes" :config="configCategories">
                        <template slot="deleteCat" slot-scope="props">
                            <center>
                                <base-button class="text-center mr-2" size="sm" type="danger" v-on:click="deleteCategory(props.row._id)">
                                    <a-icon style="vertical-align:2px;font-weight:bold;" type="close" />
                                </base-button> 
                            </center>
                        </template>
                    </vue-bootstrap4-table>
                    <div class="row p-0 mt-2">
                        <div class="col-10 pr-5">
                            <base-input  
                                alternative
                                class="pl-1"
                                placeholder="Nombre de la categoría"
                                id="catFocus"
                                v-model="nameCategory"
                                addon-left-icon="fa fa-list-ol">
                            </base-input>
                        </div>
                        <div class="col-2">
                            <base-button type="success" class="float-right" :disabled="nameCategory != '' ? false : true" @click="newCategory">
                                Agregar
                            </base-button>
                        </div>
                    </div>
                </template>
            </card>
        </modal>
    </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import VueBootstrap4Table from 'vue-bootstrap4-table'
import router from '../router'
import EventBus from '../components/EventBus'
import jwtDecode from 'jwt-decode'

// COMPONENTS
import Modal from '@/components/Modal'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import mixinUserToken from '../mixins/mixinUserToken'

import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinUserToken, mixinES],
    components: {
        VueBootstrap4Table,
        Modal,
        vueCustomScrollbar
    },
    data(){
        return {
            auth: [],
            categoryRegister: 'Categoría',
            unitPerItem: '',
            countModal:'',
            typeItemModal:'',
            itemUses:'',
            serviceState: true,
            configHeader: {
                headers: {
                    "x-database-connect": endPoint.database, 
                    "x-access-token": localStorage.userToken
                }
            },
            payment: false,
            paymentAmount: 0,
            editPayment: false,
            editPaymentAmount: 0,
            alertTable: 'Selecciona un filtro en la parte superior',
            modals: {
                modal1: false,
                modal2: false,
                modal3: false,
                modal4: false,
                modal5: false,
                modal6: false,
                message: "",
                icon: '',
                type:''
            },
            nameCategory: '',
            categories: [],
            serviceRegister: '',
            serviceAditionalRegister: '',
            priceRegister: 0,
            comissionRegister: '',
            timeHoursRegister: 'Horas',
            timeMinutesRegister: 'Minutos',
            services: [],
            editTimeHoursRegister: '',
            editTimeMinutesRegister: '',
            columnsLender: [
                {
                    label: "Nombre",
                    name: "firstName",
                    // filter: {
                    //     type: "simple",
                    //     placeholder: "id"
                    // },
                    sort: true,
                },
                {
                    label: "Acciones",
                    name: "valid",
                    slot_name:"validationnnn",
                    sort: false,
                }
            ],
            columnsItem: [{
                label: "Nombre",
                name: "producto",
                // filter: {
                //     type: "simple",
                //     placeholder: "id"
                // },
                sort: true,
            }],
            columnsCategories: [
                {
                    label: "Nombre",
                    name: "name",
                    sort: true,
                },
                {
                    label: "Borrar",
                    name: "name",
                    slot_name: "deleteCat",
                    sort: false,
                },
            ],
            columns: [
                {
                    title: 'Nombre',
                    dataIndex: 'name',
                    key: 'name',
                    width: '30%',
                    scopedSlots: {
                        filterDropdown: 'filterDropdown',
                        filterIcon: 'filterIcon',
                        customRender: 'forName',
                    },
                    onFilter: (value, record) =>
                        record.name
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
                    title: 'Costo',
                    dataIndex: 'price',
                    key: 'price',
                    ellipsis: true,
                    scopedSlots: { customRender: 'format-price' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.price - b.price
                },
                {
                    title: 'Duración',
                    dataIndex: 'duration',
                    key: 'duration',
                    scopedSlots: { customRender: 'format-time' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.duration - b.duration,
                    ellipsis: true,
                },
                {
                    title: 'Comisión',
                    dataIndex: 'commission',
                    key: 'commission',
                    scopedSlots: { customRender: 'format-commission' },
                    ellipsis: true,
                },
                {
                    title: 'Abono',
                    dataIndex: 'prepayment',
                    key: 'prepayment',
                    scopedSlots: { customRender: 'prepayment-slot' },
                    defaultSortOrder: 'descend',
                    sorter: (a, b) => a.duration - b.duration,
                    ellipsis: true,
                },
                {
                    title: 'Descuento',
                    dataIndex: 'discount',
                    key: 'discount',
                    scopedSlots: { customRender: 'discount-slot' },
                    ellipsis: true,
                },
                {
                    title: 'Acciones',
                    dataIndex: '_id',
                    width: '15%',
                    key: '_id',
                    scopedSlots: { customRender: 'actionButtons' },
                    ellipsis: true,
                }
            ],
            config: {
                card_title: "Tabla de servicios",
                checkbox_rows: false,
                rows_selectable : true,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                rows_selectable: true,
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                global_search: {
                    placeholder: "Enter custom Search text",
                    visibility: false,
                    case_sensitive: false
                },
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: true,
                preservePageOnDataChange : true,
                pagination_info : true
            },
            configCategories: {
                card_title: "",
                checkbox_rows: false,
                rows_selectable : false,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                rows_selectable: false,
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                global_search: {
                    placeholder: "Enter custom Search text",
                    visibility: false,
                    case_sensitive: false
                },
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: false,
                preservePageOnDataChange : false,
                pagination_info : false,
                pagination: false
            },
            configLender: {
                checkbox_rows: false,
                rows_selectable : false,
                highlight_row_hover_color:"rgba(238, 238, 238, 0.623)",
                rows_selectable: true,
                per_page_options: [5, 10, 20, 30, 40, 50, 80, 100],
                show_refresh_button: false,
                show_reset_button: false,  
                selected_rows_info: false,
                preservePageOnDataChange : false,
                pagination_info : false,
                pagination: false,
                global_search: {
                    placeholder: "Busque el prestador",
                    visibility: true,
                    case_sensitive: false,
                    showClearButton: true,
                    searchOnPressEnter: false,
                    searchDebounceRate: 200,                      
                },
            },
            classes: {
                table: "table-bordered table-striped"
            },
            lenders: [],
            lenderSelecteds: [],
            addDiscount: false,
            idServiceEdit: '',
            EditlenderSelecteds: [],
            serviceEdit: '',
            servicesAdditionalEdit: '',
            priceEdit: 0,
            comissionEdit: 0,
            timeEdit: '',
            addDiscountEdit: '',
            prueba:'false',
            rowsItems:[],
            itemSelected:[],
            EdititemSelected:[],
            itemsBox:[],
            itemIndex:'',
            editCategoryServicer:'',
            branch: '',
            branchName: '',
            branches: [],
            branchRegister: '',
            branchEdit: '',
            searchText: '',
            searchInput: null,
            searchedColumn: '',
            status: 0
        }
    },
    created(){
        this.getToken()
        this.getBranch()
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
            this.branch = decoded.branch
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
        checkPayment(){
            this.payment = this.payment ? false : true
        },
        checkPaymentEdit(){
            this.editPayment = this.editPayment ? false : true
        },
        getBranch(){
            this.branchName = localStorage.branchName  
            this.branch = localStorage.branch
            this.getServices()
            this.getEmployes()
            this.getProducts()
            this.getCategories()
        },
        validCreate(){
            if (this.categories.length == 0) {
                this.$swal({
					icon: 'error',
					title: 'Registra una categoría',
                    text: 'Debes registrar una categoría para continuar',
					showConfirmButton: true
				})
            }else{
                this.modals.modal1 = true
            }
        },
        deleteService(id){
            this.$swal({
				title: '¿Eliminar servicio?',
				text: '¡Recuerda! no se puede revertir esta acción',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Sí',
				cancelButtonText: 'No, cancelar',
				showCloseButton: true,
				showLoaderOnConfirm: true
			}).then((result) => {
                if (result.value) {
                    axios.delete(endPoint.endpointTarget+'/services/'+id, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'ok') {
                            this.getServices()
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
                    this.$swal({
                        icon: 'info',
                        title: 'acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        async getServices(){
            this.serviceState = true
            try {
                const services = await axios.get(endPoint.endpointTarget+'/services/'+this.branch, this.configHeader)
                if (services.data.status == 'ok') {
                    this.services = services.data.data   
                    this.serviceState = false
                }else{
                    this.services = []
                    this.serviceState = false
                    this.alertTable = 'Sucursal sin servicios creados'
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
        async getProducts() {
            try {
                const inventory = await axios.get(endPoint.endpointTarget+'/stores/getinventorybybranchforservice/'+this.branch, this.configHeader)
                if (inventory.data.status == 'ok') {
                    this.rowsItems = inventory.data.data 
                    for (let index = 0; index < this.rowsItems.length; index++) {
                        this.itemsBox.push({check: false, count: '', id:this.rowsItems[index]._id})
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
        formatPrice(value) {
            let val = (value/1).toFixed(2).replace('.', ',')
            return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        },
        async getEmployes(){
            try {
                const employes = await axios.get(endPoint.endpointTarget+'/employes/employesbybranch/'+this.branch, this.configHeader)
                if(employes.data.status == 'ok'){
                    for (let index = 0; index < employes.data.data.length; index++) {
                        employes.data.data[index].valid = false
                    }
                    this.lenders = employes.data.data
                }else{
                    this.lenders = []
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
        selectedAll(value){
            for (let index = 0; index < value.selected_items.length; index++) {
                this.lenderSelecteds.push(value.selected_items[index]._id)
                this.EditlenderSelecteds.push({id: value.selected_items[index]._id, name: value.selected_items[index].firstName+' '+value.selected_items[index].lastName, class: value.selected_items[index].class, days: value.selected_items[index].days})
            }
        },
        unSelectedAll(value){
            this.lenderSelecteds = []
            this.EditlenderSelecteds = []
        },
        selectedItem(value){
            if (this.countModal != '') {
                this.itemsBox[this.itemIndex].check = true
                this.itemsBox[this.itemIndex].count = this.countModal
                if (this.typeItemModal == 1) {
                    this.itemSelected.push({id:this.rowsItems[this.itemIndex]._id,count:this.itemsBox[this.itemIndex].count, name:this.rowsItems[this.itemIndex].product})
                }
                if (this.typeItemModal == 2) {
                    this.EdititemSelected.push({id:this.rowsItems[this.itemIndex]._id,count:this.itemsBox[this.itemIndex].count, name:this.rowsItems[this.itemIndex].product})
                }
                this.$swal({
                    type: 'success',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    title: 'Ingreso producto',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.modals.modal4 = false
            }
            else{
                this.$swal({
                    icon: 'error',
                    title: 'Debe rellenar los datos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        },
        unSelectedItem(value){
            for (let i = 0; i < this.itemSelected.length; i++) {
                if (this.itemSelected[i] == value.unselected_item._id) {
                    this.itemSelected.splice(i, 1)
                    break
                }
            }
            for (let i = 0; i < this.EdititemSelected.length; i++) {
                if (this.EdititemSelected[i] == value.unselected_item._id) {
                    this.EdititemSelected.splice(i, 1)
                    break
                }
            }
        },
        
        selectedAllItem(value){
            for (let index = 0; index < value.selected_items.length; index++) {
                this.itemSelected.push(value.selected_items[index]._id)
                this.EdititemSelected.push(value.selected_items[index]._id)
            }
        },
        unSelectedAllItem(value){
            this.itemSelected = []
            this.EdititemSelected = []
        },
        registerService(){
            var timeService = 0 
            if (this.timeHoursRegister != 'Horas' && this.timeMinutesRegister != 'Minutos') {
                if (this.timeHoursRegister.includes('hr')) {
                    this.timeHoursRegister = this.timeHoursRegister.split(' ')[0]
                }
                if (this.timeMinutesRegister.includes('min')) {
                    this.timeMinutesRegister = this.timeMinutesRegister.split(' ')[0]
                }
                timeService = (this.timeHoursRegister * 60) + parseFloat(this.timeMinutesRegister)
            }
            if (this.serviceRegister == '' || this.priceRegister == 0 || timeService == 0 || this.comissionRegister == '' || this.categoryRegister == 'Categoría') {
                if (this.categoryRegister == 'Categoría') {
                    this.$swal({
                        icon: 'info',
                        title: 'Seleccione categoría',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if(this.priceRegister == 0){
                    this.$swal({
                        icon: 'info',
                        title: 'Debe registrar precio',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if(this.serviceRegister == ''){
                    this.$swal({
                        icon: 'info',
                        title: 'Debe llenar datos en blanco',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else if(timeService == 0){
                    this.$swal({
                        icon: 'info',
                        title: 'Debe completar horas y minutos',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else if(this.paymentAmount > this.priceRegister){
                this.$swal({
                    icon: 'info',
                    title: 'Monto de abono no valido',
                    text: 'El monto de abono no debe superar el precio del servicio',
                    showConfirmButton: true
                })
            }else{
                if (this.lenderSelecteds.length == 0) {
                    this.$swal({
                        icon: 'info',
                        title: 'Debe seleccionar un empleado',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    axios.post(endPoint.endpointTarget+'/services', {
                        branch: this.branch,
                        name: this.serviceRegister,
                        additionalName: this.serviceAditionalRegister,
                        price: this.priceRegister,
                        commission: this.comissionRegister,
                        duration: timeService,
                        employes: this.lenderSelecteds,
                        products:this.itemSelected,
                        category: this.categoryRegister,
                        discount: this.addDiscount,
                        prepayment: this.payment,
                        prepaymentAmount: this.paymentAmount,
                    }, this.configHeader).then(res => {
                        if (res.data.status == 'ok') {
                            this.$swal({
                                icon: 'success',
                                title: 'Servicios creados',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.initialState()
                            this.getServices()
                            EventBus.$emit('reloadServices', 'reload')
                        }else{
                            this.$swal({
                                icon: 'error',
                                title: 'El servicio ya existe',
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
                }
            }
        },
        initialState(){
            this.serviceRegister = ''
            this.priceRegister = 0
            this.comissionRegister = ''
            this.serviceAditionalRegister = ''
            this.timeRegister = 'Seleccione el tiempo'
            this.lenderSelecteds = []
            this.payment = false
            this.paymentAmount = 0
            this.addDiscount = false
            this.modals.modal1 = false
            $('.maxHeight  thead .vbt-checkbox').click()
            $('.maxHeight  thead .vbt-checkbox').prop('checked', false)
        },
        selected(value, id){
            this.lenders[id - 1].valid = true
            console.log(value)
            this.lenderSelecteds.push({id: value._id, name: value.firstName+' '+value.lastName, class: value.class, days: value.days, img: value.users ? value.users.userImage : 'no', validOnline: value.validOnline})
            this.EditlenderSelecteds.push({id: value._id, name: value.firstName+' '+value.lastName, class: value.class, days: value.days, img: value.users ? value.users.userImage : 'no', validOnline: value.validOnline})
        },
        unSelected(value, id){
            this.lenders[id - 1].valid = false
            for (let i = 0; i < this.lenderSelecteds.length; i++) {
                if (this.lenderSelecteds[i].id == value) {
                    this.lenderSelecteds.splice(i, 1)
                    break
                }
            }
            for (let i = 0; i < this.EditlenderSelecteds.length; i++) {
                if (this.EditlenderSelecteds[i].id == value) {
                    this.EditlenderSelecteds.splice(i, 1)
                    break
                }
            }
        },
        dataEdit(id, lenders, name, time, discount, comission, price, items, category, branch, prepayment,additionalName){
            this.itemsBox.forEach(element => {
                element.check = false
                element.count = ''
            });
            for (let i = 0; i < items.length; i++) {
                const element = items[i];
                for (let index = 0; index < this.itemsBox.length; index++) {
                    if (element.id == this.itemsBox[index].id) {
                        this.itemsBox[index].check = true
                        this.itemsBox[index].count = element.count
                    }
                }
            }
            if (prepayment) {
                this.editPayment = prepayment.ifPrepayment
                this.editPaymentAmount = prepayment.amount
            }else{
                this.editPayment = false
                this.editPaymentAmount = 0
            }
            this.EditlenderSelecteds = []
            this.EdititemSelected = []
            const discountFinal = discount ? false : true
            this.idServiceEdit = id
            this.EditlenderSelecteds = lenders
            this.EdititemSelected = items
            this.serviceEdit = name
            this.servicesAdditionalEdit = additionalName
            this.branchEdit = branch
            this.priceEdit = price
            this.editCategoryServicer = category
            this.comissionEdit = comission
            this.editTimeHoursRegister = parseInt(time / 60) + ' hr'
            this.editTimeMinutesRegister = time - (parseInt(time / 60) * 60 )  + ' min'
            this.addDiscountEdit = discount
            this.modals.modal2 = true
            this.EditlenderSelecteds = []
            for (let index = 0; index < this.lenders.length; index++) {
                const element = this.lenders[index];
                this.lenders[index].valid = false
                for (let j = 0; j < lenders.length; j++) {
                    const elementTwo = lenders[j];
                    if (elementTwo.id == element._id) {
                        this.EditlenderSelecteds.push({id: element._id, name: element.firstName+' '+element.lastName, class: element.class, days: element.days, img: element.users ? element.users.userImage : ''})
                        this.lenders[index].valid = true
                    }
                }
            }
        },
        clean(){
            this.categoryRegister = 'Categoría'
            this.timeHoursRegister = 'Horas',
            this.timeMinutesRegister = 'Minutos',
            this.itemsBox.forEach(element => {
                element.check = false
                element.count = ''
            });
            this.lenderSelecteds = []
            this.EditlenderSelecteds = []
            for (let index = 0; index < this.lenders.length; index++) {
                const element = this.lenders[index];
                element.valid = false
            }
        },
        editService(){
            var timeService = 0 
            if (this.editTimeHoursRegister.includes('hr')) {
                this.editTimeHoursRegister = this.editTimeHoursRegister.split(' ')[0]
            }
            if (this.editTimeMinutesRegister.includes('min')) {
                this.editTimeMinutesRegister = this.editTimeMinutesRegister.split(' ')[0]
            }
            timeService = (this.editTimeHoursRegister * 60) + parseFloat(this.editTimeMinutesRegister)
            if (this.serviceEdit == '' || this.priceEdit == '' || timeService <= 0 || this.comissionEdit < 0) {
                console.log(this.serviceEdit + ' - '+ this.priceEdit +' - '+ timeService +' - '+ this.comissionEdit)
                this.$swal({
                    icon: 'error',
                    title: 'Debe rellenar los datos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }else if(this.editPaymentAmount > this.priceEdit){
                this.$swal({
                    icon: 'info',
                    title: 'Monto de abono no valido',
                    text: 'El monto de abono no debe superar el precio del servicio',
                    showConfirmButton: true
                })
            }else{
                if (this.EditlenderSelecteds.length == 0) {
                    this.$swal({
                        icon: 'error',
                        title: 'Debe seleccionar almenos un prestador',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }else{
                    var ifCheck = this.addDiscountEdit ? false : true
					const id = this.idServiceEdit
					axios.put(endPoint.endpointTarget+'/services/'+id, {
                        branch: this.branch,
                        name: this.serviceEdit,
                        additionalName: this.servicesAdditionalEdit,
                        price: this.priceEdit,
                        commission: this.comissionEdit,
                        duration: timeService,
                        employes: this.EditlenderSelecteds,
                        products:this.EdititemSelected,
                        category: this.editCategoryServicer,
                        discount: this.addDiscountEdit,
                        prepayment: this.editPayment,
                        prepaymentAmount: this.editPaymentAmount
					}, this.configHeader).then(res => {
                        if (res.data.status == 'ok') {
                            this.$swal({
                                icon: 'success',
                                title: 'Servicio actualizado',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.modals.modal2 = false
                            this.getServices();
                            EventBus.$emit('reloadServices', 'reload')
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
        changeStatus(id){
            axios.put(endPoint.endpointTarget+'/services/changeActive/'+id, {
                id: id
            }, this.configHeader)
            .then(res => {
                this.getServices();
                
                // this.emitMethod()
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
        itemsFunction(i,e){
            setTimeout(() => {
                if (this.itemsBox[i].count == '') {
                    if (this.itemsBox[i].check) {
                        this.itemsBox[i].check = false
                    }
                    this.typeItemModal = e
                    this.countModal = ''
                    this.modals.modal4 = true
                    this.itemIndex = i
                    this.unitPerItem = this.rowsItems[i].measure
                }
                else{
                    this.$swal({
                        title: '¿Está seguro que desea eliminar este producto del servicio?',
                        type: 'warning',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Estoy seguro',
                        cancelButtonText: 'No, evitar acción',
                        showCloseButton: true,
                        showLoaderOnConfirm: true
                    }).then((result) => {
                        if(result.value) {
                            this.itemsBox[i].count = ''
                            this.itemsBox[i].check = false
                            for (let e = 0; e < this.itemSelected.length;e++) {
                                if (this.itemSelected[e].id == this.rowsItems[i]._id) {
                                    this.itemSelected.splice(e, 1)
                                    break
                                }
                            }
                            for (let e = 0; e < this.EdititemSelected.length; e++) {
                                if (this.EdititemSelected[e].id == this.rowsItems[i]._id) {
                                    this.EdititemSelected.splice(e, 1)
                                    break
                                }
                            }
                        }
                        else{
                            this.itemsBox[i].check = true
                            this.$swal({
                                type: 'error',
                                icon: 'error',
                                title: 'Acción cancelada',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                }
            }, 200);
            
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
        newCategory(){
            axios.post(endPoint.endpointTarget+'/services/newCategory', {
                branch: this.branch,
                name: this.nameCategory
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    this.getCategories()
                    this.nameCategory = ''
                    document.getElementById("catFocus").focus()
                    this.modals.modal6 = false
                }else{
                    this.nameCategory = ''
                     this.$swal({
                        icon: 'info',
                        title: 'Esta categoría ya esta creada',
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
        deleteCategory(id){
            axios.delete(endPoint.endpointTarget+'/services/deleteCategory/'+id, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    this.getCategories()
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
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 'auto' }
        }
    },
    mounted() {
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
    }
}
</script>
<style>
    .maxHeight{
        max-height: 300px;
        overflow: scroll;
    }
    .vbt-table-tools th{
        padding: 5px !important;
        max-height: 20px !important;
        overflow: hidden !important;
    }
    .vbt-table-tools th div .col-md-8{
        display:none !important;
    }
    .vbt-table-tools th div .col-md-4{
        flex: 0 0 100%; 
        max-width: 100%;
    }
    .vbt-table-tools th div .col-md-4 .no-gutters .col-md-6{
        display:none;
    }
    .vbt-table-tools th div .col-md-4 .no-gutters .vbt-global-search{
        display:block !important;
        flex: 0 0 100%; 
        max-width: 100%;
    }
    .vbt-table-tools th div .col-md-4 .no-gutters .vbt-global-search .form-group{
        margin-bottom: 2px !important;
    }
    .vbt-table-tools th div .col-md-4 .no-gutters .vbt-global-search .form-group input{
       border-left: 1px solid #cad1d7;
       padding-left: 5px;
    }
    .maxHeight .card .card-header{
        display:none ;
    }
    .maxHeight .table td {
        padding: 5px;
        padding-bottom: 5px;
    }
    .card-header{
        font-size: 2.5vw;
    }
    .class_categories .card-header{
        display: none;
    }
    .class_categories .card-footer{
        display: none;
    }
</style>