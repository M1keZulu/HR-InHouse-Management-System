import React, { Fragment, useState, useEffect } from 'react';
import man from '../../assets/images/dashboard/profile.jpg'
import { FileText, LogIn, Mail, User, MessageSquare, Bell, Maximize, Search, ShoppingCart, Minus, Plus, X } from 'react-feather';
import { useNavigate } from 'react-router-dom'
import { firebase_app } from '../../data/config'
import { useAuth0 } from '@auth0/auth0-react'
import Bookmark from "../../layout/bookmark"
import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { English, Deutsch, Español, Français, Português, 简体中文, Notification, DeliveryProcessing, OrderComplete, TicketsGenerated, DeliveryComplete, CheckAllNotification, ViewAll, MessageBox, EricaHughes, KoriThomas, Admin, Account, Inbox, Taskboard, LogOut, AinChavez, CheckOut, ShopingBag, OrderTotal, GoToyourcart } from '../../constant'
import { InputGroup, InputGroupText } from 'reactstrap';
import { classes } from '../../data/layouts';

const Rightbar = () => {

  const history = useNavigate();
  const [profile, setProfile] = useState('');
  const [name, setName] = useState('')
  const [searchresponsive, setSearchresponsive] = useState(false)
  const [langdropdown, setLangdropdown] = useState(false)
  const [moonlight, setMoonlight] = useState(false)
  const [cartDropdown, setCartDropDown] = useState(false)
  const [notificationDropDown, setNotificationDropDown] = useState(false)
  const [chatDropDown, setChatDropDown] = useState(false)
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState('en');

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setSelected(lng);
  };


  const { logout } = useAuth0()
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"))

  useEffect(() => {
    setProfile(localStorage.getItem('profileURL') || man);
    setName(localStorage.getItem('Name'))
    if (localStorage.getItem("layout_version") === "dark-only") {
      setMoonlight(true)
    }
    i18n.changeLanguage('en');
  }, []);

  const Logout_From_Firebase = () => {
    localStorage.removeItem('profileURL')
    localStorage.removeItem('token');
    firebase_app.auth().signOut()
    window.location.href = `${process.env.PUBLIC_URL}/login`;
  }

  const Logout_From_Auth0 = () => {
    localStorage.removeItem("auth0_profile")
    localStorage.setItem("authenticated", false)
    window.location.href = `${process.env.PUBLIC_URL}/login`;
    logout()
  }
  const defaultLayoutObj = classes.find(item => Object.values(item).pop(1) === 'compact-wrapper');
  const layout = {home: "content-wrapper modern-type"} || Object.keys(defaultLayoutObj).pop();
  const RedirectToChats = () => {
    history(`${process.env.PUBLIC_URL}/app/users/userProfile/${layout}`)
  }
  const RedirectToChat = () => {
    history(`${process.env.PUBLIC_URL}/app/chat-app/${layout}`)
  }

  const UserMenuRedirect = (redirect) => {
    history(redirect)
  }

  //full screen function
  function goFull() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  const SeacrhResposive = (searchresponsive) => {
    if (searchresponsive) {
      setSearchresponsive(!searchresponsive)
      document.querySelector(".search-full").classList.add("open");
      document.querySelector(".more_lang").classList.remove("active");
    } else {
      setSearchresponsive(!searchresponsive)
      document.querySelector(".search-full").classList.remove("open");
    }
  }

  const LanguageSelection = (language) => {
    if (language) {
      setLangdropdown(!language)
    } else {
      setLangdropdown(!language)
    }
  }

  const MoonlightToggle = (light) => {
    if (light) {
      setMoonlight(!light)
      document.body.classList.add("light");
      document.body.classList.remove("dark-only");
      // document.body.className = "light"
      localStorage.setItem('layout_version', 'light');
    } else {
      setMoonlight(!light)
      document.body.classList.remove("light");
      document.body.classList.add("dark-only");
      // document.body.className = "dark-only"
      localStorage.setItem('layout_version', 'dark-only');
    }
  }

  return (
    <Fragment>
      <div className="nav-right col-8 pull-right right-header p-0">
        <ul className="nav-menus">
          <li>
            <div className="mode" onClick={() => MoonlightToggle(moonlight)} >
              {moonlight ? <i className="fa fa-lightbulb-o"></i> : <i className="fa fa-moon-o"></i>}
            </div>
            {/* <div className="mode" onClick={() => MoonlightToggle(moonlight)}><i className={`fa ${moonlight ? 'fa-lightbulb-o' : 'fa-moon-o'}`}></i></div> */}
          </li>
          <li className="maximize"><a className="text-dark" href="#javascript" onClick={goFull}><Maximize /></a></li>
          <li className="profile-nav onhover-dropdown p-0">
            <div className="media profile-media">
              <img className="b-r-10" src={"/"} alt="" />
              <div className="media-body"><span>{"Mike Zulu"}</span>
                <p className="mb-0 font-roboto">{Admin} <i className="middle fa fa-angle-down"></i></p>
              </div>
            </div>
            <ul className="profile-dropdown onhover-show-div">
              <li onClick={() => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/users/userProfile/${layout}`)}><User /><span>{Account} </span></li>
              <li onClick={() => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/email-app/${layout}`)}><Mail /><span>{Inbox}</span></li>
              <li onClick={() => UserMenuRedirect(`${process.env.PUBLIC_URL}/app/todo-app/todo/${layout}`)}><FileText /><span>{Taskboard}</span></li>
              <li onClick={authenticated ? Logout_From_Auth0 : Logout_From_Firebase}><LogIn /><span>{LogOut}</span></li>
            </ul>
          </li>
        </ul>
      </div>
    </Fragment>

  );
}
// export default translate(Rightbar);
export default Rightbar;