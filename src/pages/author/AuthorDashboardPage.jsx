import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";

export default function AuthorDashboardPage() {
  return (
    <div>
      <PageHeader title="Панель автора" subtitle="Ваши статьи и статусы" />
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "24px" }}>
        <Link
          to="/papers/submit"
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            width: "240px",
            textDecoration: "none",
            color: "black",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Подать статью</h3>
          <p>Создать новую заявку и отправить статью.</p>
        </Link>

        <Link
          to="/papers"
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            width: "240px",
            textDecoration: "none",
            color: "black",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Мои статьи</h3>
          <p>Посмотреть список всех отправленных статей.</p>
        </Link>
      </div>
    </div>
  );
}
