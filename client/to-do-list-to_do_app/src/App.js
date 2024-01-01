import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add new todo item to the database
  const addItem = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5500/api/item', { item: itemText });
      setListItems((prev) => [...prev, res.data]);
      setItemText('');
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Error adding item. Please try again.');
    }
  };

  // Create function to fetch all todo items from the database using useEffect hook
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:5500/api/items');
        setListItems(res.data);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Error fetching items. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    getItemsList();
  }, []);

  // Delete item when clicking on delete
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/api/item/${id}`);
      const newListItems = listItems.filter((item) => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Error deleting item. Please try again.');
    }
  };

  // Update item
  const updateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5500/api/item/${isUpdating}`, { item: updateItemText });
      const updatedItemIndex = listItems.findIndex((item) => item._id === isUpdating);
      listItems[updatedItemIndex].item = updateItemText;
      setUpdateItemText('');
      setIsUpdating('');
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Error updating item. Please try again.');
    }
  };

  // Before updating item, show input field where the updated item can be created
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => updateItem(e)}>
      <input
        className="update-new-input"
        type="text"
        placeholder="New Item"
        onChange={(e) => setUpdateItemText(e.target.value)}
        value={updateItemText}
      />
      <button className="update-new-btn" type="submit">
        Update
      </button>
    </form>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={(e) => addItem(e)}>
        <input
          type="text"
          placeholder="Add Todo Item"
          onChange={(e) => setItemText(e.target.value)}
          value={itemText}
        />
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {listItems.map((item) => (
          <div className="todo-item" key={item._id}>
            {isUpdating === item._id ? (
              renderUpdateForm()
            ) : (
              <>
                <p className="item-content">{item.item}</p>
                <button className="update-item" onClick={() => setIsUpdating(item._id)}>
                  Update
                </button>
                <button className="delete-item" onClick={() => deleteItem(item._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
