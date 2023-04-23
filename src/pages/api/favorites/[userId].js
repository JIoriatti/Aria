import { addFavorite, getFavorites} from "lib/prisma/favoriteController"

const favoriteHandler = async (req, res)=>{
  console.log('got here')
  try{
    const { userId } = req.query;
    
    if(req.method === 'POST'){
      const { songInfo } = JSON.parse(req.body);
      const response = await addFavorite(songInfo, userId);
      console.log(response);
      res.status(200).json(response);
    }
    if(req.method === 'GET'){
      const response = await getFavorites(userId);
      console.log(response)
      res.status(200).json(response);
    } 
  }catch(err){
    console.log(err)
    throw new Error(err)
  }
}

export default favoriteHandler;