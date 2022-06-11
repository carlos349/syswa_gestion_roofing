<template>
    <div class="container">
        <center >
            <div class="mt-9 hidden divShow">
                <i class="fa fa-info-circle mb-4" style="font-size:15em;color:#238ae6;"></i>
                <h1>Su cita fue cancelada satifactoriamente</h1>
            </div>    
        </center> 
    </div>
</template>
<script>
import axios from 'axios'
import endPoint from '../../config-endpoint/endpoint.js'
import router from '../router'
import io from 'socket.io-client';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
export default {
    data(){
        return {
            id: this.$route.query.id,
            socket: io(endPoint.endpointTarget),
            configHeader: {
                headers:{
                    "x-database-connect": endPoint.database,
                }
            }
        }
    },
    created(){
        this.confirmDate()
    },
    methods: {
        confirmDate(){
            axios.delete(endPoint.endpointTarget+'/dates/'+this.id, this.configHeader)
            .then(res => {
                if (res.data.status == 'deleted') {
                    $('.divShow').show('slow')
                    if (res.data.data) {
                        var micro = ''
                        res.data.data.microServices.forEach((element,index)=> {
                            if (res.data.data.microServices[index + 1]) {
                                micro = micro + element.name + ' - '
                            }else{
                                micro = micro + element.name
                            }
                        });
                        
                        axios.post(endPoint.endpointTarget+'/notifications', {
                            userName:'Cliente: '+res.data.data.client.name,
                            userImage: '',
                            detail: 'Canceló su cita para el día '+this.formatDateTwo(res.data.data.createdAt),
                            branch: res.data.data.branch,
                            link: 'agendamiento'
                        }, this.configHeader)
                        .then(respo => {
                            this.socket.emit('sendNotification', respo.data.data)
                        })
                        
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
                            system: false
                        }, this.configHeader)
                        .then(res => {
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }
                }
            })
        },
        formatDateTwo(date) {
            let dateFormat = new Date(date)
            return moment(dateFormat).format("DD-MM-YYYY")
        },
    }
}
</script>
<style>
.divShow{
    display:none;
}
</style>