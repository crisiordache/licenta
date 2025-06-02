import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import api from "../../api";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Sala from "../../types/Sala";

interface TipBilet {
  idTipBilet: number;
  pret: number;
  numeTip: string;
}

interface TipBiletCuCantitate extends TipBilet {
  cantitateSelectata: number;
}

interface Eveniment {
  idEveniment: number;
  numeEveniment: string;
  descriere: string;
  dataEveniment: string;
  oraIncepere: string;
  durataEveniment: number;
  cuLocuriNominale: boolean;
  poster: string;
  sala?: Sala;
  tipuriBilet: TipBilet[];
}

export const SelectareBilete = () => {
  const { idEveniment } = useParams<{ idEveniment: string }>();
  const navigate = useNavigate();

  const [eveniment, setEveniment] = useState<Eveniment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [tipuriBileteCuCantitate, setTipuriBileteCuCantitate] = useState<
    TipBiletCuCantitate[]
  >([]);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<string>("");

  useEffect(() => {
    const fetchEveniment = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/evenimente/${idEveniment}`);
        const fetchedEveniment: Eveniment = res.data;
        setEveniment(fetchedEveniment);
        console.log("Tipuri bilete:", fetchedEveniment.tipuriBilet);
        console.log("Este array?", Array.isArray(fetchedEveniment.tipuriBilet));

        if (
          fetchedEveniment.tipuriBilet &&
          fetchedEveniment.tipuriBilet.length > 0
        ) {
          setTipuriBileteCuCantitate(
            fetchedEveniment.tipuriBilet.map((tb) => ({
              ...tb,
              cantitateSelectata: 0,
            }))
          );
        } else {
          setError(
            "Nu există tipuri de bilete configurate pentru acest eveniment."
          );
        }
      } catch (err: any) {
        console.error("Eroare la încărcarea evenimentului:", err);
        setError(
          err.response?.data?.message ||
            "Nu s-a putut încărca evenimentul. Reîncărcați pagina."
        );
      } finally {
        setLoading(false);
      }
    };

    if (idEveniment) {
      fetchEveniment();
    }
  }, [idEveniment]);

  const pretTotal = useMemo(() => {
    return tipuriBileteCuCantitate.reduce((total, tipBilet) => {
      return total + tipBilet.pret * tipBilet.cantitateSelectata;
    }, 0);
  }, [tipuriBileteCuCantitate]);

  const handleCantitateChange = useCallback(
    (idTipBilet: number, delta: number) => {
      setTipuriBileteCuCantitate((prevTipuri) =>
        prevTipuri.map((tb) =>
          tb.idTipBilet === idTipBilet
            ? {
                ...tb,
                cantitateSelectata: Math.max(0, tb.cantitateSelectata + delta),
              }
            : tb
        )
      );
    },
    []
  );

  const validateComanda = useCallback(() => {
    const totalBileteSelectate = tipuriBileteCuCantitate.reduce(
      (sum, tb) => sum + tb.cantitateSelectata,
      0
    );
    if (totalBileteSelectate === 0) {
      setError("Te rugăm să selectezi cel puțin un bilet.");
      return false;
    }
    setError(null);
    return true;
  }, [tipuriBileteCuCantitate]);

  const handleConfirmOrder = () => {
    if (!validateComanda()) {
      return;
    }

    let content = "Ai selectat următoarele bilete:\n";
    tipuriBileteCuCantitate.forEach((tb) => {
      if (tb.cantitateSelectata > 0) {
        content += `- ${tb.numeTip}: ${
          tb.cantitateSelectata
        } x ${tb.pret.toFixed(2)} RON = ${(
          tb.cantitateSelectata * tb.pret
        ).toFixed(2)} RON\n`;
      }
    });
    content += `\nPreț total: ${pretTotal.toFixed(
      2
    )} RON.\n\nConfirmi comanda?`;
    setDialogContent(content);
    setOpenConfirmDialog(true);
  };

  const handleSubmitComanda = async () => {
    setOpenConfirmDialog(false);

    if (!eveniment) return;

    const bileteComandate = tipuriBileteCuCantitate
      .filter((tb) => tb.cantitateSelectata > 0)
      .map((tb) => ({
        idTipBilet: tb.idTipBilet,
        cantitate: tb.cantitateSelectata,
      }));

    if (bileteComandate.length === 0) {
      setError("Te rugăm să selectezi cel puțin un bilet.");
      return;
    }

    const comandaPayload = {
      idEveniment: eveniment.idEveniment,
      bilete: bileteComandate,
    };

    try {
      setLoading(true);
      const res = await api.post("/comenzi/creare", comandaPayload);
      setSuccessMessage("Comanda a fost plasată cu succes!");
      console.log("Comandă plasată:", res.data);
      navigate(`/comanda-confirmare/${res.data.idComanda}`);
    } catch (err: any) {
      console.error("Eroare la plasarea comenzii:", err);
      setError(
        err.response?.data?.message ||
          "Eroare la plasarea comenzii. Vă rugăm să încercați din nou."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography ml={2}>Se încarcă evenimentul...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!eveniment) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Evenimentul nu a putut fi găsit.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Cumpără bilete pentru "{eveniment.numeEveniment}"
      </Typography>
      <Typography variant="body1" color="text.secondary" align="center" mb={3}>
        {new Date(eveniment.dataEveniment).toLocaleDateString("ro-RO", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        la {eveniment.oraIncepere}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Tip bilet</Typography>
          <Typography variant="h6">Preț</Typography>
          <Typography variant="h6">Nr. bilete</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {tipuriBileteCuCantitate.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Nu există tipuri de bilete configurate pentru acest eveniment.
          </Alert>
        )}

        {tipuriBileteCuCantitate.map((tipBilet) => (
          <Box
            key={tipBilet.idTipBilet}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            sx={{
              p: 1,
              border: "1px solid #eee",
              borderRadius: 1,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {tipBilet.numeTip}
            </Typography>
            <Typography
              variant="body1"
              sx={{ minWidth: 100, textAlign: "right" }}
            >
              {tipBilet.pret.toFixed(2)} RON
            </Typography>
            <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
              <IconButton
                onClick={() => handleCantitateChange(tipBilet.idTipBilet, -1)}
                disabled={tipBilet.cantitateSelectata === 0}
                size="small"
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                variant="outlined"
                value={tipBilet.cantitateSelectata}
                inputProps={{ readOnly: true, style: { textAlign: "center" } }}
                size="small"
                sx={{ width: 60, mx: 1 }}
              />
              <IconButton
                onClick={() => handleCantitateChange(tipBilet.idTipBilet, 1)}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />
        <Box
          sx={{
            p: 1,
            border: "1px solid #eee",
            borderRadius: 1,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          ></Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 3, textAlign: "right" }}>
        <Typography variant="h5">
          Total de plată: {pretTotal.toFixed(2)} RON
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirmOrder}
          sx={{ mt: 2 }}
          disabled={loading || pretTotal === 0}
        >
          {eveniment.cuLocuriNominale
            ? "Plasează Comanda"
            : "Selectează locurile"}
        </Button>
      </Paper>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">Confirmă Comanda</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="confirm-dialog-description"
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Anulează</Button>
          <Button onClick={handleSubmitComanda} autoFocus>
            Confirmă
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
