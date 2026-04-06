import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const navigate = useNavigate();

  const fetchSessions = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions);
    } catch (error) {
      console.log(error.response);
    }
  };

  const createSession = async () => {
    if (!role || !experience) return alert("Fill all fields");

    try {
      await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
        questions: [],
      });
    } catch (error) {
      console.log(error.response);
    }

    setRole("");
    setExperience("");
    fetchSessions();
  };

  // NEW: Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Delete the security key
    navigate("/login"); // Kick them back to the login screen
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header with Logout Button */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your interview preparation sessions
          </p>
        </div>
        
        <button
          onClick={handleLogout}
          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-slate-100">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Create New Session</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            placeholder="Enter Role (e.g. Frontend Developer)"
            value={role}
            className="border border-gray-200 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setRole(e.target.value)}
          />

          <input
            placeholder="Experience (e.g. 2 yrs)"
            value={experience}
            className="border border-gray-200 p-3 rounded-lg w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onChange={(e) => setExperience(e.target.value)}
          />

          <button
            onClick={createSession}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer font-medium"
          >
            + Create
          </button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg font-medium text-slate-600">No sessions yet 😕</p>
          <p className="text-sm mt-1">Create your first session to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sessions.map((s) => (
            <div
              key={s._id}
              onClick={() => navigate(`/interview/${s._id}`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group"
            >
              <h2 className="font-semibold text-lg text-slate-800 mb-1 group-hover:text-orange-500 transition-colors">{s.role}</h2>
              <p className="text-slate-500 text-sm">{s.experience} experience</p>
              <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-400 font-medium group-hover:text-orange-400 transition-colors">
                Click to start prep →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;