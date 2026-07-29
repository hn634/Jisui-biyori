import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FiMenu,
  FiPlus,
  FiImage,
  FiUsers,
  FiBookOpen,
  FiDroplet,
  FiLogOut,
} from "react-icons/fi";
import api from "../api/api";

function PlumStamp() {
  return <img src="/plum.svg" alt="" className="plum-stamp" />;
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [likeMap, setLikeMap] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const targetYear = currentMonth.getFullYear();
  const targetMonth = currentMonth.getMonth() + 1;

  const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
  const firstDayOfMonth = new Date(targetYear, targetMonth - 1, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(targetYear, targetMonth - 2, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(targetYear, targetMonth, 1));
    setSelectedDay(null);
  };

  const handleGoToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDay(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchPosts();
    fetchPhotos();
    fetchCurrentUser();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await api.get("/api/posts", {
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

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await api.get("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const handleToggleLike = async (postId, event) => {
    event.stopPropagation();

    try {
      const token = localStorage.getItem("access_token");
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

      setLikeMap((prevLikeMap) => ({
        ...prevLikeMap,
        [postId]: {
          likeCount: response.data.like_count,
          likedByMe: response.data.liked_by_me,
        },
      }));
    } catch (error) {
      console.error(error);
      alert("いいねの処理に失敗しました");
    }
  };

  const getPostDate = (post) => {
    return new Date(post.cooked_date || post.created_at);
  };

  const getPostDay = (post) => {
    return getPostDate(post).getDate();
  };

  const hasPostOnDay = (day) => {
    return posts.some((post) => {
      const postDate = getPostDate(post);

      return (
        postDate.getFullYear() === targetYear &&
        postDate.getMonth() + 1 === targetMonth &&
        postDate.getDate() === day
      );
    });
  };

  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) {
      return "";
    }

    const normalizedPath = photoUrl.replaceAll("\\", "/").replace(/^\/+/, "");

    return `${process.env.REACT_APP_API_BASE_URL}/${normalizedPath}`;
  };

  const displayedPosts = selectedDay
    ? posts.filter((post) => {
        const postDate = getPostDate(post);

        return (
          postDate.getFullYear() === targetYear &&
          postDate.getMonth() + 1 === targetMonth &&
          postDate.getDate() === selectedDay
        );
      })
    : posts;

  return (
    <div className="home-page">
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(62, 43, 34, 0.28)",
              zIndex: 998,
            }}
          />

          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "280px",
              height: "100vh",
              padding: "28px 22px",
              boxSizing: "border-box",
              backgroundColor: "#fffaf5",
              color: "#4f3527",
              fontFamily:
                '"Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", serif',
              boxShadow: "8px 0 24px rgba(74, 48, 35, 0.16)",
              zIndex: 999,
            }}
          >
            <div
              style={{
                marginBottom: "24px",
                padding: "14px 8px 20px",
                borderBottom: "1px solid #dccdc2",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: "#9a7a69",
                  fontSize: "13px",
                  letterSpacing: "0.08em",
                }}
              >
                ログイン中
              </p>

              <p
                style={{
                  margin: 0,
                  color: "#4f3527",
                  fontSize: "15px",
                  wordBreak: "break-all",
                }}
              >
                {currentUser?.email || "読み込み中..."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/favorites")}
              style={menuItemStyle}
            >
              <FiBookOpen />
              お気に入りレシピ
            </button>

            <button
              type="button"
              onClick={() => navigate("/ingredients")}
              style={menuItemStyle}
            >
              <FiDroplet />
              調味料
            </button>

            <div
              style={{
                height: "1px",
                margin: "22px 0",
                backgroundColor: "#dccdc2",
              }}
            />

            <button
              type="button"
              onClick={handleLogout}
              style={{
                ...menuItemStyle,
                color: "#8f5555",
              }}
            >
              <FiLogOut />
              ログアウト
            </button>
          </aside>
        </>
      )}

      <div className="home-card">
        <div className="home-month-header">
          <button
            type="button"
            aria-label="メニューを開く"
            onClick={() => setMenuOpen(true)}
            className="home-menu-button"
          >
            <FiMenu />
          </button>

          <div className="home-month-navigation">
            <button
              type="button"
              className="month-button"
              onClick={handlePrevMonth}
              aria-label="前の月"
            >
              ‹
            </button>

            <h1 className="title home-month-title">
              {targetYear}年{targetMonth}月
            </h1>

            <button
              type="button"
              className="month-button"
              onClick={handleNextMonth}
              aria-label="次の月"
            >
              ›
            </button>
          </div>

          <div className="home-header-space" />
        </div>

        <p className="subtitle">日々のごはんの記録</p>

        <button
          type="button"
          className="calendar-today-button"
          onClick={handleGoToToday}
        >
          今日へ戻る
        </button>

        <div className="calendar">
          <div>日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div>土</div>

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const hasPost = hasPostOnDay(day);

            return (
              <button
                key={day}
                type="button"
                className={`calendar-day ${hasPost ? "has-post" : ""} ${
                  selectedDay === day ? "selected" : ""
                }`}
                onClick={() => {
                  if (hasPost) {
                    setSelectedDay(day);
                  }
                }}
                disabled={!hasPost}
                aria-label={
                  hasPost
                    ? `${targetMonth}月${day}日の記録を見る`
                    : `${targetMonth}月${day}日`
                }
              >
                {hasPost && <PlumStamp />}

                <span className="calendar-day-number">{day}</span>
              </button>
            );
          })}
        </div>

        {selectedDay && (
          <p className="subtitle">{selectedDay}日の記録を表示中</p>
        )}

        {selectedDay && (
          <button
            className="button"
            type="button"
            onClick={() => setSelectedDay(null)}
          >
            全部の投稿を見る
          </button>
        )}

        <div className="home-navigation">
          <button
            className="home-nav-item"
            type="button"
            onClick={() => navigate("/album")}
          >
            <span className="home-nav-icon">
              <FiImage />
            </span>
            <span>アルバム</span>
          </button>

          <button
            className="home-nav-item"
            type="button"
            onClick={() => navigate("/post")}
          >
            <span className="home-nav-icon">
              <FiPlus />
            </span>
            <span>投稿する</span>
          </button>

          <button
            className="home-nav-item"
            type="button"
            onClick={() => navigate("/community")}
          >
            <span className="home-nav-icon">
              <FiUsers />
            </span>
            <span>みんなのごはん</span>
          </button>
        </div>

        <div style={{ display: "none" }}>
          <h2
            style={{
              color: "#4a3023",
              fontWeight: "400",
              marginTop: "40px",
              marginBottom: "20px",
            }}
          >
            アルバム
          </h2>

          {displayedPosts.length === 0 && (
            <p className="subtitle">この日の記録はまだありません</p>
          )}

          {displayedPosts.map((post) => {
            const postPhoto = photos.find((photo) => photo.post_id === post.id);

            return (
              <div
                key={post.id}
                className="today-card"
                onClick={() => navigate(`/detail/${post.id}`)}
                style={{ cursor: "pointer" }}
              >
                {postPhoto && (
                  <img
                    src={getPhotoUrl(postPhoto.photo_url)}
                    alt={postPhoto.original_filename || "ごはんの写真"}
                    style={{
                      width: "100%",
                      borderRadius: "16px",
                      marginBottom: "16px",
                    }}
                  />
                )}

                <p>{post.memo}</p>

                <button
                  className="button button-secondary"
                  type="button"
                  onClick={(event) => handleToggleLike(post.id, event)}
                >
                  {likeMap[post.id]?.likedByMe ? "♥" : "♡"} いいね{" "}
                  {likeMap[post.id]?.likeCount ?? 0}
                </button>

                <p className="subtitle">{getPostDay(post)}日の記録</p>
              </div>
            );
          })}
        </div>

        {selectedDay && (
          <div
            className="post-modal-overlay"
            onClick={() => setSelectedDay(null)}
          >
            <div
              className="post-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="post-modal-close"
                onClick={() => setSelectedDay(null)}
                aria-label="閉じる"
              >
                ×
              </button>

              <p className="post-modal-date">
                {targetYear}年{targetMonth}月{selectedDay}日
              </p>

              <h2 className="post-modal-title">この日のごはん</h2>

              {displayedPosts.map((post) => {
                const postPhoto = photos.find(
                  (photo) => photo.post_id === post.id,
                );

                return (
                  <div className="post-modal-record" key={post.id}>
                    {postPhoto && (
                      <img
                        className="post-modal-image"
                        src={getPhotoUrl(postPhoto.photo_url)}
                        alt={postPhoto.original_filename || "ごはんの写真"}
                      />
                    )}

                    <h3>{post.title || "今日のごはん"}</h3>

                    {post.memo && <p>{post.memo}</p>}

                    <button
                      type="button"
                      className="post-modal-detail"
                      onClick={() => navigate(`/detail/${post.id}`)}
                    >
                      詳細を見る
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const menuItemStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "14px 8px",
  border: "none",
  background: "transparent",
  color: "#4f3527",
  fontFamily: "inherit",
  fontSize: "16px",
  textAlign: "left",
  cursor: "pointer",
};
