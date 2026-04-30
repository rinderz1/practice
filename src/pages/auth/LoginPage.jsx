import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError("Заполните email и пароль");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <ErrorMessage message={formError} />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Вход..." : "Войти"}
        </Button>
      </form>
    </div>
  );
}
