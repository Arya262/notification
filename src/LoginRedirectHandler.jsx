import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // ✅ correct import

const LoginRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Save to localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('', JSON.stringify(decoded));

        // Redirect to dashboard
        navigate('/', { replace: true });
      } catch (e) {
        alert('Invalid token');
        console.error(e);
        navigate('/error');
      }
    } else {
      alert('Token not found in URL');
      navigate('/error');
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default LoginRedirectHandler;
