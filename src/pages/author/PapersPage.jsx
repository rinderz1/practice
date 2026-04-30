import { useState } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { EmptyState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Select } from "../../components/ui/Select";
import { PAPER_STATUS, PAPER_STATUS_META } from "../../constants/statuses";

const statusOptions = [
  PAPER_STATUS.UNDER_REVIEW,
  PAPER_STATUS.ACCEPTED,
  PAPER_STATUS.REJECTED,
  PAPER_STATUS.REVISION,
  PAPER_STATUS.WITHDRAWN,
];

export default function PapersPage() {
  const userEmail = localStorage.getItem("userEmail");
  const [articles, setArticles] = useState(
    JSON.parse(localStorage.getItem("articles")) || []
  );
  const [editingIndex, setEditingIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [message, setMessage] = useState("");

  const myPapers = articles.filter((article) => article.author === userEmail);

  const saveArticles = (updated) => {
    localStorage.setItem("articles", JSON.stringify(updated));
    setArticles(updated);
  };

  const handleDelete = (indexToDelete) => {
    const updated = articles.filter((_, index) => index !== indexToDelete);
    saveArticles(updated);
    setMessage("Статья удалена");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditTitle(articles[index].title);
    setEditDescription(articles[index].description);
  };

  const handleSave = (index) => {
    if (!editTitle || !editDescription) {
      setMessage("Заполните название и описание");
      return;
    }

    const updated = [...articles];
    updated[index] = {
      ...updated[index],
      title: editTitle,
      description: editDescription,
    };

    saveArticles(updated);
    setEditingIndex(null);
    setEditTitle("");
    setEditDescription("");
    setMessage("Изменения сохранены");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleStatusChange = (index, newStatus) => {
    const updated = [...articles];
    updated[index] = {
      ...updated[index],
      status: newStatus,
    };

    saveArticles(updated);
    setMessage(`Статус изменён на "${PAPER_STATUS_META[newStatus].label}"`);
  };

  return (
    <div>
      <PageHeader
        title="Мои статьи"
        subtitle="Управляйте своими заявками и следите за статусом" 
      />

      {message && <div className="message message--success">{message}</div>}

      {myPapers.length === 0 ? (
        <EmptyState
          title="Нет отправленных статей"
          description="Пока у вас нет поданных заявок. Подайте новую статью в личном кабинете."
        />
      ) : (
        <div className="paper-list">
          {myPapers.map((article, index) => {
            const statusMeta = PAPER_STATUS_META[article.status || PAPER_STATUS.SUBMITTED] || {};
            const globalIndex = articles.findIndex((item) => item === article);

            return (
              <div key={globalIndex} className="card card--paper">
                {editingIndex === globalIndex ? (
                  <div className="paper-edit-form">
                    <label className="form-field">
                      <span className="form-label">Название статьи</span>
                      <input
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        className="form-input"
                      />
                    </label>
                    <label className="form-field">
                      <span className="form-label">Описание</span>
                      <textarea
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                        className="form-textarea"
                        rows="5"
                      />
                    </label>
                    <div className="button-row">
                      <Button onClick={() => handleSave(globalIndex)}>Сохранить</Button>
                      <Button variant="ghost" onClick={handleCancel}>Отмена</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="paper-card-header">
                      <h3>{article.title}</h3>
                      <Badge variant={statusMeta.variant || "neutral"}>
                        {statusMeta.label || article.status}
                      </Badge>
                    </div>
                    <p>{article.description}</p>
                    <div className="paper-meta">
                      <span>Автор: {article.author}</span>
                      <span>Дата: {article.submittedAt || "не указана"}</span>
                    </div>
                    <div className="form-field">
                      <Select
                        label="Поменять статус"
                        value={article.status || PAPER_STATUS.SUBMITTED}
                        onChange={(event) => handleStatusChange(globalIndex, event.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {PAPER_STATUS_META[status].label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="button-row">
                      <Button onClick={() => handleEdit(globalIndex)}>Редактировать</Button>
                      <Button variant="ghost" onClick={() => handleDelete(globalIndex)}>
                        Удалить
                      </Button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
