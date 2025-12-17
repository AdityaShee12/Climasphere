

export default function DataDownloadCard() {
  const downloadData = async (type) => {
    const res = await api.get(`/data/download?type=${type}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${type}-data.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        Download Weather & Pollution Data
      </h2>
      <div className="flex gap-4">
        <button
          onClick={() => downloadData("weather")}
          className="px-4 py-2 bg-blue-600 text-white rounded">
          Weather CSV
        </button>
        <button
          onClick={() => downloadData("pollution")}
          className="px-4 py-2 bg-green-600 text-white rounded">
          Pollution CSV
        </button>
      </div>
    </div>
  );
}
