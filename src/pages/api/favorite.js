import { addFavorite } from "lib/prisma/favoriteController"

const favoriteHandler = async (req, res)=>{
  try{
    if(req.method === 'POST'){
      const { songInfo } = JSON.parse(req.body);
      const { userId } = JSON.parse(req.body);
      console.log(JSON.parse(req.body))
      const response = await addFavorite(songInfo, userId)
      console.log(response)
      res.status(200).json(response)
    } 
  }catch(err){
    console.log(err)
  }
}

export default favoriteHandler;