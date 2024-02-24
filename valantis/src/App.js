import "./App.css";
import React, { useEffect, useState } from "react";
import iconsearch from "./icons/search-circle.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIds,
  fetchItems,
  filterItems,
} from "./features/componentName/apiSlice";

function App() {
  const dispatch = useDispatch();
  const idMyData = useSelector((state) => state.api.idMyData);
  const items = useSelector((state) => state.api.items);
  const status = useSelector((state) => state.api.status);
  const error = useSelector((state) => state.api.error);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const [filterParams, setFilterParams] = useState({ type: "", value: "" });

  useEffect(() => {
    dispatch(fetchIds());
  }, [dispatch]);

  useEffect(() => {
    if (idMyData.length > 0) {
      dispatch(fetchItems(idMyData));
    }
  }, [idMyData, dispatch]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = /^\d+$/.test(value) ? parseInt(value, 10) : value;
    setFilterParams({ ...filterParams, [name]: parsedValue });
  };

  const handleFilterSubmit = async () => {
    if (filterParams.type && filterParams.value) {
      dispatch(filterItems({ [filterParams.type]: filterParams.value }));
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    console.error("Error occurred: ", error);
    return (
      <div>
        <div>Error: {error}</div>
        <button onClick={() => dispatch(fetchIds())}>Retry</button>
      </div>
    );
  }

  if (idMyData.length === 0) {
    return (
      <div>
        <div>По вашему запросу ничего не найдено </div>
        <button onClick={() => dispatch(fetchIds())}>Retry again</button>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="mySearchContainer">
        <div className="mySearchContainerinside">
          <img className="icoSearch" src={iconsearch} alt="Search Icon"></img>
          <select
            name="type"
            value={filterParams.type}
            onChange={handleFilterChange}
          >
            <option value="">Выберите критерий фильтрации</option>
            <option value="product">Название</option>
            <option value="price">Цена</option>
            <option value="brand">Бренд</option>
          </select>
          <input
            type="text"
            name="value"
            value={filterParams.value}
            onChange={handleFilterChange}
            placeholder="Введите значение"
          />
          <button onClick={handleFilterSubmit}>Применить фильтр</button>
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
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td className="line">{item.id}</td>
              <td className="line">{item.product}</td>
              <td className="line">{item.brand}</td>
              <td className="line">{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
