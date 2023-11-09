import React from 'react';
import PropTypes from 'prop-types';

import './MainLayout.scss';

import ImsLogo from 'assets/icons/Lytics_logo.svg';
import MainMenu from './section/MainMenu/MainMenu';
import ClientProfileMenu from './section/ProfileMenu/ClientProfileMenu';

function MainLayout({ children }) {
  return (
    <section className="MainLayout">
      <header className="v3-header">
        <div className="menu-wrapper">
          <MainMenu />
        </div>
        <div className="logo-wrapper">
          <img src={ImsLogo} alt="logo" />
        </div>
        <div className="profile-menu-wrapper">
          <ClientProfileMenu />
        </div>
      </header>
      <div className="v3-main-content">{children}</div>
    </section>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;
