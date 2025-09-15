
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileData = {
      key: req.file.key,           // file key in S3
      bucket: req.file.bucket,     // bucket name
      location: req.file.location, // full S3 URL
      mimetype: req.file.mimetype,
      size: req.file.size,
    };

    // TODO: If you’re using MongoDB, save fileData in DB here

    return res.status(200).json({
      message: "File uploaded successfully",
      file: fileData,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
};
