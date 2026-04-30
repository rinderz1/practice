import { useState } from "react";


const statusMap = {
  submitted: { text: "Подана", color: "#888" },
  under_review: { text: "На рецензии", color: "#f0ad4e" },
  accepted: { text: "Принята", color: "green" },
  rejected: { text: "Отклонена", color: "red" },
};

function ArticlesPage() {
  const userEmail = localStorage.getItem("userEmail");

  const [articles, setArticles] = useState(
    JSON.parse(localStorage.getItem("articles")) || []
  );

  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const statusOptions = ["under_review", "accepted", "rejected"];
  const [message, setMessage] = useState("");

  const myArticles = articles.filter((article) => article.author === userEmail);

  function handleDelete(indexToDelete) {
    const updatedArticles = articles.filter((_, index) => index !== indexToDelete);

    localStorage.setItem("articles", JSON.stringify(updatedArticles));
    setArticles(updatedArticles);
    setMessage("Статья удалена");
  }

  function handleEdit(index) {
    setEditingIndex(index);
    setEditTitle(articles[index].title);
    setEditDescription(articles[index].description);
  }

  function handleSave(index) {
    if (!editTitle || !editDescription) {
      return;
    }

    
    const updatedArticles = [...articles];
    updatedArticles[index] = {
      ...updatedArticles[index],
      title: editTitle,
      description: editDescription,
    };

    localStorage.setItem("articles", JSON.stringify(updatedArticles));
    setArticles(updatedArticles);
    setMessage("Изменения сохранены");

    setEditingIndex(null);
    setEditTitle("");
    setEditDescription("");
  }

  function handleCancel() {
    setEditingIndex(null);
    setEditTitle("");
    setEditDescription("");
  }

  function handleStatusChange(index, newStatus) {
  const updatedArticles = [...articles];

  updatedArticles[index] = {
    ...updatedArticles[index],
    status: newStatus,
  };

  localStorage.setItem("articles", JSON.stringify(updatedArticles));
  setArticles(updatedArticles);
  setMessage(`Статус изменён на "${statusMap[newStatus].text}"`);
}
  return (
    <div style={{ marginTop: "30px", maxWidth: "900px" }}>
      <h1 style={{ marginBottom: "10px" }}>Мои статьи</h1>
      <p style={{ marginBottom: "25px" }}>
        Здесь отображаются статьи, которые вы отправили.
      </p>

      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "12px 16px",
            border: "1px solid #cce5ff",
            borderRadius: "10px",
            backgroundColor: "#e9f7ff",
            color: "#1a4d7a",
          }}
        >
          {message}
        </div>
      )}

      {myArticles.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#fafafa",
          }}
        >
          <p style={{ margin: 0 }}>У вас пока нет отправленных статей.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {articles.map((article, index) =>
            article.author === userEmail ? (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: "#fafafa",
                }}
              >
                {editingIndex === index ? (
                  <>
                    <div style={{ marginBottom: "12px" }}>
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
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "12px" }}>
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
                        value={editDescription}
                        onChange={(event) =>
                          setEditDescription(event.target.value)
                        }
                        rows="5"
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          resize: "vertical",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => handleSave(index)}
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "#dcdcdc",
                          cursor: "pointer",
                        }}
                      >
                        Сохранить
                      </button>

                      <button
                        onClick={handleCancel}
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "#efefef",
                          cursor: "pointer",
                        }}
                      >
                        Отмена
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                      {article.title}
                    </h3>

                    <p style={{ marginBottom: "12px" }}>{article.description}</p>

                    <p style={{ marginBottom: "16px" }}>
                      <strong>Автор:</strong> {article.author}
                    </p>
                    <p style={{ marginBottom: "16px" }}>
                      <strong>Статус:</strong>{" "}
                      <span
                        style={{
                          color: statusMap[article.status || "submitted"].color,
                          fontWeight: "bold",
                        }}
                      >
                        {statusMap[article.status || "submitted"].text}
                      </span>
                    </p>

                    <div style={{ marginBottom: "16px" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        Поменять статус
                      </label>
                      <select
                        value={article.status === "submitted" ? "" : article.status}
                        onChange={(event) =>
                          handleStatusChange(index, event.target.value)
                        }
                        style={{
                          width: "100%",
                          maxWidth: "250px",
                          padding: "10px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          backgroundColor: "#fff",
                        }}
                      >
                        {article.status === "submitted" && (
                          <option value="" disabled>
                            {statusMap.submitted.text}
                          </option>
                        )}
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusMap[status].text}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleEdit(index)}
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "#e0e0e0",
                          cursor: "pointer",
                        }}
                      >
                        Редактировать
                      </button>

                      <button
                        onClick={() => handleDelete(index)}
                        style={{
                          padding: "10px 16px",
                          border: "none",
                          borderRadius: "8px",
                          backgroundColor: "#e0e0e0",
                          cursor: "pointer",
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

export default ArticlesPage;