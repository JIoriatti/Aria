import { addFavorite, getFavorites} from "lib/prisma/favoriteController"

const favoriteHandler = async (req, res)=>{
  try{
    const { songInfo } = JSON.parse(req.body);
    const { userId } = JSON.parse(req.body);

    if(req.method === 'POST'){
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
  }
}

export default favoriteHandler;