export function Input({ label, error, ...props }) {
  return (
    <label className="form-field">
      {label && <span className="form-label">{label}</span>}
      <input className="form-input" {...props} />
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
