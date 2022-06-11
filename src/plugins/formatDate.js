import moment from 'moment'
import 'moment/locale/es';
moment.locale('es');
const formatDate = {}

formatDate.install = (Vue) => {
    Vue.filter('formatDate', (date) => {
        let dateFormat = new Date(date)
		return moment(dateFormat).format("DD-MM-YYYY")
    })

    Vue.filter('formatDateEdit', (date) => {
        let dateFormat = new Date(date)
		return moment(dateFormat).format("MM-DD-YYYY")
    })

    Vue.filter('fromNow', (date) => {
        let dateFormat = new Date(date)
		return moment(dateFormat, "YYYYMMDD").fromNow();
    })
}



export default formatDate