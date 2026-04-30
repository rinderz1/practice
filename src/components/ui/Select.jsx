export function Select({ label, error, children, ...props }) {
  return (
    <label className="form-field">
      {label && <span className="form-label">{label}</span>}
      <select className="form-select" {...props}>
        {children}
      </select>
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
