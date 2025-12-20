import { useEffect } from "react";
import { useReducer } from "react";
import { createContext } from "react";
import { authApi } from "../api/authApi";
import { useContext } from "react";

const AuthContext = createContext();

const initState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_USER":
      return {
        ...state,
        user: action.payload.user || null,
        token: action.payload.token || null,
        isAuthenticated: !!action.payload.user,
        loading: false,
      };

    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      dispatch({
        type: "LOAD_USER",
        payload: {
          user: JSON.parse(savedUser),
          token: savedToken,
        },
      });
    } else {
      dispatch({
        type: "LOAD_USER",
        payload: {},
      });
    }
  }, []);

  // Register
  const register = async (data) => {
    const res = await authApi.register(data);
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({
      type: "LOGIN",
      payload: { token, user },
    });
    return res.data;
  };

  // Login
  const login = async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    dispatch({
      type: "LOGIN",
      payload: { token, user },
    });
    return res.data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({
      type: "LOGOUT",
    });
  };

  const updateUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  dispatch({
    type: "UPDATE_USER",
    payload: user,
  });
};

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
