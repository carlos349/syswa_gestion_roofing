const serverL = 'localhost:3200'
const server = '18.228.199.97:4200'
const portClient = '3389'
const endpointTarget = `http://${serverL}`
const imgEndpoint = `${endpointTarget}/static/users/`

const dataRoofing = {
    imgEndpoint: imgEndpoint, 
    portClient: portClient, 
    database: 'roofing-syswa',
    siteRedirect: "",
    endpointTarget: endpointTarget,
    url: `http://stjohnsroofingservicesllc.syswa.net/#`,
    server: server 
}

const endPoint = dataRoofing

module.exports = endPoint