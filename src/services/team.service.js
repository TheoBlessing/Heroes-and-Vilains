import {getRequest, patchRequest, postRequest} from "@/services/axios.service";

async function getTeamsFromAPI() {
    return getRequest('/teams/get', 'GETTEAMS')
}

async function createTeamsFromAPI(name) {
    let data = {
        name:name
    }
    return postRequest('/teams/create',data, 'CREATETEAMS')
}
async function addHeroesFromAPI(tabId,idTeam) {
    console.log("data : ")
    console.log(tabId+idTeam)
    let data = {
        idHeroes:tabId,
        idTeam:idTeam
    }
    return patchRequest('/teams/addheroes',data, 'ADDHEROES')
}
async function removeHeroesFromTeamFromAPI(tabId,idTeam) {

    let data = {
        idHeroes:tabId,
        idTeam:idTeam
    }
    return patchRequest('/teams/removeheroes',data, 'REMOVEHEROES')
}


async function getAllTeamsService(){
    let answer = await getTeamsFromAPI()
    return answer
}
async function removeHeroesFromTeamService(tabId,idTeam){
    let answer = await removeHeroesFromTeamFromAPI(tabId,idTeam)
    return answer
}
async function createTeamService(name){
    let answer = await createTeamsFromAPI(name)
    return answer
}
async function addHeroesToTeamService(tabId,idTeam){
    let answer = await addHeroesFromAPI(tabId,idTeam)
    return answer
}



export {
    getAllTeamsService,
    createTeamService,
    addHeroesToTeamService,
    removeHeroesFromTeamService,
}