import { TextEditorPreview } from '@/components/TextEditorPreview'
import { TextEditorForm } from '@/components/TextEditorForm'

async function getContent(){
  const res = await fetch('http://localhost:3000/api/contents/',{
    cache:"no-cache"
  })
  if (res.ok) {
    const content = await res.json()
    if (content.length !== 0) {
      return content[0]
    }
  }
  return { content:undefined }
}

export default async function Home() {
  const data = await getContent()
  if (data) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-[540px] h-80">
          <TextEditorForm _id={data._id ?? undefined } content={data.content} />
        </div>
        <div className="w-[540px] h-80">
          <TextEditorPreview content={data.content} />
        </div> 
      </main>
    )
  }
  return <div>Loading</div>
}
