// pages/Home.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import { FaRegComment, FaRegHeart, FaRegPaperPlane } from "react-icons/fa";

import '../styles/home.css'
import Navbar from "../components/navbar";
import Logo from "../assets/images/hiveLogo.png"
import tournoi1 from "../assets/images/tournoi1.png";
import tournoi2 from "../assets/images/tournoi2.png";
import tournoi3 from "../assets/images/tournoi3.png";

function Home() {

  const navigation = useNavigate();

  const Tournaments = [
    {
      id: 1,
      title: "tournament 1",
      alt: "First tournament",
      src: tournoi1,
    },
    {
      id: 2,
      title: "tournament 2",
      alt: "Second tournament",
      src: tournoi2,
    },
    {
      id: 3,
      title: "tournament 3",
      alt: "Third tournament",
      src: tournoi3,
    },
  ];
  
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  
  return (
    <div className="basic-container">
      <div className="top-page-home">
        <Navbar/>
      </div>
      <div className="middle-page-home">
        <div className="middle-left-home">
          <div className="publication">
            <div className="top-publication">
              <img alt="logo" src={Logo} style={{width: "50px", height: "50px", borderRadius: "50%"}}></img>
              <h2>Name</h2>
            </div>
            <div className="middle-publication">
              <img alt="publication" src={Logo}></img>
            </div>
            <div className="bottom-publication">
              <div className="publication-react">
                <FaRegHeart className="icon heart"/>
                <FaRegComment className="icon comment"/>
                <FaRegPaperPlane className="icon send"/>
              </div>
              <div className="description-publication">
                <h4>Description</h4>
              </div>
            </div>
          </div>
        </div>
        <div className="middle-right-home">
          <div className="carousel-container">
            <Slider {...settings}>
              {Tournaments.map((item) => (
                <div key={item.id}>
                  <div className="img-body">
                    <img src={item.src} alt={item.alt} />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
          <div className="create-tournament">
            <button className="submit-50">Create a tournament</button>
          </div>
        </div>
      </div>
      <div className="bottom-page-home"></div>
    </div>
  );
}

export default Home;