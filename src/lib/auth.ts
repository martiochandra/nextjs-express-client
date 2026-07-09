// src/lib/auth.ts

export function saveAuth(token: string, user: any) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
   
  export function getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }
   
  export function getUser() {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    }
    return null;
  }
   
  export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }