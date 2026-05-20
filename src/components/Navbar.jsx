import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContect";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>My Shop</h1>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          {/* <Link to="/auth" className='navbar-link'>Auth</Link> */}
          <Link to="/checkout" className="navbar-link">
            Cart
          </Link>
        </div>
        <div className="navbar-auth">
          {!user ? (
            <div className="navbar-auth-links">
              <Link to="/auth" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/auth" className="btn btn-primary">
                Register
              </Link>
            </div>
          ) : (
            <div className="navbar-auth-links">
              <span className="navbar-user">Welcome, {user.email}</span>
              <Link to="/auth" className="btn btn-primary" onClick={logout}>
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
