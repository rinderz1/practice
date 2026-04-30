export function Textarea({ label, error, ...props }) {
  return (
    <label className="form-field">
      {label && <span className="form-label">{label}</span>}
      <textarea className="form-textarea" {...props} />
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
