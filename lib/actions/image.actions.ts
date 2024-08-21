"use server"
import { redirect } from "next/navigation";
import Image from "../database/models/image.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils"
import { revalidatePath } from "next/cache";
import {v2 as cloudinary} from 'cloudinary'

const populateUser=(query:any)=>query.populate({
    path:'author',
    model:User,
    select:'_id firstName lastName'
})
//ADD IMAGE 

export async function addImage({image , userId,path}:AddImageParams){
    try{
       await connectToDatabase();

       const curruser=await User.findById(userId);
       if(!curruser){
        throw new Error("user not found");
       }

       const newImage=await Image.create({
        ...image,
        author:curruser._id,

       })
       revalidatePath(path);

       return JSON.parse(JSON.stringify(newImage));
    }
    catch(err){
        handleError(err);
    }
}

//UPDATE THE IMAGE
export async function updateImage({image , userId,path}:UpdateImageParams){
    try{
       await connectToDatabase();

    const currimage=await Image.findById(image._id);

    if(!currimage || currimage.author.toHexString()!=userId){
        throw new Error ("Unauthorized or Image not found");
    }

   const updatedImage=await Image.findByIdAndUpdate(currimage._id,
    image,
    {new:true}
   )
       revalidatePath(path);

       return JSON.parse(JSON.stringify(updatedImage));
    }
    catch(err){
        handleError(err);
    }
}

//DELETE THE IMAGE

export async function deleteImage(imageId:string){
    try{
       await connectToDatabase();

       await Image.findByIdAndDelete(imageId);

    }
    catch(err){
        handleError(err);
    } finally{
        redirect('/');
    }
}

//GET IMAGE BY ID

export async function getImageById(imageId:string){
    try{
       await connectToDatabase();

       const image=await populateUser(Image.findById(imageId));

     if(!image) throw new Error("image not found");

       return JSON.parse(JSON.stringify(image));
    }
    catch(err){
        handleError(err);
    }
}

//GET ALL IMAGES
export async function getAllImages({ limit = 9, page = 1, searchQuery = '' }: {
    limit?: number;
    page: number;
    searchQuery?: string;
  }) {
    try {
      await connectToDatabase();
  
      cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      })
  
      let expression = 'folder=imaginify';
  
      if (searchQuery) {
        expression += ` AND ${searchQuery}`
      }
  
      const { resources } = await cloudinary.search
        .expression(expression)
        .execute();
  
      const resourceIds = resources.map((resource: any) => resource.public_id);
  
      let query = {};
  
      if(searchQuery) {
        query = {
          publicId: {
            $in: resourceIds
          }
        }
      }
  
      const skipAmount = (Number(page) -1) * limit;
  
      const images = await populateUser(Image.find(query))
        .sort({ updatedAt: -1 })
        .skip(skipAmount)
        .limit(limit);
      
      const totalImages = await Image.find(query).countDocuments();
      const savedImages = await Image.find().countDocuments();
  
      return {
        data: JSON.parse(JSON.stringify(images)),
        totalPage: Math.ceil(totalImages / limit),
        savedImages,
      }
    } catch (error) {
      handleError(error)
    }
  }