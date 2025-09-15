import React, { useState } from "react";
import axios from "axios";
const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleUploadFile = (e) => {
    console.log(e.target.files);
    setSelectedFile(e.target.files[0]);
  };

  const handleSendFileToCloud = async () => {
    const formdata = new FormData();
    formdata.append('photo', selectedFile);

    const res = await axios.post(
      "http://localhost:5000/api/images/upload",
      formdata,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(res);
  };
  return (
    <div className="min-h-screen w-full container m-auto text-text-primary-dark pt-10">
      <div className="flex w-full justify-around flex-wrap items-center border border-border-strong-dark rounded-2xl px-5 py-10 gap-2">
        <div className="text-2xl w-[60%]">
          Welcome to the gallery — a collection of visuals that freeze fleeting
          moments into stories. Each image is more than pixels; it’s a frame of
          emotion, memory, and perspective.
        </div>
        <div className="flex flex-col items-center justify-center w-fit h-fit">
          <form>
            <label
              htmlFor="file"
              className="cursor-pointer px-16 py-8 rounded-[40px] border-2 border-dashed border-[#666] shadow-[0px_0px_200px_-50px_rgba(0,0,0,0.5)] text-[#eee] flex flex-col items-center justify-center"
            >
              <svg
                viewBox="0 0 640 512"
                className="h-12 fill-[#666] hover:fill-[#888] mb-5"
              >
                <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
              </svg>
              <span className="bg-[#666] px-4 py-1 rounded-lg text-[#eee] transition-all duration-300 hover:bg-[#888] hover:text-white">
                Browse file
              </span>
              <input
                onChange={(e) => {
                  handleUploadFile(e);
                }}
                id="file"
                type="file"
                accept="image/*"
                className="hidden"
                name="photo"
              />
            </label>
          </form>

          {selectedFile && (
            <div className="w-full flex flex-col justify-center items-center bg-bg-secondary-dark rounded-md p-2 mt-4 gap-2">
              {selectedFile.name}
              <span
                className="bg-accent-dark hover:bg-accent-hover-dark w-fit px-4 py-1 rounded-lg text-[#eee] transition-all duration-300  hover:text-white cursor-pointer"
                onClick={handleSendFileToCloud}
              >
                Upload to Cloud
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
