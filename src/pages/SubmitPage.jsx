import { useState } from "react";

function SubmitPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!title || !description) {
      setMessage("Заполните все поля");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");

    const newArticle = {
      title,
      description,
      author: userEmail,
      status: "submitted",
    };

    const articles = JSON.parse(localStorage.getItem("articles")) || [];
    articles.push(newArticle);
    localStorage.setItem("articles", JSON.stringify(articles));

    setMessage("Статья отправлена");
    setTitle("");
    setDescription("");
  }

  return (
    <div style={{ marginTop: "30px", maxWidth: "700px" }}>
      <h1 style={{ marginBottom: "10px" }}>Подать статью</h1>
      <p style={{ marginBottom: "25px" }}>
        Заполните форму и отправьте новую статью.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "24px",
          backgroundColor: "#fafafa",
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Название статьи
          </label>
          <input
            type="text"
            placeholder="Введите название статьи"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "bold",
            }}
          >
            Описание статьи
          </label>
          <textarea
            placeholder="Введите описание статьи"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="6"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              resize: "vertical",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "200px",
            padding: "12px",
            fontSize: "16px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#dcdcdc",
            cursor: "pointer",
          }}
        >
          Отправить статью
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "16px", color: message === "Статья отправлена" ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default SubmitPage;