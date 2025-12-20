import { Backdrop, Box } from "@mui/material";
import { keyframes } from '@mui/system';

const swap = keyframes`
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(40px); }
`;

const LoadingComponent = () => {
  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: 1301,
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 64, // container width for spacing
          height: 24,
        }}
      >
        {/* First block */}
        <Box
          sx={{
            position: 'absolute',
            width: 24,
            height: 24,
            bgcolor: '#047E4B',
            borderRadius: 1,
            animation: `${swap} 1.2s ease-in-out infinite`,
          }}
        />

        {/* Second block */}
        <Box
          sx={{
            position: 'absolute',
            width: 24,
            height: 24,
            bgcolor: '#047E4B',
            borderRadius: 1,
            animation: `${swap} 1.2s ease-in-out infinite`,
            animationDelay: '0.6s',
          }}
        />
      </Box>
    </Backdrop>
  );
};

export default LoadingComponent;
