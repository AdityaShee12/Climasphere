import axios from "axios";
import { API } from "../BackendApi.js";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function AnalystPortal() {
  const { userName, fullName, avatar, userProffesion } = useSelector(
    (state) => state.user
  );

  /* ---------------- CSV DOWNLOAD ---------------- */
  const downloadCSV = async () => {
    const res = await axios.get(`${API}/api/download-csv`, {
      responseType: "blob",
      withCredentials: true,
    });

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

  const [loading, setLoading] = useState(false);

  /* ---------------- SAVED INSIGHTS STATE ---------------- */
  const [savedInsights, setSavedInsights] = useState([]);

  /* ---------------- FETCH SAVED INSIGHTS ---------------- */
  const fetchInsights = async () => {
    try {
      const res = await axios.get(`${API}/api/weather/insights`, {
        withCredentials: true,
      });
      setSavedInsights(res.data.data || []);
    } catch (err) {
      console.log("Failed to fetch insights");
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

      await axios.post(`${API}/api/weather/insights/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setInsights([{ title: "", description: "", image: null }]);
      fetchInsights(); // ✅ auto refresh

      alert("Insights uploaded successfully");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4337e6] flex justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-6">
        {/* ---------------- PROFILE ---------------- */}
        <div className="text-center">
          <img
            src={avatar}
            className="w-24 h-24 rounded-full mx-auto border-4 border-[#4337e6]"
          />
          <h2 className="mt-3 font-semibold">{fullName}</h2>
          <p className="text-sm text-gray-500">@{userName}</p>
          <p className="text-xs text-gray-400">{userProffesion}</p>
        </div>

        {/* ---------------- CSV ---------------- */}
        <button
          onClick={downloadCSV}
          className="w-full py-3 bg-[#4337e6] text-white rounded-xl text-sm font-semibold">
          Download Analytics CSV
        </button>

        {/* ---------------- UPLOAD FORM ---------------- */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-center">Upload Insights</h3>

          {insights.map((insight, index) => (
            <div
              key={index}
              className="border rounded-xl p-3 space-y-2 relative">
              {insights.length > 1 && (
                <button
                  onClick={() => removeInsight(index)}
                  className="absolute top-2 right-2 text-xs text-red-500">
                  Remove
                </button>
              )}

              <input
                type="text"
                placeholder="Insight title"
                value={insight.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />

              <textarea
                placeholder="Insight description"
                rows={3}
                value={insight.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleChange(index, "image", e.target.files[0])
                }
                className="text-sm"
              />
            </div>
          ))}

          <button
            onClick={addInsight}
            className="w-full py-2 border rounded-xl text-sm">
            + Add Another Insight
          </button>

          <button
            onClick={uploadInsights}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold disabled:opacity-50">
            {loading ? "Uploading..." : "Upload Insights"}
          </button>
        </div>

        {/* ---------------- SAVED INSIGHTS ---------------- */}
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-semibold text-center">Saved Insights</h3>

          {savedInsights.length === 0 && (
            <p className="text-xs text-center text-gray-400">
              No insights uploaded yet
            </p>
          )}

          {savedInsights.map((item) => (
            <div key={item._id} className="border rounded-xl p-3 space-y-2">
              {item.title && (
                <h4 className="text-sm font-semibold">Title : {item.title}</h4>
              )}

              {item.description && (
                <p className="text-xs text-gray-600">Description : {item.description}</p>
              )}

              {item.image && (
                <img
                  src={item.image}
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
