import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ErrorMessage } from "../../components/ui/ErrorMessage";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!email || !password || !fullName) {
      setFormError("Заполните все поля");
      return;
    }

    try {
      setIsSubmitting(true);
      await register({ email, password, fullName });
      navigate("/dashboard");
    } catch (error) {
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <Input label="ФИО" type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input label="Пароль" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <ErrorMessage message={formError} />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
    </div>
  );
}
