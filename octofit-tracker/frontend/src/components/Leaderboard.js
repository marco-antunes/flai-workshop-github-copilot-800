import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${API_BASE}/api/leaderboard/`;
    console.log('Fetching leaderboard from:', url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Leaderboard data:', data);
        setEntries(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-4"><strong>Error:</strong> {error}</div>;

  const sorted = entries.slice().sort((a, b) => b.score - a.score);

  const rankClass = (i) => i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : '';
  const rankIcon  = (i) => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1;

  return (
    <div>
      <h2 className="page-heading">Leaderboard</h2>
      <div className="card octofit-card">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Rankings</span>
          <span className="badge bg-secondary">{sorted.length} athletes</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover octofit-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Athlete</th>
                  <th scope="col">Username</th>
                  <th scope="col">Team</th>
                  <th scope="col">Score</th>
                  <th scope="col">Total Calories</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((entry, index) => (
                  <tr key={entry.id}>
                    <td data-label="Rank" className={rankClass(index)}>
                      {rankIcon(index)}
                    </td>
                    <td data-label="Athlete"><strong>{entry.user ? entry.user.name : '—'}</strong></td>
                    <td data-label="Username">
                      {entry.user && entry.user.username
                        ? <span className="badge bg-secondary">{entry.user.username}</span>
                        : '—'}
                    </td>
                    <td data-label="Team">
                      {entry.team
                        ? <span className="badge bg-primary">{entry.team}</span>
                        : <span className="text-muted">—</span>}
                    </td>
                    <td data-label="Score">
                      <span className="badge bg-success fs-6">{entry.score}</span>
                    </td>
                    <td data-label="Total Calories">
                      <span className="fw-semibold text-danger">{entry.total_calories ? entry.total_calories.toLocaleString() : 0} kcal</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
