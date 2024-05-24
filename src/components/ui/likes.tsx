import React from "react";


export default function LikePage() {
    const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];
    const [likes, setLikes] = React.useState(0);


    function handleClick() {
        setLikes(likes + 1);
    }
   
    return (
      <div>
        <ul>
          {names.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
        <button onClick={handleClick}>Like({likes})</button>
      </div>
    );
  }