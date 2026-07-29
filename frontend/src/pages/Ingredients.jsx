import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import api from "../api/api";

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [name, setName] = useState("");
  const [bestBefore, setBestBefore] = useState("");
  const [memo, setMemo] = useState("");
  const [editingIngredientId, setEditingIngredientId] = useState(null);

  const navigate = useNavigate();

  const fetchIngredients = useCallback(async () => {
    try {
      const response = await api.get("/api/ingredients");

      setIngredients(response.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  const resetForm = () => {
    setName("");
    setBestBefore("");
    setMemo("");
    setEditingIngredientId(null);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !bestBefore) {
      alert("名前と賞味期限を入力してください");
      return;
    }

    const ingredientData = {
      name: name.trim(),
      best_before: bestBefore,
      memo: memo.trim(),
    };

    try {
      if (editingIngredientId) {
        await api.put(
          `/api/ingredients/${editingIngredientId}`,
          ingredientData,
        );

        alert("調味料・食材を更新しました！");
      } else {
        await api.post("/api/ingredients", ingredientData);

        alert("調味料・食材を保存しました！");
      }

      resetForm();
      fetchIngredients();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert(
          editingIngredientId ? "更新に失敗しました" : "保存に失敗しました",
        );
      }
    }
  };

  const handleEdit = (ingredient) => {
    setName(ingredient.name);
    setBestBefore(ingredient.best_before);
    setMemo(ingredient.memo || "");
    setEditingIngredientId(ingredient.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (ingredientId) => {
    const confirmDelete = window.confirm("この調味料・食材を削除しますか？");

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/ingredients/${ingredientId}`);

      if (editingIngredientId === ingredientId) {
        resetForm();
      }

      fetchIngredients();
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
    }
  };

  const getDaysLeft = (dateValue) => {
    const today = new Date();
    const limitDate = new Date(`${dateValue}T00:00:00`);

    today.setHours(0, 0, 0, 0);
    limitDate.setHours(0, 0, 0, 0);

    const diffTime = limitDate.getTime() - today.getTime();

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getLimitText = (dateValue) => {
    const daysLeft = getDaysLeft(dateValue);

    if (daysLeft < 0) {
      return `${Math.abs(daysLeft)}日過ぎています`;
    }

    if (daysLeft === 0) {
      return "今日まで";
    }

    return `あと${daysLeft}日`;
  };

  const formatDate = (dateValue) => {
    const date = new Date(`${dateValue}T00:00:00`);

    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "40px 20px 70px",
      boxSizing: "border-box",
      background:
        "linear-gradient(rgba(255, 252, 247, 0.94), rgba(255, 252, 247, 0.94)), repeating-linear-gradient(0deg, rgba(120, 85, 60, 0.02) 0px, rgba(120, 85, 60, 0.02) 1px, transparent 1px, transparent 4px)",
      color: "#4f3527",
      fontFamily:
        '"Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", serif',
    },

    card: {
      width: "100%",
      maxWidth: "620px",
      margin: "0 auto",
    },

    title: {
      margin: "0 0 10px",
      textAlign: "center",
      fontSize: "34px",
      fontWeight: "400",
      letterSpacing: "0.16em",
      color: "#4a3023",
    },

    subtitle: {
      margin: "0 0 44px",
      textAlign: "center",
      color: "#8c776b",
      fontSize: "14px",
      lineHeight: "1.9",
      letterSpacing: "0.08em",
    },

    editNotice: {
      margin: "0 0 24px",
      padding: "12px 16px",
      borderRadius: "12px",
      backgroundColor: "rgba(150, 90, 90, 0.08)",
      color: "#8f5555",
      textAlign: "center",
      fontSize: "14px",
      letterSpacing: "0.06em",
    },

    fieldGroup: {
      marginBottom: "28px",
    },

    label: {
      display: "block",
      width: "94%",
      margin: "0 auto 8px",
      color: "#7a6558",
      fontSize: "14px",
      letterSpacing: "0.1em",
    },

    input: {
      display: "block",
      width: "94%",
      margin: "0 auto",
      padding: "12px 10px 14px",
      boxSizing: "border-box",
      border: "none",
      borderBottom: "1px solid #c8b7aa",
      outline: "none",
      backgroundColor: "transparent",
      color: "#4f3527",
      fontSize: "16px",
      fontFamily: "inherit",
    },

    mainButton: {
      display: "block",
      width: "94%",
      margin: "12px auto 0",
      padding: "16px 20px",
      border: "none",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #8f5555, #9d6161)",
      color: "#fffdfb",
      fontSize: "17px",
      fontFamily: "inherit",
      letterSpacing: "0.15em",
      cursor: "pointer",
      boxShadow: "0 7px 18px rgba(117, 70, 43, 0.14)",
    },

    cancelButton: {
      display: "block",
      margin: "18px auto 0",
      padding: "6px 12px",
      border: "none",
      background: "transparent",
      color: "#9a8072",
      fontSize: "14px",
      fontFamily: "inherit",
      cursor: "pointer",
    },

    backButton: {
      display: "block",
      margin: "26px auto 0",
      padding: "8px 14px",
      border: "none",
      background: "transparent",
      color: "#8f5555",
      fontSize: "14px",
      fontFamily: "inherit",
      letterSpacing: "0.08em",
      cursor: "pointer",
    },

    divider: {
      height: "1px",
      margin: "48px 0 34px",
      backgroundColor: "#ddd0c6",
    },

    sectionTitle: {
      margin: "0 0 26px",
      textAlign: "center",
      color: "#4a3023",
      fontSize: "23px",
      fontWeight: "400",
      letterSpacing: "0.12em",
    },

    ingredientCard: {
      marginBottom: "22px",
      padding: "24px",
      border: "1px solid rgba(156, 122, 101, 0.18)",
      borderRadius: "18px",
      backgroundColor: "rgba(255, 253, 250, 0.72)",
      boxShadow: "0 8px 20px rgba(90, 61, 45, 0.06)",
    },

    limitText: {
      margin: "0 0 8px",
      color: "#8f5555",
      fontSize: "13px",
      letterSpacing: "0.08em",
    },

    ingredientName: {
      margin: "0 0 14px",
      color: "#4f3527",
      fontSize: "20px",
      fontWeight: "400",
      lineHeight: "1.6",
    },

    dateText: {
      margin: "0 0 10px",
      color: "#786358",
      fontSize: "14px",
    },

    memoText: {
      margin: "12px 0 0",
      color: "#786358",
      fontSize: "14px",
      lineHeight: "1.8",
      whiteSpace: "pre-wrap",
    },

    actionRow: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "12px",
      marginTop: "22px",
      paddingTop: "18px",
      borderTop: "1px solid #eadfd7",
    },

    editButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "9px 14px",
      border: "1px solid #b88a82",
      borderRadius: "999px",
      backgroundColor: "transparent",
      color: "#8f5555",
      fontSize: "13px",
      fontFamily: "inherit",
      cursor: "pointer",
    },

    deleteButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "9px 10px",
      border: "none",
      backgroundColor: "transparent",
      color: "#a98b82",
      fontSize: "13px",
      fontFamily: "inherit",
      cursor: "pointer",
    },

    emptyText: {
      textAlign: "center",
      color: "#9a877c",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>期限管理</h1>

        <p style={styles.subtitle}>
          調味料や食材の期限を、そっと残しておきましょう。
        </p>
        {editingIngredientId && (
          <p style={styles.editNotice}>保存済みの調味料・食材を編集中です</p>
        )}

        <div style={styles.fieldGroup}>
          <label htmlFor="ingredient-name" style={styles.label}>
            調味料・食材名
          </label>

          <input
            id="ingredient-name"
            style={styles.input}
            type="text"
            placeholder="例）しょうゆ"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="best-before" style={styles.label}>
            賞味期限
          </label>

          <input
            id="best-before"
            style={styles.input}
            type="date"
            value={bestBefore}
            onChange={(event) => setBestBefore(event.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="ingredient-memo" style={styles.label}>
            メモ（任意）
          </label>

          <input
            id="ingredient-memo"
            style={styles.input}
            type="text"
            placeholder="例）開封済み・冷蔵庫の右側"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </div>

        <button type="button" style={styles.mainButton} onClick={handleSubmit}>
          {editingIngredientId ? "変更を保存" : "期限を残す"}
        </button>

        {editingIngredientId && (
          <button type="button" style={styles.cancelButton} onClick={resetForm}>
            編集をキャンセル
          </button>
        )}

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/home")}
        >
          ホームへ戻る
        </button>

        <div style={styles.divider} />

        <h2 style={styles.sectionTitle}>保存したもの</h2>

        {ingredients.length === 0 && (
          <p style={styles.emptyText}>
            まだ登録された調味料・食材はありません。
          </p>
        )}

        {ingredients.map((ingredient) => (
          <div key={ingredient.id} style={styles.ingredientCard}>
            <p style={styles.limitText}>
              {getLimitText(ingredient.best_before)}
            </p>

            <h3 style={styles.ingredientName}>{ingredient.name}</h3>

            <p style={styles.dateText}>
              賞味期限：{formatDate(ingredient.best_before)}
            </p>

            {ingredient.memo && (
              <p style={styles.memoText}>{ingredient.memo}</p>
            )}

            <div style={styles.actionRow}>
              <button
                type="button"
                style={styles.editButton}
                onClick={() => handleEdit(ingredient)}
              >
                <FiEdit3 />
                編集する
              </button>

              <button
                type="button"
                style={styles.deleteButton}
                onClick={() => handleDelete(ingredient.id)}
              >
                <FiTrash2 />
                削除する
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
