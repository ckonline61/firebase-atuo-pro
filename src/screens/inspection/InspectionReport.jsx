import Header from '../../components/Header';
import { sampleInspectionReport } from '../../data/mockData';
import './Inspection.css';

export default function InspectionReport() {
  const report = sampleInspectionReport;

  const getScoreClass = (score) => {
    if (score >= 8) return 'score-good';
    if (score >= 6) return 'score-ok';
    return 'score-bad';
  };

  return (
    <div className="screen screen-with-header" id="inspection-report-screen">
      <Header title="Inspection Report" rightAction={
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-700)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      } />
      <div className="screen-content">
        <h3 className="section-label">Overall Score</h3>
        <div className="report-score">
          <div className="report-score-circle">
            <span className="report-score-value">{report.overallScore}</span>
            <span className="report-score-total">/10</span>
          </div>
          <div>
            <p className="report-condition">{report.condition}</p>
            <p className="report-condition-note">{report.conditionNote}</p>
          </div>
        </div>

        <div className="report-categories">
          {report.categories.map((cat, i) => (
            <div key={i} className="report-category">
              <span className="report-category-dot" style={{ background: cat.score >= 8 ? 'var(--green)' : cat.score >= 6 ? 'var(--orange)' : 'var(--primary-red)' }}></span>
              <span className="report-category-name">{cat.name}</span>
              <span className={`report-category-score ${getScoreClass(cat.score)}`}>{cat.score}<span className="text-gray text-small">/10</span></span>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom-action">
        <button className="btn btn-primary" id="btn-download-report">
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
}
