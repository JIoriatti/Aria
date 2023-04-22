import prisma from ".";

export async function addToHistory(songData, userId){
    try{
        const historyExists = await prisma.history.findFirst({
            where: {
                spotifyId: songData.id
            }
        })
        if(!historyExists){
            const history = await prisma.history.create({
                data:{
                    spotifyId: songData.id,
                    songName: songData.name,
                    artistsNames: songData.artistsNames,
                    image: songData.images[1].url,
                    previewMp3: songData.preview_url,
                    userId: userId
                },
            })
            return history;
        }
    }catch(err){
        console.log(err)
        return { err };
    }
}

export async function getHistory(userId){
    try{
        const favorite = await prisma.user.findUnique({
            where:{
                id: userId
            },
            include:{
                history: true,
            }
        })
        return favorite
    }catch(err){
        console.log(err)
        return { err }
    }
}