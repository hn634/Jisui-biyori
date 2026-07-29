import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api/api";
import { getPhotoUrl } from "../utils/photoUrl";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [likeMap, setLikeMap] = useState({});

  const navigate = useNavigate();

  const handleAuthError = useCallback(
    (error) => {
      if (error.response?.status === 401) {
        alert("ログイン情報の有効期限が切れました。");
        localStorage.removeItem("access_token");
        navigate("/");
        return true;
      }

      return false;
    },
    [navigate],
  );

  const fetchCommunityPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await api.get("/api/posts/community/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(response.data);

      const likeResults = await Promise.all(
        response.data.map((post) =>
          api.get(`/api/likes/${post.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ),
      );

      const newLikeMap = {};

      likeResults.forEach((result) => {
        newLikeMap[result.data.post_id] = {
          likeCount: result.data.like_count,
          likedByMe: result.data.liked_by_me,
        };
      });

      setLikeMap(newLikeMap);
    } catch (error) {
      console.error(error);

      if (!handleAuthError(error)) {
        alert("みんなの投稿を取得できませんでした");
      }
    }
  }, [handleAuthError, navigate]);

  const fetchPhotos = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await api.get("/api/photos/community", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPhotos(response.data);
    } catch (error) {
      console.error(error);
      handleAuthError(error);
    }
  }, [handleAuthError, navigate]);

  useEffect(() => {
    fetchCommunityPosts();
    fetchPhotos();
  }, [fetchCommunityPosts, fetchPhotos]);

  const handleToggleLike = async (postId, event) => {
    event.stopPropagation();

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        navigate("/");
        return;
      }

      const likeInfo = likeMap[postId];

      if (likeInfo?.likedByMe) {
        await api.delete(`/api/likes/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await api.post(
          `/api/likes/${postId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }

      const response = await api.get(`/api/likes/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLikeMap((previousLikeMap) => ({
        ...previousLikeMap,
        [postId]: {
          likeCount: response.data.like_count,
          likedByMe: response.data.liked_by_me,
        },
      }));
    } catch (error) {
      console.error(error);

      if (!handleAuthError(error)) {
        alert("いいねの処理に失敗しました");
      }
    }
  };

  const formatDate = (dateText) => {
    const date = new Date(dateText);

    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="album-page">
      <div className="album-card">
        <div className="album-header">
          <button
            type="button"
            className="album-back"
            onClick={() => navigate("/home")}
            aria-label="ホームへ戻る"
          >
            <FiArrowLeft />
          </button>

          <div>
            <h1 className="album-title">みんなのごはん</h1>

            <p className="album-subtitle">
              ほかの人の食卓を、そっとのぞいてみましょう。
            </p>
          </div>

          <div className="album-header-space" />
        </div>

        {posts.length === 0 ? (
          <p className="album-empty">まだ共有されたごはんはありません。</p>
        ) : (
          <div className="community-list">
            {posts.map((post) => {
              const postPhoto = photos.find(
                (photo) => photo.post_id === post.id,
              );

              return (
                <div key={post.id} className="community-card">
                  {postPhoto ? (
                    <img
                      src={getPhotoUrl(postPhoto.photo_url)}
                      alt={postPhoto.original_filename || "ごはんの写真"}
                      className="community-image"
                    />
                  ) : (
                    <div className="community-image-empty">ごはんの写真</div>
                  )}

                  <div className="community-body">
                    <p className="community-memo">
                      {post.memo || "今日のごはん"}
                    </p>

                    <div className="community-footer">
                      <span className="community-date">
                        {formatDate(post.created_at)}
                      </span>

                      <button
                        type="button"
                        className="community-like"
                        onClick={(event) => handleToggleLike(post.id, event)}
                        aria-label={
                          likeMap[post.id]?.likedByMe
                            ? "いいねを取り消す"
                            : "いいねする"
                        }
                      >
                        {likeMap[post.id]?.likedByMe ? "♥" : "♡"}{" "}
                        {likeMap[post.id]?.likeCount ?? 0}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
