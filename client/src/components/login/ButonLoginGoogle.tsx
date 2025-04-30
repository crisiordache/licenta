import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

const ButonLoginGoogle = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <div>
      <Button
        onClick={handleLogin}
        variant="contained"
        color="primary"
        startIcon={<GoogleIcon />}
      >
        Continuă cu Google
      </Button>
    </div>
  );
};

export default ButonLoginGoogle;
