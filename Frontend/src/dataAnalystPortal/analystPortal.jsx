// import axios from "axios";
// import { API } from "../BackendApi.js";

// const downloadCSV = async () => {
//   try {
//     // if (!userId) {
//     //   navigate("/sign_in");
//     //   alert("Please sign in to download the CSV.");
//     //   return;
//     // }
//     const res = await axios.get(`${API}/api/download-csv`, {
//       responseType: "blob",
//     });
//     const url = window.URL.createObjectURL(new Blob([res.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", "weather_data.csv");
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   } catch (err) {
//     console.log("CSV download error", err);
//   }
// };

// export function AnalystPortal() {
//   return <div onClick={downloadCSV}>Download CSV</div>;
// }

import DataDownloadCard from "./DataDownloadCard.jsx";
import UploadPost from "./uploadPost.jsx"
import PostFeed from "../dataAnalystPortal/postFeed.jsx";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Data Analyst Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <DataDownloadCard />
        <UploadPost />
      </div>

      <PostFeed />
    </div>
  );
}