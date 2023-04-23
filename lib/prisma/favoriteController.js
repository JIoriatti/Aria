import prisma from ".";


//songData is req.body
export async function addFavorite(songData, userId){
    try{
        //if the object passed has a spotifyId property, then it must be
        //from the sidebar, and is already in DB model format.
        if(songData.hasOwnProperty('spotifyId')){
            const favoriteExists = await prisma.favorite.findFirst({
                where: {
                    spotifyId: songData.spotifyId
                }
            })
            if(favoriteExists){
                const deletedFavorite = await prisma.favorite.delete({
                    where: {
                        id: favoriteExists.id
                    }
                })
                return deletedFavorite
            }
            const favorite = await prisma.favorite.create({
                data:{
                    ...songData,
                }
                
            })
            return favorite;
        }
        else{
            const favoriteExists = await prisma.favorite.findFirst({
                where: {
                    spotifyId: songData.id
                }
            })
            if(favoriteExists){
                const deletedFavorite = await prisma.favorite.delete({
                    where: {
                        id: favoriteExists.id
                    }
                })
                return deletedFavorite
            }
            const favorite = await prisma.favorite.create({
                data:{
                    spotifyId: songData.id,
                    songName: songData.name,
                    artistsNames: songData.artistsNames,
                    image: songData.images[1].url,
                    miniImage: songData.images[2].url,
                    previewMp3: songData.preview_url,
                    userId: userId
                },
            })
            return favorite;
            
        }
    }catch(err){
        console.log(err)
        throw new Error(err)
    }
}

export async function getFavorites(userId){
    try{
        const favorites = await prisma.user.findUnique({
            where:{
                id: userId
            },
            include:{
                favorites: true,
            }
        })
        return favorites
    }catch(err){
        console.log(err)
        return { err }
    }
}