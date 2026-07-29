import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !passwordConfirm) {
      alert("すべての項目を入力してください");
      return;
    }

    if (password !== passwordConfirm) {
      alert("パスワードが一致していません");
      return;
    }

    try {
      await api.post("/api/auth/signup", {
        email,
        password,
      });

      alert("新規登録が完了しました！");

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("新規登録に失敗しました");
      }
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "24px",
      boxSizing: "border-box",
      background:
        "linear-gradient(rgba(255, 252, 247, 0.94), rgba(255, 252, 247, 0.94)), repeating-linear-gradient(0deg, rgba(120, 85, 60, 0.02) 0px, rgba(120, 85, 60, 0.02) 1px, transparent 1px, transparent 4px)",
      color: "#4f3527",
      fontFamily:
        '"Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", serif',
    },

    card: {
      width: "100%",
      maxWidth: "460px",
      padding: "30px 45px",
      boxSizing: "border-box",
    },

    title: {
      margin: "2px 0 6px",
      textAlign: "center",
      fontSize: "38px",
      fontWeight: "400",
      letterSpacing: "0.26em",
      color: "#4a3023",
    },

    subtitle: {
      margin: "8px 0 44px",
      textAlign: "center",
      fontSize: "15px",
      letterSpacing: "0.16em",
      color: "#5b4134",
    },

    pageTitle: {
      margin: "0 0 36px",
      textAlign: "center",
      fontSize: "21px",
      fontWeight: "400",
      letterSpacing: "0.16em",
      color: "#4f3527",
    },

    fieldGroup: {
      marginBottom: "28px",
    },

    label: {
      display: "block",
      width: "94%",
      margin: "0 auto 10px",
      fontSize: "14px",
      letterSpacing: "0.1em",
      color: "#7a6558",
    },

    inputRow: {
      position: "relative",
    },

    input: {
      width: "94%",
      display: "block",
      margin: "0 auto",
      padding: "12px 46px 14px 12px",
      border: "none",
      borderBottom: "1px solid #c8b7aa",
      outline: "none",
      backgroundColor: "transparent",
      boxSizing: "border-box",
      fontSize: "17px",
      fontFamily: "inherit",
      color: "#4f3527",
    },

    eyeButton: {
      position: "absolute",
      right: "24px",
      top: "50%",
      transform: "translateY(-50%)",
      border: "none",
      background: "transparent",
      color: "#965a5a",
      fontSize: "22px",
      cursor: "pointer",
      padding: "4px",
    },

    signupButton: {
      width: "94%",
      display: "block",
      margin: "10px auto 0",
      padding: "17px 20px",
      border: "none",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #8f5555, #9d6161)",
      color: "#fffdfb",
      fontSize: "18px",
      fontFamily: "inherit",
      letterSpacing: "0.18em",
      cursor: "pointer",
      boxShadow: "0 7px 18px rgba(117, 70, 43, 0.16)",
    },

    backButton: {
      display: "block",
      margin: "24px auto 0",
      border: "none",
      background: "transparent",
      color: "#a09086",
      fontSize: "14px",
      fontFamily: "inherit",
      letterSpacing: "0.08em",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>じすい日和</h1>

        <p style={styles.subtitle}>日々のごはんを、私のしあわせに。</p>

        <h2 style={styles.pageTitle}>新規登録</h2>

        <div style={styles.fieldGroup}>
          <label htmlFor="signup-email" style={styles.label}>
            メールアドレス
          </label>

          <input
            id="signup-email"
            style={styles.input}
            type="email"
            placeholder="例）test@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="signup-password" style={styles.label}>
            パスワード
          </label>

          <div style={styles.inputRow}>
            <input
              id="signup-password"
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="パスワードを入力"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword
                  ? "パスワードを非表示にする"
                  : "パスワードを表示する"
              }
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="signup-password-confirm" style={styles.label}>
            パスワード確認
          </label>

          <div style={styles.inputRow}>
            <input
              id="signup-password-confirm"
              style={styles.input}
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="もう一度入力してください"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />

            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
              aria-label={
                showPasswordConfirm
                  ? "確認用パスワードを非表示にする"
                  : "確認用パスワードを表示する"
              }
            >
              {showPasswordConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>

        <button
          type="button"
          style={styles.signupButton}
          onClick={handleSignup}
        >
          新規登録
        </button>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/")}
        >
          ログイン画面へ戻る
        </button>
      </div>
    </div>
  );
}
