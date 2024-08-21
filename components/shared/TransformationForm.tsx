"use client"
import React, { startTransition } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { debounce, deepMergeObjects } from '@/lib/utils'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, defaultValues, transformationTypes} from '@/constants'
import { AspectRatioKey } from '@/lib/utils'
import { CustomField } from './CustomField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MediaUploader from './MediaUploader'

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string()
})


const TransformationForm = ({ action, data = null, userId, type, creditBalance,config=null }: TransformationFormProps) => {

  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setnewTransformation] = useState<Transformations | null>(null);
  const initialValues = data && action === 'Update' ? {
    title: data?.title,
    aspectRatio: data?.aspectRatio,
    color: data?.color,
    prompt: data?.prompt,
    publicId: data?.publicId,
  } : defaultValues

 const [isSubmitting,setIsSubmitting]=useState(false);
 const [isTransforming,setIsTransforming]=useState(false);
 const [transformationConfig,setTransformationConfig]=useState(config);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        const imageSize= aspectRatioOptions[value as AspectRatioKey]
        setImage((prevState:any) => ({
          ...prevState,
          aspectRatio:imageSize.aspectRatio,
          width:imageSize.width,
          height:imageSize.height,

        }))

        setnewTransformation(transformationType.config);

        return onChangeField(value);

  }

  const onInputChangeHandler=(fieldName:string, value:string,type:string, onChangeField:(value:string )=>void)=>{
        debounce(()=>{

          setnewTransformation((prevState:any)=>({
            ...prevState,
            [type]:{
              ...prevState?.[type],
              [fieldName === 'prompt' ?'prompt':'to']:value
            }
          }));

          return onChangeField(value);
        },1000);
  }
  
  const onTransformHandler=async ()=>{
      setIsTransforming(true);

      setTransformationConfig(deepMergeObjects(newTransformation,transformationConfig))

      setnewTransformation(null);

      startTransition(async ()=>{
         
      });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        <CustomField
          control={form.control}
          name="title"
          formLabel='Image Title'
          className='w-full'
          render={({ field }) => <Input {...field}
            className='input-field' />}
        />

        {/* FILL type */}
        {type == "fill" && (
          <CustomField
          control={form.control}
          name="aspectRatio"
          formLabel='Aspect Ratio'
          className='w-full'
            render={({ field }) => (
              <Select onValueChange={(value)=>onSelectFieldHandler(value,field.onChange)} value={field.value}>
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key)=>(
                    <SelectItem key={key} value={key} 
                    className='select-item'>
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            )}
          />
        )}

        {/* remove and recolor  */}
         
         {(type === 'remove' || type === 'recolor') && (

          <div className='prompt-field'>
          <CustomField 
           control={form.control}
            name="prompt"
            formLabel={
              type==='remove'?'Object to Remove':'Object to recolor'
            }
            className='w-full'
            render={({field})=>(
              <Input
              value={field.value}
              className='input-field'
              onChange={(e)=>onInputChangeHandler('prompt',e.target.value,type,field.onChange)}
              />
            )}
          />
          
          {type==='recolor' && (
            <CustomField
            control={form.control}
            name="color"
            formLabel='Replacement Color'
            className='w-full'
            render={({field})=>(
              <Input
              value={field.value}
              className='input-field'
              onChange={(e)=>onInputChangeHandler('color',e.target.value,'recolor',field.onChange)}
              />
            )}
            />
          )}
          </div>
         )}

         <div className='media-uploader-field'>
          <CustomField
           control={form.control}
           name="publicId"
           className='flex size-full flex-col'
           render={({field})=>(
            <MediaUploader
            onValueChange={field.onChange}
            setImage={setImage}
            publicId={field.value}
            image={image}
            type={type}
            />
           )}
          />
         </div>
         <div className='flex flex-col gap-4'>

         <button 
         type='button'
         className='submit-button capitalize'
         disabled={isTransforming || newTransformation===null}
         onClick={onTransformHandler}
         >{isTransforming?'Transforming....':'Apply Transformation'}</button>
         
         <button 
         type='submit'
         className='submit-button capitalize bg color-black'
         disabled={isSubmitting}
         >{isSubmitting?'Submitting...':'Save Image'}</button>
         </div>

         
         
      </form>
    </Form>
  )
}

export default TransformationForm