import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUsers } from '../services/api';

const UserDetail = () => {
  const { id } = useParams(); // Get the user ID from the route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const users = await getUsers(); // Fetch all users (since JSONPlaceholder doesn't have an individual user API)
        const foundUser = users.find(user => user.id === parseInt(id)); // Find the user by ID
        if (foundUser) {
          setUser(foundUser);
        } else {
          setError('User not found');
        }
      } catch (error) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <p> Loading... (Skeleton Screen)</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User Details</h1>
      {user && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Website:</strong> {user.website}</p>
          <p><strong>Company:</strong> {user.company.name}</p>
          <p><strong>Address:</strong> {`${user.address.suite}, ${user.address.street}, ${user.address.city}`}</p>
        </div>
      )}
    </div>
  );
};

export default UserDetail;
