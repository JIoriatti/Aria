import prisma from ".";


export async function recentArtists(){
    try{
        const recentArtists = await prisma.history.findMany({
            
        })
    }catch(err){

    }
}