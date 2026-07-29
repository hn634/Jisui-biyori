import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiImage, FiX } from "react-icons/fi";
import api from "../api/api";
import { getPhotoUrl } from "../utils/photoUrl";

export default function PostForm() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(postId);

  const [memo, setMemo] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const fetchPostForEdit = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/");
          return;
        }

        const [postResponse, photosResponse] = await Promise.all([
          api.get(`/api/posts/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get("/api/photos"),
        ]);

        setMemo(postResponse.data.memo || "");
        setIsPublic(postResponse.data.is_public);

        const currentPhoto = photosResponse.data.find(
          (item) => item.post_id === Number(postId),
        );

        if (currentPhoto) {
          setPreviewUrl(getPhotoUrl(currentPhoto.photo_url));
        }
      } catch (error) {
        console.error(error);
        alert("投稿情報の取得に失敗しました");
        navigate("/home");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostForEdit();
  }, [isEditMode, navigate, postId]);

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setPhoto(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPreviewUrl("");
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("ログイン情報がありません");
        navigate("/");
        return;
      }

      if (isEditMode) {
        await api.put(
          `/api/posts/${postId}`,
          {
            memo,
            is_public: isPublic,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        alert("投稿を更新しました！");
        navigate(`/detail/${postId}`);
        return;
      }

      let photoId = null;

      if (photo) {
        const formData = new FormData();

        formData.append("file", photo);

        const photoResponse = await api.post("/api/photos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        photoId = photoResponse.data.id;
      }

      await api.post(
        "/api/posts",
        {
          memo,
          photo_id: photoId,
          is_public: isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("投稿を保存しました！");
      navigate("/home");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert(isEditMode ? "投稿の更新に失敗しました" : "投稿に失敗しました");
      }
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      navigate(`/detail/${postId}`);
    } else {
      navigate("/home");
    }
  };

  if (isLoading) {
    return (
      <div className="post-form-page">
        <div className="post-form-card">
          <p className="post-detail-loading">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-form-page">
      <div className="post-form-card">
        <div className="post-form-header">
          <button
            type="button"
            className="post-form-close"
            onClick={handleCancel}
            aria-label={isEditMode ? "投稿詳細へ戻る" : "ホームへ戻る"}
          >
            <FiX />
          </button>

          <h1 className="post-form-title">
            {isEditMode ? "投稿を編集" : "投稿する"}
          </h1>

          <div className="post-form-header-space" />
        </div>

        <p className="post-form-subtitle">
          {isEditMode
            ? "ごはんの記録を、やさしく整えましょう。"
            : "今日のごはんを、やさしく残しましょう。"}
        </p>

        {isEditMode ? (
          <>
            {previewUrl ? (
              <div className="post-photo-preview-wrap">
                <img
                  src={previewUrl}
                  alt="現在の投稿写真"
                  className="post-photo-preview"
                />
              </div>
            ) : (
              <div className="post-photo-placeholder">
                <FiImage />
                <span>写真はありません</span>
              </div>
            )}

            <p
              style={{
                margin: "12px 0 32px",
                color: "#9a877c",
                fontSize: "12px",
                lineHeight: "1.7",
                textAlign: "center",
              }}
            >
              現在、編集できるのはメモのみです。
            </p>
          </>
        ) : (
          <label className="post-photo-label">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="post-photo-input"
            />

            {previewUrl ? (
              <div className="post-photo-preview-wrap">
                <img
                  src={previewUrl}
                  alt="選択した写真"
                  className="post-photo-preview"
                />

                <button
                  type="button"
                  className="post-photo-remove"
                  onClick={(event) => {
                    event.preventDefault();
                    handleRemovePhoto();
                  }}
                  aria-label="写真を削除する"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div className="post-photo-placeholder">
                <FiImage />
                <span>写真を追加する</span>
              </div>
            )}
          </label>
        )}

        <label className="post-form-label" htmlFor="memo">
          ひとこと
        </label>

        <textarea
          id="memo"
          className="post-form-textarea"
          placeholder="今日はどんなごはんでしたか？"
          value={memo}
          onChange={(event) => setMemo(event.target.value)}
        />

        <label className="post-form-share">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
          />
          <span>
            <strong>みんなに共有する</strong>
            <small>
              オンにすると、ほかの人の「みんなのごはん」に表示されます
            </small>
          </span>
        </label>

        <button
          type="button"
          className="post-form-submit"
          onClick={handleSubmit}
        >
          {isEditMode ? "変更を保存" : "投稿する"}
        </button>

        <button
          type="button"
          className="post-form-cancel"
          onClick={handleCancel}
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}
