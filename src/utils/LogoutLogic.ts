export const LogoutRequest = async (setIsAuthenticated?: (value: boolean) => void) => {
  localStorage.removeItem("token");
  
  if (setIsAuthenticated) {
    setIsAuthenticated(false);
  }
  
  window.location.href = "/login";
};