import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './assets/Sidebar.css'

// Component for the Sidebar
function Sidebar({ socket, setIsMusicPlayerOpened }) {
  // Using state hooks to manage component state
  const [name, setNewCategoryName] = useState(""); // State for the name of the new category
  const [color, setNewCategoryColor] = useState("#ffffff"); // State for the color of the new category
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for toggling the dropdown

  const [categories, setCategories] = useState([]); // State to store the list of categories

  const navigate = useNavigate(); // Hook for navigating within the application

  // Handler for toggling the dropdown
  const handleToggleDropdown = () => {
    if (!isDropdownOpen) {
      fetchCategories();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to fetch the list of categories from the server
  const fetchCategories = () => {
    socket.emit("get-all-categories"); // Sending a request to get categories through the socket
    socket.on("get-all-categories-response", (response) => {
      if (response.success) {
        setCategories(response.categories); // Setting the received categories into state
      } else {
        alert("Error categories getting");
      }
    });
  };
  
  // Handler for adding a new category
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

  // Rendering the Sidebar component
  return (
    <aside className="left-section">
      <nav className="menu">
        <ul>
          <li><a href="#calendar" onClick={() => setIsMusicPlayerOpened(false)}>Calendar</a></li>
          <li><a href="#categories" onClick={handleToggleDropdown}>Your categories</a></li>
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
          <li><a href="#svg" onClick={() => navigate('/svg')}>Notes</a></li>
          <li><a href="#music" onClick={() => setIsMusicPlayerOpened(true)}>Music player</a></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;