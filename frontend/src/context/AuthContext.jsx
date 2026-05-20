import {
  createContext,
  useEffect,
  useState,
} from 'react';

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // ======================================
  // CARGAR SESIÓN
  // ======================================

  useEffect(() => {
    const token =
      localStorage.getItem('token');

    const storedUser =
      localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ======================================
  // LOGIN
  // ======================================

  const login = (data) => {
    localStorage.setItem(
      'token',
      data.token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(data.user)
    );

    setUser(data.user);
  };

  // ======================================
  // LOGOUT
  // ======================================

  const logout = () => {
    localStorage.removeItem('token');

    localStorage.removeItem('user');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};