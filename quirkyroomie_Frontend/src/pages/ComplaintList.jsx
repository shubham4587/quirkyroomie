import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

const ComplaintList = () => {
  const navigate = useNavigate();

  /* -------------------- state -------------------- */
  const [complaints, setComplaints] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const [topTypes, setTopTypes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "Other",
    severity: "Mild",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  /* -------------------- fetchers -------------------- */
  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/flat/leaderboard");
      setLeaders(res.data.slice(0, 3)); // preview top 3
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTopTypes = async () => {
    try {
      const res = await API.get("/flat/types");
      setTopTypes(res.data.slice(0, 3)); // preview top 3 categories
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
    fetchLeaderboard();
    fetchTopTypes();
  }, []);

  /* -------------------- handlers -------------------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/complaints", form);
      setForm({ title: "", description: "", type: "Other", severity: "Mild" });
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit complaint");
    }
  };

  const handleVote = async (id, voteType) => {
    try {
      await API.post(`/complaints/${id}/vote`, { voteType });
      fetchComplaints();
      fetchLeaderboard(); // votes may affect karma preview
    } catch (err) {
      alert(err.response?.data?.message || "Voting failed");
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await API.put(`/complaints/${id}/resolve`);
      setUser(res.data.user);          // update karma locally
      fetchComplaints();
      fetchLeaderboard();              // karma changed – refresh preview
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resolve");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header + user info */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-bold">Flatmate Complaints</h2>
        {user?.name && (
          <div className="text-sm text-gray-600">
            Logged in as <strong>{user.name}</strong> | Karma:{" "}
            <span className="font-semibold text-green-600">{user.karma}</span>
          </div>
        )}
      </div>

      {/* --- Leaderboard Preview --- */}
      <div
        className="bg-white p-4 shadow rounded mb-6 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => navigate("/leaderboard")}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">🏆 Top Flatmates (Top 3)</h3>
          <button
            className="text-sm text-blue-600 underline"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/leaderboard");
            }}
          >
            See full leaderboard →
          </button>
        </div>

        {leaders.length === 0 ? (
          <p className="text-sm text-gray-500">No data yet.</p>
        ) : (
          <ul className="space-y-1">
            {leaders.map((l, idx) => (
              <li key={l._id || l.email} className="flex justify-between text-sm">
                <span>
                  #{idx + 1} {l.name}
                </span>
                <span className="font-medium">{l.karma} ⚡</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Stats Preview --- */}
      <div
        className="bg-white p-4 shadow rounded mb-8 cursor-pointer hover:bg-gray-50 transition"
        onClick={() => navigate("/stats")}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">📊 Popular Complaint Categories</h3>
          <button
            className="text-sm text-blue-600 underline"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/stats");
            }}
          >
            View stats →
          </button>
        </div>

        {topTypes.length === 0 ? (
          <p className="text-sm text-gray-500">No data yet.</p>
        ) : (
          <ul className="space-y-1">
            {topTypes.map((t) => (
              <li
                key={t._id}
                className="flex justify-between text-sm capitalize"
              >
                <span>{t._id}</span>
                <span className="font-medium">{t.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- Complaint Form --- */}
      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded space-y-3 mb-6">
        <h3 className="text-lg font-semibold">Submit a Complaint</h3>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Complaint title"
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue..."
          required
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option>Noise</option>
            <option>Cleanliness</option>
            <option>Bills</option>
            <option>Pets</option>
            <option>Other</option>
          </select>

          <select
            name="severity"
            value={form.severity}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option>Mild</option>
            <option>Annoying</option>
            <option>Major</option>
            <option>Nuclear</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Complaint
        </button>
      </form>

      {/* --- Complaint List --- */}
      <div className="space-y-4">
        {complaints.length === 0 && <p>No active complaints yet.</p>}
        {complaints.map((c) => (
          <div key={c._id} className="bg-gray-100 p-4 rounded shadow">
            <h4 className="font-bold text-lg">{c.title}</h4>
            <p className="text-sm text-gray-600">{c.description}</p>

            <div className="text-xs text-gray-500 mt-1">
              Type: {c.type} | Severity: {c.severity}
            </div>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <button
                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm"
                onClick={() => handleVote(c._id, "upvote")}
              >
                👍 {c.votes}
              </button>
              <button
                className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                onClick={() => handleVote(c._id, "downvote")}
              >
                👎
              </button>

              {c.punishment && (
                <div className="text-sm text-purple-600 font-semibold">
                  🔥 Punishment: {c.punishment}
                </div>
              )}

              {c.resolved ? (
                <div className="ml-auto text-sm text-green-700">
                  ✅ Resolved
                </div>
              ) : (
                <button
                  className="ml-auto bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600"
                  onClick={() => handleResolve(c._id)}
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintList;







// import { useEffect, useState } from "react";
// import API from "../api/axios";

// const ComplaintList = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     type: "Other",
//     severity: "Mild",
//   });
//   const [error, setError] = useState("");

//   const fetchComplaints = async () => {
//     try {
//       const res = await API.get("/complaints");
//       setComplaints(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/complaints", form);
//       setForm({ title: "", description: "", type: "Other", severity: "Mild" });
//       fetchComplaints();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit complaint");
//     }
//   };

//   const handleVote = async (id, voteType) => {
//     try {
//       await API.post(`/complaints/${id}/vote`, { voteType });
//       fetchComplaints();
//     } catch (err) {
//       alert(err.response?.data?.message || "Voting failed");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h2 className="text-2xl font-bold text-center mb-4">Flatmate Complaints</h2>

//       {/* Complaint Form */}
//       <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded space-y-3 mb-6">
//         <h3 className="text-lg font-semibold">Submit a Complaint</h3>

//         {error && <div className="text-red-600 text-sm">{error}</div>}

//         <input
//           type="text"
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="Complaint title"
//           required
//           className="w-full p-2 border rounded"
//         />

//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Describe the issue..."
//           required
//           className="w-full p-2 border rounded"
//         />

//         <div className="flex gap-4">
//           <select
//             name="type"
//             value={form.type}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           >
//             <option>Noise</option>
//             <option>Cleanliness</option>
//             <option>Bills</option>
//             <option>Pets</option>
//             <option>Other</option>
//           </select>

//           <select
//             name="severity"
//             value={form.severity}
//             onChange={handleChange}
//             className="p-2 border rounded"
//           >
//             <option>Mild</option>
//             <option>Annoying</option>
//             <option>Major</option>
//             <option>Nuclear</option>
//           </select>
//         </div>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Submit Complaint
//         </button>
//       </form>

//       {/* Complaint List */}
//       <div className="space-y-4">
//         {complaints.length === 0 && <p>No active complaints yet.</p>}
//         {complaints.map((c) => (
//           <div key={c._id} className="bg-gray-100 p-4 rounded shadow">
//             <h4 className="font-bold text-lg">{c.title}</h4>
//             <p className="text-sm text-gray-600">{c.description}</p>

//             <div className="text-xs text-gray-500 mt-1">
//               Type: {c.type} | Severity: {c.severity}
//             </div>

//             <div className="flex items-center gap-4 mt-3">
//               <button
//                 className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm"
//                 onClick={() => handleVote(c._id, "upvote")}
//               >
//                 👍 {c.votes}
//               </button>
//               <button
//                 className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
//                 onClick={() => handleVote(c._id, "downvote")}
//               >
//                 👎
//               </button>

//               {c.punishment && (
//                 <div className="ml-auto text-sm text-purple-600 font-semibold">
//                   🔥 Punishment: {c.punishment}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ComplaintList;
