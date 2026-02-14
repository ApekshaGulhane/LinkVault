import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SharePage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/${id}`
        );
        setData(response.data);
      } catch (err) {
        setError("Link expired or not found");
      }
    };

    fetchData();
  }, [id]);

  if (error) return <h2>{error}</h2>;
  if (!data) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>Shared Content</h2>
      {data.text && <p>{data.text}</p>}

      {data.fileUrl && (
        <a
          href={`http://localhost:5001/download/${id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download File
        </a>
      )}

      <p>Expires at: {new Date(data.expiresAt).toLocaleString()}</p>
    </div>
  );
}

export default SharePage;

