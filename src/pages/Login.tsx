import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '~/contexts/ThemeContext';
import AppStorage from '~/services/storage';
import { loginAPI } from '~/services/api/auth';

export const Login = () => {
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const bgColor = theme === 'dark' ? '#121212' : '#f5f5f5';
  const cardBg = theme === 'dark' ? '#1e1e1e' : '#ffffff';
  const textColor = theme === 'dark' ? '#e0e0e0' : '#333';
  const inputBg = theme === 'dark' ? '#2a2a2a' : '#ffffff';
  const borderColor = theme === 'dark' ? '#444' : '#ddd';

  const handleLogin = async () => {
    console.log('=== handleLogin INICIADO ===');
    console.log('Username:', username);
    console.log('Password:', password ? '***' : 'vazio');
    
    setError('');
    setIsLoading(true);

    try {
      console.log('Chamando loginAPI...');
      const response = await loginAPI({ username, password });
      console.log('Resposta recebida:', response);
      
      const data = response.data;

      AppStorage.setToken(data.access);
      AppStorage.setRefresh(data.refresh);
      AppStorage.setUser(data.user);

      navigate('/');
    } catch (err: any) {
      console.error('ERRO NO LOGIN:', err);
      console.error('Erro completo:', JSON.stringify(err, null, 2));
      
      let errorMessage = 'Erro ao fazer login';
      
      if (err.message === 'Network Error' || !err.response) {
        errorMessage = 'Erro de conexão. Verifique se o servidor está rodando e se há problemas de CORS.';
        console.error('ERRO DE REDE - Possíveis causas:');
        console.error('1. Servidor não está rodando em http://127.0.0.1:8000');
        console.error('2. Problema de CORS - servidor precisa permitir requisições de http://localhost:5173');
        console.error('3. Firewall ou antivírus bloqueando a conexão');
      } else {
        errorMessage =
          err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          'Erro ao fazer login';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: bgColor,
        transition: 'background-color 0.3s',
      }}
    >
      <div
        style={{
          backgroundColor: cardBg,
          padding: '2rem',
          borderRadius: '12px',
          boxShadow:
            theme === 'dark'
              ? '0 10px 40px rgba(0, 0, 0, 0.5)'
              : '0 2px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
          border: `1px solid ${borderColor}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h1 style={{ margin: 0, textAlign: 'center', color: textColor }}>
            Login
          </h1>
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: `1px solid ${borderColor}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: textColor,
              fontSize: '1.2rem',
            }}
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: textColor,
              }}
            >
              Usuário
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: inputBg,
                color: textColor,
              }}
            />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: textColor,
              }}
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: inputBg,
                color: textColor,
              }}
            />
        </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('BOTÃO CLICADO!');
              handleLogin();
            }}
            disabled={isLoading}
            type="button"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
            }}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
      </div>
    </div>
  );
};
