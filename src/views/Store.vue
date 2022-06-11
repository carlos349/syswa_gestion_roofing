<template>
  <div>
    <base-header class="header pb-4 pt-2 pt-lg-4 d-flex align-items-center" style="min-height: 50px; background-image: url(img/theme/store.png); background-size: cover; background-position: center 70%;">
        <!-- Mask -->
        <span style="background-color:#172b4d !important" class="mask  opacity-7"></span>
        <!-- Header container -->
        <div class="row">
            <div class="col-12">
                <div class="text-absolute">
                    <p class="mb-0 display-2 text-white">Bodega</p>
                    <p class="text-white">Total STOCK - {{totalStock | formatPrice}}</p>
                </div>
                <base-button class="float-right mt-7 mr-0" :disabled="validRoute('bodega', 'cierre_bodega') ? false : true" size="sm" @click="modals.modal4 = true" type="warning">
                    <i class="fa fa-archive mr-2" style="vertical-align:1px;font-size:1.2em;"></i>
                    Cerrar bodega
                </base-button>
                <base-button :disabled="validRoute('bodega', 'registrar_proveedores') ? false : true" class="float-right mt-7 mr-2" size="sm" @click="modals.modal3 = true, providerSup.typeProvider = 'Registrar', initialState(2)" type="primary">
                    <a-icon type="shopping-cart" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    Proveedores
                </base-button>
                <base-button :disabled="validRoute('bodega', 'gestion_sucursales') ? false : true" class="float-right mt-7 mr-2" size="sm" @click="modalAdminProduct.modal1 = true,selectLoad()
                productForBranch = ''" type="success">
                    <a-icon type="shop" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    Sucursales
                </base-button>
                <base-button :disabled="validRoute('bodega', 'registrar_producto') ? false : true" class="float-right mt-7 mr-2" size="sm" @click="modals.modal1 = true ,validForm = 1, initialState(3)" type="success">
                    <a-icon type="form" class="mr-2" style="vertical-align:1px;font-size:1.2em;" />
                    Registrar
                </base-button>
            </div>
        </div>
    </base-header>
    <tabs fill class="flex-column flex-md-row inventory inventoryTabs">
        <card shadow>
            <tab-pane>
                <span class="p-2" slot="title">
                    <i class="fa fa-box-open"></i>
                    Tabla de productos
                </span>
                <template>
                    <div class="p-2">
                        <a-config-provider :locale="es_ES">
                            <template #renderEmpty>
                                <div style="text-align: center">
                                    <a-icon type="warning" style="font-size: 20px" />
                                    <h2>No hay ningún producto registrado</h2>
                                </div>
                            </template>
                            <a-table :columns="columns" :loading="productState" :data-source="products" :scroll="getScreen">
                                <div
                                slot="filterDropdown"
                                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                                style="padding: 8px"
                                >
                                <a-input
                                    v-ant-ref="c => (searchInput = c)"
                                    :placeholder="`Buscar por ${column.title.toLowerCase()}`"
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
                                    Restablecer
                                </a-button>
                                </div>
                                <a-icon
                                    slot="filterIcon"
                                    slot-scope="filtered"
                                    type="search"
                                    :style="{ color: filtered ? '#108ee9' : undefined }"
                                />
                                <template slot="total" slot-scope="record,column">
                                  <span class="text-danger" v-if="(parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume) < column.alertTotal">
                                    {{(parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume)}}
                                    <a-tooltip placement="topLeft">
                                        <template slot="title">
                                            <span>Bajo en stock</span>
                                        </template>
                                        <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.1em;font-size:1.1em" type="exclamation-circle" />
                                    </a-tooltip>
                                  </span>
                                  <span v-else>
                                    {{(parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume)}}
                                  </span>
                                    
                                </template>
                                <template slot="price" slot-scope="record">
                                    {{formatPrice(record)}}
                                </template>
                                <template slot="actions" slot-scope="record, column">
                                    <b>
                                        <a-tooltip placement="top">
                                            <template slot="title">
                                            <span>Anexar productos</span>
                                            </template>
                                            <base-button :disabled="validRoute('bodega', 'anexar_productos') ? false : true" title="Compras" size="sm" type="success" @click="modals.modal1 = true, validForm = 3, dataProduct.entry = '', dataProduct.measure = column.measure, dataProduct.product = column.product,initialState(1,column._id)" icon="fa fa-plus"></base-button>
                                        </a-tooltip>

                                        <a-tooltip placement="top">
                                            <template slot="title">
                                                <span>Editar producto</span>
                                            </template>
                                            <base-button :disabled="validRoute('bodega', 'editar_producto') ? false : true" title="Editar producto" size="sm" type="default" icon="fa fa-edit" @click="pushDataProduct(column.product,column.measure,column.price, column.alertTotal, column._id)"></base-button>
                                        </a-tooltip>  

                                        <a-tooltip placement="top">
                                            <template slot="title">
                                            <span>Eliminar</span>
                                            </template>
                                            <base-button :disabled="validRoute('bodega', 'eliminar_producto') ? false : true" title="Eliminar" size="sm" type="danger" @click="deleteItem(column._id)" icon="fa fa-trash"></base-button>
                                        </a-tooltip> 
                                    </b>
                                </template>
                            </a-table>
                        </a-config-provider>    
                    </div>
                </template>
            </tab-pane>

            <tab-pane title="Profile">
                <span id="provedorBtn" slot="title">
                    <i class="fa fa-user-tie"></i>
                    Tabla de provedores
                </span>
                <template>
                    <div class="p-2">
                        <a-config-provider :locale="es_ES">
                            <template #renderEmpty>
                                <div style="text-align: center">
                                    <a-icon type="warning" style="font-size: 20px" />
                                    <h2>No hay ningún provedor registrado</h2>
                                </div>
                            </template>
                            <a-table :columns="columnsProviders" :loading="productState" :data-source="providerTable" :scroll="getScreen">
                                <div
                                slot="filterDropdown"
                                slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                                style="padding: 8px"
                                >
                                <a-input
                                    v-ant-ref="c => (searchInput = c)"
                                    :placeholder="`Buscar por ${column.title.toLowerCase()}`"
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
                                    Restablecer
                                </a-button>
                                </div>
                                <a-icon
                                    slot="filterIcon"
                                    slot-scope="filtered"
                                    type="search"
                                    :style="{ color: filtered ? '#108ee9' : undefined }"
                                />
                                <template slot="actions" slot-scope="record, column">
                                    <b>
                                        <a-tooltip placement="top">
                                          <template slot="title">
                                            <span>Editar</span>
                                          </template>
                                          <base-button :disabled="validRoute('bodega', 'editar_proveedor') ? false : true" size="sm" type="default" @click="modals.modal3 = true, providerSup.typeProvider = 'Editar', pushDataProvider(column.name, column.document, column.contact,column.contactPlus,column.location,column._id)" icon="fas fa-edit"></base-button>
                                        </a-tooltip>

                                        <a-tooltip placement="top">
                                            <template slot="title">
                                            <span>Eliminar</span>
                                            </template>
                                            <base-button :disabled="validRoute('bodega', 'eliminar_proveedor') ? false : true" size="sm" type="danger" @click="deleteProvider(column._id)" icon="fa fa-trash"></base-button>
                                        </a-tooltip> 
                                    </b>
                                </template>
                            </a-table>
                        </a-config-provider>    
                    </div>
                </template>
            </tab-pane>

            <tab-pane>
                <span slot="title">
                  <i class="ni ni-calendar-grid-58"></i>
                  Historial
                </span>
                <tabs fill class="flex-column flex-md-row">
                    <card shadow>
                        <tab-pane>
                            <span slot="title">
                                <i class="fa fa-money-check-alt"></i>
                                Historial de compras y abastecimientos
                            </span>
                            <template>
                              <div class="p-2">
                                  <a-config-provider :locale="es_ES">
                                      <template #renderEmpty>
                                          <div style="text-align: center">
                                              <a-icon type="warning" style="font-size: 20px" />
                                              <h2>{{messageHistory}}</h2>
                                          </div>
                                      </template>
                                      <a-table :columns="columnsHistory" :loading="productState" :data-source="dataHistory" :scroll="getScreen">
                                          <div
                                          slot="filterDropdown"
                                          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                                          style="padding: 8px"
                                          >
                                          <a-input
                                              v-ant-ref="c => (searchInput = c)"
                                              :placeholder="`Buscar por ${column.title.toLowerCase()}`"
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
                                              Restablecer
                                          </a-button>
                                          </div>
                                          <a-icon
                                              slot="filterIcon"
                                              slot-scope="filtered"
                                              type="search"
                                              :style="{ color: filtered ? '#108ee9' : undefined }"
                                          />
                                          <template slot="date" slot-scope="record">
                                              {{formatDate(record)}}
                                          </template>
                                          <template slot="price" slot-scope="record">
                                              {{formatPrice(record)}}
                                          </template>
                                          <template slot="priceTotal" slot-scope="record, column">
                                              <span v-if="record == 'Abastecimiento' ">No aplica</span>
                                              <span v-else-if="record == 'Devolución' ">No aplica</span>
                                              <span v-else-if="record == 'Descartamiento' ">No aplica</span>
                                              <span v-else>{{formatPrice(record * column.entry)}}</span>
                                          </template>
                                          
                                      </a-table>
                                  </a-config-provider>    
                              </div>
                          </template>
                        </tab-pane>

                        <tab-pane title="Profile">
                            <span slot="title">
                                <i class="fa fa-file-contract"></i>
                                Historial de cierres
                            </span>
                            <template>
                              <div class="p-2">
                                  <a-config-provider :locale="es_ES">
                                      <template #renderEmpty>
                                          <div style="text-align: center">
                                              <a-icon type="warning" style="font-size: 20px" />
                                              <h2>{{messageHistory}}</h2>
                                          </div>
                                      </template>
                                      <a-table :columns="columnsHistoryClosed" :loading="productState" :data-source="dataHistoryClosed" :scroll="getScreen">
                                          <div
                                          slot="filterDropdown"
                                          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                                          style="padding: 8px"
                                          >
                                          <a-input
                                              v-ant-ref="c => (searchInput = c)"
                                              :placeholder="`Buscar por ${column.title.toLowerCase()}`"
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
                                              Restablecer
                                          </a-button>
                                          </div>
                                          <a-icon
                                              slot="filterIcon"
                                              slot-scope="filtered"
                                              type="search"
                                              :style="{ color: filtered ? '#108ee9' : undefined }"
                                          />
                                          <template slot="date" slot-scope="record">
                                              {{formatDate(record)}}
                                          </template>
                                          <template slot="user" slot-scope="record">
                                              {{record.email}}
                                          </template>
                                          <template slot="report" slot-scope="record, column">
                                            <a-tooltip placement="top">
                                              <template slot="title">
                                                <span>Ver informe</span>
                                              </template>
                                              <base-button size="sm" type="default" @click="modals.modal5 = true ,validForm = 2, dataHistoryClosedReport = column.products, dateReport = column.createdAt" icon="ni ni-bullet-list-67"></base-button>
                                            </a-tooltip>
                                          </template>
                                      </a-table>
                                  </a-config-provider>    
                              </div>
                          </template>
                        </tab-pane>
                    </card>
                </tabs>
            </tab-pane>
        </card>
    </tabs>
    <modal :show.sync="modals.modal1"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
        <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
        <card type="secondary" shadow
              header-classes="bg-white pb-5"
              body-classes="px-lg-5 py-lg-5"
              class="border-0">
            <template>
            </template>
            <template>
                <div v-if="validForm != 3" style="margin-top:-30%" class="text-center text-muted mb-4">
                    <small>Datos del producto</small>
                </div>
                <div v-else style="margin-top:-30%" class="text-center text-muted mb-4">
                    <small>Anexa mas productos a {{dataProduct.product}}</small>
                </div>
                <form role="form">
                   <div class="row" v-if="validForm == 3">
                     <div class="col-7">
                        <base-input alternative
                            placeholder="Cantidad"
                            v-model="dataProduct.entry"
                            addon-left-icon="fa fa-box-open">
                        </base-input>
                      </div>
                      <div class="col-5 mt-2">
                        {{dataProduct.measure}}
                      </div>
                   </div>
                    
                    <base-input v-if="validForm == 3" addon-left-icon="ni ni-calendar-grid-58">
                        <flat-picker slot-scope="{focus, blur}"
                            @on-open="focus"
                            @on-close="blur"
                            :config="configDatePicker"
                            class="form-control datepicker"
                            v-model="dateAdd"
                            placeholder="Seleccione una fecha de compra">
                        </flat-picker>
                    </base-input>
                    
                    <base-input v-if="validForm != 3" alternative
                                class="mb-3"
                                placeholder="Nombre"
                                v-model="dataProduct.product"
                                addon-left-icon="fa fa-edit">
                    </base-input>
                    <select v-if="validForm != 3" class="form-control mb-3"  v-model="dataProduct.measure">
                      <option style="color:black;" selected value="">Seleccione el tipo de medida</option>
                      <option style="color:black;" value="Gramo(s)">Gramo(s)</option>
                      <option style="color:black;" value="Kilogramo(s)">Kilogramo(s)</option>
                      <option style="color:black;" value="Litro(s)">Litro(s)</option>
                      <option style="color:black;" value="Mililitro(s)">Mililitro(s)</option>
                      <option style="color:black;" value="Unidad">Unidad</option>
                    </select>
                    <base-input v-if="validForm == 1" alternative
                          placeholder="Numero para alerta"
                          v-on:keyup="verifyDecimal()"
                          v-model="dataProduct.alertTotal"
                          addon-left-icon="fa fa-bell">
                    </base-input>
                    <a-tooltip placement="right">
                        <template slot="title">
                        <span>Introduzca gasto total</span>
                        </template>
                        <currency-input
                            v-if="validForm != 1"
                            locale="de"
                            :placeholder="'Gasto total'"
                            addon-left-icon="ni ni-money-coins"
                            v-model="dataProduct.price"
                            class="form-control mb-3"
                            style="margin-top:-10px;"
                        />
                    </a-tooltip>
                    	
                    <base-button icon="fa fa-plus" @click="modals.modal3 = true, providerSup.typeProvider = 'Registrar', initialState(2)" v-if="validForm == 3" class="mb-2" size="sm" type="success">Registrar provedor</base-button>
                    <a-select class="input-group-alternative w-100 mb-4 mt-2" v-if="validForm == 3" default-value="Seleccione un provedor"   size="large">
                        <a-select-option v-for="provider of providers" :key="provider" @click="selectProviderForProduct(provider)" :value="provider">
                            {{provider}}
                        </a-select-option>
                    </a-select>
                    
                    <div class="text-center">
                        <base-button v-on:click="addProduct()" v-if="validForm == 1" :disabled="dataProduct.product != '' && dataProduct.measure != '' && dataProduct.alertTotal != '' ? false : true" type="default">Registrar</base-button>
                        <base-button v-on:click="updateProducts()" v-if="validForm == 2" type="default">Editar</base-button>
                        
                        <base-button  v-on:click="addMore(dataProduct.id)" :disabled="dataProduct.entry != '' && dataProduct.price != null && dateAdd != '' && dataProduct.price != '' && dataProduct.price != 0 && provider.name != '' ? false : true" v-if="validForm == 3" type="success">Agregar</base-button>
                    </div>
                </form>
            </template>
        </card>
    </modal>
    <modal :show.sync="modals.modal6"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
        <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
        <card type="secondary" shadow
              header-classes="bg-white pb-5"
              body-classes="px-lg-5 py-lg-5"
              class="border-0">
            <template>
                <div style="margin-top:-30%" class="text-center mb-4">
                    Editar producto
                </div>
                <form role="form">
                    <base-input alternative
                                class="mb-3"
                                placeholder="Nombre"
                                v-model="dataProduct.product"
                                addon-left-icon="fa fa-edit">
                    </base-input>
                    <select  class="form-control mb-3"  v-model="dataProduct.measure">
                      <option style="color:black;" selected value="">Seleccione el tipo de medida</option>
                      <option style="color:black;" value="Gramo(s)">Gramo(s)</option>
                      <option style="color:black;" value="Kilogramo(s)">Kilogramo(s)</option>
                      <option style="color:black;" value="Litro(s)">Litro(s)</option>
                      <option style="color:black;" value="Mililitro(s)">Mililitro(s)</option>
                      <option style="color:black;" value="Unidad">Unidad</option>
                    </select>
                    <base-input alternative
                          placeholder="Numero para alerta"
                          v-on:keyup="verifyDecimal()"
                          v-model="dataProduct.alertTotal"
                          addon-left-icon="fa fa-bell">
                    </base-input>
                    	
                </form>
            </template>
            <div class="text-center">
              <base-button v-on:click="editProduct()" :disabled="dataProduct.product != '' && dataProduct.measure != ''  && dataProduct.alertTotal != ''  ? false : true" type="default">Editar</base-button>
            </div>
        </card>
    </modal>
    <modal :show.sync="modals.modal3"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
        <h6 slot="header" class="modal-title p-0 m-0" id="modal-title-default"></h6>
        <card type="secondary" shadow
              header-classes="bg-white pb-5"
              body-classes="px-lg-5 py-lg-5"
              class="border-0">
            <template>
                <div style="margin-top:-30%" class="text-center text-muted mb-4">
                    <small>Datos del provedor</small>
                </div>
                <form role="form">
                    <base-input  alternative
                        placeholder="Nombre de la empresa"
                        v-model="provider.name"
                        v-on:keyup="validProviders()"
                        addon-left-icon="fa fa-user-tie"
                        addon-right-icon="fa fa-asterisk text-danger">
                    </base-input>
                    <base-input  alternative
                        placeholder="Datos de identificación"
                        v-model="provider.document"
                        v-on:keyup="formatRut(provider.document)"
                        addon-left-icon="fa fa-key"
                        addon-right-icon="fas fa-plus text-default">
                    </base-input>

                    <VuePhoneNumberInput v-model="provider.contact.formatNational"
                        class="mb-4"
                        @update="provider.contact = $event"
                        :default-phoner-number="provider.contact.nationalNumber"
                        :default-country-code="provider.contact.countryCode"
                        :translations="{
                        countrySelectorLabel: 'Código de país',
                        countrySelectorError: 'Elije un país',
                        phoneNumberLabel: 'Número de teléfono',
                        example: 'Ejemplo :'
                    }"/>
                    <base-input  alternative
                        placeholder="Correo"
                        v-model="provider.contactPlus"
                        addon-left-icon="fa fa-address-book"
                        addon-right-icon="fas fa-plus text-default">
                    </base-input>
                    <base-input  alternative
                        placeholder="Dirección de la empresa"
                        v-model="provider.location"
                        v-on:keyup="validProviders()"
                        addon-left-icon="fas fa-route"
                        addon-right-icon="fa fa-asterisk text-danger">
                    </base-input>
                </form>
            </template>
            <div class="text-center">
              <base-button v-on:click="providerFunction()"  :disabled="providerSup.validProvider" type="default">{{providerSup.typeProvider}}</base-button>
            </div>
        </card>
    </modal>
    <modal :show.sync="modals.modal4" modal-classes="modal-dialog-centered modal-lg">
      <h6 slot="header" class="modal-title" id="modal-title-default">Cierre de bodega</h6>
      <vue-custom-scrollbar style="height:30vh;overflow:hidden;overflow-x: hidden;overflow-y:hidden;">
        <div class="row p-2 m-2">
          <div class="col-6">
            Nombre del producto
          </div>
          <div class="col-6 text-left">
            Total real
          </div>
        </div> 
        <div v-for="(data, index) in products" :key="index" class="row p-2 m-2">
          <dt class="col-6 mt-2">{{data.product}}</dt>

          <base-input class="col-6" v-model="countProduct[index].count" :placeholder="'Ingrese cantidad en '+data.measure"></base-input>
        </div>
      </vue-custom-scrollbar> 
      
      <template slot="footer">
          <base-button v-on:click="closeStore" type="default">Cerrar inventario</base-button>
          <base-button type="link" class="ml-auto" @click="modals.modal4 = false">Salir
          </base-button>
      </template>
    </modal>
    <modal  modal-classes="modal-dialog-centered modal-xl" :show.sync="modals.modal5">
        <h4 slot="header" class="modal-title" id="modal-title-default">Informe de cierre</h4>
        <template>
            <div class="p-2">
                <a-config-provider :locale="es_ES">
                    <template #renderEmpty>
                        <div style="text-align: center">
                            <a-icon type="warning" style="font-size: 20px" />
                            <h2>{{messageHistory}}</h2>
                        </div>
                    </template>
                    <a-table :columns="columnsHistoryClosedReport" :loading="productState" :data-source="dataHistoryClosedReport" :scroll="getScreen">
                        <div
                        slot="filterDropdown"
                        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
                        style="padding: 8px"
                        >
                        <a-input
                            v-ant-ref="c => (searchInput = c)"
                            :placeholder="`Buscar por ${column.title.toLowerCase()}`"
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
                            Restablecer
                        </a-button>
                        </div>
                        <a-icon
                            slot="filterIcon"
                            slot-scope="filtered"
                            type="search"
                            :style="{ color: filtered ? '#108ee9' : undefined }"
                        />
                    </a-table>
                </a-config-provider>    
            </div>
        </template>

        <template slot="footer">
            
            <base-button type="default" class="ml-auto" @click="printExcel">
                Imprimir excel
            </base-button>
        </template>
    </modal>

    <modal  modal-classes="modal-dialog-centered modal-xl" :show.sync="modalAdminProduct.modal1">
        <h6 slot="header" class="modal-title" id="modal-title-default">Gestión de sucursales</h6>
        <div class="row mb-5">
            <div class="col-md-4 mx-auto">
                <a-select class="input-group-alternative w-100 mx-auto" show-search default-value="Seleccione una sucursal"  @change="selectEmploye" size="large">
                    <a-select-option v-for="branch of branches" :key="branch._id" v-if="branch.active" :value="branch.name" v-on:click="getInventoryByBranch(branch._id, branch.name)">
                        {{branch.name}}
                    </a-select-option>
                </a-select>
            </div>
            <div class="col-md-4 mx-auto">
                <a-select v-if="productsForBranch.length > 0" class="input-group-alternative w-100" default-value="Seleccione un producto" size="large">
                    <a-select-option v-for="product of productsForBranch" :key="product" :value="product.name" @click="selectProductForBranch(product.data)" :disabled="product.disabled">
                        {{product.name}}
                    </a-select-option>
                </a-select>
            </div>
            <div class="col-md-3 mx-auto">
                <base-button type="success" :disabled="productForBranch != '' ? false : true" class="mx-auto" @click="addProductToBranch">Agregar un producto
                </base-button>
            </div>
            
            
        </div>
        
        <a-empty v-if="branchDataValid == true">
            <span slot="description"> Selecciona una sucursal </span>
        </a-empty>
        <a-config-provider :locale="es_ES" v-else>
            <template #renderEmpty>
                <div style="text-align: center">
                    <a-icon type="warning" style="font-size: 20px" />
                    <h2>Esta sucursal no posee ningún producto</h2>
                </div>
            </template>
            <a-table :columns="columnsBranchData" :data-source="branchData" :scroll="getScreen">
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

                <template slot="actions" class="mx-auto" slot-scope="record, column">
                    <base-button size="sm" class=" mr-0" type="danger" @click="deleteProductByBranch(column)" icon="fa fa-trash"></base-button>
                    <base-button size="sm" class="ml-1" type="primary" @click="modalAdminProduct.modal4 = true, idForAlert = column._id, branchAlert = column.alertTotal" icon="ni ni-bell-55"></base-button>
                </template>
                <template slot="total" slot-scope="record,column">
                    <span class="text-danger" v-if="(parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume) < column.alertTotal">
                    {{(parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume)}}
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                            <span>Bajo en stock</span>
                        </template>
                        <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.1em;font-size:1.1em" type="exclamation-circle" />
                    </a-tooltip>
                    </span>
                    <span v-else>
                    {{(parseFloat(column.quantity) + parseFloat(column.entry)) - parseFloat(column.consume)}}
                    </span>
                    
                </template>
                <template slot="add" class="mx-auto" slot-scope="record, column, index">
                    
                    <base-button size="sm" class="float-right ml-2" type="success" :disabled="branchEntry[index].count > 0 ? false : true" @click="addToProductBranch(column._id, column.storeId, column.measure, index)" icon="fa fa-plus"></base-button>
                    <base-button size="sm" class="float-right ml-2" type="danger" :disabled="branchEntry[index].count > 0 ? false : true" @click="removeProductsBranch(column._id, column.storeId, index, column.measure, ((column.quantity + column.entry) - column.consume))" icon="fa fa-minus"></base-button>
                    <a-input
                        style="width: 65%"
                        :placeholder="'Cantidad'"
                        class="ml-auto float-right"
                        
                        v-model="branchEntry[index].count"
                    />
                </template>
                <template slot="format-date" slot-scope="record, column">
                    {{formatDate(column.createdAt)}}
                </template>
                <template slot="totalStore" slot-scope="record, column">
                    {{getQuantity(column.storeId)}}
                </template>
            </a-table>
        </a-config-provider>
        
        <!-- <base-button v-for="(branch, index) in branchData" :key="branch" class="col-12 mb-1" style="cursor:default" size="sm" type="secondary">
            <div class="row p-0">
                <div class="col-3 p-0">
                    <span style="vertical-align: -0.4em;" class="text-danger" v-if="(parseFloat(branch.quantity) + parseFloat(branch.entry)) - parseFloat(branch.consume) < branch.alertTotal">
                        {{branch.product}}
                        <a-tooltip placement="topLeft">
                            <template slot="title">
                                <span>Este producto necesita ser reabastecido.</span>
                            </template>
                            <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.1em;font-size:1.1em" type="exclamation-circle" />
                        </a-tooltip>
                    </span>
                    <span style="vertical-align: -0.4em;" v-else>
                        {{branch.product}}
                    </span>
                </div>
                <div v-if="branchEntry != []" class="col-10 row p-0">
                    <a-input
                        :placeholder="'Ingrese cantidad en '+branch.measure"
                        class="w-75 ml-auto float-right"
                        v-model="branchEntry[index].count"
                    />
                    <base-button size="sm" class="float-right ml-auto" type="success" @click="addToProductBranch(branch._id, branch.storeId, branch.measure, index)" icon="fa fa-plus"></base-button>
                    
                </div>
                
            </div>
        </base-button> -->
        <template slot="footer">
            <base-button type="link" class="ml-auto" @click="modalAdminProduct.modal1 = false">Cerrar
            </base-button>
        </template>
    </modal>
    <modal  modal-classes="modal-dialog-centered modal-lg" :show.sync="modalAdminProduct.modal2">
        <h6 slot="header" class="modal-title" id="modal-title-default">Gestionar productos de sucursal </h6>
        <a-empty v-if="branchData == 0">
            <span slot="description"> Selecciona una sucursal </span>
        </a-empty>
        <a-empty v-if="branchData == []">
            <span slot="description"> Esta sucursal no posee ningún producto registrado </span>
        </a-empty>
        <base-button v-for="(branch, index) in branchData" :key="branch" class="col-12 mb-1" style="cursor:default" size="sm" type="secondary">
            <div class="row p-0">
                <div class="col-5 p-0">
                    <base-button size="sm" class="float-left ml-2 mr-0" type="danger" @click="deleteProductByBranch(branch)" icon="fa fa-trash"></base-button>
                    <base-button size="sm" class="float-left ml-1" type="primary" @click="modalAdminProduct.modal4 = true, idForAlert = branch._id, branchAlert = branch.alertTotal" icon="ni ni-bell-55"></base-button>
                    <span style="vertical-align: -0.4em;" class="text-danger" v-if="(parseFloat(branch.quantity) + parseFloat(branch.entry)) - parseFloat(branch.consume) < branch.alertTotal">
                        {{branch.product}}
                        <a-tooltip placement="topLeft">
                            <template slot="title">
                                <span>Este producto necesita ser reabastecido.</span>
                            </template>
                            <a-icon class="ml-2" style="cursor: pointer;vertical-align: 0.1em;font-size:1.1em" type="exclamation-circle" />
                        </a-tooltip>
                    </span>
                    <span style="vertical-align: -0.4em;" v-else>
                        {{branch.product}}
                    </span>
                </div>
                <div v-if="branchEntry != []" class="col-7 row p-0">
                    <a-input
                        :placeholder="'Ingrese cantidad en '+branch.measure"
                        class="w-75 ml-auto float-right"
                        v-model="branchEntry[index].count"
                    />
                    <base-button size="sm" class="float-right ml-auto" type="success" @click="addToProductBranch(branch._id, branch.storeId, branch.measure, index)" icon="fa fa-plus"></base-button>
                </div>
            </div>
        </base-button>
        <template slot="footer">
            <base-button type="success" class="ml-auto" @click="modalAdminProduct.modal3 = true, selectLoad()">Agregar un producto
            </base-button>
            <base-button type="link" class="mr-auto" @click="modalAdminProduct.modal2 = false">Cerrar
            </base-button>
        </template>
    </modal>
    <modal  modal-classes="modal-dialog-centered modal-lg" :show.sync="modalAdminProduct.modal3">
        <h6 slot="header" class="modal-title" id="modal-title-default">Gestionar productos de sucursal </h6>
        <a-empty v-if="productsForBranch.length == 0">
            <span slot="description"> No existen productos en la bodega </span>
        </a-empty>
        <a-select v-if="productsForBranch.length > 0" class="input-group-alternative w-100 mb-4 mt-2" default-value="Seleccione un producto" size="large">
            <a-select-option v-for="product of productsForBranch" :key="product" :value="product.name" @click="selectProductForBranch(product.data)" :disabled="product.disabled">
                {{product.name}}
            </a-select-option>
        </a-select>
        <template slot="footer">
            <base-button type="success" class="ml-auto" @click="addProductToBranch">Agregar
            </base-button>
            <base-button type="link" class="mr-auto" @click="modalAdminProduct.modal3 = false">Cerrar
            </base-button>
        </template>
    </modal>
    <modal  modal-classes="modal-dialog-centered modal-lg" :show.sync="modalAdminProduct.modal4">
        <h6 slot="header" class="modal-title" id="modal-title-default">Gestionar productos de sucursal </h6>
        <div class="text-center text-muted mb-4">
            <small>Anexa mas productos.</small>
        </div>
        <base-input alternative
            placeholder="Numero para alerta"
            v-on:keyup="verifyDecimalBranch()"
            v-model="branchAlert"
            addon-left-icon="fa fa-bell">
        </base-input>
        <template slot="footer">
            <base-button type="success" class="ml-auto" @click="addAlertToBranch">Agregar
            </base-button>
            <base-button type="link" class="mr-auto" @click="modalAdminProduct.modal4 = false">Cerrar
            </base-button>
        </template>
    </modal>
  </div>
