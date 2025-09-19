import Image from "../model/image.model.js";
import { User } from "../model/user.model.js";

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileData = {
            name: req.file.key,
            location: req.file.location,
            size: req.file.size,
        };

        const image = await Image.create(fileData);

        const userId = req.user_id;

        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { images: image._id } },
            { new: true }
        );


        return res.status(200).json({
            message: "File uploaded successfully",
        });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: "Upload failed" });
    }
};

export const getImages = async (req, res) => {
    try {

        const user = await User.findById(req.user_id).populate("images");
        const images = user.images;

        return res.status(200).json({
            message: "Images Fetched Successfully",
            images,
            size: images.length,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return res.status(500).json({ error: "Upload failed" });
    }
};
