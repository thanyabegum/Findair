import React from 'react';
import './Header.css';
import Logo from '../images/logo.svg'

function Header(props) { 
    return (
        <div className="header">
            <a href="./">
                <img id="logo" src={Logo} alt="Shield with airplane shape cutout."/>
            </a>
            <a href="./">
                <h1 id="title">{props.title}</h1>
            </a>
        </div>
    )
}

export default Header;