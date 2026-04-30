import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setError("Заполните email и пароль");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem("users")) || [];

      if (users.length === 0) {
        setError("Сначала зарегистрируйтесь");
        return;
      }

      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (!foundUser) {
        setError("Неверный email или пароль");
        return;
      }

      localStorage.setItem("isAuth", "true");
      localStorage.setItem("userEmail", foundUser.email);
      localStorage.setItem("userRole", foundUser.role || "guest");

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError("Ошибка при входе");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h1>Вход</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "300px",
        }}
      >
        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;