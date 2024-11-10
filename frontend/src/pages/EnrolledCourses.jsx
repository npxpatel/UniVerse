import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Header from '../components/Header';

const EnrolledCourses = () => {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      axios.get('http://localhost:3001/api/enrolled-courses', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      })
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching enrolled courses', error));
    }
  }, []);

  return (
    <div className="text-center">
      
    <h2 className="text-lg font-semibold mb-4 mt-5">Your Enrolled Courses</h2>
    <ul className="flex flex-wrap justify-center">
      {courses.map(course => (
        <li key={course.id} className="border p-4 mb-2 rounded shadow-md w-64 mx-2">
          {course.name}
        </li>
      ))}
    </ul>
  </div>
);
};

export default EnrolledCourses;