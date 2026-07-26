import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiExternalLink, FiTrash2 } from "react-icons/fi";
import api from "../api/api";

export default function FavoriteRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeUrl, setRecipeUrl] = useState("");
  const [sourceSite, setSourceSite] = useState("");
  const [editingRecipeId, setEditingRecipeId] = useState(null);

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchRecipes = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await api.get("/api/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecipes(response.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("ログイン情報の有効期限が切れました。");
        localStorage.removeItem("access_token");
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const resetForm = () => {
    setRecipeTitle("");
    setRecipeUrl("");
    setSourceSite("");
    setEditingRecipeId(null);
  };

  const handleSubmit = async () => {
    if (!recipeTitle.trim() || !recipeUrl.trim()) {
      alert("レシピ名とURLを入力してください");
      return;
    }

    const recipeData = {
      recipe_title: recipeTitle.trim(),
      recipe_url: recipeUrl.trim(),
      source_site: sourceSite.trim(),
    };

    try {
      if (editingRecipeId) {
        await api.put(`/api/favorites/${editingRecipeId}`, recipeData, {
          headers: getAuthHeaders(),
        });

        alert("お気に入りレシピを更新しました！");
      } else {
        await api.post("/api/favorites", recipeData, {
          headers: getAuthHeaders(),
        });

        alert("お気に入りレシピを保存しました！");
      }

      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert(
          editingRecipeId
            ? "レシピの更新に失敗しました"
            : "レシピの保存に失敗しました",
        );
      }
    }
  };

  const handleEdit = (recipe) => {
    setRecipeTitle(recipe.recipe_title);
    setRecipeUrl(recipe.recipe_url);
    setSourceSite(recipe.source_site || "");
    setEditingRecipeId(recipe.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (recipeId) => {
    const confirmDelete =
      window.confirm("このお気に入りレシピを削除しますか？");

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/favorites/${recipeId}`, {
        headers: getAuthHeaders(),
      });

      if (editingRecipeId === recipeId) {
        resetForm();
      }

      fetchRecipes();
    } catch (error) {
      console.error(error);
      alert("削除に失敗しました");
    }
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

    recipeCard: {
      marginBottom: "22px",
      padding: "24px",
      border: "1px solid rgba(156, 122, 101, 0.18)",
      borderRadius: "18px",
      backgroundColor: "rgba(255, 253, 250, 0.72)",
      boxShadow: "0 8px 20px rgba(90, 61, 45, 0.06)",
    },

    sourceSite: {
      margin: "0 0 8px",
      color: "#9a8173",
      fontSize: "13px",
      letterSpacing: "0.08em",
    },

    recipeTitle: {
      margin: "0 0 18px",
      color: "#4f3527",
      fontSize: "20px",
      fontWeight: "400",
      lineHeight: "1.6",
    },

    recipeLink: {
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      color: "#8f5555",
      fontSize: "14px",
      textDecoration: "none",
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
        <h1 style={styles.title}>お気に入りレシピ</h1>

        <p style={styles.subtitle}>
          また作りたいレシピを、そっと残しておきましょう。
        </p>

        {editingRecipeId && (
          <p style={styles.editNotice}>保存済みのレシピを編集中です</p>
        )}

        <div style={styles.fieldGroup}>
          <label htmlFor="recipe-title" style={styles.label}>
            レシピ名
          </label>

          <input
            id="recipe-title"
            style={styles.input}
            type="text"
            placeholder="例）鶏肉の照り焼き"
            value={recipeTitle}
            onChange={(event) => setRecipeTitle(event.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="recipe-url" style={styles.label}>
            レシピURL
          </label>

          <input
            id="recipe-url"
            style={styles.input}
            type="url"
            placeholder="https://example.com"
            value={recipeUrl}
            onChange={(event) => setRecipeUrl(event.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="source-site" style={styles.label}>
            サイト名（任意）
          </label>

          <input
            id="source-site"
            style={styles.input}
            type="text"
            placeholder="例）クックパッド"
            value={sourceSite}
            onChange={(event) => setSourceSite(event.target.value)}
          />
        </div>

        <button type="button" style={styles.mainButton} onClick={handleSubmit}>
          {editingRecipeId ? "変更を保存" : "レシピを残す"}
        </button>

        {editingRecipeId && (
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

        <h2 style={styles.sectionTitle}>保存したレシピ</h2>

        {recipes.length === 0 && (
          <p style={styles.emptyText}>まだお気に入りレシピはありません。</p>
        )}

        {recipes.map((recipe) => (
          <div key={recipe.id} style={styles.recipeCard}>
            <p style={styles.sourceSite}>{recipe.source_site || "レシピ"}</p>

            <h3 style={styles.recipeTitle}>{recipe.recipe_title}</h3>

            <a
              href={recipe.recipe_url}
              target="_blank"
              rel="noreferrer"
              style={styles.recipeLink}
            >
              <FiExternalLink />
              レシピを見る
            </a>

            <div style={styles.actionRow}>
              <button
                type="button"
                style={styles.editButton}
                onClick={() => handleEdit(recipe)}
              >
                <FiEdit3 />
                編集する
              </button>

              <button
                type="button"
                style={styles.deleteButton}
                onClick={() => handleDelete(recipe.id)}
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
