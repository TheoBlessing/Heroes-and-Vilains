import {getRequest, postRequest,patchRequest} from "@/services/axios.service";

async function getOrgsFromAPI() {
    return getRequest('/orgs/get', 'GETORGS')
}
async function getOrgsByIdFromAPI(id) {
    return getRequest(`/orgs/getbyid/${id}`, 'GETORGSBYID')
}
async function createOrgFromAPI(nom,valeurSecrete){
    console.log(nom,valeurSecrete)
    let data = {
        name:nom,
        secret:valeurSecrete
    }
    return postRequest('/orgs/create',data,'CREATEORG')
}
async function addTeamToOrgFromAPI(id){
    let data = {
        idTeam:id
    }
    return patchRequest('/orgs/addteam',data,'ADDTEAM')
}
async function removeteamFromAPI(id){
    let data = {
        idTeam:id
    }

    return patchRequest('/orgs/removeteam',data,'REMOVETEAM')
}
async function getAllOrgsService() {
    let answer = await getOrgsFromAPI()
    console.log(answer)
    return answer
}
async function createOrgService(nom,valeurSecrete) {
    let answer = await createOrgFromAPI(nom,valeurSecrete)
    console.log(answer)
    return answer
}
async function getOrgByIdService(id){
    let answer = await getOrgsByIdFromAPI(id)
    return answer
}
async function addTeamToOrgService(id){
    let answer = await addTeamToOrgFromAPI(id)
    return answer
}
async function removeteamFromOrgService(id){
    let answer = await removeteamFromAPI(id)
    return answer
}



export {
    getAllOrgsService,
    createOrgService,
    addTeamToOrgService,
    removeteamFromOrgService,
    getOrgByIdService
}