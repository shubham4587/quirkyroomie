import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await API.get("/flat/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">🏆 Full Leaderboard</h2>

      {leaders.length === 0 ? (
        <p className="text-center text-gray-500">No leaderboard data available.</p>
      ) : (
        <ul className="space-y-4">
          {leaders.map((user, index) => (
            <li
              key={user._id || user.email}
              className="bg-white p-4 rounded shadow flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-lg">
                  #{index + 1} {user.name}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
                {user.badges?.length > 0 && (
                  <div className="text-xs text-yellow-600 mt-1">
                    🏅 {user.badges.join(", ")}
                  </div>
                )}
              </div>

              <div className="text-xl font-bold text-blue-600">{user.karma} ⚡</div>
            </li>
          ))}
        </ul>
      )}

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link to="/" className="text-blue-600 underline">
          ← Back to Complaints
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;
