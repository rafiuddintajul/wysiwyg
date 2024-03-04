'use client'
import { ObjectId } from "mongoose"
import { TextEditor } from "./ui/textEditor"

export function TextEditorForm({ _id, content }:{ _id:ObjectId|undefined, content:string }) {

  const onSave = async (data:string) => {
    if (_id) {
      const res = await fetch('/api/contents', {
        method:'PATCH',
        body: JSON.stringify({
          _id:_id,
          content:data
        })
      })
      if (res.ok) {
        console.log('data saved')
      } else {
        console.log('failed to save data')
      }
    }else{
      const res = await fetch('/api/contents',{
        method:'POST',
        body: JSON.stringify({
          content:data
        })
      })
      if (res.ok) {
        console.log('data saved')
      } else {
        console.log('failed to save data')
      }
    }
  }

  return (
    <TextEditor state={content} namespace="testing" onSave={onSave} />
  )
}