import { useState } from "react";
import axios from "axios";

function UploadPage() {
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [link, setLink] = useState("");
    const [expiryOption, setExpiryOption] = useState("10");
    const [customMinutes, setCustomMinutes] = useState("");
    const [password, setPassword] = useState("");
    const [maxViews, setMaxViews] = useState("");



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

            let minutes;

            if (expiryOption === "custom") {
                if (!customMinutes || customMinutes <= 0) {
                    alert("Enter valid custom minutes");
                    return;
                }
                minutes = parseInt(customMinutes);
            } else {
                minutes = parseInt(expiryOption);
            }

            const expiryTime = new Date(Date.now() + minutes * 60 * 1000);


            const formData = new FormData();

            if (text) {
                formData.append("text", text);
            }

            if (file) {
                formData.append("file", file);
            }

            formData.append("expiry", expiryTime);
            if (password) {
                formData.append("password", password);
            }

            if (maxViews) {
                formData.append("maxViews", maxViews);
            }


            const response = await axios.post(
                "http://localhost:5001/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const id = response.data.link.split("/").pop();
            setLink(`http://localhost:5173/view/${id}`);


            setText("");
            setFile(null);

        } catch (error) {
            alert("Upload failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg">

                <h1 className="text-3xl font-bold mb-6 text-center">
                    🔐 LinkVault
                </h1>

                {/* Text Area */}
                <textarea
                    className="w-full p-4 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows="4"
                />

                {/* File Input */}
                <div className="mt-4">
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="w-full text-sm text-gray-300"
                    />
                </div>

                {/* Expiry Selector */}
                <select
                    value={expiryOption}
                    onChange={(e) => setExpiryOption(e.target.value)}

                    className="w-full mt-4 p-3 rounded-lg bg-gray-700 text-white"
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
                        className="w-full mt-3 p-3 rounded-lg bg-gray-700 text-white"
                    />
                )}

                {/* Password Protection */}
                <input
                    type="password"
                    placeholder="Optional password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 text-white"
                />

                {/* Max Views */}
                <input
                    type="number"
                    placeholder="Optional max views"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 text-white"
                />


                <button
                    onClick={handleUpload}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition py-3 rounded-lg font-semibold"
                >
                    Upload
                </button>

                {link && (
                    <div className="mt-6 bg-gray-700 p-4 rounded-lg space-y-3">
                        <p className="text-sm text-gray-300">Generated Link:</p>

                        <div className="flex items-center gap-2">
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline break-all"
                            >
                                {link}
                            </a>


                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(link);
                                    alert("Link copied!");
                                }}
                                className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm"
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
