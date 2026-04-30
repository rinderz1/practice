export function ErrorMessage({ message }) {
  return message ? <div className="message message--error">{message}</div> : null;
}
