import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowBack, CloudUpload } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { imageApi } from "../../api/imageApi";
import { styled } from "@mui/material/styles";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../constants/translations";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const EditProfile = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [previewSrc, setPreviewSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    image: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await userApi.getUser(id);
        setFormData({
          name: res.data.name || "",
          username: res.data.username || "",
          email: res.data.email || "",
          image: res.data.image || null,
        });
      } catch (err) {
        console.error("Error fetching user data", err.message);
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchUserData();
  }, [id]);

  // Image Preview
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      const res = await imageApi.addImage(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setImageFile(res.data.savedImage);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewSrc(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setImageFile(null);
      setPreviewSrc(null);
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  const handleSubmit = async () => {
    try {
      console.log(id, { ...formData, image: imageFile });
      const res = await userApi.updateUser(id, {
        ...formData,
        image: imageFile,
      });
      console.log(res);
      navigate(`/settings`);
    } catch (err) {
      console.error("Error updating user", err.message);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Box sx={{ px: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Stack direction={"row"} spacing={{ sm: 3, xs: 2 }}>
          <Button
            variant="text"
            color="primary"
            size="small"
            startIcon={<ArrowBack />}
            sx={{ textTransform: "none" }}
            onClick={handleBack}
          >
            {translations[language].go_back}
          </Button>
          <Typography
            variant="h6"
            fontWeight={{ sm: "bold" }}
            color="text.primary"
            sx={{ mt: 3 }}
          >
            {translations[language].edit_profile}
          </Typography>
        </Stack>
        <Button
          variant="text"
          size="small"
          color="primary"
          onClick={handleSubmit}
        >
          {translations[language].save}
        </Button>
      </Box>
      <Box component="form">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Card sx={{ my: 2 }}>
            {previewSrc ? (
              <CardMedia
                component="img"
                src={previewSrc}
                alt="Image Preview"
                sx={{ height: 250, width: 250, objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  height: 250,
                  width: 250,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {translations[language].no_data}
                </Typography>
              </Box>
            )}
          </Card>
          <Button
            component="label"
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
            fullWidth
          >
            {translations[language].upload}
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
          <Box
            sx={{
              mt: 3,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              label={translations[language].name}
              variant="outlined"
              value={formData.name}
              size="small"
              color="primary"
              fullWidth
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label={translations[language].username}
              variant="outlined"
              value={formData.username}
              size="small"
              color="primary"
              fullWidth
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </Box>
        </Box>
      </Box>
      {error && (
        <Alert
          severity="error"
          sx={{ position: "fixed", bottom: 5, left: 0, width: "100%" }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default EditProfile;
