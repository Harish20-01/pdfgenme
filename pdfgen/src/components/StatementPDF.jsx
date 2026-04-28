import React from 'react';
import { Document, Page, StyleSheet, Image, View } from '@react-pdf/renderer';
import StudentValues from './StudentValues';
import template from '../../assets/temp3.jpg'

const StatementPDF = ({ students }) => {
  const processStudent = (student) => {
    /*  // Make sure subjects is an array
     const subjects = Array.isArray(student.subjects) ? student.subjects : [];
     const chunks = [];
 
     // Log for debugging
     console.log(`Processing student ${student.name} with ${subjects.length} subjects`);
 
     // Split into chunks of 12
     for (let i = 0; i < subjects.length; i += 12) {
       chunks.push(subjects.slice(i, i + 12));
     }
 
     // If no subjects, still need one page with empty array
     if (chunks.length === 0) {
       chunks.push([]);
     } */

    const subjects = Array.isArray(student.subjects) ? student.subjects : [];

    // STEP 1: Separate
    const regular = subjects.filter(s => !s.isAdditional);
    const additional = subjects.filter(s => s.isAdditional);

    // STEP 2: Fill pages properly
    const chunks = [];
    let currentPage = [];

    // Fill regular subjects first
    for (let i = 0; i < regular.length; i++) {
      currentPage.push(regular[i]);

      if (currentPage.length === 12) {
        chunks.push(currentPage);
        currentPage = [];
      }
    }

    // Then fill additional courses
    for (let i = 0; i < additional.length; i++) {
      currentPage.push(additional[i]);

      if (currentPage.length === 12) {
        chunks.push(currentPage);
        currentPage = [];
      }
    }

    // Push remaining
    if (currentPage.length > 0) {
      chunks.push(currentPage);
    }

    // Ensure at least one page
    if (chunks.length === 0) {
      chunks.push([]);
    }

    // console.log(`Created ${chunks.length} pages`);

    // Create a page for each chunk
    return chunks.map((chunk, index) => {
      const pageData = {
        ...student,
        subjects: chunk,
        allSubjects:student.subjects,
        pageIndex: index,
        totalPages: chunks.length,
        isLastPage: index === chunks.length - 1,
        isFirstPage: index === 0,
        // Include all other student data
        rollNumber: student.rollNumber,
        name: student.name,
        regNo: student.regNo,
        dob: student.dob,
        gender: student.gender,
        publicationDate: student.publicationDate,
        regulation: student.regulation,
        examMonth: student.examMonth,
        program: student.program,
        folio: student.folio,
        semesterSummary: student.semesterSummary || {
          registered: ['19', '', '', '', '', '', '', ''],
          earned: ['19', '', '', '', '', '', '', ''],
          gradePoints: ['53', '', '', '', '', '', '', ''],
          gpa: ['7.37', '', '', '', '', '', '', ''],
          cumEarned: ['19', '', '', '', '', '', '', ''],
          cgpa: '7.37',
          marksPercent: '76.80%'
        }
      };

      return pageData;
    });
  };

  // Flatten all pages for all students
  const allPages = [];
  students.forEach(student => {
    const studentPages = processStudent(student);
    allPages.push(...studentPages);
  });
  const hasContinuedPage = allPages.length>1; 
  const styles = StyleSheet.create({
    page: {
      padding: 0,
      fontFamily: 'Times-Roman',
      fontSize: 10,
      position: 'relative',
    },

    template: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },

    content: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    }

  });
  // console.log(`Total pages to render: ${allPages.length}`);

  return (
    <Document>
      {allPages.map((pageData, index) => (
        <Page key={`${pageData.regNo}-${pageData.pageIndex}`} size="A4" style={styles.page}>
          {/* <Image
            src={template}
            style={styles.template}
            fixed />  */}
          <View style={styles.content}>
            <StudentValues
              student={pageData}
              isLastPage={pageData.isLastPage}
              continuedPageLength={pageData.totalPages}
              continuedPage={pageData.pageIndex+1}
              hasContinuedPage={hasContinuedPage}
              allSubjects={pageData.allSubjects}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default StatementPDF;