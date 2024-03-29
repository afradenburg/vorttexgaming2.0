"use client";
import { useEffect, useState } from "react";
import filter from "./utils/filter.js";
import order from "./utils/order.js";
import Card from "@/components/card/Card.jsx";
import MostPrice from "@/components/mostPrice/MostPrice.jsx";
import Offerts from "@/components/offerts/Offerts.jsx";
import Aside from "@/components/aside/Aside.jsx";
import Genders from "@/components/generos/Genders.jsx";
import SearchBar from "@/components/searchbar/Searchbar.jsx";
import search from "./utils/search";
import Paginado from "@/components/paginado/paginado";
import ParticlesWall from "@/components/wallpeaper.jsx/ParticlesWall";
import Cahatbot from "@/components/chatbot/cahatbot";
import { useStoreCart } from "@/zustand/store/index.js";
import axios from "axios";
import Loader from "@/components/loader/Loader.jsx";
import { VAR_AROUND } from "./varsprocess.js";
import Footer from "@/components/footer/footer.jsx";

const gamesPerPage = 8;

const HomePage = () => {
  const [data, setData] = useState([]);

  const initialGames = [data[0], data[2], data[9]];
  const [mostPriceGames, setMostPriceGames] = useState(initialGames);
  let dataToRender = data;

  const store = useStoreCart();

  let getGames;
  if (store) getGames = store.getGames;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_URL =
          process.env.NODE_ENV === "development"
            ? process.env.NEXT_PUBLIC_URL_REQUESTS_GAMES_LOCAL
            : process.env.NEXT_PUBLIC_URL_REQUESTS_GAMES_DEPLOY;
        const { data } = await axios(API_URL);
        setData(data);
        setMostPriceGames([data[0], data[2], data[9]]);
        getGames(data).then(() => {});
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const [filtrado, setFiltrado] = useState(false);
  const [filtrados, setFiltrados] = useState([]);
  const [ordenado, setOrdenado] = useState(false);
  const [ordenados, setOrdenados] = useState([]);
  const [find, setFind] = useState(false);
  const [finds, setFinds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const intervalId = setInterval(() => {
      let randomGameIndexes = [];
      while (randomGameIndexes.length < 3) {
        const randomIndex = Math.floor(Math.random() * 10);
        if (!randomGameIndexes.includes(randomIndex)) {
          randomGameIndexes.push(randomIndex);
        }
      }
      const randomGames = randomGameIndexes.map((index) => data[index]);

      setMostPriceGames(randomGames);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [data]);

  const arrTypesdata = data.map((game) => game.genre).flat();
  const uniqueArrTypesGames = arrTypesdata.filter((type, index, array) => {
    return array.indexOf(type) === index;
  });

  const handleFilter = (types) => {
    setFiltrados(filter(data, types));
    setOrdenado(false);
    setFind(false);
    setFiltrado(true);
    setCurrentPage(1);
  };

  const handleOrder = (op) => {
    setOrdenados(order(data, op, dataToRender));
    setFiltrado(false);
    setFind(false);
    setOrdenado(true);
    setCurrentPage(1);
  };

  const handleSearch = (letters) => {
    if (letters.length < 3) {
      setFinds(data);
      if (filtrados.length > 0) {
        setFinds(filtrados);
        return;
      }
      if (ordenados.length > 0) {
        setFinds(ordenados);
        return;
      }
      return;
    }
    setFinds(search(data, letters));
    setFiltrado(false);
    setOrdenado(false);
    setFind(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (filtrado) dataToRender = filtrados;
  if (ordenado) dataToRender = ordenados;
  if (find) dataToRender = finds;

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = dataToRender.slice(indexOfFirstGame, indexOfLastGame);

  const totalPages = Math.ceil(dataToRender.length / gamesPerPage);

  if (data.length > 0) {
    return (
      <div>
        <ParticlesWall />
        <MostPrice mostPrice={mostPriceGames} />
        <Offerts games={mostPriceGames} />
        <Genders types={uniqueArrTypesGames} />
        <SearchBar handleSearch={handleSearch} games={data} />
        <div className="cardsAndAside">
          <Card data={currentGames} />

          <Aside
            types={uniqueArrTypesGames}
            onChange={[handleFilter, handleOrder]}
          />
        </div>

        <Paginado
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
        <Cahatbot />
        <Footer />
      </div>
    );
  }
  return <Loader />;
};

export default HomePage;
