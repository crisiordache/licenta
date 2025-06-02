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
import React from "react";

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
            reject(new Error("Structura nu e un array."));
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
                new Error(
                  "Structura JSON conține obiecte Loc invalide (lipsesc rand, numar, x sau y, sau au tip greșit)."
                )
              );
            }
            resolve(parsed);
          }
        } catch (err: any) {
          reject(new Error("Eroare la parsarea JSON-ului: " + err.message));
        }
      };

      reader.onerror = () => reject(new Error("Eroare la citirea fișierului."));

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
      setJsonError("Fișier JSON invalid: " + (error.message || error));
      console.error(error);
    }
  };

  const latimeLoc = 30;
  const latimeLabelRand = 50;
  const paddingContainer = 20;

  const { latime, lungime } = useMemo(() => {
    if (formData.structura.length === 0) return { latime: 0, lungime: 0 };

    let xMin = Infinity;
    let yMin = Infinity;
    let xMax = 0;
    let yMax = 0;

    formData.structura.forEach((loc) => {
      const x = typeof loc.x === "number" ? loc.x : 0;
      const y = typeof loc.y === "number" ? loc.y : 0;

      if (x < xMin) xMin = x;
      if (y < yMin) yMin = y;
      if (x + latimeLoc > xMax) xMax = x + latimeLoc;
      if (y + latimeLoc > yMax) yMax = y + latimeLoc;
    });

    const distantaX = yMax - xMin;
    const distantaY = yMax - yMin;

    const latimeFinala = latimeLabelRand + distantaX + paddingContainer * 2;
    const lungimeFinala = distantaY + paddingContainer * 2;

    return {
      latime: Math.max(200, latimeFinala),
      lungime: Math.max(150, lungimeFinala),
    };
  }, [formData.structura]);

  const locuriPeRand = useMemo(() => {
    const randuri: { [key: string]: Loc[] } = {};
    formData.structura.forEach((loc) => {
      if (!randuri[loc.rand]) {
        randuri[loc.rand] = [];
      }
      randuri[loc.rand].push(loc);
    });

    let minY = Infinity;
    if (formData.structura.length > 0) {
      minY = Math.min(...formData.structura.map((loc) => loc.y));
    }

    Object.keys(randuri).forEach((rand) => {
      randuri[rand].sort((a, b) => a.numar - b.numar);
    });

    const randuriSortate = Object.keys(randuri).sort((a, b) => {
      const primulLocA = randuri[a][0];
      const primulLocB = randuri[b][0];
      if (primulLocA && primulLocB) {
        return primulLocA.y - minY - (primulLocB.y - minY);
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

  const { offsetX, offsetY } = useMemo(() => {
    if (formData.structura.length === 0) return { offsetX: 0, offsetY: 0 };

    let minX = Infinity;
    let minY = Infinity;

    formData.structura.forEach((loc) => {
      if (loc.x < minX) minX = loc.x;
      if (loc.y < minY) minY = loc.y;
    });

    return { offsetX: minX, offsetY: minY };
  }, [formData.structura]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 800, mx: "auto", p: 2 }}
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
            border: "1px solid #ccc",
            borderRadius: 2,
            position: "relative",
            width: latime,
            height: lungime,
            overflow: "hidden",
            bgcolor: "#f5f5f5",
            mx: "auto",
          }}
        >
          {locuriPeRand.map(({ loc, estePrimulDinRand }) => (
            <React.Fragment key={`${loc.rand}-${loc.numar}`}>
              {estePrimulDinRand && (
                <Typography
                  key={`label-${loc.rand}`}
                  variant="caption"
                  sx={{
                    position: "absolute",
                    left: paddingContainer,
                    top: loc.y - offsetY + latimeLoc / 2 - 8 + paddingContainer,
                    width: latimeLabelRand - 10,
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "#555",
                    zIndex: 1,
                  }}
                >
                  {loc.rand}
                </Typography>
              )}
              <Box
                sx={{
                  position: "absolute",
                  left: loc.x - offsetX + latimeLabelRand + paddingContainer,
                  top: loc.y - offsetY + paddingContainer,
                  width: latimeLoc,
                  height: latimeLoc,
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
            </React.Fragment>
          ))}
        </Box>
      )}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
        Adaugă Sală
      </Button>
    </Box>
  );
};
