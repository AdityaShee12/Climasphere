import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { insightAPI, downloadData } from "../api/api.js";

const DataAnalystPortal = () => {

    const { userName, fullName, avatar, userProffesion } = useSelector(
        (state) => state.user.user
    );
    console.log("DataAD", userName, fullName, avatar, userProffesion);

    /* ---------------- CSV DOWNLOAD ---------------- */
    const downloadCSV = async () => {
        const res = await downloadData.downloadCSV();

        const blob = new Blob([res.data], {
            type: "text/csv;charset=utf-8;",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "weather_pollution_analytics_data.csv";
        link.click();
        window.URL.revokeObjectURL(url);
    };

    /* ---------------- UPLOAD FORM STATE ---------------- */
    const [insights, setInsights] = useState([
        { title: "", description: "", image: null },
    ]);

    const [saveInsights, setSaveInsights] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ---------------- SAVED INSIGHTS STATE ---------------- */
    const [savedInsights, setSavedInsights] = useState([]);

    /* ---------------- FETCH INSIGHTS ---------------- */
    const fetchInsights = async () => {
        try {
            const res = await insightAPI.fetchInsight();
            console.log("Res", res);

            setSaveInsights(res.data || []);
        } catch (err) {
            console.log("Failed to load insights");
        }
    };

    useEffect(() => {
        fetchInsights();
    }, []);

    /* ---------------- FORM HANDLERS ---------------- */
    const addInsight = () => {
        setInsights([...insights, { title: "", description: "", image: null }]);
    };

    const removeInsight = (index) => {
        setInsights(insights.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const updated = [...insights];
        updated[index][field] = value;
        setInsights(updated);
    };

    /* ---------------- UPLOAD ---------------- */
    const uploadInsights = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", insights[0].title);
            formData.append("description", insights[0].description);

            insights.forEach((item) => {
                if (item.image) {
                    formData.append("insights", item.image);
                }
            });

            await insightAPI.uploadInsight(formData);

            setInsights([{ title: "", description: "", image: null }]);
            fetchInsights(); // ✅ auto refresh
            setLoading(false)
            alert("Insights uploaded successfully");
        } catch (err) {
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020817] px-6 py-8">
            <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-6">

                {/* ════════════ SIDEBAR ════════════ */}
                <aside className="w-full lg:w-[320px] lg:flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7 flex flex-col flex-1">

                        {/* ── Profile ── */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-28 h-28 rounded-full border-[3px] border-orange-500 overflow-hidden bg-slate-800 flex items-center justify-center mb-1">
                                <img
                                    src={avatar}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-slate-100 tracking-tight text-center">
                                {fullName}
                            </h2>
                            <p className="text-sm text-slate-500">@{userName}</p>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mt-1">
                                {userProffesion}
                            </span>
                        </div>

                        <div className="h-px bg-slate-800 my-6" />

                        {/* ── Stats ── */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Insights", value: saveInsights.length },
                                { label: "Cities", value: 20 }
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

                        {/* pushes button to bottom */}
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
                <div className="flex-1 min-w-0 flex flex-col gap-5">

                    {/* ── Upload Insights ── */}
                    <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-5">
                            Upload Insights
                        </p>

                        <div className="flex flex-col gap-4">
                            {insights.map((insight, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col gap-3 relative"
                                >
                                    {insights.length > 1 && (
                                        <button
                                            onClick={() => removeInsight(index)}
                                            className="absolute top-3.5 right-4 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-0.5 hover:bg-red-500/20 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}

                                    <input
                                        type="text"
                                        placeholder="Insight title"
                                        value={insight.title}
                                        onChange={(e) => handleChange(index, "title", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors"
                                    />

                                    <textarea
                                        placeholder="Insight description"
                                        rows={4}
                                        value={insight.description}
                                        onChange={(e) => handleChange(index, "description", e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none transition-colors"
                                    />

                                    <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer px-4 py-3 bg-slate-900 border border-dashed border-slate-700 rounded-xl hover:border-orange-500 hover:text-slate-300 transition-colors">
                                        <span className="truncate">
                                            {insight.image ? insight.image.name : "Choose image…"}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleChange(index, "image", e.target.files[0])}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={addInsight}
                                className="flex-1 py-3 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-100 rounded-[13px] text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            >
                                + Add Another Insight
                            </button>

                            <button
                                onClick={uploadInsights}
                                disabled={loading}
                                className="flex-[2] py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 rounded-[13px] text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Uploading..." : "Upload Insights"}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7 h-full flex flex-col">

                            {/* ── Section label ── */}
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-6">
                                Published Insights
                            </p>

                            {/* ── Empty state ── */}
                            {saveInsights.length === 0 && (
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
                                {saveInsights.map((item, index) => (
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

                </div>
                {/* end main col */}

            </div>
        </div>
    );
}

export default DataAnalystPortal;


// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import { insightAPI, downloadData } from "../api/api.js";

// const DataAnalystPortal = () => {

//     const { userName, fullName, avatar, userProffesion } = useSelector(
//         (state) => state.user.user
//     );
//     console.log("DataAD", userName, fullName, avatar, userProffesion);

//     /* ---------------- CSV DOWNLOAD ---------------- */
//     const downloadCSV = async () => {
//         const res = await downloadData.downloadCSV();

//         const blob = new Blob([res.data], {
//             type: "text/csv;charset=utf-8;",
//         });

//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = "weather_pollution_analytics_data.csv";
//         link.click();
//         window.URL.revokeObjectURL(url);
//     };

//     /* ---------------- UPLOAD FORM STATE ---------------- */
//     const [insights, setInsights] = useState([
//         { title: "", description: "", image: null },
//     ]);

//     const [loading, setLoading] = useState(false);

//     /* ---------------- SAVED INSIGHTS STATE ---------------- */
//     const [savedInsights, setSavedInsights] = useState([]);

//     /* ---------------- FETCH SAVED INSIGHTS ---------------- */
//     const fetchInsights = async () => {
//         try {
//             const res = await insightAPI.fetchInsight();
//             setSavedInsights(res.data.data || []);
//         } catch (err) {
//             console.log("Failed to fetch insights");
//         }
//     };

//     useEffect(() => {
//         fetchInsights();
//     }, []);

//     /* ---------------- FORM HANDLERS ---------------- */
//     const addInsight = () => {
//         setInsights([...insights, { title: "", description: "", image: null }]);
//     };

//     const removeInsight = (index) => {
//         setInsights(insights.filter((_, i) => i !== index));
//     };

//     const handleChange = (index, field, value) => {
//         const updated = [...insights];
//         updated[index][field] = value;
//         setInsights(updated);
//     };

//     /* ---------------- UPLOAD ---------------- */
//     const uploadInsights = async () => {
//         try {
//             setLoading(true);

//             const formData = new FormData();
//             formData.append("title", insights[0].title);
//             formData.append("description", insights[0].description);

//             insights.forEach((item) => {
//                 if (item.image) {
//                     formData.append("insights", item.image);
//                 }
//             });

//             await insightAPI.uploadInsight(formData);

//             setInsights([{ title: "", description: "", image: null }]);
//             fetchInsights(); // ✅ auto refresh

//             alert("Insights uploaded successfully");
//         } catch (err) {
//             alert("Upload failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#020817] px-6 py-8">
//             <div className="w-full max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col lg:flex-row gap-6">

//                 {/* ════════════ SIDEBAR ════════════ */}
//                 <aside className="w-full lg:w-[320px] lg:flex-shrink-0 flex flex-col gap-4">
//                     <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7 flex flex-col flex-1">

//                         {/* ── Profile ── */}
//                         <div className="flex flex-col items-center gap-2">
//                             <div className="w-28 h-28 rounded-full border-[3px] border-orange-500 overflow-hidden bg-slate-800 flex items-center justify-center mb-1">
//                                 <img
//                                     src={avatar}
//                                     alt={fullName}
//                                     className="w-full h-full object-cover"
//                                 />
//                             </div>
//                             <h2 className="text-xl font-bold text-slate-100 tracking-tight text-center">
//                                 {fullName}
//                             </h2>
//                             <p className="text-sm text-slate-500">@{userName}</p>
//                             <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full mt-1">
//                                 {userProffesion}
//                             </span>
//                         </div>

//                         <div className="h-px bg-slate-800 my-6" />

//                         {/* ── Stats ── */}
//                         <div className="grid grid-cols-2 gap-3">
//                             {[
//                                 { label: "Insights", value: savedInsights.length },
//                                 { label: "Cities", value: 20 }
//                             ].map(({ label, value }) => (
//                                 <div
//                                     key={label}
//                                     className="bg-slate-800 border border-slate-700 rounded-xl py-4 px-2 text-center"
//                                 >
//                                     <p className="text-2xl font-bold text-slate-100 leading-none">{value}</p>
//                                     <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-500 mt-2">
//                                         {label}
//                                     </p>
//                                 </div>
//                             ))}
//                         </div>

//                         {/* pushes button to bottom */}
//                         <div className="flex-1" />

//                         <div className="h-px bg-slate-800 my-6" />

//                         {/* ── Download CSV ── */}
//                         <button
//                             onClick={downloadCSV}
//                             className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white rounded-[13px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200"
//                         >
//                             Download Analytics CSV
//                         </button>
//                     </div>
//                 </aside>

//                 {/* ════════════ MAIN COLUMN ════════════ */}
//                 <div className="flex-1 min-w-0 flex flex-col gap-5">

//                     {/* ── Upload Insights ── */}
//                     <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7">
//                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-5">
//                             Upload Insights
//                         </p>

//                         <div className="flex flex-col gap-4">
//                             {insights.map((insight, index) => (
//                                 <div
//                                     key={index}
//                                     className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex flex-col gap-3 relative"
//                                 >
//                                     {insights.length > 1 && (
//                                         <button
//                                             onClick={() => removeInsight(index)}
//                                             className="absolute top-3.5 right-4 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-2 py-0.5 hover:bg-red-500/20 transition-colors"
//                                         >
//                                             Remove
//                                         </button>
//                                     )}

//                                     <input
//                                         type="text"
//                                         placeholder="Insight title"
//                                         value={insight.title}
//                                         onChange={(e) => handleChange(index, "title", e.target.value)}
//                                         className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors"
//                                     />

//                                     <textarea
//                                         placeholder="Insight description"
//                                         rows={4}
//                                         value={insight.description}
//                                         onChange={(e) => handleChange(index, "description", e.target.value)}
//                                         className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none resize-none transition-colors"
//                                     />

//                                     <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer px-4 py-3 bg-slate-900 border border-dashed border-slate-700 rounded-xl hover:border-orange-500 hover:text-slate-300 transition-colors">
//                                         <span className="truncate">
//                                             {insight.image ? insight.image.name : "Choose image…"}
//                                         </span>
//                                         <input
//                                             type="file"
//                                             accept="image/*"
//                                             className="hidden"
//                                             onChange={(e) => handleChange(index, "image", e.target.files[0])}
//                                         />
//                                     </label>
//                                 </div>
//                             ))}
//                         </div>

//                         <div className="flex gap-3 mt-5">
//                             <button
//                                 onClick={addInsight}
//                                 className="flex-1 py-3 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-100 rounded-[13px] text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
//                             >
//                                 + Add Another Insight
//                             </button>

//                             <button
//                                 onClick={uploadInsights}
//                                 disabled={loading}
//                                 className="flex-[2] py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 rounded-[13px] text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {loading ? "Uploading..." : "Upload Insights"}
//                             </button>
//                         </div>
//                     </div>

//                     {/* ── Saved Insights ── */}
//                     <div className="bg-slate-900 border border-slate-800 rounded-[20px] p-7 flex-1">
//                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-5">
//                             Saved Insights
//                         </p>

//                         {savedInsights.length === 0 ? (
//                             <div className="flex items-center justify-center h-40">
//                                 <p className="text-sm text-slate-600">No insights uploaded yet</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//                                 {savedInsights.map((item) => (
//                                     <div
//                                         key={item._id}
//                                         className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col gap-2.5"
//                                     >
//                                         {item.title && (
//                                             <p className="text-sm font-bold text-slate-100">{item.title}</p>
//                                         )}
//                                         {item.description && (
//                                             <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
//                                         )}
//                                         {item.image && (
//                                             <img
//                                                 src={item.image}
//                                                 alt={item.title}
//                                                 className="w-full h-36 object-cover rounded-xl mt-1"
//                                             />
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                 </div>
//                 {/* end main col */}

//             </div>
//         </div>
//     );
// }

// export default DataAnalystPortal;