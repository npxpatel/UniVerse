import React from 'react'
import CoursesList from './CourseList'
import MarksList from './MarksList'
import EnrolledCourses from './EnrolledCourses'
import Header from '../components/Header';


const Student = () => {
 
  return (
      <div>
         <Header/>
        <h1 className="mt-3 text-xl md:text-2xl font-bold mb-4 text-center">Student - Section</h1>
          <CoursesList />
          {/* <MarksList /> */}
          <EnrolledCourses />
      </div>
  );
};

export default Student