import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("access_token", response.data.access_token);

      alert("ログイン成功！");

      navigate("/home");
    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.detail);
      } else {
        alert("サーバーに接続できません");
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
      margin: "8px 0 52px",
      textAlign: "center",
      fontSize: "15px",
      letterSpacing: "0.16em",
      color: "#5b4134",
    },

    fieldGroup: {
      marginBottom: "28px",
    },

    label: {
      display: "block",
      width: "94%",
      margin: "0 auto 10px",
      fontSize: "14px",
      letterSpacing: "0.10em",
      color: "#7A6558",
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
      color: "#965A5A",
      fontSize: "22px",
      cursor: "pointer",
      padding: "4px",
    },

    loginButton: {
      width: "94%",
      display: "block",
      margin: "8px auto 0",
      padding: "17px 20px",
      border: "none",
      borderRadius: "999px",
      background: "linear-gradient(90deg, #8F5555, #9D6161)",
      color: "#FFFDFB",
      fontSize: "18px",
      fontFamily: "inherit",
      letterSpacing: "0.18em",
      cursor: "pointer",
      boxShadow: "0 7px 18px rgba(117, 70, 43, 0.16)",
    },

    forgotButton: {
      display: "block",
      margin: "24px auto 0",
      border: "none",
      background: "transparent",
      color: "#A09086",
      fontSize: "13px",
      fontFamily: "inherit",
      letterSpacing: "0.06em",
      cursor: "pointer",
      textDecoration: "none",
    },

    divider: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
      margin: "48px 0 28px",
    },

    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#c8b7aa",
    },

    dividerText: {
      margin: "0",
      whiteSpace: "nowrap",
      fontSize: "16px",
      letterSpacing: "0.13em",
      color: "#4f3527",
    },

    signupButton: {
      width: "94%",
      display: "block",
      margin: "0 auto",
      padding: "16px 20px",
      border: "1px solid #965A5A",
      borderRadius: "999px",
      backgroundColor: "transparent",
      color: "#965A5A",
      fontSize: "17px",
      fontFamily: "inherit",
      letterSpacing: "0.16em",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>じすい日和</h1>

        <p style={styles.subtitle}>日々のごはんを、私のしあわせに。</p>

        <div style={styles.fieldGroup}>
          <label htmlFor="email" style={styles.label}>
            メールアドレス
          </label>

          <input
            id="email"
            style={styles.input}
            type="email"
            placeholder="例）test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label htmlFor="password" style={styles.label}>
            パスワード
          </label>

          <div style={styles.inputRow}>
            <input
              id="password"
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="パスワードを入力"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <button type="button" style={styles.loginButton} onClick={handleLogin}>
          ログイン
        </button>

        <button
          type="button"
          style={styles.forgotButton}
          onClick={() => {
            alert("パスワード再設定機能は現在準備中です。");
          }}
        >
          パスワードをお忘れの方はこちら
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <p style={styles.dividerText}>アカウントをお持ちでない方</p>
          <span style={styles.dividerLine} />
        </div>

        <button
          type="button"
          style={styles.signupButton}
          onClick={() => navigate("/signup")}
        >
          新規登録はこちら
        </button>
      </div>
    </div>
  );
}
