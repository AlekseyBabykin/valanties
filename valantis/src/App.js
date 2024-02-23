import "./App.css";
import React, { useEffect, useState } from "react";
import iconsearch from "./icons/search-circle.svg";
import axios from "axios";
import md5 from "md5";

function App() {
  const [items, setItems] = useState([]);
  const [idMyData, setIdMyData] = useState([]);

  const password = "Valantis";
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const authString = md5(`${password}_${timestamp}`);

  const headers = {
    "X-Auth": authString,
  };

  const fetchDataId = async () => {
    try {
      const response = await axios.post(
        "http://api.valantis.store:40000/",
        {
          action: "get_ids",
          // params: { offset: 5, limit: 500 },
        },
        {
          headers: {
            "X-Auth": authString,
            "Content-Type": "application/json",
          },
        }
      );
      setIdMyData(response.data.result);

      fectData(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const fectData = async (MyIdData) => {
    try {
      const response = await axios.post(
        "http://api.valantis.store:40000/",
        {
          action: "get_items",
          params: { ids: MyIdData },
        },
        {
          headers: {
            "X-Auth": authString,
            "Content-Type": "application/json",
          },
        }
      );

      const uniqueItems = response.data.result.filter(
        (item, index, arr) =>
          arr.findIndex((obj) => obj.id === item.id) === index
      );
      setItems(uniqueItems);
      console.log(uniqueItems);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataId();
  }, []);

  return (
    <div className="App">
      <div className="mySearchContainer">
        <div className="mySearchContainerinside">
          <img className="icoSearch" src={iconsearch}></img>
          <input type="text" placeholder="поиск" />
        </div>
      </div>
      <table className="tablePanel">
        <thead>
          <tr className="firstLine">
            <th>Id</th>
            <th>Название</th>
            <th>Бранд</th>
            <th>Цена</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="line">{item.id}</td>
              <td className="line">{item.product}</td>
              <td className="line">{item.brand}</td>
              <td className="line">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
