import { addFavorite, getFavorites} from "lib/prisma/favoriteController"

const favoriteHandler = async (req, res)=>{
  try{
    const { userId } = req.query;
    
    if(req.method === 'POST'){
      const { songInfo } = JSON.parse(req.body);
      const response = await addFavorite(songInfo, userId);
      res.status(200).json(response);
    }
    if(req.method === 'GET'){
      const response = await getFavorites(userId);
      res.status(200).json(response);
    } 
  }catch(err){
    console.log(err)
    res.status(500).json(err)
    throw new Error(err)
  }
}

export default favoriteHandler;