import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import api from "../../api";
import Sala from "../../types/Sala";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const FormularEveniment = () => {
  const [formData, setFormData] = useState({
    numeEveniment: "",
    descriere: "",
    dataEveniment: "",
    oraIncepere: "",
    cuLocuriNominale: "false",
    sala: "",
  });

  const [sali, setSali] = useState<Sala[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataCuImagine = new FormData();
      formDataCuImagine.append("numeEveniment", formData.numeEveniment);
      formDataCuImagine.append("descriere", formData.descriere);
      formDataCuImagine.append("dataEveniment", formData.dataEveniment);
      formDataCuImagine.append("oraIncepere", formData.oraIncepere);
      formDataCuImagine.append("cuLocuriNominale", formData.cuLocuriNominale);
      formDataCuImagine.append("sala", formData.sala);
      if (imageFile) {
        formDataCuImagine.append("poster", imageFile);
      }

      await api.post("/evenimente", formDataCuImagine, {
        withCredentials: true,
      });
      alert("Eveniment adăugat cu succes!");
      setFormData({
        numeEveniment: "",
        descriere: "",
        dataEveniment: "",
        oraIncepere: "",
        cuLocuriNominale: "false",
        sala: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Eroare la salvare eveniment:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: 500, mx: "auto" }}
    >
      <Typography variant="h6" mb={2}>
        Adaugă Eveniment
      </Typography>

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
              {sala.denumireSala}
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

      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel id="cuLocuriNominale-label">Locuri nominale?</InputLabel>
        <Select
          labelId="cuLocuriNominale-label"
          name="cuLocuriNominale"
          value={formData.cuLocuriNominale}
          label="Locuri nominale?"
          onChange={handleSelectChange}
        >
          <MenuItem value="true">Da</MenuItem>
          <MenuItem value="false">Nu</MenuItem>
        </Select>
      </FormControl>

      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2 }}
      >
        Încărcați fotografia
        <Input type="file" onChange={handleImageChange} hidden />
      </Button>

      {imageError && <FormHelperText error>{imageError}</FormHelperText>}

      <Button type="submit" variant="contained" fullWidth>
        Adaugă Eveniment
      </Button>
    </Box>
  );
};
