import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  SelectChangeEvent,
  Input,
  FormHelperText,
  IconButton,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import api from "../../api";
import Sala from "../../types/Sala";
import CloudUploadIcon from "@mui/icons-material/AddPhotoAlternate";
import { TipBilet } from "../../types/TipBilet";
import { Loc } from "../../types/Loc";
import { VizualizareSala } from "./VizualizareSala";
import { useNavigate } from "react-router-dom";

export interface TipBiletCuLocuri extends TipBilet {
  locuriAsignate: Loc[];
}

export const FormularEveniment = () => {
  const [formData, setFormData] = useState({
    numeEveniment: "",
    descriere: "",
    dataEveniment: "",
    oraIncepere: "",
    durataEveniment: "",
    cuLocNominal: "false",
    sala: "",
  });

  const [sali, setSali] = useState<Sala[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

  const [tipuriBilete, setTipuriBilete] = useState<TipBiletCuLocuri[]>([]);
  const [locuriSelectateCurent, setLocuriSelectateCurent] = useState<
    Map<string, Loc>
  >(new Map());
  const [activeTipBiletId, setActiveTipBiletId] = useState<
    string | number | null
  >(null);

  const [detaliiSalaSelectata, setDetaliiSalaSelectata] = useState<Sala | null>(
    null
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSali = async () => {
      try {
        const res = await api.get("/sali");
        setSali(res.data);
      } catch (error) {
        console.error("Eroare la încărcarea sălilor:", error);
      }
    };
    fetchSali();
  }, []);

  useEffect(() => {
    if (formData.sala) {
      const salaSelectata = sali.find(
        (sala) => sala.idSala.toString() === formData.sala
      );
      if (salaSelectata) {
        setDetaliiSalaSelectata(salaSelectata);
        setLocuriSelectateCurent(new Map());
        setTipuriBilete([]);
        setActiveTipBiletId(null);
      } else {
        setDetaliiSalaSelectata(null);
        setLocuriSelectateCurent(new Map());
        setTipuriBilete([]);
        setActiveTipBiletId(null);
      }
    } else {
      setDetaliiSalaSelectata(null);
      setTipuriBilete([]);
      setLocuriSelectateCurent(new Map());
      setActiveTipBiletId(null);
    }
  }, [formData.sala, sali]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "cuLocuriNominale") {
      setTipuriBilete([]);
      setLocuriSelectateCurent(new Map());
      setActiveTipBiletId(null);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        setImageError("");
      } else {
        setImageError("Te rugăm să selectezi doar imagini.");
        setImageFile(null);
      }
    }
  };

  const validateTipBilet = useCallback(
    (bilet: TipBiletCuLocuri): boolean => {
      if (bilet.numeTip.trim() === "") {
        setValidationError("Numele tipului de bilet nu poate fi gol.");
        return false;
      }
      if (
        bilet.pret === "" ||
        isNaN(Number(bilet.pret)) ||
        Number(bilet.pret) <= 0
      ) {
        setValidationError("Prețul biletului trebuie să fie un număr pozitiv.");
        return false;
      }
      if (
        formData.cuLocNominal === "true" &&
        bilet.locuriAsignate.length === 0
      ) {
        setValidationError(
          `Tipul de bilet "${bilet.numeTip}" necesită cel puțin un loc asignat.`
        );
        return false;
      }

      setValidationError(null);
      return true;
    },
    [formData.cuLocNominal]
  );

  const saveCurrentActiveBilet = useCallback(() => {
    if (activeTipBiletId !== null) {
      const activeBiletIndex = tipuriBilete.findIndex(
        (b) => b.idTipBilet === activeTipBiletId
      );
      if (activeBiletIndex !== -1) {
        const updatedTipBilet = {
          ...tipuriBilete[activeBiletIndex],
          locuriAsignate: Array.from(locuriSelectateCurent.values()),
        };
        validateTipBilet(updatedTipBilet);
        setTipuriBilete((prev) =>
          prev.map((b, idx) => (idx === activeBiletIndex ? updatedTipBilet : b))
        );
      }
    }
  }, [activeTipBiletId, locuriSelectateCurent, tipuriBilete, validateTipBilet]);

  const handleAddTipBilet = () => {
    saveCurrentActiveBilet();

    const incompleteBilet = tipuriBilete.find(
      (bilet) =>
        bilet.numeTip.trim() === "" ||
        bilet.pret === "" ||
        Number(bilet.pret) <= 0 ||
        (formData.cuLocNominal === "true" && bilet.locuriAsignate.length === 0)
    );
    if (incompleteBilet) {
      setValidationError(
        "Finalizează editarea sau completează câmpurile pentru tipurile de bilete existente înainte de a adăuga un nou tip."
      );
      return;
    }

    const newId = Date.now();
    const newTipBilet: TipBiletCuLocuri = {
      idTipBilet: newId,
      numeTip: "",
      pret: "",
      locuriAsignate: [],
    };
    setTipuriBilete((prev) => [...prev, newTipBilet]);
    setActiveTipBiletId(newId);
    setLocuriSelectateCurent(new Map());
    setValidationError(null);
  };

  const handleRemoveTipBilet = (id: string | number) => {
    if (activeTipBiletId === id) {
      setActiveTipBiletId(null);
      setLocuriSelectateCurent(new Map());
    }
    setTipuriBilete((prev) => prev.filter((bilet) => bilet.idTipBilet !== id));
    setValidationError(null);
  };

  const handleTipBiletChange = (
    id: string | number,
    field: keyof TipBilet,
    value: string
  ) => {
    setTipuriBilete((prev) => {
      const updated = prev.map((bilet) =>
        bilet.idTipBilet === id ? { ...bilet, [field]: value } : bilet
      );
      const biletValidat = updated.find((b) => b.idTipBilet === id);
      if (biletValidat) {
        validateTipBilet(biletValidat as TipBiletCuLocuri);
      }
      return updated;
    });
  };

  const handleToggleLocSelectat = (loc: Loc) => {
    const locKey = `${loc.rand}-${loc.numar}`;
    setLocuriSelectateCurent((prev) => {
      const newMap = new Map(prev);

      if (newMap.has(locKey)) {
        newMap.delete(locKey);
      } else {
        newMap.set(locKey, loc);
      }

      if (activeTipBiletId !== null) {
        const activeBilet = tipuriBilete.find(
          (b) => b.idTipBilet === activeTipBiletId
        );
        if (activeBilet) {
          validateTipBilet({
            ...activeBilet,
            locuriAsignate: Array.from(newMap.values()),
          });
        }
      }
      return newMap;
    });
  };

  const handleSelectTipBiletToEdit = useCallback(
    (bilet: TipBiletCuLocuri) => {
      setValidationError(null);
      saveCurrentActiveBilet();

      setActiveTipBiletId(bilet.idTipBilet);
      setLocuriSelectateCurent(
        new Map(
          bilet.locuriAsignate.map((loc) => [`${loc.rand}-${loc.numar}`, loc])
        )
      );
    },
    [saveCurrentActiveBilet]
  );

  const locuriBlocate = useMemo(() => {
    const blocked = new Map<string, Loc>();
    tipuriBilete.forEach((bilet) => {
      if (bilet.idTipBilet !== activeTipBiletId) {
        bilet.locuriAsignate.forEach((loc) => {
          blocked.set(`${loc.rand}-${loc.numar}`, loc);
        });
      }
    });
    return blocked;
  }, [tipuriBilete, activeTipBiletId]);

  const parsedStructuraLocuri = useMemo(() => {
    if (!detaliiSalaSelectata || !detaliiSalaSelectata.structura) {
      return [];
    }
    try {
      const parsed = JSON.parse(detaliiSalaSelectata.structura) as Loc[];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Eroare la parsarea structurii sălii:", e);
      return [];
    }
  }, [detaliiSalaSelectata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    // Validează datele principale ale evenimentului
    if (
      !formData.numeEveniment ||
      !formData.descriere ||
      !formData.sala ||
      !formData.dataEveniment ||
      !formData.oraIncepere ||
      !formData.durataEveniment ||
      isNaN(Number(formData.durataEveniment)) ||
      Number(formData.durataEveniment) <= 0
    ) {
      setValidationError(
        "Toate câmpurile obligatorii (nume, descriere, sală, dată, oră, durată) trebuie completate, iar durata trebuie să fie un număr pozitiv."
      );
      return;
    }

    // Validează tipurile de bilete dacă sunt cu loc nominal
    if (formData.cuLocNominal === "true") {
      let finalTipuriBilete = [...tipuriBilete];
      if (activeTipBiletId !== null) {
        const activeBiletIndex = finalTipuriBilete.findIndex(
          (b) => b.idTipBilet === activeTipBiletId
        );
        if (activeBiletIndex !== -1) {
          const updatedTipBilet = {
            ...finalTipuriBilete[activeBiletIndex],
            locuriAsignate: Array.from(locuriSelectateCurent.values()),
          };
          if (!validateTipBilet(updatedTipBilet)) {
            return;
          }
          finalTipuriBilete[activeBiletIndex] = updatedTipBilet;
        }
      }

      const allTipuriBileteValid = finalTipuriBilete.every((bilet) =>
        validateTipBilet(bilet)
      );
      if (!allTipuriBileteValid) {
        setValidationError(
          "Există tipuri de bilete incomplete sau invalide. Te rugăm să le corectezi."
        );
        return;
      }
      if (finalTipuriBilete.length === 0) {
        setValidationError(
          "Te rugăm să adaugi cel puțin un tip de bilet pentru locurile nominale."
        );
        return;
      }
    }

    // *** ÎNCEPE MODIFICAREA AICI ***

    try {
      const formDataToSend = new FormData();

      // Adaugă câmpurile simple din formData
      formDataToSend.append("numeEveniment", formData.numeEveniment);
      formDataToSend.append("descriere", formData.descriere);
      formDataToSend.append("dataEveniment", formData.dataEveniment);
      formDataToSend.append("oraIncepere", formData.oraIncepere);
      formDataToSend.append(
        "durataEveniment",
        String(formData.durataEveniment)
      ); // Convert to string
      formDataToSend.append(
        "cuLocNominal",
        String(formData.cuLocNominal === "true")
      ); // Convert to boolean string
      formDataToSend.append("idSala", String(formData.sala)); // Convert to string

      // Adaugă fișierul poster
      if (imageFile) {
        formDataToSend.append("poster", imageFile);
      } else {
        // Dacă posterul este opțional, poți seta o valoare goală
        // sau te asiguri că backend-ul acceptă fișier lipsă.
        // În controllerul tău, fileIsRequired: false permite asta.
      }

      // Adaugă tipurile de bilete. JSON.stringify() este necesar pentru a le trimite ca string.
      // Backend-ul NestJS (ParseArrayPipe sau similar) va deserializa automat.
      const tipuriBiletePentruBackend = tipuriBilete.map(
        ({ idTipBilet, ...rest }) => ({
          ...rest,
          pret: Number(rest.pret), // Asigură-te că prețul este număr
        })
      );
      formDataToSend.append(
        "tipuriBilete",
        JSON.stringify(tipuriBiletePentruBackend)
      ); // Trimite ca string JSON

      // Trimite cererea POST cu FormData
      const response = await api.post("/evenimente", formDataToSend, {
        headers: {
          // Axios va seta automat 'Content-Type': 'multipart/form-data'
          // când trimiți un obiect FormData. Nu trebuie să o setezi manual.
          // "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log("Eveniment adăugat cu succes:", response.data);
      setSuccessMessage("Eveniment adăugat cu succes!");

      // Reset form
      setFormData({
        numeEveniment: "",
        descriere: "",
        dataEveniment: "",
        oraIncepere: "",
        durataEveniment: "",
        cuLocNominal: "false",
        sala: "",
      });
      setImageFile(null);
      setTipuriBilete([]);
      setLocuriSelectateCurent(new Map());
      setActiveTipBiletId(null);
      setValidationError(null);

      navigate("/");
    } catch (error: any) {
      console.error(
        "Eroare la salvare eveniment:",
        error.response?.data || error
      );

      if (error.response?.data) {
        console.log(
          "Detailed error:",
          JSON.stringify(error.response.data, null, 2)
        );
      }

      setValidationError(
        error.response?.data?.message ||
          "Eroare la salvare eveniment. Verifică consola pentru detalii."
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 800, mx: "auto", p: 2 }}
    >
      <Typography variant="h6" mb={2}>
        Adaugă Eveniment
      </Typography>

      {validationError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <TextField
        fullWidth
        required
        name="numeEveniment"
        label="Nume eveniment"
        variant="outlined"
        value={formData.numeEveniment}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        required
        name="descriere"
        label="Descriere"
        variant="outlined"
        multiline
        rows={4}
        value={formData.descriere}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel id="sala-label">Sala</InputLabel>
        <Select
          labelId="sala-label"
          name="sala"
          value={formData.sala}
          label="Sala"
          onChange={handleSelectChange}
        >
          {sali.map((sala) => (
            <MenuItem key={sala.idSala} value={sala.idSala.toString()}>
              {sala.numeSala}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        required
        name="dataEveniment"
        label="Data"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.dataEveniment}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        required
        name="oraIncepere"
        label="Ora Începere"
        type="time"
        InputLabelProps={{ shrink: true }}
        value={formData.oraIncepere}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        required
        name="durataEveniment"
        label="Durata Eveniment (minute)"
        type="number"
        variant="outlined"
        value={formData.durataEveniment}
        onChange={handleInputChange}
        sx={{ mb: 2 }}
        inputProps={{ min: "1" }}
      />

      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel id="cuLocuriNominale-label">Locuri nominale?</InputLabel>
        <Select
          labelId="cuLocuriNominale-label"
          name="cuLocuriNominale"
          value={formData.cuLocNominal}
          label="Locuri nominale?"
          onChange={handleSelectChange}
        >
          <MenuItem value="true">Da</MenuItem>
          <MenuItem value="false">Nu</MenuItem>
        </Select>
      </FormControl>

      {formData.cuLocNominal === "true" && (
        <Box
          sx={{
            border: "1px dashed #ccc",
            p: 2,
            mb: 2,
            borderRadius: "4px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Typography variant="h6" mb={2}>
            Configurare bilete cu locuri
          </Typography>

          <Typography variant="subtitle1" mb={1}>
            Tipuri de Bilete:
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxHeight: "250px",
              overflowY: "auto",
              overflowX: "hidden",
              mb: 2,
              p: 1,
              border: "1px solid #f0f0f0",
              borderRadius: "4px",
            }}
          >
            {tipuriBilete.map((bilet) => (
              <Box
                key={bilet.idTipBilet}
                display="flex"
                gap={2}
                mb={2}
                alignItems="center"
                sx={{
                  width: "100%",
                  border:
                    activeTipBiletId === bilet.idTipBilet
                      ? "2px solid #1976d2"
                      : "1px solid #eee",
                  borderRadius: "4px",
                  p: 1,
                  cursor: "pointer",
                }}
                onClick={() => handleSelectTipBiletToEdit(bilet)}
              >
                <TextField
                  label="Nume Tip Bilet"
                  value={bilet.numeTip}
                  onChange={(e) =>
                    handleTipBiletChange(
                      bilet.idTipBilet,
                      "numeTip",
                      e.target.value
                    )
                  }
                  sx={{ flexGrow: 1 }}
                  size="small"
                  disabled={activeTipBiletId !== bilet.idTipBilet}
                />
                <TextField
                  label="Preț"
                  type="number"
                  value={bilet.pret}
                  onChange={(e) =>
                    handleTipBiletChange(
                      bilet.idTipBilet,
                      "pret",
                      e.target.value
                    )
                  }
                  inputProps={{ min: "0", step: "0.01" }}
                  sx={{ width: 100 }}
                  size="small"
                  disabled={activeTipBiletId !== bilet.idTipBilet}
                />
                <IconButton
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTipBilet(bilet.idTipBilet);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddTipBilet}
            fullWidth
            sx={{ mb: 3 }}
          >
            Adaugă Tip Bilet
          </Button>

          <Typography variant="subtitle1" mb={1}>
            Selectează locurile:
            {activeTipBiletId && (
              <Typography
                component="span"
                variant="body2"
                color="primary"
                ml={1}
              >
                (pentru tipul de bilet activ:{" "}
                {tipuriBilete.find((b) => b.idTipBilet === activeTipBiletId)
                  ?.numeTip || "N/A"}
                )
              </Typography>
            )}
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxHeight: "400px",
              overflow: "auto",
              p: 1,
              border: "1px solid #f0f0f0",
              borderRadius: "4px",
            }}
          >
            {!formData.sala ? (
              <Typography color="textSecondary" sx={{ mb: 2 }}>
                Selectează o sală mai întâi pentru a vizualiza locurile.
              </Typography>
            ) : (
              <>
                {parsedStructuraLocuri.length > 0 ? (
                  <VizualizareSala
                    structura={parsedStructuraLocuri}
                    locuriSelectate={locuriSelectateCurent}
                    onToggleLoc={handleToggleLocSelectat}
                    locuriBolcate={locuriBlocate}
                  />
                ) : (
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    Sala selectată nu are o structură de locuri definită.
                  </Typography>
                )}
              </>
            )}
          </Box>

          <Typography variant="body2" mt={2}>
            Locuri selectate pentru tipul activ ({locuriSelectateCurent.size}):{" "}
            {Array.from(locuriSelectateCurent.values())
              .map((loc) => `${loc.rand}-${loc.numar}`)
              .join(", ")}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          mb: 2,
        }}
      >
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Încărcați fotografia
          <Input type="file" onChange={handleImageChange} hidden />
        </Button>
      </Box>
      {imageError && <FormHelperText error>{imageError}</FormHelperText>}
      {imageFile && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          Fișier imagine selectat: {imageFile.name}
        </Typography>
      )}

      <Button type="submit" variant="contained" fullWidth>
        Adaugă Eveniment
      </Button>
    </Box>
  );
};
