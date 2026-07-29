import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api/api";
import { getPhotoUrl } from "../utils/photoUrl";

export default function Album() {
  const [photos, setPhotos] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const [photosResponse, postsResponse] = await Promise.all([
          api.get("/api/photos"),
          api.get("/api/posts"),
        ]);

        setPhotos(photosResponse.data);
        setPosts(postsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecords();
  }, [navigate]);

  const cookedDateByPostId = Object.fromEntries(
    posts.map((post) => [post.id, post.cooked_date]),
  );

  const groupedPhotos = [...photos]
    .filter((photo) => photo.post_id && cookedDateByPostId[photo.post_id])
    .map((photo) => ({
      ...photo,
      cookedDate: cookedDateByPostId[photo.post_id],
    }))
    .sort(
      (a, b) =>
        new Date(`${b.cookedDate}T00:00:00`).getTime() -
        new Date(`${a.cookedDate}T00:00:00`).getTime(),
    )
    .reduce((groups, photo) => {
      const date = new Date(`${photo.cookedDate}T00:00:00`);
      const monthKey = `${date.getFullYear()}年${date.getMonth() + 1}月`;

      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }

      groups[monthKey].push(photo);

      return groups;
    }, {});

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
            <h1 className="album-title">アルバム</h1>

            <p className="album-subtitle">
              あなたのごはんを、やさしく振り返りましょう。
            </p>
          </div>

          <div className="album-header-space" />
        </div>

        {Object.keys(groupedPhotos).length === 0 ? (
          <p className="album-empty">
            まだ写真がありません。
            <br />
            今日のごはんを残してみましょう。
          </p>
        ) : (
          <div className="album-month-list">
            {Object.entries(groupedPhotos).map(([month, monthPhotos]) => (
              <section className="album-month-section" key={month}>
                <h2 className="album-month-title">{month}</h2>

                <div className="album-photo-grid">
                  {monthPhotos.map((photo) => (
                    <button
                      type="button"
                      className="album-photo-item"
                      key={photo.id}
                      onClick={() => navigate(`/detail/${photo.post_id}`)}
                    >
                      <img
                        src={getPhotoUrl(photo.photo_url)}
                        alt={photo.original_filename || "ごはんの写真"}
                      />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
