'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faBars, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="logo-container">
        <Link href="/">
          <Image src="/images/logo.png" alt="ロゴ" width={100} height={100} />
        </Link>
      </div>

      <div className="actions-container">
        <button className="menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="search-bar">
          <input type="text" placeholder="検索" />
          <button type="submit">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} size="lg" />
        </Link>
        <Link href="/cart">
          <FontAwesomeIcon icon={faShoppingCart} size="lg" />
        </Link>
      </div>

      {menuOpen && (
        <nav className="menu-list">
          <h2>Menu</h2>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/category">Category</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">SNS</Link></li>
          </ul>
        </nav>
      )}

      <style jsx>{`
        header {
          background-color: #ffffff;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 10;
        }

        .logo-container {
          margin-bottom: 15px;
        }

        .actions-container {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 15px;
        }

        .menu-button {
          background: none;
          border: none;
          padding: 0;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .search-bar {
          display: flex;
          border: 1px solid #ccc;
          border-radius: 5px;
          overflow: hidden;
        }

        .search-bar input[type="text"] {
          padding: 8px;
          border: none;
          flex-grow: 1;
          outline: none;
        }

        .search-bar button[type="submit"] {
          background-color: #ddd;
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 1rem;
        }

        .actions-container a {
          color: #333;
        }

        .menu-list {
          margin-top: 10px;
          background-color: #f8f8f8;
          padding: 20px;
          border-radius: 10px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .menu-list h2 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 1.2rem;
        }

        .menu-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .menu-list li a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.3s;
        }

        .menu-list li a:hover {
          color: #0070f3;
        }
      `}</style>
    </header>
  );
}
