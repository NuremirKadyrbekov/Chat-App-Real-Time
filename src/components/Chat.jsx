import React from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import icon from "../images/emoji.svg";
import styles from "../styles/Chat.module.css";
import Messages from "./Messages";

const socket = io.connect("https://chat-app-react-server-2-0.onrender.com");

const Chat = ({user,name}) => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: "", user: "" });
  const [state, setState] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);
  }, [search]);

  

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setState((_state) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", { params });
    navigate("/");
    
  };
  const Light = ()=>{
    // document.getElementById("Main").style.backgroundColor="red"
    document.getElementById("Main").classList.toggle("FFF")
    document.getElementById('Footer').classList.toggle('GGG')
    document.getElementById("WWW").classList.toggle("messagesTwo")
    document.querySelector('body').classList.toggle("body2")
    document.getElementById('UserSelect').classList.toggle("UsersSelectLight")
    document.getElementById("SunOrMoon").classList.toggle('SunOrMoon2')
    document.getElementById('Light').classList.toggle("SwitchDark")
  }

  const handleChange = ({ target: { value } }) => setMessage(value);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message) return;

    socket.emit("sendMessage", { message, params });

    setMessage(""); 
  };

  const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`);

  return (
    
    <div className={styles.wrap} id="wrap">
      <div className={styles.Wrap2}>

      <div className={styles.header} id="Main">
        <div className={styles.title}> <p className={styles.NameGroup}>Название группы:</p> <div><p className={styles.NameRoom}>{params.room}</p> </div> </div>
        <div className={styles.users}><p className={styles.UsersCheck}>пользователей:</p><p className={styles.HeaderUsersCheck}>{users}</p> </div>
        <div className={styles.ParSelect}>
              <div className={styles.UsersSelect} id="UserSelect" >

               Профиль: <p className={styles.ParamsName}>{params.name}</p>
                </div>   
        </div>
        <div>

           <button className={styles.SwitchLight} onClick={Light} id="Light">
                 <div className={styles.SunOrMoon} id="SunOrMoon"></div>  
          </button> 
            
        </div>
       {/* <div>
        <button className={styles.SwitchDark} onClick={dark} id="Dark">
                 Dark
          </button>
        </div> */}
        <button className={styles.left} onClick={leftRoom}>
          Выйти
        </button>
      </div>

      <div className={styles.messages} id="WWW">
        <Messages messages={state} name={params.name} />
      </div>

      <form className={styles.form} id="Footer"  onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="Ваше сообшение "
            value={message}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />

          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className={styles.button} >
          <input type="submit" onSubmit={handleSubmit} value="Отправить сообшение " />
        </div>
          
      </form>
    </div>
      </div>
  );
};

export default Chat;
