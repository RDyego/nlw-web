import React from 'react';

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import './styles.css';

function TeacherItem() {
    return (
        <article className="teacher-item">
            <header>
                <img src="https://avatars2.githubusercontent.com/u/6733336?s=460&u=ce96e496682bcb26f88bc15f4c3805fc266cb111&v=4" alt="Raphaell Dyego" />
                <div>
                    <strong>Raphaell Dyego</strong>
                    <span>Química</span>
                </div>
            </header>
            <p>
                asdjasdh ashda husdhuas asdas dasd asd
            <br />
            asdjasdh ashda husdhuas asdas dasd asdasdjasdh ashda husdhuas asdas dasd asdasdjasdh ashda husdhuas asdas dasd asdasdjasdh ashda husdhuas asdas dasd asd
        </p>
            <footer>
                <p>
                    Preço/hora
                <strong>R$ 80,00</strong>
                </p>
                <button type="button">
                    <img src={whatsappIcon} alt="Whatsapp" />
                Entrar em contato
            </button>
            </footer>
        </article>
    )
}

export default TeacherItem;