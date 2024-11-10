// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import Header from '../components/Header';

// const CoursesList = () => {
 
//     const [courses, setCourses] = useState([]);
//     const [role, setRole] = useState(null);
//     const [instructorId, setInstructorId] = useState(null);
    

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//          if (token) {
//             const decodedToken = jwtDecode(token);
//           setRole(decodedToken.role);
//           setInstructorId(decodedToken.id);
//           console.log(decodedToken.role);
//          }

//         axios.get('http://localhost:3001/api/courses')
//             .then(response => setCourses(response.data))
//             .catch(error => console.error('Error fetching courses', error));
//     }, []);

//     const enroll = (courseId) => {
//         const token = localStorage.getItem('token'); 
        
//         // Enroll the student in a course
//         console.log(role + "haiiiiii");
//         if(role === 'student'){
//         axios.post('http://localhost:3001/api/enroll', { course_id: courseId }, {
//             headers: {
//                 Authorization: `Bearer ${token}` // Send token for authentication
//             }
//         })
//         .then(() => { alert('Enrolled successfully');
//              window.location.reload(); }) 
//         .catch(error => alert('Already done!'));
//         }
//         else{
//             axios.put(`http://localhost:3001/api/courses/${courseId}/assign`, { instructor_id: instructorId }, {
//                 headers: {
//                     Authorization: `Bearer ${token}` // Send token for authentication
//                 }
//             })
//             .then(() => {
//                 alert('Assigned to teach this course');
//                 window.location.reload(); 
//             })
//             .catch(error => alert('Error assigning instructor to the course'));
//         }

//     };

//     return (

//         <>
       
//         <div className="p-4">
          
//             <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {courses.map(course => (
//                     <div key={course.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
//                         <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
//                         <button 
//                             className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
//                             onClick={() => enroll(course.id)}
//                         >
//                         { role == 'student' ? 'Enroll' : 'Teach it' }
                        
//                         </button>

//                         {role === 'instructor' ?  
//                          <button 
//                          className="bg-blue-500 text-white py-2 px-4 ml-6 rounded hover:bg-blue-600 transition-colors duration-300"
//                          onClick={() => show(course.id)}> 
                        
//                           View Enrolled Students
//                         </button>
                        
//                         : ''}


//                     </div>
//                 ))}
//             </div>
//         </div>

//         </>
//     );
// };

// export default CoursesList;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Header from '../components/Header';

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [role, setRole] = useState(null);
    const [instructorId, setInstructorId] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setRole(decodedToken.role);
            setInstructorId(decodedToken.id);
        }

        axios.get('http://localhost:3001/api/courses')
            .then(response => setCourses(response.data))
            .catch(error => console.error('Error fetching courses', error));
    }, []);

    const enroll = (courseId) => {
        const token = localStorage.getItem('token');
        if (role === 'student') {
            axios.post('http://localhost:3001/api/enroll', { course_id: courseId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                alert('Enrolled successfully');
                window.location.reload();
            })
            .catch(error => alert('Already enrolled!'));
        } else {
            axios.put(`http://localhost:3001/api/courses/${courseId}/assign`, { instructor_id: instructorId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                alert('Assigned to teach this course');
                window.location.reload();
            })
            .catch(error => alert('Error assigning instructor to the course'));
        }
    };

    const show = (courseId) => {
        axios.get(`http://localhost:3001/api/courses/${courseId}/students`)
            .then(response => {
                setEnrolledStudents(response.data);
                setIsModalOpen(true); 
            })
            .catch(error => console.error('Error fetching enrolled students', error));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEnrolledStudents([]);
    };

    return (
        <>
            
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {courses.map(course => (
                        <div key={course.id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300"
                                onClick={() => enroll(course.id)}
                            >
                                {role === 'student' ? 'Enroll' : 'Teach it'}
                            </button>
                            {role === 'instructor' && (
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 ml-6 rounded hover:bg-blue-600 transition-colors duration-300"
                                    onClick={() => show(course.id)}
                                >
                                    View Enrolled Students
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
                        <h3 className="text-xl font-semibold mb-4">Enrolled Students</h3>
                        <ul className="mb-4">
                            {enrolledStudents.length > 0 ? (
                                enrolledStudents.map(student => (
                                    <li key={student.id} className="p-2 border-b border-gray-200">
                                        {student.email}
                                    </li>
                                ))
                            ) : (
                                <p>No students enrolled in this course.</p>
                            )}
                        </ul>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CoursesList;
