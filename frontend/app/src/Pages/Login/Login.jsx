// ===== LOGIN PAGE OPTIMIZADO =====
// src/Pages/Login/Login.jsx

// Hook personalizado con lógica de login
import { useLoginLogic } from "../../hooks/useLoginLogic";

// Componentes del sistema de diseño
import { LoginCard } from "../../components/organisms/LoginCard/LoginCard";
import { Typography } from "../../components/atoms/Typography/Typography";
import { FlexContainer } from "../../components/atoms/FlexContainer/FlexContainer";
import { Container } from "../../components/atoms/Container/Container";

function Login() {
  // ✅ NUEVO: Toda la lógica viene del hook personalizado
  const { 
    handleLoginSubmit, 
    handleForgotPassword, 
    error, 
    isLoading 
  } = useLoginLogic();

  return (
    <Container size="full">
      <FlexContainer
        direction="column"
        justify="center"
        align="center"
        spacing="xl"
        padding="xl"
        width="full"
        style={{ minHeight: '100vh' }}
      >
        {/* Header de la aplicación */}
        <FlexContainer
          direction="column"
          align="center"
          spacing="md"
        >
          <Typography 
            as="h1"
            variant="h1" 
            size="3xl" 
            weight="bold"
            align="center"
          >
            StreamingApp
          </Typography>
          <Typography 
            variant="body" 
            size="lg" 
            color="muted"
            align="center"
          >
            Tu plataforma de entretenimiento
          </Typography>
        </FlexContainer>

        {/* LoginCard optimizado */}
        <Container size="lg" style={{ maxWidth: '42rem', width: '100%' }}>
          <LoginCard
            title="Iniciar Sesión"
            subtitle="Ingresa tus credenciales para continuar"
            onSubmit={handleLoginSubmit}
            onForgotPassword={handleForgotPassword}
            loading={isLoading}
            error={error}
            size="lg"
            rounded="lg"
          />
        </Container>
      </FlexContainer>
    </Container>
  );
}

export { Login };