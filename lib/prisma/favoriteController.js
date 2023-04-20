import prisma from ".";


//songData is req.body
export async function addFavorite(songData, userId){
    try{
    
        const favoriteExists = await prisma.favorite.findFirst({
            where: {
                spotifyId: songData.id
            }
        })
        console.log(favoriteExists)

        if(!favoriteExists){
            const favorite = await prisma.favorite.create({
                data:{
                    spotifyId: songData.id,
                    songName: songData.name,
                    artistsNames: songData.artistsNames,
                    image: songData.images[1].url,
                    previewMp3: songData.preview_url,
                    userId: userId
                },
            })
            return favorite;
        }
    }catch(err){
        console.log(err)
        return { err };
    }
}

export async function getFavorites(userId){
    try{
        const favorite = await prisma.user.findUnique({
            where:{
                id: userId
            },
            include:{
                favorites: true,
            }
        })
        return favorite
    }catch(err){
        console.log(err)
        return { err }
    }
}