import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Header from '../components/Header';

const InstructorTeaches = () => {
    
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === 'instructor') {
                axios.get('http://localhost:3001/api/instructor/courses', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => setCourses(response.data))
                .catch(error => console.error('Error fetching instructor courses:', error));
            }
        }
    }, []);

    return (
        <div className="p-4">
            
            <h2 className="text-2xl font-bold mb-4 text-center">Courses You Teach</h2>
            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-semibold">{course.name}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">You are not currently assigned to teach any courses.</p>
            )}
        </div>
    );
};

export default InstructorTeaches;
