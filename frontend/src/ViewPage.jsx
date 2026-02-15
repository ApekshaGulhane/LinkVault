import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-gray-900 flex items-center justify-center text-white">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-lg text-center transform hover:scale-105 transition duration-300">

        <h1 className="text-3xl font-bold mb-6">📄 Shared Content</h1>

        {localStorage.getItem("token") && (
          <button
            onClick={handleLogout}
           className="w-36 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 py-1 rounded-xl font-semibold shadow-lg"
          >
            Logout
          </button>
        )}


        {/* Password Required */}
        {requiresPassword && (
          <div className="space-y-4">
            <p>This link is password protected</p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handlePasswordSubmit}
             className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition-all duration-300 py-2 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/50"        
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
          <div className="space-y-1 text-left">

            {data.text && (
              <div>
                <p className="font-semibold">Text:</p>
                <p className="w-full p-4 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
                  {data.text}
                </p>
              </div>
            )}

            {data.fileUrl && (
              <div>
                <p className="font-semibold">File:</p>
                <a
                  href={`http://localhost:5001/download/${id}`}
                  className="w-1000 p-1 rounded-xl bg-black/40 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
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
        {localStorage.getItem("token") && (
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");

                await axios.delete(
                  `http://localhost:5001/delete/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );

                alert("Link deleted successfully");
                navigate("/upload");

              } catch (error) {
                alert("Delete failed");
              }
            }}
            className="w-36 bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition-transform duration-300 py-1 rounded-xl font-semibold shadow-lg"
          >
            Delete Link
          </button>
        )}
      </div>
    </div>
  );
}

export default ViewPage;
