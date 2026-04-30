export function Button({ children, type = "button", variant = "primary", disabled, ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`button button--${variant}`}
      {...props}
    >
      {children}
    </button>
  );
}
