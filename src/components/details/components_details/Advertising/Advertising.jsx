import React from "react";
import "./Advertising.css";

const Advertising = ({ game }) => {
  return (
    <section className="ss">
      <div className="tituloCDJ">
        <h1 className="tituloDJ">{game.title}</h1>
      </div>

      <img className="imgD2" src={game.wallpaper} alt={game} />

      <p className="odetails">{game.description}</p>
      <div className="fffix">
        <h2 className="destaco">Genre: {game.genre}</h2>
        <h2 className="PlatformD">Store: {game.platform}</h2>
        <h2 className="SizeD">Size: {game.size}</h2>
      </div>
    </section>
  );
};

export default Advertising;
