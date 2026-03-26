// src/AuthContext.jsx
import { createContext, useState, useEffect, useContext, ReactNode} from "react";
import axios from "axios";

interface AuthContextType {
  isLoading: boolean;
  ifLogIn: boolean;
  setIfLogIn: (value: boolean) => void;
  currentUser: string | null;  // 可能是字串，也可能還沒登入是 null
  setCurrentUser: (value: string | null) => void;
}

// 1. 建立 Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode; // ReactNode 代表任何合法的 React 元素
}

// 2. 建立 Provider 元件 (負責提供資料與邏輯)
export const AuthProvider = ({children}: AuthProviderProps) => {
  // 將原本 App.jsx 裡的狀態移到這裡
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ifLogIn, setIfLogIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // 將 F5 重整檢查 Session 的邏輯也移過來
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/check-auth`,
          { withCredentials: true }
        );
        setIfLogIn(true);
        setCurrentUser(response.data.account);
      } catch (error) {
        console.log("未登入或 Session 已過期");
        setIfLogIn(false);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 3. 把想讓其他元件使用的資料打包起來
  const value = {
    isLoading,
    ifLogIn,
    setIfLogIn,
    currentUser,
    setCurrentUser
  };

  // 4. 將包裹好的資料透過 Provider 廣播出去
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. 建立一個 Custom Hook (語法糖)，讓其他檔案引入時更簡潔
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth 必須在 AuthProvider 內被使用！");
  }
  return context;
};