</template>
<script>
//Back - End 
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import EventBus from '../components/EventBus'
import { Empty } from 'ant-design-vue';
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {Spanish} from 'flatpickr/dist/l10n/es.js';
import jwtDecode from 'jwt-decode';
// COMPONENTS
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import XLSX from 'xlsx'
import mixinUserToken from '../mixins/mixinUserToken'
import mixinES from '../mixins/mixinES'
  export default {
    mixins: [mixinUserToken, mixinES],
    components: {
        flatPicker,
        vueCustomScrollbar,
        VuePhoneNumberInput
    },
    data() {
      return {
        countProduct:[],
        usuario: localStorage.nombre + ' ' + localStorage.apellido,
        myId:null,
        historyClosed:[],
        validForm:0,
        branches:[],
        branchDataValid:true,
        branchData: [],
        selectedBranchName: '',
        branchEntry: [],
        branchAlert: null,
        idForAlert:'',
        selectedBranch:'',
        productsForBranch:[],
        productForBranch:'',
        providerSup:{
          validProvider:false,
          typeProvider:'',
        }, 
        history:[],
        provider:{
          name:'No entender',
          document:'',
          contact: {
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
          contactPlus:'',
          location:'',
        },
        configHeader: {
            headers:{
                "x-database-connect": endPoint.database,
                'x-access-token':localStorage.userToken
            }
        },
        providers:[],
        providerTable:[],
        dateAdd:'',
        productState: false,
        addValid:true,
        configDatePicker: {
          allowInput: true,
          dateFormat: 'm-d-Y',
          locale: Spanish,        
        },
        auth: [],
        modals: {
          modal1: false,
          modal3: false,
          modal4: false,
          modal5: false,
          modal6: false,
        },
        modalAdminProduct: {
          modal1: false,
          modal2: false,
          modal3: false,
          modal4: false
        },
        dataProduct:{
          product:'',
          price:'',
          measure:'',
          quantity:'',
          entry:'',
          alertTotal:'',
          id:null
        },
        messageHistory: '',
        products: [],
        searchText: '',
        searchInput: null,
        searchedColumn: '',
        columnsBranchData: [
            {
                title: 'Productos',
                dataIndex: 'product',
                key: 'product',
                sorter: (a, b) => {
                     if (a.product > b.product) {
                        return -1;
                    }
                    if (b.product > a.product) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.product.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Medida',
                dataIndex: 'measure',
                width: 120,
                key: 'price',
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.price - b.price,
            },
            {
                title: 'Total bodega',
                width: 120,
                key: '_id',
                scopedSlots: { customRender: 'totalStore' },
                sorter: (a, b) => (a.quantity + a.entry - a.consume) - (b.quantity + b.entry - b.consume),
            },
            {
                title: 'Agregar / Restar cantidades',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: {
                    customRender: 'add',
                },
            },
            {
                title: 'Total sucursal',
                width: 120,
                key: '_id',
                scopedSlots: { customRender: 'total' },
                sorter: (a, b) => (a.quantity + a.entry - a.consume) - (b.quantity + b.entry - b.consume),
            },
            {
                title: 'Acciones',
                dataIndex: '_id',
                width: 150,
                key: '_id',
                scopedSlots: { customRender: 'actions' }
            }
        ],
        columns: [
            {
                title: 'Producto',
                dataIndex: 'product',
                key: 'product',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.product > b.product) {
                        return -1;
                    }
                    if (b.product > a.product) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.product.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Precio promedio',
                dataIndex: 'price',
                key: 'price',
                ellipsis: true,
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.price - b.price,
            },
            {
                title: 'Tipo de medida',
                dataIndex: 'measure',
                key: 'measure',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.measure.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Cantidad inicial',
                dataIndex: 'quantity',
                key: 'quantity',
                ellipsis: true,
                scopedSlots: { customRender: 'quantity' },
                sorter: (a, b) => a.quantity - b.quantity,
            },
            {
                title: 'Cantidad ingresada',
                dataIndex: 'entry',
                key: 'entry',
                ellipsis: true,
                scopedSlots: { customRender: 'entry' },
                sorter: (a, b) => a.entry - b.entry,
            },
             {
                title: 'Consumo',
                dataIndex: 'consume',
                key: 'consume',
                ellipsis: true,
                scopedSlots: { customRender: 'consume' },
                sorter: (a, b) => a.consume - b.consume,
            },
            {
                title: 'Total',
                key: '_id',
                ellipsis: true,
                scopedSlots: { customRender: 'total' },
                sorter: (a, b) => (a.quantity + a.entry - a.consume) - (b.quantity + b.entry - b.consume),
            },
            {
                title: 'Acciones',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: { customRender: 'actions' }
            }
        ],
        columnsProviders: [
            {
                title: 'Nombre de la empresa',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.name > b.name) {
                        return -1;
                    }
                    if (b.name > a.name) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Documento',
                dataIndex: 'document',
                key: 'document',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.document.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Teléfono',
                dataIndex: 'contact.formatInternational',
                key: 'contact.formatInternational',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.contact.toString().toLowerCase().includes(value.toLowerCase()),
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
                dataIndex: 'contactPlus',
                key: 'contactPlus',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.contactPlus.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Ubicación',
                dataIndex: 'location',
                key: 'location',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.location.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Acciones',
                dataIndex: '_id',
                key: '_id',
                scopedSlots: { customRender: 'actions' }
            }
        ],
        dateReport: '',
        columnsHistory: [
            {
                title: 'Fecha',
                dataIndex: 'date',
                key: 'date',
                ellipsis: true,
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
                scopedSlots: {
                    customRender: 'date',
                },
            },
            {
                title: 'Producto',
                dataIndex: 'product',
                key: 'product',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.product > b.product) {
                        return -1;
                    }
                    if (b.product > a.product) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'customRender',
                },
                onFilter: (value, record) => record.product.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    }
                },
            },
            {
                title: 'Anexado',
                dataIndex: 'entry',
                key: 'entry',
                ellipsis: true
            },
            {
                title: 'Medida',
                dataIndex: 'measure',
                key: 'measure',
                ellipsis: true
            },
            {
                title: 'Precio por medida',
                dataIndex: 'price',
                key: 'price',
                ellipsis: true,
                scopedSlots: { customRender: 'price' },
                sorter: (a, b) => a.price - b.price,
            },
            {
                title: 'Gasto total',
                dataIndex: 'price',
                key: 'price',
                ellipsis: true,
                scopedSlots: { customRender: 'priceTotal' },
                sorter: (a, b) => a.price - b.price,
            },
            {
                title: 'Provedor',
                dataIndex: 'provider',
                key: 'provider',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'provide',
                },
                onFilter: (value, record) => record.provider.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
            {
                title: 'Destino',
                dataIndex: 'branchName',
                key: 'branchName',
                ellipsis: true,
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'branchName',
                },
                onFilter: (value, record) => record.branchName.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    }, 0);
                    }
                },
            },
        ],
        columnsHistoryClosed: [
            {
                title: 'Fecha',
                dataIndex: 'createdAt',
                key: 'createdAt',
                ellipsis: true,
                defaultSortOrder: 'descend',
                sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                scopedSlots: {
                    customRender: 'date',
                },
            },
            {
                title: 'Encargado del cierre',
                dataIndex: 'user',
                key: 'user',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.user > b.user) {
                        return -1;
                    }
                    if (b.user > a.user) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'user',
                },
                onFilter: (value, record) => record.user.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    }
                },
            },
            {
                title: 'Productos totales',
                dataIndex: 'totalProduct',
                key: 'totalProduct',
                ellipsis: true
            },
            {
                title: 'Informe',
                dataIndex: '_id',
                scopedSlots: {
                    customRender: 'report',
                },
                key: '_id',
                ellipsis: true
            },
        ],
        columnsHistoryClosedReport: [
            {
                title: 'Producto',
                dataIndex: 'product',
                key: 'product',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.product > b.product) {
                        return -1;
                    }
                    if (b.product > a.product) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'product',
                },
                onFilter: (value, record) => record.product.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    }
                },
            },
            {
                title: 'Medida',
                dataIndex: 'measure',
                key: 'measure',
                ellipsis: true,
                sorter: (a, b) => {
                     if (a.measure > b.measure) {
                        return -1;
                    }
                    if (b.measure > a.measure) {
                        return 1;
                    }
                    return 0;
                },
                sortDirections: ['descend', 'ascend'],
                scopedSlots: {
                    filterDropdown: 'filterDropdown',
                    filterIcon: 'filterIcon',
                    customRender: 'measure',
                },
                onFilter: (value, record) => record.measure.toString().toLowerCase().includes(value.toLowerCase()),
                onFilterDropdownVisibleChange: visible => {
                    if (visible) {
                        setTimeout(() => {
                            this.searchInput.focus();
                        }, 0);
                    }
                },
            },
            {
                title: 'Total ideal',
                dataIndex: 'ideal',
                key: 'ideal',
                ellipsis: true
            },
            {
                title: 'Total real',
                dataIndex: 'count',
                key: 'count',
                ellipsis: true
            },
            {
                title: 'Diferencia',
                dataIndex: 'difference',
                key: 'difference',
                ellipsis: true
            },
        ],
        firstNameUser: '',
        lastNameUser: '',
        emailUser: '',
        idUser: '',
        dataHistory: '',
        branchName: '',
        branch: '',
        totalStock: 0
      };
    },
    created(){
        this.getToken()
        this.getProducts();
        this.getProviders();
        this.getHistoryClosed();
        this.getUserData()
        this.getHistory()
        this.getBranches()
        this.getBranch()
    },
    methods: {
        getUserData(){
            this.firstNameUser = localStorage.firstname  
            this.lastNameUser = localStorage.lastname
            this.emailUser = localStorage.email
            this.idUser = localStorage._id
        },
        getBranch(){
            this.branchName = localStorage.branchName  
            this.branch = localStorage.branch
        },
        getToken(){
            const token = localStorage.userToken
            if (token.length > 0) {
                const decoded = jwtDecode(token)  
                this.auth = decoded.access
            }
        },
        getQuantity(id){
            var quanty = 0
            this.products.forEach(element => {
                if (element._id == id) {
                    quanty = (element.entry + element.quantity) - element.consume
                }
            });
            return quanty
        },
        async getProducts() {
            this.countProduct = []
            try{
                const getAllProducts = await axios.get(endPoint.endpointTarget+'/stores/getstore', this.configHeader)
                if (getAllProducts.data.status == 'ok') {
                    this.products = getAllProducts.data.data
                    for (let index = 0; index < this.products.length; index++) {
                        var ideal = (this.products[index].quantity + this.products[index].entry) - this.products[index].consume
                        this.countProduct.push({id:this.products[index]._id,count:'',ideal:ideal,measure:this.products[index].measure,product:this.products[index].product,difference:''})
                        this.totalStock = this.totalStock + (((this.products[index].quantity + this.products[index].entry) - this.products[index].consume) * this.products[index].price) 
                    }
                    
                }else{
                    this.products = []
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
        async getProviders() {
          try{
            const getProviders = await axios.get(endPoint.endpointTarget+'/stores/getproviders', this.configHeader)
            if (getProviders.data.status == 'ok') {
              this.providerTable = getProviders.data.data
              this.providers = []
              for (let i = 0; i < getProviders.data.data.length; i++) {
                  this.providers.push(getProviders.data.data[i].name)
              }
            }else{
                this.providers = []
                this.providerTable = []
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
        async getHistory() {
          try{
            const getHistory = await axios.get(endPoint.endpointTarget+'/stores/getstorehistory', this.configHeader)
            if (this.validRoute('bodega', 'ver_historial_compras')) {
                if (getHistory.data.status == 'ok') {
                    this.dataHistory = getHistory.data.data
                }else{
                    this.dataHistory = []
                    this.messageHistory = 'Sin historial registrado'
                }
            }else{
                this.messageHistory = 'No tiene permisos para visualizar historial'
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
        async getBranches() {
            try{
                const getBranches = await axios.get(endPoint.endpointTarget+'/branches', this.configHeader)
                if (getBranches) {
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
        async getInventoryByBranch(branch, branchName) {
            this.selectedBranch = branch
            this.selectedBranchName = branchName
            this.branchEntry = []
            this.branchData = []
            this.branchDataValid = false
            this.productsForBranch = []
            try{
                const getInventoryByBranch = await axios.get(endPoint.endpointTarget+'/stores/getinventorybybranch/'+branch, this.configHeader)
                if (getInventoryByBranch.data.status == 'ok') {
                    this.branchData = getInventoryByBranch.data.data
                    for (let i = 0; i < this.branchData.length; i++) {
                        this.branchEntry.push({count: ''})
                    }
                    
                }
                this.selectLoad()
                this.productForBranch = ''
                
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
        selectLoad(){
            console.log("aja")
            this.productsForBranch = []
            for (let i = 0; i < this.products.length; i++) {
                var valid = false
                const element = this.products[i];
                if (this.branchData) {
                   for (let e = 0; e < this.branchData.length; e++) {
                        const elementE = this.branchData[e];
                        if (elementE.product == element.product ) {
                            valid = true
                            break
                        }
                    } 
                }
                if (valid) {
                    this.productsForBranch.push({data:element, name: element.product, disabled:true})
                }else{
                    this.productsForBranch.push({data:element, name: element.product, disabled:false})
                }
            }
        },
        selectProductForBranch(value){
            this.productForBranch = value
        },
        addProductToBranch() {
            this.$swal({
                title:`¿Registrar ${this.productForBranch.product} a sucursal?`,
                text: '¡Recuerda! este producto se registrará en inventario de la sucursal',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No, cancelar',
                showCloseButton: true,
                showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.post(endPoint.endpointTarget+'/stores/registertobranch',{
                        branch: this.selectedBranch,
                        storeId: this.productForBranch._id,
                        product: this.productForBranch.product,
                        measure: this.productForBranch.measure,
                        price: this.productForBranch.price 
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'product registered') {
                            this.$swal({
                                icon: 'success',
                                title: 'El producto fue agregado a la sucursal',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.modalAdminProduct.modal3 = false
                            this.getInventoryByBranch(this.selectedBranch, this.selectedBranchName)
                            this.getBranches()
                            this.productForBranch = ''
                            this.productsForBranch = []
                            setTimeout(() => {
                                this.selectLoad()
                            }, 200);   
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
                        icon: 'error',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        removeProductsBranch(id,storeId, index, measure, total){
            axios.get(endPoint.endpointTarget+'/stores/getstorebyid/' + storeId, this.configHeader)
            .then(res => {
                if (this.branchEntry[index].count <= total ) {
                    this.productForBranch = res.data.data
                    console.log(this.productForBranch)
                    this.$swal({
                        title: '¿Está seguro que desea eliminar ' + this.branchEntry[index].count + ' ' + measure + ' de este producto?',
                        html: '¡Recuerda! se descontará de la sucursal: <b>'+ this.selectedBranchName + '</b>',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí',
                        cancelButtonText: 'No, cancelar',
                        showCloseButton: true,
                        showLoaderOnConfirm: true
                    }).then((result) => {
                        if(result.value) {
                            axios.post(endPoint.endpointTarget+'/stores/addtobranch',{
                                branch: this.selectedBranch,
                                branchName: this.selectedBranchName,
                                id:id,
                                storeId: this.productForBranch._id,
                                product: this.productForBranch.product,
                                measure: measure,
                                price: this.productForBranch.price,
                                entry: -(this.branchEntry[index].count),
                                firstNameUser: this.firstNameUser,
                                lastNameUser: this.lastNameUser,
                                emailUser: this.emailUser,
                                idUser: this.idUser ,
                                inv:false
                            }, this.configHeader)
                            .then(res => {
                                if (res.data.status == 'added') {
                                    axios.post(endPoint.endpointTarget+'/expenses/', {
                                        branch: this.selectedBranch,
                                        detail: `Se ha restado ${this.branchEntry[index].count} ${measure} de ${this.productForBranch.product} del inventario`,
                                        amount: -(this.productForBranch.price * this.branchEntry[index].count),
                                        type: 'Inventario',
                                    }, this.configHeader)
                                    .then(res => {
                                        if (res.data.status == 'ok') {
                                            this.$swal({
                                                
                                                icon: 'success',
                                                title: 'La cantidad fue restada',
                                                showConfirmButton: false,
                                                timer: 1500
                                            })
                                            this.getInventoryByBranch(this.selectedBranch, this.selectedBranchName)
                                            this.branchEntry = []
                                            for (let i = 0; i < this.branchData.length; i++) {
                                                this.branchEntry.push({count: ''})
                                            }
                                            this.getProducts()
                                            this.getHistory()
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
                        else{
                            this.$swal({
                                icon: 'error',
                                title: 'Acción cancelada',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                }else{
                    this.$swal({
                        
                        icon: 'error',
                        title: 'La sucursal no dispone de la cantidad ingresada',
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
        addToProductBranch(id, storeId, measure, index) {
            axios.get(endPoint.endpointTarget+'/stores/getstorebyid/' + storeId, this.configHeader)
            .then(res => {
                var total = (res.data.data.quantity + res.data.data.entry) - res.data.data.consume
                if (this.branchEntry[index].count <= total ) {
                    this.productForBranch = res.data.data
                    this.$swal({
                        title: '¿Desea agregar ' + this.branchEntry[index].count + ' ' + measure + '?',
                        text: '¡Recuerda! Se descontará de tu bodega',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí',
                        cancelButtonText: 'No, cancelar',
                        showCloseButton: true,
                        showLoaderOnConfirm: true
                    }).then((result) => {
                        if(result.value) {
                            axios.post(endPoint.endpointTarget+'/stores/addtobranch',{
                                branch: this.selectedBranch,
                                branchName: this.selectedBranchName,
                                id:id,
                                storeId: this.productForBranch._id,
                                product: this.productForBranch.product,
                                measure: this.productForBranch.measure,
                                price: this.productForBranch.price,
                                entry: this.branchEntry[index].count,
                                firstNameUser: this.firstNameUser,
                                lastNameUser: this.lastNameUser,
                                emailUser: this.emailUser,
                                idUser: this.idUser 
                            }, this.configHeader)
                            .then(res => {
                                if (res.data.status == 'added') {
                                    axios.post(endPoint.endpointTarget+'/expenses/', {
                                        branch: this.selectedBranch,
                                        detail: `Se agregaron ${this.branchEntry[index].count + " " + measure} de ${this.productForBranch.product}`,
                                        amount: this.productForBranch.price * this.branchEntry[index].count,
                                        type: 'Inventario',
                                    }, this.configHeader)
                                    .then(res => {
                                        if (res.data.status == 'ok') {
                                            this.$swal({
                                                
                                                icon: 'success',
                                                title: 'La cantidad fue agregada a la sucursal',
                                                showConfirmButton: false,
                                                timer: 1500
                                            })
                                            this.getInventoryByBranch(this.selectedBranch, this.selectedBranchName)
                                            this.branchEntry = []
                                            for (let i = 0; i < this.branchData.length; i++) {
                                                this.branchEntry.push({count: ''})
                                            }
                                            this.getProducts()
                                            this.getHistory()
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
                        else{
                            this.$swal({
                                
                                icon: 'error',
                                title: 'Acción cancelada',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    })
                }else{
                    this.$swal({
                        
                        icon: 'error',
                        title: 'La bodega no dispone de la cantidad ingresada',
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
        deleteProductByBranch(data){
            this.$swal({
            title: '¿Desea eliminar el producto?',
            html: '¡Recuerda! El producto se eliminará de la sucursal: <b>'+ this.selectedBranchName + '</b>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No, cancelar',
            showCloseButton: true,
            showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.post(endPoint.endpointTarget+'/stores/deleteinventoryproduct',{
                        id:data._id,
                        storeId:data.storeId,
                        branch: this.selectedBranch,
                        branchName: this.selectedBranchName,
                        firstNameUser: this.firstNameUser,
                        lastNameUser: this.lastNameUser,
                        emailUser: this.emailUser,
                        idUser: this.idUser,
                        price: 'Descartamiento',
                        product: data.product,
                        entry: data.entry,
                        measure: data.measure
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'product deleted') {
                            axios.post(endPoint.endpointTarget+'/expenses/', {
                                branch: this.selectedBranch,
                                detail: `Producto (${res.data.product}) eliminado del inventario`,
                                amount: -(res.data.price * res.data.total),
                                type: 'Inventario',
                            }, this.configHeader)
                            .then(res => {
                                if (res.data.status == 'ok') {
                                    this.$swal({
                                        
                                        icon: 'success',
                                        title: 'El producto fue eliminado con éxito',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                    this.getInventoryByBranch(this.selectedBranch, this.selectedBranchName)
                                    this.branchEntry = []
                                    for (let i = 0; i < this.branchData.length; i++) {
                                        this.branchEntry.push({count: ''})
                                    }
                                    this.getProducts()
                                    this.getHistory()
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
                else{
                    this.$swal({
                        
                        icon: 'error',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        async getHistoryClosed() {
            try{
                const getHistoryClosed = await axios.get(endPoint.endpointTarget+'/stores/getstoreclosed', this.configHeader)
                if (this.validRoute('bodega', 'ver_historial_compras')) {
                    if (getHistoryClosed.data.status == 'ok') {
                        this.dataHistoryClosed = getHistoryClosed.data.data
                    }else{
                        this.dataHistoryClosed = []
                        this.messageHistory = 'Sin historial registrado'
                    }
                }else{
                    this.messageHistory = 'No tiene permisos para visualizar historial'
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
        validDataProduct(){
            if (this.dataProduct.product != '' && this.dataProduct.measure != '' && this.dataProduct.price != null && this.dataProduct.alertTotal != '' && this.dataProduct.price != 0) {
                return true
            }else{
                return false
            }
        },
        addAlertToBranch(){
            axios.put(endPoint.endpointTarget+'/stores/editstockalarmfrominventory/'+ this.idForAlert, {
                stock: this.branchAlert
            }, this.configHeader)
            .then(res => {
                if (res.data.status == 'ok') {
                    this.$swal({
                        
                        icon: 'success',
                        title: 'Alerta actualizada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.getInventoryByBranch(this.selectedBranch)
                    this.modalAdminProduct.modal4 = false
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
        addProduct(){
            axios.post(endPoint.endpointTarget+'/stores', {
                product: this.dataProduct.product,
                measure: this.dataProduct.measure,
                price: this.dataProduct.price,
                alertTotal: this.dataProduct.alertTotal
            }, this.configHeader)
            .then(res => {  
                if (res.data.status === 'product registered') {
                    this.$swal({
                        
                        icon: 'success',
                        title: '¡Producto registrado con éxito!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.getProducts();
                    this.initialState(3)
                    this.modals.modal1 = false
                }else{
                    this.$swal({
                        
                        icon: 'error',
                        title: '¡Producto ya existe!',
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
        handleSearch(selectedKeys, confirm, dataIndex) {
            confirm();
            this.searchText = selectedKeys[0];
            this.searchedColumn = dataIndex;
        },
        handleReset(clearFilters) {
            clearFilters();
            this.searchText = '';
        },
        verifyDecimal(){
            if (this.dataProduct.alertTotal != '') {
                console.log("aqui no")
                this.dataProduct.alertTotal = this.dataProduct.alertTotal.toString().replace(/\,/g,'.')
            }
        },
        verifyDecimalBranch(){
            setTimeout(() => {
                if (this.branchAlert != '') {
                    console.log("aqui no")
                    this.branchAlert = parseFloat(this.branchAlert.toString().replace(/\,/g,'.'))
                }
            }, 200);
        },
        addProvider(){
            axios.post(endPoint.endpointTarget+'/stores/addprovider', {
              name: this.provider.name,
              document:this.provider.document,
              contact:this.provider.contact,
              contactPlus:this.provider.contactPlus,
              location:this.provider.location
            }, this.configHeader)
            .then(res => {
              if (res.data.status === 'provider registered') {
                  this.$swal({
                    
                    icon: 'success',
                    title: 'Provedor registrado',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  this.provider = {
                    name:'',
                    rut:'',
                    contact:{
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
                    contactPlus:'',
                    direction:'',
                  }
                  this.modals.modal3 = false
                  if (this.modals.modal1 == false) {
                      document.getElementById("provedorBtn").click()
                  } 
                  this.getProducts();
                  this.getProviders();
              }else{
                  this.$swal({
                  
                  title: 'Provedor existe',
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
        initialState(type,id){
            if (type == 1) {
            this.myId = id
            this.dateAdd = ''
            this.dataProduct.price = ''
            }
            if (type == 2) {
                this.provider = {
                    name:'',
                    rut:'',
                    contact:{
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
                    contactPlus:'',
                    direction:'',
                }
                this.providerSup.validProvider = true
            }
            if(type == 3){
            this.dataProduct = {
                product:'',
                price:0,
                measure:'',
                quantity:'',
                entry:'',
                alertTotal:'',
                id:null
            }
            this.unit = ''
            }
        },
        formatDate(date) {
            let dateFormat = new Date(date)
            return dateFormat.getDate()+"-"+(dateFormat.getMonth() + 1)+"-"+dateFormat.getFullYear()
        },
        formatPrice(value) {
            if (value == 'Abastecimiento' || value == 'Devolución' || value == 'Descartamiento') {
                return value
            }else{
                let val = (value/1).toFixed(2).replace('.', ',')
                return '$ '+val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
        },
        updateProvider(){
            axios.put(endPoint.endpointTarget+'/stores/updateProvider/'+this.provider.id, {
                name:this.provider.name,
                document: this.provider.document,
                contact:this.provider.contact,
                contactPlus:this.provider.contactPlus,
                location:this.provider.location
            }, this.configHeader)
            .then(res => {
              if (res.data.status == 'provider edited') {
                this.$swal({
                    
                    icon: 'success',
                    title: 'Provedor Actualizado',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.getProviders();
                this.modals.modal3 = false
              }else{
                this.$swal({
                  
                  icon: 'error',
                  title: 'El nuevo documento del provedor ya se encuentra registrado',
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
        addMore(){
            axios.put(endPoint.endpointTarget+'/stores/add/'+this.myId, {
                entry:this.dataProduct.entry,
                history:{
                    id:this.myId,
                    date:this.dateAdd,
                    product:this.dataProduct.product,
                    entry:this.dataProduct.entry,
                    measure:this.dataProduct.measure,
                    price:this.dataProduct.price / this.dataProduct.entry,
                    provider: this.provider.name,
                    firstNameUser: this.firstNameUser,
                    lastNameUser: this.lastNameUser,
                    emailUser: this.emailUser,
                    idUser: this.idUser
                },  
            }, this.configHeader)
            .then(res => {
                this.$swal({
                    
                    icon: 'success',
                    title: '¡Producto actualizado con éxito!',
                    showConfirmButton: false,
                    timer: 1500
                })
                this.modals.modal1 = false
                this.getProducts();
                this.getHistory()
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
        selectProviderForProduct(value){
            this.provider.name = value
        },
        deleteProvider(id){
            this.$swal({
            title: '¿Desea eliminar proveedor?',
            text: '¡Recuerda! No podrás revertir esta acción',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No, cancelar',
            showCloseButton: true,
            showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.delete(endPoint.endpointTarget+'/stores/deleteprovider/'+id, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'provider deleted') {
                            this.$swal({
                                
                                icon: 'success',
                                title: 'Provedor borrado con éxito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getProviders()
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
                        
                        icon: 'error',
                        title: 'Accion cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        deleteItem(id){
            this.$swal({
                title: '¿Desea eliminar productos?',
                text: '¡Recuerda! Se procederá a eliminar de todas las sucursales donde se encuentre registrado y no se podrá revertir esta acción',
                icon:'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No, cancelar',
                showCloseButton: true,
                showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.post(endPoint.endpointTarget+'/stores/deletestoreproduct',{
                        id:id,
                        firstNameUser: this.firstNameUser,
                        lastNameUser: this.lastNameUser,
                        emailUser: this.emailUser,
                        idUser: this.idUser
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'product deleted') {
                            this.$swal({
                                icon: 'success',
                                title: 'Producto borrado con éxito',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            this.getProducts()
                            this.getHistory()
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
                        
                        icon: 'error',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        closeStore(){
            var valid = true
            this.countProduct.forEach(element => {
                if (element.count == '' || element.count == null ) {
                    valid = false
                }
            });
            if (valid) {
                axios.post(endPoint.endpointTarget+'/stores/closestore', {
                    firstNameUser: this.firstNameUser,
                    lastNameUser: this.lastNameUser,
                    emailUser: this.emailUser,
                    idUser: this.idUser, 
                    products:this.countProduct
                }, this.configHeader)
                .then(res => {
                    if (res.data.status === 'closed') {
                        this.$swal({
                            icon: 'success',
                            title: 'Cierre realizado con éxito',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.getProducts();
                        this.getHistoryClosed()
                    }
                    else{
                        this.$swal({
                            icon:'error',
                            title: 'Ya se hizo un cierre este mes',
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
            }else{
                this.$swal({
                    icon:'error',
                    title: 'Debes llenar todos los campos',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            
        },
        validProviders(){
            if (this.provider.name != '' && this.provider.contact.isValid && this.provider.location != '') {
              this.providerSup.validProvider = false
            }
            else{
              this.providerSup.validProvider = true
            }
        },
        pushDataProvider(name,document,contact,contactPlus,location,id){
            this.provider = {
              name:name,
              document:document,  
              contact: contact,
              contactPlus:contactPlus,
              location:location,
              id:id
            }
        },
        providerFunction(){
            if (this.providerSup.typeProvider == 'Registrar') {
              this.addProvider()
            }
            else{
              this.updateProvider()
            }
        },
        pushDataProduct(product, measure, price, alertTotal, id){
            this.modals.modal6 = true
            this.dataProduct = {
                product:product,
                price:price,
                measure:measure,
                quantity:'',
                entry:'',
                alertTotal:alertTotal,
                id:id
            }
        },
        printExcel(){
            var data = []
            for (const column of this.dataHistoryClosedReport) {
                data.push({
                    Producto: column.product,
                    Medida: column.measure,
                    "En stock": column.count,
                    "Total ideal": column.ideal,
                    Diferencia: column.difference
                })
            }
            var Datos = XLSX.utils.json_to_sheet(data) 
            var wb = XLSX.utils.book_new() 
            XLSX.utils.book_append_sheet(wb, Datos, 'Datos') 
            XLSX.writeFile(wb, 'Reporte del '+this.formatDate(this.dateReport)+'.xlsx') 
        },
        editProduct(){
            this.$swal({
              title: `¿Desea editar el producto ${this.dataProduct.product}?`,
              text: '¡Recuerda! También se editara de todas las sucursales donde está registrado. No puedes revertir esta acción.',
              icon:'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí',
              cancelButtonText: 'No, cancelar',
              showCloseButton: true,
              showLoaderOnConfirm: true
            }).then((result) => {
                if(result.value) {
                    axios.put(endPoint.endpointTarget+'/stores/'+this.dataProduct.id, {
                        product:this.dataProduct.product,
                        measure:this.dataProduct.measure,
                        price:this.dataProduct.price,
                        alertTotal:this.dataProduct.alertTotal,
                    }, this.configHeader)
                    .then(res => {
                        if (res.data.status == 'store edited') {
                            this.$swal({
                                
                                icon: 'success',
                                title: 'Producto editado correctamente',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            setTimeout(() => {
                                this.modals = {
                                    modal1: false,
                                    modal2: false,
                                    modal3: false,
                                    modal4: false,
                                    modal5: false,
                                    modal6: false,
                                    message: "",
                                    icon: '',
                                    type:''
                                }
                                this.getProducts();
                            }, 1500);
                        }
                        else if (res.data.status == 'product already in use') {
                            this.$swal({
                                
                                icon: 'error',
                                title: 'El nombre del producto ya se encuentra registrado en la bodega',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }else{
                            this.$swal({
                                
                                icon:'error',
                                title: 'Hubo un problema',
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
                else{
                    this.$swal({
                        
                        icon:'error',
                        title: 'Acción cancelada',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
        },
        formatRut(rut) {
            rut.replace(/[-.]/g,'')
            const newRut = rut.replace(/\./g,'').replace(/\-/g, '').trim().toLowerCase();
            const lastDigit = newRut.substr(-1, 1);
            const rutDigit = newRut.substr(0, newRut.length-1)
            let format = '';
            for (let i = rutDigit.length; i > 0; i--) {
            const e = rutDigit.charAt(i-1);
            format = e.concat(format);
            if (i % 3 === 0){
                format = '.'.concat(format);
            }
            }
            this.provider.document = format.concat('-').concat(lastDigit);
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
        }
    },
    mounted() {
        EventBus.$on('changeBranch', status => {
            this.getBranch()
        })
    },
    computed: {
        getScreen: () => {
            return screen.width < 780 ? { x: 'calc(700px + 50%)', y: 240 } : { y: 240 }
        }
    }
  }
</script>
<style lang="scss">
  .card-header{
    font-size: 2.5vw;
  }
  .cursor-pointer{
    cursor: pointer;
  }
  .inventory .nav-item .active{
    background-color:#172b4d !important;
    color: white !important;
  }
  .inventory .nav-link {
    color: #172b4d !important;
  }
  .inventory .card-header{
    display:none;
  }
  .nav-item{
    padding-left: 1rem;
  }
  .inventoryTabs .nav-item:last-child{
    padding-right: 1rem !important;
  }
</style>