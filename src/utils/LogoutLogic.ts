export const LogoutRequest = async (
  setIsAuthenticated?: (value: boolean) => void
) => {
  localStorage.removeItem("nexgad_token");

  if (setIsAuthenticated) {
    setIsAuthenticated(false);
  }

  window.location.href = "/login";
};
