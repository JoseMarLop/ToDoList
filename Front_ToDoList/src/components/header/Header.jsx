import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CNavbarNav,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilMenu, cilUser } from "@coreui/icons";
import { useState, useEffect } from "react";

import spanish from "../../assets/spanish.png";
import english from "../../assets/english.png";

import { NavLink } from "react-router-dom";

import i18n from "../../i18n";
import { useTranslation } from "react-i18next";

import styles from "./Header.module.scss";

import { isAuthenticated, logout } from "../../data/auth";

const Header = () => {
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") === "es" ? spanish : english
  );

  const [isSidebarVisible, setSideBarVisible] = useState(false);
  const authenticated = isAuthenticated();

  const handleLanguageChange = (lang) => {
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang === "es" ? spanish : english);
  };

  const email = localStorage.getItem("email");

  return (
    <CHeader position="sticky" className="p-0 py-3 border-bottom shadow-sm">
      <CContainer className="px-4" fluid>
        <CHeaderToggler
          style={{ marginInlineStart: "-14px" }}
          className="d-md-none d-flex"
          onClick={() => setSideBarVisible(true)}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <HeaderSidebar
          visible={isSidebarVisible}
          setVisible={setSideBarVisible}
        />

        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              {t("header:dashboard")}
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CDropdown variant="nav-item" placement="bottom">
            <CDropdownToggle caret={false}>
              <CIcon icon={cilUser} size="lg" />
            </CDropdownToggle>
            <CDropdownMenu>
              {authenticated ? (
                <>
                  <CDropdownItem
                    as="button"
                    type="button"
                    onClick={() => logout()}
                  >
                    <CIcon icon={cilLockLocked} /> Log out
                  </CDropdownItem>
                  <CDropdownItem>
                    <CIcon icon={cilUser} /> {email}
                  </CDropdownItem>
                </>
              ) : (
                <>
                  <CDropdownItem as={NavLink} to="/register">
                    Register
                  </CDropdownItem>
                  <CDropdownItem as={NavLink} to="/login">
                    Login
                  </CDropdownItem>
                </>
              )}
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
        <CHeaderNav>
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
          {/*Dropdown for the languages*/}
          <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              <img src={selectedLanguage} width="30" height="20" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                className="d-flex justify-content-between"
                as="button"
                type="button"
                onClick={() => handleLanguageChange("es")}
              >
                <img src={spanish} width="30" height="20" />
                <article className="ms-2">{t("header:spanish")}</article>
              </CDropdownItem>
              <CDropdownItem
                className="d-flex justify-content-between"
                as="button"
                type="button"
                onClick={() => handleLanguageChange("en")}
              >
                <img src={english} width="30" height="20" />
                <article>{t("header:english")}</article>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          {/**************************/}
          <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li>
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid></CContainer>
    </CHeader>
  );
};

const HeaderSidebar = ({ visible, setVisible }) => {
  const { t } = useTranslation();

  return (
    <COffcanvas
      id="offcanvasNavbar"
      placement="start"
      portal={false}
      visible={visible}
      onHide={() => setVisible(false)}
      className={styles.sidebar_menu}
    >
      <COffcanvasHeader>
        <COffcanvasTitle>Menu</COffcanvasTitle>
        <CCloseButton
          className="text-reset"
          onClick={() => setVisible(false)}
        />
      </COffcanvasHeader>
      <COffcanvasBody>
        <CNavbarNav>
          <CNavItem>
            <CNavLink
              to="/dashboard"
              as={NavLink}
              onClick={() => setVisible(false)}
            >
              {t("header:dashboard")}
            </CNavLink>
          </CNavItem>
        </CNavbarNav>
      </COffcanvasBody>
    </COffcanvas>
  );
};

export default Header;
