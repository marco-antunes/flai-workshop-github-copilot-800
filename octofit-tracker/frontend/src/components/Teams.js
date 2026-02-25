import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
      : 'http://localhost:8000/api/teams/';
    console.log('Fetching teams from:', url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Teams data:', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-4"><strong>Error:</strong> {error}</div>;

  return (
    <div>
      <h2 className="page-heading">Teams</h2>
      <div className="row g-4">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6">
            <div className="card octofit-card h-100">
              <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{team.name}</span>
                <span className="badge bg-info text-dark">{(team.members || []).length} members</span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover octofit-table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(team.members || []).map((member, index) => (
                        <tr key={member.id}>
                          <td>{index + 1}</td>
                          <td><strong>{member.name}</strong></td>
                          <td><span className="badge bg-secondary">{member.username}</span></td>
                          <td><a href={`mailto:${member.email}`} className="text-decoration-none">{member.email}</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;

