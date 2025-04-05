import {getRequest, postRequest,patchRequest} from "@/services/axios.service";

async function getOrgsFromAPI() {
    return getRequest('/orgs/get', 'GETORGS')
}
async function getOrgsByIdFromAPI(id,secret) {
    return getRequest(`/orgs/getbyid/${id}?org-secret=${secret}`, 'GETORGSBYID',{
        params:{
            secret:secret
        }
    })
}
async function createOrgFromAPI(nom,valeurSecrete){
    console.log(nom,valeurSecrete)
    let data = {
        name:nom,
        secret:valeurSecrete
    }
    return postRequest('/orgs/create',data,'CREATEORG')
}
async function addTeamToOrgFromAPI(id,secret){
    let data = {
        idTeam:id
    }
    return patchRequest('/orgs/addteam?org-secret='+secret,data,'ADDTEAM')
}
async function removeteamFromAPI(id,secret){
    let data = {
        idTeam:id
    }

    return patchRequest('/orgs/removeteam?org-secret='+secret,data,'REMOVETEAM')
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
async function getOrgByIdService(id,secret){
    let answer = await getOrgsByIdFromAPI(id,secret)
    return answer
}
async function addTeamToOrgService(id,secret){
    console.log("id : "+id)
    let answer = await addTeamToOrgFromAPI(id,secret)
    return answer
}
async function removeteamFromOrgService(id,secret){
    console.log("id : "+id)
    let answer = await removeteamFromAPI(id,secret)
    return answer
}



export {
    getAllOrgsService,
    createOrgService,
    addTeamToOrgService,
    removeteamFromOrgService,
    getOrgByIdService
}