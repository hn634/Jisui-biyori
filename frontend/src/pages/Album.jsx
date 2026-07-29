import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import api from "../api/api";
import { getPhotoUrl } from "../utils/photoUrl";

export default function Album() {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await api.get("/api/photos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPhotos(response.data);
      } catch (error) {
        console.error(error);

        if (error.response?.status === 401) {
          alert("ログイン情報の有効期限が切れました。");
          localStorage.removeItem("access_token");
          navigate("/");
        }
      }
    };

    fetchPhotos();
  }, [navigate]);

  const groupedPhotos = [...photos]
    .filter((photo) => photo.post_id && photo.created_at)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .reduce((groups, photo) => {
      const date = new Date(photo.created_at);
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
