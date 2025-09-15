import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    location: {
      type: String,
      required: true, 
    },
    size: {
      type: Number,
      required: true, 
    },
  },
  { timestamps: true } 
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
