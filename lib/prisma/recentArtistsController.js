import prisma from ".";



export async function addRecentArtist(artistData, userId){
    try{
        const artist = await prisma.recentArtist.create({
            data:{
                spotifyId: artistData.artistId,
                name: artistData.artistInfo.name,
                image: artistData.artistInfo.images[0].url,
                miniImage: artistData.artistInfo.images[2].url,
                userId,
            }
        })
        return artist;
    }catch(err){
        throw new Error(err);
    }
}



export async function recentArtists(){
    try{
        const recentArtists = await prisma.history.findMany({
            
        })
    }catch(err){

    }
}