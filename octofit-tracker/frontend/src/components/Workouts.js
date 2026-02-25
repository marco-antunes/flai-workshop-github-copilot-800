import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
      : 'http://localhost:8000/api/workouts/';
    console.log('Fetching workouts from:', url);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Workouts data:', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-4"><strong>Error:</strong> {error}</div>;

  const intensityClass = (level) =>
    level === 'High' ? 'badge-high' : level === 'Medium' ? 'badge-medium' : 'badge-low';

  return (
    <div>
      <h2 className="page-heading">Workouts</h2>
      <div className="row g-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-md-6">
            <div className="card octofit-card h-100">
              <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{workout.name}</span>
                <span className={`badge ${intensityClass(workout.intensity)}`}>{workout.intensity}</span>
              </div>
              <div className="card-body">
                <p className="card-text mb-3">{workout.description}</p>
                <table className="table table-sm octofit-table mb-0">
                  <tbody>
                    <tr>
                      <th scope="row" style={{width:'40%'}}>Type</th>
                      <td><span className="badge bg-info text-dark">{workout.workout_type || '—'}</span></td>
                    </tr>
                    <tr>
                      <th scope="row">Duration</th>
                      <td><strong>{workout.duration} min</strong></td>
                    </tr>
                    <tr>
                      <th scope="row">Intensity</th>
                      <td><span className={`badge ${intensityClass(workout.intensity)}`}>{workout.intensity}</span></td>
                    </tr>
                    <tr>
                      <th scope="row">Calories Burned</th>
                      <td><span className="fw-semibold text-danger">{workout.calories_burned ? workout.calories_burned.toLocaleString() : 0} kcal</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts;
