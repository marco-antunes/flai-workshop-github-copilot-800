import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = () => {
    const usersUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`
      : 'http://localhost:8000/api/users/';
    const teamsUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
      : 'http://localhost:8000/api/teams/';
    console.log('Fetching users from:', usersUrl);
    console.log('Fetching teams from:', teamsUrl);
    Promise.all([fetch(usersUrl).then(r => r.json()), fetch(teamsUrl).then(r => r.json())])
      .then(([usersData, teamsData]) => {
        console.log('Users data:', usersData);
        console.log('Teams data:', teamsData);
        setUsers(Array.isArray(usersData) ? usersData : usersData.results || []);
        setTeams(Array.isArray(teamsData) ? teamsData : teamsData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const getUserTeam = (userId) => {
    const team = teams.find(t => (t.members || []).some(m => m.id === userId));
    return team ? team.id : '';
  };

  const openEdit = (user) => {
    setSaveError(null);
    setSaveSuccess(false);
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username || '',
      email: user.email,
      password: '',
      team_id: getUserTeam(user.id),
    });
  };

  const closeEdit = () => {
    setEditingUser(null);
    setFormData({});
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      // Build user update payload (omit empty password)
      const userPayload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        ...(formData.password ? { password: formData.password } : {}),
      };

      const base = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
        : 'http://localhost:8000';
      const userRes = await fetch(`${base}/api/users/${editingUser.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });
      if (!userRes.ok) {
        const err = await userRes.json();
        throw new Error(JSON.stringify(err));
      }

      // Assign team
      await fetch(`${base}/api/users/${editingUser.id}/assign_team/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: formData.team_id || null }),
      });

      setSaveSuccess(true);
      fetchData();
      setTimeout(closeEdit, 900);
    } catch (err) {
      console.error('Save error:', err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-4"><strong>Error:</strong> {error}</div>;

  return (
    <div>
      <h2 className="page-heading">Users</h2>
      <div className="card octofit-card">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <span className="fw-semibold">All Users</span>
          <span className="badge bg-secondary">{users.length} total</span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover octofit-table mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Team</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const team = teams.find(t => (t.members || []).some(m => m.id === user.id));
                  return (
                    <tr key={user.id}>
                      <td data-label="#">{index + 1}</td>
                      <td data-label="Name"><strong>{user.name}</strong></td>
                      <td data-label="Username"><span className="badge bg-secondary">{user.username}</span></td>
                      <td data-label="Email"><a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a></td>
                      <td data-label="Team">
                        {team
                          ? <span className="badge bg-primary">{team.name}</span>
                          : <span className="text-muted">—</span>}
                      </td>
                      <td data-label="Actions">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(user)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Edit User — {editingUser.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeEdit}></button>
              </div>
              <div className="modal-body">
                {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
                {saveSuccess && <div className="alert alert-success py-2">Saved successfully!</div>}
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      value={formData.username || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password <small className="text-muted fw-normal">(leave blank to keep current)</small></label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password || ''}
                      onChange={handleChange}
                      placeholder="New password (optional)"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Team</label>
                    <select
                      className="form-select"
                      name="team_id"
                      value={formData.team_id || ''}
                      onChange={handleChange}
                    >
                      <option value="">— No Team —</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeEdit} disabled={saving}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving…</> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;

