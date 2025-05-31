import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Eveniment } from "../../types/Eveniment";
import { TipBilet } from "../../types/TipBilet";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const SelectareBiletePage = () => {
  const { idEveniment } = useParams<{ idEveniment: string }>();
  const [eveniment, setEveniment] = useState<Eveniment | null>(null);
  const [tipuriBilet, setTipuriBilet] = useState<TipBilet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cantitatiSelectate, setCantitatiSelectate] = useState<{
    [tipBiletId: number]: number;
  }>({});
  const [totalPret, setTotalPret] = useState<number>(0);

  useEffect(() => {
    const fetchEvenimentAndTipuriBilet = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/evenimente/${idEveniment}`, {
          withCredentials: true,
        });
        setEveniment(res.data);
        if (res.data.tipuriBilet) {
          setTipuriBilet(res.data.tipuriBilet);
          const initialQuantities: { [tipBiletId: number]: number } = {};
          res.data.tipuriBilet.forEach((tip: TipBilet) => {
            initialQuantities[tip.idTipBilet as number] = 0;
          });
          setCantitatiSelectate(initialQuantities);
        } else {
          setError("Nu s-au găsit tipuri de bilete pentru acest eveniment.");
        }
      } catch (err: any) {
        console.error(
          "Eroare la obținerea evenimentului sau tipurilor de bilete:",
          err
        );
        setError(
          err.response?.data?.message ||
            "A apărut o eroare la încărcarea datelor."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvenimentAndTipuriBilet();
  }, [idEveniment]);

  useEffect(() => {
    let calculatedTotal = 0;
    tipuriBilet.forEach((tip) => {
      calculatedTotal +=
        tip.pret * (cantitatiSelectate[tip.idTipBilet as number] || 0);
    });
    setTotalPret(calculatedTotal);
  }, [cantitatiSelectate, tipuriBilet]);

  const handleQuantityChange = (tipBiletId: number, delta: number) => {
    setCantitatiSelectate((prevQuantities) => {
      const currentQuantity = prevQuantities[tipBiletId] || 0;
      const newQuantity = currentQuantity + delta;

      const tip = tipuriBilet.find((t) => t.idTipBilet === tipBiletId);
      const maxQuantity =
        tip?.stocDisponibil !== undefined ? tip.stocDisponibil : Infinity;

      if (newQuantity >= 0 && newQuantity <= maxQuantity) {
        return {
          ...prevQuantities,
          [tipBiletId]: newQuantity,
        };
      }
      return prevQuantities;
    });
  };

  const handleAddToCart = () => {
    console.log("Cantități selectate:", cantitatiSelectate);
    console.log("Total Preț:", totalPret);
    alert(
      `Ați adăugat în coș: ${JSON.stringify(
        cantitatiSelectate
      )}. Total: ${totalPret.toFixed(2)} RON`
    );
  };

  if (loading) {
    return (
      <Container style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress />
        <Typography variant="h6">
          Se încarcă detaliile evenimentului...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ marginTop: "50px" }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!eveniment) {
    return (
      <Container style={{ marginTop: "50px" }}>
        <Alert severity="warning">Evenimentul nu a fost găsit.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "30px", padding: "20px" }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {eveniment.numeEveniment}
      </Typography>
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        align="center"
        color="textSecondary"
      >
        Selectează Biletele
      </Typography>

      <Box sx={{ my: 4 }}>
        {tipuriBilet.length === 0 ? (
          <Alert severity="info">
            Momentan nu există tipuri de bilete disponibile pentru acest
            eveniment.
          </Alert>
        ) : (
          tipuriBilet.map((tip) => (
            <Card
              key={tip.idTipBilet}
              sx={{
                mb: 2,
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <CardContent
                sx={{ flexGrow: 1, p: 0, "&:last-child": { pb: 0 } }}
              >
                <Typography variant="h6">{tip.numeTip}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {tip.pret.toFixed(2)} RON
                </Typography>
                {tip.stocDisponibil !== undefined && (
                  <Typography variant="body2" color="textSecondary">
                    Stoc disponibil: {tip.stocDisponibil}
                  </Typography>
                )}
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  aria-label="scade cantitate"
                  onClick={() =>
                    handleQuantityChange(tip.idTipBilet as number, -1)
                  }
                  disabled={cantitatiSelectate[tip.idTipBilet as number] <= 0}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="h6" sx={{ mx: 2 }}>
                  {cantitatiSelectate[tip.idTipBilet as number]}
                </Typography>
                <IconButton
                  aria-label="creste cantitate"
                  onClick={() =>
                    handleQuantityChange(tip.idTipBilet as number, 1)
                  }
                  disabled={
                    cantitatiSelectate[tip.idTipBilet as number] >=
                    (tip.stocDisponibil || Infinity)
                  }
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Card>
          ))
        )}
      </Box>

      {tipuriBilet.length > 0 && (
        <Box sx={{ textAlign: "right", mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Total de plată: {totalPret.toFixed(2)} RON
          </Typography>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={totalPret === 0}
          >
            Adaugă în coș
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default SelectareBiletePage;
