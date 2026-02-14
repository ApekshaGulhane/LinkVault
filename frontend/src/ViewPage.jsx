import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ViewPage() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (enteredPassword = "") => {
    try {
      setError("");
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5001/${id}`,
        {
          params: enteredPassword
            ? { password: enteredPassword }
            : {},
        }
      );

      setData(response.data);
      setRequiresPassword(false);
    } catch (err) {
      if (err.response?.status === 401) {
        setRequiresPassword(true);
      } else if (err.response?.status === 403) {
        setError("Incorrect password or link expired.");
      } else if (err.response?.status === 410) {
        setError("Maximum views reached.");
      } else {
        setError("Link expired or not found.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handlePasswordSubmit = () => {
    if (!password) {
      alert("Enter password");
      return;
    }
    fetchData(password);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-lg text-center">

        <h1 className="text-3xl font-bold mb-6">📄 Shared Content</h1>

        {/* Password Required */}
        {requiresPassword && (
          <div className="space-y-4">
            <p>This link is password protected</p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
            />
            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
            >
              Unlock
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400">{error}</p>
        )}

        {/* Content */}
        {data && !requiresPassword && (
          <div className="space-y-4 text-left">

            {data.text && (
              <div>
                <p className="font-semibold">Text:</p>
                <p className="bg-gray-700 p-3 rounded-lg mt-2">
                  {data.text}
                </p>
              </div>
            )}

            {data.fileUrl && (
              <div>
                <p className="font-semibold">File:</p>
                <a
                  href={`http://localhost:5001/download/${id}`}
                  className="text-blue-400 underline"
                >
                  Download File
                </a>
              </div>
            )}

            <p className="text-sm text-gray-400">
              Expires at:{" "}
              {new Date(data.expiresAt).toLocaleString()}
            </p>

          </div>
        )}
        <button
  onClick={async () => {
    await axios.delete(`http://localhost:5001/delete/${id}`);
    alert("Link deleted");
    window.location.href = "/";
  }}
  className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
>
  Delete Link
</button>

      </div>
    </div>
  );
}

export default ViewPage;
