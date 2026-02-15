import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UploadPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };


    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [link, setLink] = useState("");
    const [expiryOption, setExpiryOption] = useState("10");
    const [customMinutes, setCustomMinutes] = useState("");
    const [password, setPassword] = useState("");
    const [maxViews, setMaxViews] = useState("");

    // Protect page (redirect if not logged in)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const handleUpload = async () => {
        try {
            if (!text && !file) {
                alert("Please provide text or file");
                return;
            }

            if (text && file) {
                alert("Upload either text OR file, not both");
                return;
            }

            let minutes =
                expiryOption === "custom"
                    ? parseInt(customMinutes)
                    : parseInt(expiryOption);

            const expiryTime = new Date(Date.now() + minutes * 60 * 1000);

            const formData = new FormData();
            if (text) formData.append("text", text);
            if (file) formData.append("file", file);
            formData.append("expiry", expiryTime);
            if (password) formData.append("password", password);
            if (maxViews) formData.append("maxViews", maxViews);

            //  GET TOKEN HERE
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5001/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const id = response.data.link.split("/").pop();
            setLink(`http://localhost:5173/view/${id}`);

            setText("");
            setFile(null);
        } catch (error) {
            console.log(error.response?.data);
            alert("Upload failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 flex items-center justify-center text-white">
           < div className="backdrop-blur-xl bg-white/5 border border-white/10 p-10 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] w-full max-w-lg transform hover:scale-105 transition duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        🔐 LinkVault
                    </h1>

                    <button
                        onClick={handleLogout}
                        className="w-36 bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-transform duration-300 py-1 rounded-xl font-semibold shadow-lg"
                    >
                        Logout
                    </button>
                </div>


                <textarea
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Enter text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="4"
                />

                <div className="mt-4">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <select
                    value={expiryOption}
                    onChange={(e) => setExpiryOption(e.target.value)}
                    className="w-full p-2 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"

                >
                    <option value="10">Expire in 10 minutes</option>
                    <option value="60">Expire in 1 hour</option>
                    <option value="1440">Expire in 1 day</option>
                    <option value="custom">Custom</option>
                </select>

                {expiryOption === "custom" && (
                    <input
                        type="number"
                        placeholder="Enter minutes"
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(e.target.value)}
                        className="w-full p-2 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"

                    />
                )}

                <input
                    type="password"
                    placeholder="Optional password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                   className="w-full p-2 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"

                />

                <input
                    type="number"
                    placeholder="Optional max views"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    className="w-full p-2 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"

                />

                <button
                    onClick={handleUpload}
                    className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition-all duration-300 py-2 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50"
                >
                    Upload
                </button>

                {link && (
  <div className="mt-6 bg-white/10 backdrop-blur-md p-5 rounded-2xl space-y-4 border border-white/20">

    <p className="text-sm text-gray-300 text-center">
      🔗 Your Generated Link
    </p>

    <div className="flex items-center justify-between gap-3 bg-black/30 p-3 rounded-xl">

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-300 break-all text-sm"
      >
        {link}
      </a>

      <button
        onClick={() => {
          navigator.clipboard.writeText(link);
          alert("Link copied to clipboard ");
        }}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-all duration-300 text-sm"
      >
        Copy
      </button>

    </div>

  </div>

)}

    </div>
  </div>
);
}

export default UploadPage;
