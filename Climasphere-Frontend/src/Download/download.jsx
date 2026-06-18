import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { insightAPI, downloadData } from "../api/api.js";

const Download = () => {
  const { userName, fullName, avatar, userProffesion } = useSelector(
    (state) => state.user.user
  );

  /* ---------------- CSV DOWNLOAD (UNCHANGED) ---------------- */
  const downloadCSV = async () => {
    try {
      const res = await downloadData.downloadCSV();

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

  // /* ---------------- INSIGHTS STATE ---------------- */
  const [insights, setInsights] = useState([]);

  /* ---------------- FETCH INSIGHTS ---------------- */
  const fetchInsights = async () => {
    try {
      const res = await insightAPI.fetchInsight();
      console.log("Res", res);

      setInsights(res.data || []);
    } catch (err) {
      console.log("Failed to load insights");
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen bg-[#020817] px-6 py-8">
      <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-6">

        {/* ════════════ SIDEBAR ════════════ */}
        <aside className="w-full lg:w-[320px] lg:flex-shrink-0">
          <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7 flex flex-col h-full">

            {/* ── Profile ── */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 rounded-full border-[3px] border-orange-500 overflow-hidden bg-slate-800 flex items-center justify-center mb-1">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight text-center">
                {fullName || "User Name"}
              </h2>
              <p className="text-sm text-slate-500">@{userName || "username"}</p>
              {userProffesion && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mt-1">
                  {userProffesion}
                </span>
              )}
            </div>

            <div className="h-px bg-slate-800 my-6" />

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Insights", value: insights.length },
                { label: "Cities", value: 8 },
                { label: "Reports", value: 340 },
                { label: "Rating", value: "4.9" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-slate-800 border border-slate-700 rounded-xl py-4 px-2 text-center"
                >
                  <p className="text-2xl font-bold text-slate-100 leading-none">{value}</p>
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mt-2">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* spacer pushes button to bottom */}
            <div className="flex-1" />

            <div className="h-px bg-slate-800 my-6" />

            {/* ── Download CSV ── */}
            <button
              onClick={downloadCSV}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-[13px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200"
            >
              Download Analytics CSV
            </button>
          </div>
        </aside>

        {/* ════════════ MAIN COLUMN ════════════ */}
        <div className="flex-1 min-w-0">
          <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7 h-full flex flex-col">

            {/* ── Section label ── */}
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-6">
              Published Insights
            </p>

            {/* ── Empty state ── */}
            {insights.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
                <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                <p className="text-sm text-slate-600">No insights available</p>
              </div>
            )}

            {/* ── Insights grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {insights.map((item, index) => (
                <div
                  key={item._id}
                  className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col gap-3 hover:border-slate-600 transition-colors"
                >
                  {/* Index badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
                      Insight #{index + 1}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[9px] font-bold text-orange-400">
                      {index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  {item.title && (
                    <h4 className="text-sm font-bold text-slate-100 leading-snug">
                      {item.title}
                    </h4>
                  )}

                  {/* Description */}
                  {item.description && (
                    <p className="text-xs text-slate-500 leading-relaxed flex-1">
                      {item.description}
                    </p>
                  )}

                  {/* Image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt="Insight"
                      className="w-full h-36 object-cover rounded-xl mt-1"
                    />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
        {/* end main col */}

      </div>
    </div>
  );
}

export default Download;


// import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
// import { insightAPI, downloadData } from "../api/api.js";

// const Download = () => {
//   const { userName, fullName, avatar, userProffesion } = useSelector(
//     (state) => state.user.user
//   );

//   /* ---------------- CSV DOWNLOAD (UNCHANGED) ---------------- */
//   const downloadCSV = async () => {
//     try {
//       const res = await downloadData.downloadCSV();

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

//   /* ---------------- INSIGHTS STATE ---------------- */
//   const [insights, setInsights] = useState([]);

//   /* ---------------- FETCH INSIGHTS ---------------- */
//   const fetchInsights = async () => {
//     try {
//       const res = await insightAPI.fetchInsight();
//       console.log("Res", res);

//       setInsights(res.data || []);
//     } catch (err) {
//       console.log("Failed to load insights");
//     }
//   };

//   useEffect(() => {
//     fetchInsights();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#020817] px-6 py-8">
//       <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-6">

//         {/* ════════════ SIDEBAR ════════════ */}
//         <aside className="w-full lg:w-[320px] lg:flex-shrink-0">
//           <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7 flex flex-col h-full">

//             {/* ── Profile ── */}
//             <div className="flex flex-col items-center gap-2">
//               <div className="w-28 h-28 rounded-full border-[3px] border-orange-500 overflow-hidden bg-slate-800 flex items-center justify-center mb-1">
//                 <img
//                   src={avatar}
//                   alt="User Avatar"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <h2 className="text-xl font-bold text-slate-100 tracking-tight text-center">
//                 {fullName || "User Name"}
//               </h2>
//               <p className="text-sm text-slate-500">@{userName || "username"}</p>
//               {userProffesion && (
//                 <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mt-1">
//                   {userProffesion}
//                 </span>
//               )}
//             </div>

//             <div className="h-px bg-slate-800 my-6" />

//             {/* ── Stats ── */}
//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 { label: "Insights", value: insights.length },
//                 { label: "Cities", value: 8 },
//                 { label: "Reports", value: 340 },
//                 { label: "Rating", value: "4.9" },
//               ].map(({ label, value }) => (
//                 <div
//                   key={label}
//                   className="bg-slate-800 border border-slate-700 rounded-xl py-4 px-2 text-center"
//                 >
//                   <p className="text-2xl font-bold text-slate-100 leading-none">{value}</p>
//                   <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mt-2">
//                     {label}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* spacer pushes button to bottom */}
//             <div className="flex-1" />

//             <div className="h-px bg-slate-800 my-6" />

//             {/* ── Download CSV ── */}
//             <button
//               onClick={downloadCSV}
//               className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-[13px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200"
//             >
//               Download Analytics CSV
//             </button>
//           </div>
//         </aside>

//         {/* ════════════ MAIN COLUMN ════════════ */}
//         <div className="flex-1 min-w-0">
//           <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7 h-full flex flex-col">

//             {/* ── Section label ── */}
//             <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-6">
//               Published Insights
//             </p>

//             {/* ── Empty state ── */}
//             {insights.length === 0 && (
//               <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
//                 <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                     <polyline points="14 2 14 8 20 8" />
//                     <line x1="12" y1="18" x2="12" y2="12" />
//                     <line x1="9" y1="15" x2="15" y2="15" />
//                   </svg>
//                 </div>
//                 <p className="text-sm text-slate-600">No insights available</p>
//               </div>
//             )}

//             {/* ── Insights grid ── */}
//             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//               {insights.map((item, index) => (
//                 <div
//                   key={item._id}
//                   className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col gap-3 hover:border-slate-600 transition-colors"
//                 >
//                   {/* Index badge */}
//                   <div className="flex items-center justify-between">
//                     <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">
//                       Insight #{index + 1}
//                     </span>
//                     <span className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[9px] font-bold text-orange-400">
//                       {index + 1}
//                     </span>
//                   </div>

//                   {/* Title */}
//                   {item.title && (
//                     <h4 className="text-sm font-bold text-slate-100 leading-snug">
//                       {item.title}
//                     </h4>
//                   )}

//                   {/* Description */}
//                   {item.description && (
//                     <p className="text-xs text-slate-500 leading-relaxed flex-1">
//                       {item.description}
//                     </p>
//                   )}

//                   {/* Image */}
//                   {item.image && (
//                     <img
//                       src={item.image}
//                       alt="Insight"
//                       className="w-full h-36 object-cover rounded-xl mt-1"
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>
//         {/* end main col */}

//       </div>
//     </div>
//   );
// }

// export default Download;