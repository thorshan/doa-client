import { Backdrop, Box, CircularProgress } from "@mui/material";
import FooterNav from "../../components/FooterNav";
import CardComponent from "../../components/CardComponent";
import { useState } from "react";
import { useEffect } from "react";
import { cardApi } from "../../api/cardApi";
import AlertModal from "../../components/AlertModal";
import { useAuth } from "../../context/AuthContext";
import { userApi } from "../../api/userApi";

const Card = () => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await userApi.getUserData(user?.id);
        setCurrentUser(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserData();
  }, [user?.id]);

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await cardApi.getAllCards();
        setCards(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message);
      } finally {
        setError(null);
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading)
    return (
      <Backdrop
        open={loading}
        sx={{
          color: "primary.loading",
          backgroundColor: "background.default",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  return (
    <Box sx={{ px: 2, mt: 2, mb: 15 }}>
      {error && <AlertModal type={"error"} message={error} />}
      {cards
        .filter((card) => card.level === currentUser?.level)
        .map((card, index) => (
          <CardComponent index={index} data={card} />
        ))}
      <FooterNav />
    </Box>
  );
};

export default Card;
