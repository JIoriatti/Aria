import prisma from ".";


//songData is req.body
export async function addFavorite(songData, userId){
    try{
        console.log(songData)
        const favorite = await prisma.favorite.create({
            data:{
                spotifyId: songData.id,
                songName: songData.name,
                artistsNames: songData.artistsNames,
                image: songData.images[1].url,
                previewMp3: songData.preview_url,
                userId: userId,
            }
        })
        return favorite;
    }catch(err){
        console.log(err)
        return { err };
    }
}