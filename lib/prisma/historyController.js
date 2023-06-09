import prisma from ".";

export async function addToHistory(songData, userId){
    try{
        const history = await prisma.history.create({
            data: {
                spotifyId: songData.id,
                songName: songData.name,
                artistsNames: songData.artistsNames,
                image: songData.images[1].url,
                miniImage: songData.images[2].url,
                previewMp3: songData.preview_url,
                userId: userId
            },
        })
        return history;
    }catch(err){
        console.log(err)
        return { err };
    }
}

export async function getLatestHistory(userId){
    try{
        const latestHistory = await prisma.user.findUnique({
            where:{
                id: userId
            },
            select:{
                history:{
                    orderBy: {
                        id: 'desc',
                    },
                    take: 30,
                }
            }
        })
        return latestHistory;
    }catch(err){
        console.log(err)
        return { err }
    }
}
