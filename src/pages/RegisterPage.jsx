import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("author");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setError("Заполните email и пароль");
      setSuccess("");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const alreadyExists = users.find((user) => user.email === email);

    if (alreadyExists) {
      setError("Пользователь с таким email уже существует");
      setSuccess("");
      return;
    }

    const newUser = { email, password, role };
    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    setError("");
    setSuccess("Регистрация прошла успешно");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h1>Регистрация</h1>

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

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option value="author">Автор</option>
          <option value="reviewer">Рецензент</option>
          <option value="chair">Председатель</option>
          <option value="admin">Администратор</option>
          <option value="guest">Гость</option>
        </select>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  );
}

export default RegisterPage;