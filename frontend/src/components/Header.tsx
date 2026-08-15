import { NavLink, useNavigate } from "react-router-dom";
import { KnightMark } from "./KnightMark";
import { useAuth } from "../auth/AuthContext";
import "./Header.css";

const NAV = [
  { to: "/", label: "Главная", end: true },
  { to: "/about", label: "О клубе" },
  { to: "/trainers", label: "Тренеры" },
  { to: "/branches", label: "Филиалы" },
  { to: "/schedule", label: "Расписание" },
  { to: "/pricing", label: "Цены" },
  { to: "/news", label: "Новости" },
  { to: "/contacts", label: "Контакты" },
];

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="container site-header__row">
        <NavLink to="/" className="site-header__brand">
          <KnightMark />
          <span>
            Питерские драконы
            <small>шахматный клуб</small>
          </span>
        </NavLink>

        <nav className="site-header__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "site-header__link is-active" : "site-header__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "site-header__link is-active" : "site-header__link")}>
              Админка
            </NavLink>
          )}
        </nav>

        <div className="site-header__actions">
          {user ? (
            <>
              <NavLink to="/lk" className="btn btn-ghost">
                {user.fullName.split(" ")[0]}
              </NavLink>
              <button
                className="btn btn-ghost"
                type="button"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-ghost">
              Войти
            </NavLink>
          )}
          <NavLink to="/trial" className="btn btn-primary site-header__cta">
            Записаться
          </NavLink>
        </div>
      </div>
    </header>
  );
}
