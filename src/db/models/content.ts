import { Schema, model, models  } from "mongoose";

const wysiwygContentSchema = new Schema({
  content:String
})

const WysiwygContent = models.WysiwygContent || model('WysiwygContent', wysiwygContentSchema)

export default WysiwygContent