import { useState } from "react";

const statusMap = {
  submitted: { text: "Подана", color: "#888" },
  under_review: { text: "На рецензии", color: "#f0ad4e" },
  accepted: { text: "Принята", color: "green" },
  rejected: { text: "Отклонена", color: "red" },
};

function ReviewPage() {
  const [articles, setArticles] = useState(
    JSON.parse(localStorage.getItem("articles")) || []
  );
  const [message, setMessage] = useState("");

  const statusOptions = ["under_review", "accepted", "rejected"];

  function handleStatusChange(index, newStatus) {
    const updated = [...articles];
    updated[index] = {
      ...updated[index],
      status: newStatus,
    };

    localStorage.setItem("articles", JSON.stringify(updated));
    setArticles(updated);
    setMessage(`Статус статьи "${updated[index].title}" изменён на "${statusMap[newStatus].text}"`);
  }

  return (
    <div style={{ marginTop: "30px", maxWidth: "900px" }}>
      <h1 style={{ marginBottom: "10px" }}>Рецензирование</h1>
      <p style={{ marginBottom: "25px" }}>
        Здесь отображаются все статьи для проверки и изменения статуса.
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

      {articles.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            backgroundColor: "#fafafa",
          }}
        >
          <p style={{ margin: 0 }}>Пока нет статей для рецензирования.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {articles.map((article, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                backgroundColor: "#fafafa",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "10px" }}>
                {article.title}
              </h3>

              <p style={{ marginBottom: "12px" }}>{article.description}</p>

              <p style={{ marginBottom: "8px" }}>
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
                  onChange={(event) => handleStatusChange(index, event.target.value)}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewPage;
