import axios from "axios";
import { API } from "../BackendApi.js";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Download() {
  const { userName, fullName, avatar, userProffesion } = useSelector(
    (state) => state.user
  );

  /* ---------------- CSV DOWNLOAD (UNCHANGED) ---------------- */
  const downloadCSV = async () => {
    try {
      const res = await axios.get(`${API}/api/download-csv`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "weather_pollution_data.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  /* ---------------- INSIGHTS STATE ---------------- */
  const [insights, setInsights] = useState([]);

  /* ---------------- FETCH INSIGHTS ---------------- */
  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${API}/api/weather/insights`, {
        withCredentials: true,
      });
      setInsights(res.data.data || []);
    } catch (err) {
      console.log("Failed to load insights");
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen bg-[#4337e6] flex justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-6">
        {/* ---------------- PROFILE ---------------- */}
        <div className="flex flex-col items-center text-center">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#4337e6]"
          />

          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            {fullName || "User Name"}
          </h2>

          <p className="text-sm text-gray-500">@{userName || "username"}</p>

          {userProffesion && (
            <p className="mt-1 text-xs text-gray-400">{userProffesion}</p>
          )}
        </div>

        {/* ---------------- CSV DOWNLOAD ---------------- */}
        <button
          onClick={downloadCSV}
          className="w-full py-3 rounded-xl bg-[#4337e6] text-white text-sm font-semibold hover:opacity-90 transition">
          Download Analytics CSV
        </button>

        {/* ---------------- INSIGHTS LIST ---------------- */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-center text-gray-700">
            Published Insights
          </h3>

          {insights.length === 0 && (
            <p className="text-xs text-center text-gray-400">
              No insights available
            </p>
          )}

          {insights.map((item, index) => (
            <div key={item._id} className="border rounded-xl p-3 space-y-2">
              {/* Sequential Number */}
              <p className="text-xs text-gray-400">Insight #{index + 1}</p>

              {/* Title */}
              {item.title && (
                <h4 className="text-sm font-semibold text-gray-800">
                  {item.title}
                </h4>
              )}

              {/* Description */}
              {item.description && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              )}

              {/* Image */}
              {item.image && (
                <img
                  src={item.image}
                  alt="Insight"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// import axios from "axios";
// import { API } from "../BackendApi.js";
// import { useSelector } from "react-redux";

// export default function Download() {
//   const { userName, fullName, avatar, userProffesion } = useSelector(
//     (state) => state.user
//   );

//   const downloadCSV = async () => {
//     try {
//       const res = await axios.get(`${API}/api/download-csv`, {
//         responseType: "blob",
//       });

//       const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "weather_pollution_data.csv";

//       document.body.appendChild(link);
//       link.click();

//       link.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("CSV download failed:", error);
//       alert("Download failed. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#4337e6] flex items-center justify-center px-4">
//       <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6">

//         {/* Profile Section */}
//         <div className="flex flex-col items-center text-center">
//           <img
//             src={avatar}
//             alt="User Avatar"
//             className="w-24 h-24 rounded-full object-cover border-4 border-[#4337e6]"
//           />

//           <h2 className="mt-4 text-lg font-semibold text-gray-800">
//             {fullName || "User Name"}
//           </h2>

//           <p className="text-sm text-gray-500">
//             @{userName || "username"}
//           </p>

//           {userProffesion && (
//             <p className="mt-1 text-xs text-gray-400">
//               {userProffesion}
//             </p>
//           )}
//         </div>

//         {/* Divider */}
//         <div className="my-6 h-px bg-gray-200" />

//         {/* Download Info */}
//         <div className="text-center">
//           <h3 className="text-sm font-medium text-gray-700 mb-2">
//             Environment Data Export
//           </h3>

//           <p className="text-xs text-gray-500 mb-4">
//             Weather and Pollution data will be downloaded together in one CSV
//             file.
//           </p>

//           <button
//             onClick={downloadCSV}
//             className="w-full py-3 rounded-xl bg-[#4337e6] text-white text-sm font-semibold hover:opacity-90 transition"
//           >
//             Download CSV
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
