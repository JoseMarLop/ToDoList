import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './data/auth';

const RouteGuard = ({ children, isPublic = false }) => {
    const auth = isAuthenticated();
    const location = useLocation();

    if (isPublic && auth && location.pathname !== '/welcome') {
        // Redirige a /welcome si el usuario está autenticado y trata de acceder a rutas públicas
        return <Navigate to="/welcome" replace />;
    }

    if (!isPublic && !auth) {
        // Redirige a /login si el usuario no está autenticado y trata de acceder a rutas protegidas
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default RouteGuard;