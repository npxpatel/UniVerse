import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; 

const MarksList = () => {
    const [marks, setMarks] = useState([]);
    const [studentId, setStudentId] = useState(null); 

    useEffect(() => {
 
        const token = localStorage.getItem('token');
        
        if (token) {

            const decodedToken = jwtDecode(token);
            const studentId = decodedToken.id; 

            setStudentId(studentId); 

            
            axios.get(`/api/marks/${studentId}`) 
            .then(response => setMarks(response.data))
            .catch(error => console.error('Error fetching marks', error));
        }
    }, []);

    return (
        <div>
            <h1>Your Marks</h1>
            <ul>
                {marks.map((mark, index) => (
                    <li key={index}>
                        {mark.course_name}: {mark.marks}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MarksList;
