import { useState } from "react";

export default function UploadPost() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const submitPost = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);

    await api.post("/posts", formData);
    alert("Post Uploaded");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Upload Photo / Video</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />
      <textarea
        placeholder="Write analysis or caption"
        className="w-full border rounded p-2 mb-3"
        onChange={(e) => setCaption(e.target.value)}
      />
      <button
        onClick={submitPost}
        className="bg-black text-white px-4 py-2 rounded">
        Upload
      </button>
    </div>
  );
}
