import * as React from "react";
import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Avatar from "@mui/material/Avatar";
import { RolUtilizator, Utilizator } from "../../types/Utilizator";
import api from "../../api";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { ButonLoginGoogle } from "./ButonLoginGoogle";

export const AppBarConditional = () => {
  const [utilizator, setUtilizator] = useState<Utilizator | null>(null);
  const [esteLogat, setEsteLogat] = useState(false);

  useEffect(() => {
    const fetchUtilizator = async () => {
      try {
        const res = await api.get("/auth/profile", {
          withCredentials: true,
        });
        if (res.data) {
          setEsteLogat(true);
          setUtilizator(res.data);
        }
      } catch (error) {
        setEsteLogat(false);
        setUtilizator(null);
      }
    };
    fetchUtilizator();
  }, []);

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout", { withCredentials: true });
      setEsteLogat(false);
      setUtilizator(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }} marginBottom={8}>
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="div">
              Nume aplicatie vedem
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {esteLogat && utilizator != null ? (
              <>
                {utilizator.rol === RolUtilizator.ADMIN && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/adauga-eveniment")}
                    >
                      Adăugare Eveniment
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/adauga-sala")}
                    >
                      Adăugare Sală
                    </Button>
                  </>
                )}
                <Button
                  variant="contained"
                  startIcon={<NotificationsIcon />}
                ></Button>
                <Avatar
                  alt="Avatar Utilizator"
                  src={utilizator?.avatar}
                  imgProps={{ referrerPolicy: "no-referrer" }}
                />
                <Button
                  variant="contained"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                >
                  Deconectare
                </Button>
              </>
            ) : (
              <ButonLoginGoogle />
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
