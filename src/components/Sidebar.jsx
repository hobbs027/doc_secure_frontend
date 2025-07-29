import { useAuth } from '../context/AuthContext';
import { getAllowedLinks } from '../utils/roleAccess';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { user } = useAuth();
  const links = getAllowedLinks(user?.role);

  const allRoutes = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/submit', label: 'Submit Document' },
    { path: '/review-submissions', label: 'Review Documents' },
    { path: '/admin', label: 'Admin Panel' },
  ];

  return (
    <nav>
      {allRoutes.map((route) =>
        links.includes(route.path) ? (
          <NavLink key={route.path} to={route.path}>
            {route.label}
          </NavLink>
        ) : null
      )}
    </nav>
  );
}
