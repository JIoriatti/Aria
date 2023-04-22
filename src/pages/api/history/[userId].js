import { getLatestHistory, addToHistory } from "lib/prisma/historyController";

const historyHandler = async (req, res)=>{
    try{
        const { userId } = req.query;
        if(req.method === 'POST'){
            const { songInfo } = JSON.parse(req.body);
            const response = await addToHistory(songInfo, userId);
            if(response){
                console.log(response);
            }
            res.status(200).json(response);
        }
        if(req.method === 'GET'){
            const response = await getLatestHistory(userId);
            console.log(response);
            res.status(200).json(response);
        }
    }catch(err){
        console.log(err)
        res.status(500).json(err)
        return { err }
    }
}

export default historyHandler;