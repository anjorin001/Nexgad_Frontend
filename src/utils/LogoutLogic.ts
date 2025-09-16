export const LogoutRequest = async (
  setIsAuthenticated?: (value: boolean) => void
) => {
  localStorage.removeItem("nexgad_token");
  localStorage.removeItem("nexgad_user")

  if (setIsAuthenticated) {
    setIsAuthenticated(false);
  }

  window.location.href = "/login";
};
