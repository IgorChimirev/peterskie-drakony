import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <div className="site-footer__brand">Питерские драконы</div>
          <p className="site-footer__muted">
            Шахматный клуб для детей и взрослых в Санкт-Петербурге. Индивидуальные
            и групповые занятия, очно и заочно.
          </p>
        </div>

        <div>
          <div className="site-footer__title">Разделы</div>
          <ul className="site-footer__list">
            <li><Link to="/about">О клубе</Link></li>
            <li><Link to="/trainers">Тренеры</Link></li>
            <li><Link to="/schedule">Расписание</Link></li>
            <li><Link to="/pricing">Цены</Link></li>
          </ul>
        </div>

        <div>
          <div className="site-footer__title">Контакты</div>
          <ul className="site-footer__list">
            <li><a href="tel:+79811474354">+7 (981) 147-43-54</a></li>
            <li><a href="mailto:info@chessdragons.ru">info@chessdragons.ru</a></li>
            <li>Санкт-Петербург, 5 филиалов</li>
          </ul>
        </div>

        <div>
          <div className="site-footer__title">Мы в соцсетях</div>
          <ul className="site-footer__list">
            <li><a href="https://vk.ru/chess_dragons_spb" target="_blank" rel="noreferrer">ВКонтакте</a></li>
            <li>Telegram</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <span>© {new Date().getFullYear()} Шахматный клуб «Питерские драконы»</span>
        <span>Политика конфиденциальности · Публичная оферта</span>
      </div>
    </footer>
  );
}
