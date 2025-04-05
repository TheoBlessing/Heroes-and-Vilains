import {getRequest, postRequest, putRequest} from "@/services/axios.service";


async function getAliasesFromAPI() {
    return getRequest('/heroes/getaliases', 'GETALIASES')
}

async function postHeroesFromAPI(publicName, realName, powers = []){
    const heroPayload = {
        publicName: publicName,
        realName: realName || undefined, // Ne pas envoyer si null/undefined
        powers: powers.map(power => ({
            name: power.name,
            type: power.type,
            level: power.level
        }))
    };

    return await postRequest('/heroes/create', heroPayload, 'POSTHEROES');
}

async function updateHeroesFromAPI(heroData, valeurSecret){
    const updatePayload = {
        _id: heroData._id
    };
    if (heroData.publicName !== undefined) {
        updatePayload.publicName = heroData.publicName;
    }
    if (heroData.realName !== undefined) {
        updatePayload.realName = heroData.realName;
    }
    if (heroData.powers !== undefined) {
        updatePayload.powers = heroData.powers.map(power => {
            const powerType = Number(power.type);
            const powerLevel = Number(power.level);

            return {
                _id: power._id,
                name: power.name,
                type: powerType,
                level: powerLevel
            };
        });
    }


    return putRequest('/heroes/update?org-secret='+valeurSecret,updatePayload,'UPDATEHEROES')
}

async  function getHeroesByIdFromAPI(_id,valeurSecret){
    return getRequest('/heroes/getbyid/'+_id+'?org-secret='+valeurSecret, 'GETHEROSBYID')
}

async function postHeroesService(publicName,realName,power){
    let answer = await postHeroesFromAPI(publicName,realName,power)
    return answer
}
async function updateHeroesService(heroData, valeurSecret){
    let answer = await updateHeroesFromAPI(heroData, valeurSecret)
    return answer
}

export {
    getAliasesFromAPI,
    postHeroesService,
    updateHeroesService,
    getHeroesByIdFromAPI


}