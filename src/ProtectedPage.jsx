import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import Index from './pages/Index';

const ProtectedPage = () => {
  const { user } = useAuth();
  console.log('user at ProtectedPage: ', user);

  if (!user) {
    return <Navigate to='/login' replace />;
  }

  return <Index />;
};

export default ProtectedPage;