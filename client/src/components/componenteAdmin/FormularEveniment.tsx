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

export default function FormularEveniment() {
  const [formData, setFormData] = useState({
    denumireEveniment: "",
    descriere: "",
    dataEveniment: "",
    denumireSala: "",
    poster: "",
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
      const formDataWithImage = new FormData();
      formDataWithImage.append("denumireEveniment", formData.denumireEveniment);
      formDataWithImage.append("descriere", formData.descriere);
      formDataWithImage.append("dataEveniment", formData.dataEveniment);
      formDataWithImage.append("denumireSala", formData.denumireSala);
      if (imageFile) {
        formDataWithImage.append("poster", imageFile);
      }

      await api.post("/evenimente", formDataWithImage, {
        withCredentials: true,
      });
      alert("Eveniment adăugat cu succes!");
      setFormData({
        denumireEveniment: "",
        descriere: "",
        dataEveniment: "",
        denumireSala: "",
        poster: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Eroare la salvare:", error);
      alert("Eroare la adăugare.");
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
        name="denumireEveniment"
        label="Nume eveniment"
        variant="outlined"
        value={formData.denumireEveniment}
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

      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel id="denumireSala-label">Sala</InputLabel>
        <Select
          labelId="denumireSala-label"
          name="denumireSala"
          value={formData.denumireSala}
          label="Sala"
          onChange={handleSelectChange}
        >
          {sali.map((sala) => (
            <MenuItem key={sala.idSala} value={sala.denumireSala}>
              {sala.denumireSala}
            </MenuItem>
          ))}
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
}
