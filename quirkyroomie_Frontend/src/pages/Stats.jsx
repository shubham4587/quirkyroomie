import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Stats = () => {
  const [offenders, setOffenders] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const off = await API.get("/flat/offenders");
        const typ = await API.get("/flat/types");
        setOffenders(off.data);
        setTypes(typ.data);
      } catch (err) {
        console.error("Statistics fetch failed", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">📊 Flat Statistics</h2>

      {/* ---------- Top Offenders ---------- */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-3">🚨 Most Complained‑About Users</h3>
        {offenders.length === 0 ? (
          <p className="text-sm text-gray-500">No data available.</p>
        ) : (
          <ul className="space-y-3">
            {offenders.map((u, idx) => (
              <li
                key={u._id || u.email}
                className="bg-white p-3 rounded shadow flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">
                    #{idx + 1} {u.name}
                  </div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </div>
                <div className="text-sm font-semibold text-red-600">
                  {u.totalComplaints} complaints
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------- Complaint Type Stats ---------- */}
      <section>
        <h3 className="text-lg font-semibold mb-3">🗂️ Top Complaint Categories</h3>
        {types.length === 0 ? (
          <p className="text-sm text-gray-500">No data available.</p>
        ) : (
          <ul className="space-y-3">
            {types.map((t) => (
              <li
                key={t._id}
                className="bg-white p-3 rounded shadow flex justify-between items-center capitalize"
              >
                <span>{t._id}</span>
                <span className="font-medium">{t.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---------- Back Links ---------- */}
      <div className="mt-10 flex justify-center gap-6 text-blue-600 underline">
        <Link to="/">← Complaints</Link>
        <Link to="/leaderboard">Leaderboard →</Link>
      </div>
    </div>
  );
};

export default Stats;
