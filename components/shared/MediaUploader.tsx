"use client"
import React from 'react'
import {CldUploadWidget} from "next-cloudinary"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from 'react'
import Image from 'next/image';
// import { getImageSize } from 'next/dist/server/image-optimizer';
import { dataUrl, getImageSize } from '@/lib/utils';
import { CldImage } from 'next-cloudinary';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

type MediaUploaderProps={
    onValueChange:(value:string)=>void;
    setImage:React.Dispatch<any>;
    publicId:string;
    image:any;
    type:string;
}
// useEffect(() => {
//     console.log("Updated publicId:", publicId);
// }, [publicId]);
const MediaUploader = ({
    onValueChange,
    setImage,
    image,publicId,type}:MediaUploaderProps) => {
    const {toast}=useToast();

    // console.log("MediaUploader Props:", { publicId, image, type });
    const onUploadSuccessHandler=(result:any)=>{
    //    console.log("result: ",result);
        setImage((prevState:any)=>{
            const newState = {
                ...prevState,
                publicId: result?.info?.public_id,
                width: result?.info?.width,
                height: result?.info?.height,
                secureURL: result?.info?.secure_url,
            };
            console.log("New State:", newState);
            return newState;
        })
        // console.log("result?public_id=",result?.info?.public_id);
        //  if (typeof onValueChange === 'function') {
        onValueChange(result?.info?.public_id);
    // } else {
    //     console.error("onValueChange is not a function");
    // }
        
        toast({
            title:'Image Upload Successfully',
            description:'1 credit was deducted from your account',
            duration:5000,
            className:'success-toast'
        })

    }
    const onUploadErrorHandler=()=>{
        toast({
            title:'Something went wrong while uploading',
            description:'Please try again',
            duration:5000,
            className:'error-toast'
        })
    }

    // console.log("public id: ",publicId);
  return (
    <CldUploadWidget
     uploadPreset="imaginator"
     options={{
     multiple:false,
     resourceType: "image",
     }
     }
    onSuccess={onUploadSuccessHandler}
    onError={onUploadErrorHandler}
    >

        {({open})=>(
            <div className="flex flex-col gap-4">
                <h3 className='h3-bold text-dark-600'>
                    Original
                </h3>
                {/* {`console.log("inside original: ",${publicId})`} */}
                {publicId ?(
                    <>
                    
                     
                     <div className='cursor-pointer overflow-hidden rounded-[10px]'>
                        <CldImage 
                        width={getImageSize(type,image,"width")}
                        height={getImageSize(type,image,"height")}
                        src={publicId}
                        alt="image"
                        sizes={"(max-width:767px) 100vw, 50vw"}
                        placeholder={dataUrl as PlaceholderValue}
                        className="media-uploader_cldImage"
                        />
                     </div>
                    </>
                ):(
                    <div className="media-uploader_cta" onClick={()=>open()}>
                        <div className="media-uploader_cta-image">
                        
                        <Image
                         src="/assets/icons/add.svg"
                         alt="Add Image"
                         width={24}
                         height={24}
                        />
                        </div>
                        <p className='p-14-medium'>
                           Click here to upload Image
                        </p>
                        
                    </div>
                )}

            </div>
        )}
    </CldUploadWidget>
  )
}

export default MediaUploader