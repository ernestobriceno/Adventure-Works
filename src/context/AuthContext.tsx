import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { API_URL, fetchJson } from "@/lib/api";

// ---------------------- Tipos ----------------------
type User = { id: string; email: string; name?: string };

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  signout: () => void;
  GoogleButton: React.FC; // 👈 En vez de JSX.Element
};

// ---------------------- Contexto ----------------------
const Ctx = createContext<AuthCtx | null>(null);

// ---------------------- Provider ----------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión al cargar
  useEffect(() => {
    const token = localStorage.getItem("aw_token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchJson<User>(`${API_URL}/api/me`)
      .then((me) => setUser(me))
      .catch(() => {
        localStorage.removeItem("aw_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ---------------------- Métodos email/clave ----------------------
  async function signin(email: string, password: string) {
    setLoading(true);
    try {
      const res = await fetchJson<{ token: string; user: User }>(
        `${API_URL}/api/auth/signin`,
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      localStorage.setItem("aw_token", res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  }

  async function signup(email: string, password: string, name?: string) {
    setLoading(true);
    try {
      const res = await fetchJson<{ token: string; user: User }>(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",
          body: JSON.stringify({ email, password, name }),
        }
      );
      localStorage.setItem("aw_token", res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  }

  function signout() {
    localStorage.removeItem("aw_token");
    setUser(null);
  }

  // ---------------------- Google OAuth ----------------------
  async function handleGoogle(cred: CredentialResponse) {
    if (!cred.credential) return;
    setLoading(true);
    try {
      const res = await fetchJson<{ token: string; user: User }>(
        `${API_URL}/api/auth/google`,
        {
          method: "POST",
          body: JSON.stringify({ idToken: cred.credential }),
        }
      );
      localStorage.setItem("aw_token", res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  }

  // Componente botón Google (se expone en el contexto)
  const GoogleButton: React.FC = () => (
    <GoogleLogin
      onSuccess={handleGoogle}
      onError={() => {
        // puedes manejar el error como prefieras
        console.error("Google login error");
      }}
      useOneTap={false}
      locale="es"
      theme="outline"
      size="large"
    />
  );

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        signin,
        signup,
        signout,
        GoogleButton,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

// ---------------------- Hook de acceso ----------------------
export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
