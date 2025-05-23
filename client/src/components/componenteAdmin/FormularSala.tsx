import {
  Box,
  Button,
  FormHelperText,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useMemo } from "react";
import api from "../../api";
import { Loc } from "../../types/Loc";
import { useNavigate } from "react-router-dom";

export const FormularSala = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    numeSala: string;
    capacitate: string;
    adresa: string;
    structura: Loc[];
  }>({
    numeSala: "",
    capacitate: "",
    adresa: "",
    structura: [],
  });

  const [jsonError, setJsonError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (Number(formData.capacitate) === formData.structura.length) {
        await api.post("/sali", {
          numeSala: formData.numeSala,
          adresa: formData.adresa,
          capacitate: Number(formData.capacitate),
          structura: formData.structura,
        });

        alert("Sală adăugată cu succes!");
        navigate("/");
      } else {
        alert("Capacitatea nu corespunde cu structura dată");
      }
    } catch (error: any) {
      console.error("Eroare la salvare sală:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Eroare la salvare sală. Verifică consola pentru detalii.";
      alert(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const readFileAsJson = (file: File): Promise<Loc[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed)) {
            reject("Structura nu e un array.");
          } else {
            const isValid = parsed.every(
              (item: any) =>
                typeof item.rand === "string" &&
                typeof item.numar === "number" &&
                typeof item.x === "number" &&
                typeof item.y === "number"
            );
            if (!isValid) {
              reject(
                "Structura JSON conține obiecte Loc invalide (lipsesc rand, numar, x sau y, sau au tip greșit)."
              );
            }
            resolve(parsed);
          }
        } catch (err) {
          reject("Eroare la parsarea JSON-ului.");
        }
      };

      reader.onerror = () => reject("Eroare la citirea fișierului.");

      reader.readAsText(file);
    });
  };

  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await readFileAsJson(file);
      setFormData((prev) => ({
        ...prev,
        structura: parsed,
      }));
      setJsonError("");
      e.target.value = "";
    } catch (error: any) {
      setJsonError("Fișier JSON invalid: " + error.message || error);
      console.error(error);
    }
  };

  const { width: containerWidth, height: containerHeight } = useMemo(() => {
    if (formData.structura.length === 0) return { width: 0, height: 0 };

    let maxX = 0;
    let maxY = 0;
    const seatSize = 30;
    const padding = 20;

    formData.structura.forEach((loc) => {
      const currentX = typeof loc.x === "number" ? loc.x : 0;
      const currentY = typeof loc.y === "number" ? loc.y : 0;

      if (currentX + seatSize > maxX) maxX = currentX + seatSize;
      if (currentY + seatSize > maxY) maxY = currentY + seatSize;
    });

    const rowLabelWidth = 50;
    return { width: maxX + rowLabelWidth + padding, height: maxY + padding };
  }, [formData.structura]);

  const locuriPeRand = useMemo(() => {
    const randuri: { [key: string]: Loc[] } = {};
    formData.structura.forEach((loc) => {
      if (!randuri[loc.rand]) {
        randuri[loc.rand] = [];
      }
      randuri[loc.rand].push(loc);
    });

    Object.keys(randuri).forEach((rand) => {
      randuri[rand].sort((a, b) => a.numar - b.numar);
    });

    const randuriSortate = Object.keys(randuri).sort((a, b) => {
      const primulLocA = randuri[a][0];
      const primulLocB = randuri[b][0];
      if (primulLocA && primulLocB) {
        return primulLocA.y - primulLocB.y;
      }
      return 0;
    });

    const result: { loc: Loc; estePrimulDinRand: boolean }[] = [];
    let ultimulRand = "";
    randuriSortate.forEach((randName) => {
      randuri[randName].forEach((loc) => {
        result.push({ loc, estePrimulDinRand: loc.rand !== ultimulRand });
        ultimulRand = loc.rand;
      });
    });
    return result;
  }, [formData.structura]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 600, mx: "auto", p: 2 }}
    >
      <Typography variant="h6" mb={2}>
        Adăugare sală
      </Typography>
      <TextField
        fullWidth
        required
        name="numeSala"
        label="Nume Sală"
        variant="outlined"
        value={formData.numeSala}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      ></TextField>

      <TextField
        fullWidth
        required
        name="adresa"
        label="Adresă"
        variant="outlined"
        value={formData.adresa}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      ></TextField>

      <TextField
        fullWidth
        required
        name="capacitate"
        label="Capacitate"
        variant="outlined"
        value={formData.capacitate}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      ></TextField>

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Încarcă structura sălii (JSON):
      </Typography>
      <Button component="label" variant="contained" sx={{ mt: 1 }}>
        Încarcă fișier JSON
        <Input type="file" hidden onChange={handleJsonUpload} />
      </Button>
      {jsonError && <FormHelperText error>{jsonError}</FormHelperText>}

      {formData.structura.length > 0 && (
        <Box
          sx={{
            mt: 3,
            p: 1,
            border: "1px solid #ccc",
            borderRadius: 2,
            position: "relative",
            width: containerWidth,
            height: containerHeight,
            minHeight: 200,
            overflow: "auto",
            bgcolor: "#f5f5f5",
          }}
        >
          {locuriPeRand.map(({ loc, estePrimulDinRand }) => (
            <>
              {estePrimulDinRand && (
                <Typography
                  key={`label-${loc.rand}`}
                  variant="caption"
                  sx={{
                    position: "absolute",
                    left: loc.x - 40,
                    top: loc.y + 5,
                    width: 30,
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  {loc.rand}
                </Typography>
              )}
              <Box
                key={`${loc.rand}-${loc.numar}`}
                sx={{
                  position: "absolute",
                  left: loc.x,
                  top: loc.y,
                  width: 30,
                  height: 30,
                  bgcolor: "#1976d2",
                  color: "white",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "#1565c0",
                  },
                }}
                title={`Rand: ${loc.rand}, Loc: ${loc.numar}`}
              >
                {loc.numar}
              </Box>
            </>
          ))}
        </Box>
      )}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
        Adaugă Sală
      </Button>
    </Box>
  );
};
