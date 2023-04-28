import { addRecentArtist } from "lib/prisma/recentArtistsController";

const recentArtistHandler = async (req,res)=>{
    try{
        
        if(req.method === 'POST'){
            const { userId, artistData } = JSON.parse(req.body);
            const response = await addRecentArtist(artistData, userId);
            res.status(200).json(response);
        }
    }catch(err){
        res.status(500).json(err)
        throw new Error(err)
    }
}


//Only needed for sending/storing entire Spotify API responses to DB
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb'
        }
    }
}
export default recentArtistHandler;