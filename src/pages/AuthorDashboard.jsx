import { Link } from "react-router-dom";

function AuthorDashboard() {
  const email = localStorage.getItem("userEmail");
  const role = localStorage.getItem("userRole") || "guest";
  const articles = JSON.parse(localStorage.getItem("articles")) || [];

  const myArticles = articles.filter((article) => article.author === email);

  return (
    <div style={{ marginTop: "30px" }}>
      <h1 style={{ marginBottom: "10px" }}>Кабинет пользователя</h1>
      <p style={{ marginBottom: "30px" }}>
        Добро пожаловать, {email} ({role === "author" ? "Автор" : role === "reviewer" ? "Рецензент" : role === "chair" ? "Председатель" : role === "admin" ? "Администратор" : "Гость"})
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "30px",
        }}
      >
        <Link
          to="/submit"
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            width: "220px",
            textDecoration: "none",
            color: "black",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Подать статью</h3>
          <p>Создать новую заявку и отправить статью.</p>
        </Link>

        <Link
          to="/articles"
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            width: "220px",
            textDecoration: "none",
            color: "black",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Мои статьи</h3>
          <p>Посмотреть список всех отправленных статей.</p>
        </Link>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          maxWidth: "500px",
          backgroundColor: "#fcfcfc",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Краткая информация</h3>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Количество моих статей:</strong> {myArticles.length}
        </p>
      </div>
    </div>
  );
}

export default AuthorDashboard;