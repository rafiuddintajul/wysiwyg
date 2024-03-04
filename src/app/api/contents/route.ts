import {connectDB} from "@/db"
import WysiwygContent from "@/db/models/content"

export const POST = async (req:Request) => {
  const newContent = await req.json()
  try {
    await connectDB()
    const contents = await WysiwygContent.create(newContent)
    return new Response(JSON.stringify(contents), {status:200})
  } catch (error) {
    return new Response(JSON.stringify({ message:'Failed to create data', data: error }), {status:500})  
  }
}

export const PATCH = async (req:Request) => {
  const data = await req.json()
  try {
    await connectDB()
    const contents = await WysiwygContent.findOneAndUpdate({ _id:data._id }, { content:data.content })
    return new Response(JSON.stringify(contents), {status:200})
  } catch (error) {
    return new Response(JSON.stringify({ message:'Failed to patch data', data: error }), {status:500})  
  }
}

export const GET = async () => {
  try {
    await connectDB()
    const contents = await WysiwygContent.find()
    return new Response(JSON.stringify(contents), {status:200})
  } catch (error) {
    return new Response(JSON.stringify({ message:'Failed to retrieve data', data: error }), {status:500})  
  }
}