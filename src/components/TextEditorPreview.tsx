export const TextEditorPreview = ({ content }:{ content:string|undefined }) => {

  return (
    <div dangerouslySetInnerHTML={{ __html:content ?? '<p>error</p>' }} className="w-full h-full">
      
    </div>
  )
}