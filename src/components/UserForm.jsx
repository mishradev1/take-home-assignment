import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    if (id && storedUsers) {
      const userToEdit = storedUsers.find(user => user.id === parseInt(id));
      if (userToEdit) {
        setFormData(userToEdit);
        setIsEditing(true);
      }
    }
  }, [id]);

  const validate = () => {
    let formErrors = {};
    
    // Validate name (only alphabetic characters, no digits or special characters)
    if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      formErrors.name = 'Name must contain only alphabetic characters.';
    }

    // Validate email format
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      formErrors.email = 'Please enter a valid email address.';
    }

    // Validate phone (digits only, 10-15 characters long)
    if (!/^\d{10,15}$/.test(formData.phone)) {
      formErrors.phone = 'Phone number must contain only digits and be 10-15 characters long.';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return; // Do not submit if there are validation errors

    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

    if (isEditing) {
      // Update existing user
      const updatedUsers = storedUsers.map(user =>
        user.id === parseInt(id) ? { ...user, ...formData } : user
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert('User updated successfully');
    } else {
      // Create new user
      const newUser = { ...formData, id: Date.now() };
      const updatedUsers = [...storedUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      alert('User created successfully');
    }

    navigate('/');
  };

  return (
    <div className='h-full flex justify-center'>
      <h1>{isEditing ? 'Edit User' : 'Add New User'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>
        
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>
        
        <div>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
          />
          {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
        </div>

        <button type="submit">{isEditing ? 'Update User' : 'Create User'}</button>
      </form>
    </div>
  );
};

export default UserForm;
