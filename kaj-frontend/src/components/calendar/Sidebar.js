import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function Sidebar({ socket, setIsMusicPlayerOpened }) {
  const [name, setNewCategoryName] = useState("");
  const [color, setNewCategoryColor] = useState("#ffffff");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  const handleToggleDropdown = () => {
    if (!isDropdownOpen) {
      fetchCategories();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const fetchCategories = () => {
    socket.emit("get-all-categories");
    socket.on("get-all-categories-response", (response) => {
      if (response.success) {
        setCategories(response.categories);
      } else {
        // Обработка ошибки
      }
    });
  };
  
  const handleAddCategory = (e) => {
    e.preventDefault();

    const data = {
      name,
      color
    }

    socket.emit("add-new-category", data);

    socket.on("add-new-category-response", (response) => {
      if (response.success) {
        fetchCategories();
      } else {
        alert("Failed");
      }
    })
  };

  return (
    <div className="left-section">
      <div className="menu">
        <ul>
          <li>
          <li><a href="#calendar" onClick={() => setIsMusicPlayerOpened(false)}>Calendar</a></li>
            <a href="#categories" onClick={handleToggleDropdown}>Your categories</a>
            {isDropdownOpen && (
              <>
              <div className="dropdown-sidebar">
                <input
                  type="text"
                  value={name}
                  onChange={e => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="dropdown-text"
                />
                <input
                  type="color"
                  value={color}
                  onChange={e => setNewCategoryColor(e.target.value)}
                />
                <button onClick={handleAddCategory}>Add Category</button>
              </div>
              <div>All categories</div>
              {categories.map((category, index) => (
                <li key={index} style={{ color: category.color }}>{category.name}</li>
              ))}
              </>
            )}
          </li>
          <li><a href="#item2">How to use application</a></li>
          <li><a href="#item3" onClick={() => navigate('/svg')}>Dashboard</a></li>
          <li><a href="#item4" onClick={() => setIsMusicPlayerOpened(true)}>Music player</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
