import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api/api";

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await api.get(`/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPost(response.data);
      } catch (error) {
        console.error(error);
        alert("投稿の取得に失敗しました");
      }
    };

    const fetchPhotos = async () => {
      try {
        const response = await api.get("/api/photos");
        setPhotos(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPost();
    fetchPhotos();
  }, [postId]);

  const handleDelete = async () => {
    const ok = window.confirm("この投稿を削除しますか？");

    if (!ok) {
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      await api.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("投稿を削除しました");
      navigate("/home");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("削除に失敗しました");
      }
    }
  };

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) {
      return "";
    }

    const normalizedPath = photoUrl.replaceAll("\\", "/").replace(/^\/+/, "");

    return `${process.env.REACT_APP_API_BASE_URL}/${normalizedPath}`;
  };

  if (!post) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-card">
          <p className="post-detail-loading">読み込み中...</p>
        </div>
      </div>
    );
  }

  const postPhoto = photos.find((photo) => photo.post_id === post.id);

  const postDate = new Date(post.cooked_date || post.created_at);

  const formattedDate = `${postDate.getFullYear()}年${
    postDate.getMonth() + 1
  }月${postDate.getDate()}日`;

  return (
    <div className="post-detail-page">
      <div className="post-detail-card">
        <div className="post-detail-header">
          <button
            type="button"
            className="post-detail-back"
            onClick={() => navigate("/home")}
            aria-label="ホームへ戻る"
          >
            <FiArrowLeft />
          </button>

          <h1 className="post-detail-title">ごはんの記録</h1>

          <div className="post-detail-header-space" />
        </div>

        <p className="post-detail-date">{formattedDate}</p>

        {postPhoto ? (
          <img
            src={getPhotoUrl(postPhoto.photo_url)}
            alt={postPhoto.original_filename || "ごはんの写真"}
            className="post-detail-image"
          />
        ) : (
          <div className="post-detail-photo-empty">ごはんの写真</div>
        )}

        <section className="post-detail-content">
          <h2 className="post-detail-content-title">
            {post.title || "今日のごはん"}
          </h2>

          <p className="post-detail-memo">{post.memo || "メモはありません"}</p>
        </section>

        <div className="post-detail-actions">
          <button
            type="button"
            className="post-detail-home-button"
            onClick={() => navigate(`/post/${postId}/edit`)}
          >
            編集する
          </button>

          <button
            type="button"
            className="post-detail-delete-button"
            onClick={handleDelete}
          >
            削除する
          </button>

          <button
            type="button"
            className="post-detail-home-button"
            onClick={() => navigate("/home")}
          >
            ホームへ戻る
          </button>
        </div>
      </div>
    </div>
  );
}
