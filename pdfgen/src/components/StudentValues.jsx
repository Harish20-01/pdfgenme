import React from 'react';
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Calibri',
  fonts: [
    {
      src: '/fonts/calibri-regular.ttf',
      fontWeight: 'normal'
    },
    {
      src: '/fonts/calibri-bold.ttf',
      fontWeight: 'bold'
    },
    {
      src: '/fonts/calibri-italic.ttf',
      fontStyle: 'italic'
    },
    {
      src: '/fonts/calibri-bold-italic.ttf',
      fontWeight: 'bold',
      fontStyle: 'italic'
    }
  ]
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    top: 0,
    fontFamily: 'Calibri',
    fontWeight: 'bold'
  },

  // ===== HEADER =====
  folio: {
    position: 'absolute',
    top: '3.0cm',
    left: '18.4cm',
    fontSize: 11,
    fontWeight: 'bold',
  },

  photoContainer: {
    position: 'absolute',
    top: '3.6cm',
    left: '18cm',
    width: '2.4cm',
    height: '3.0cm',
    borderWidth: 1,
  },

  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  nameValue: {
    position: 'absolute',
    top: '3.75cm',
    left: '4.3cm',
    fontSize: 11,
    /* fontWeight: 'bold', */
  },

  regNo: { position: 'absolute', top: '4.49cm', left: '4.3cm' },
  dob: { position: 'absolute', top: '4.49cm', left: '10cm' },
  gender: { position: 'absolute', top: '4.49cm', left: '15.3cm' },

  pubDate: { position: 'absolute', top: '5.38cm', left: '4.3cm' },
  regulation: { position: 'absolute', top: '5.38cm', left: '10cm' },
  examMonth: { position: 'absolute', top: '5.38cm', left: '15.3cm' },

  programValue: {
    position: 'absolute',
    top: '6.07cm',
    left: '4.3cm',
  },

  // ===== SUBJECT FLOW CONTAINER =====
  subjectContainer: {
    position: 'absolute',
    top: '7.8cm',
    left: '0.8cm',
    width: '19.4cm',
  },

  subjectRow: {
    flexDirection: 'row',
    height: '0.6cm',
    alignItems: 'center',
  },

  additionalHeading: {
    fontSize: 9,
    fontStyle: 'italic',
    marginTop: '0.3cm',
    marginBottom: '0.1cm',
    left: '4.5cm'
  },

  // columns
  colSem: {
    position: 'absolute',
    left: '0.25cm',     // 0.8cm + 0.1cm
    fontSize: 10,
    width: '0.88cm',   // 25pt ≈ 0.88cm
  },
  colCode: {
    position: 'absolute',
    left: '0.9cm',     // 0.8cm + 1.8cm (51pt = 1.8cm)
    fontSize: 10,
    width: '2.3cm',    // 60pt ≈ 2.1cm
    textAlign: 'center',
  },
  colTitle: {
    position: 'absolute',
    left: '3.55cm',     // 0.8cm + 4.2cm (119pt ≈ 4.2cm)
    fontSize: 10,
    width: '9.9cm',    // 280pt ≈ 9.9cm
  },
  colCredits: {
    position: 'absolute',
    left: '14.0cm',    // 0.8cm + 14.4cm (408.2pt = 14.4cm)
    fontSize: 10,
    width: '0.88cm',
    textAlign: 'center',
  },
  colGrading: {
    position: 'absolute',
    left: '15.1cm',    // 0.8cm + 15.4cm (436.6pt = 15.4cm)
    fontSize: 10,
    width: '0.88cm',
    textAlign: 'center',
  },
  colGradePoint: {
    position: 'absolute',
    left: '16.2cm',    // 0.8cm + 16.4cm (464.9pt = 16.4cm)
    fontSize: 10,
    width: '0.88cm',
    textAlign: 'center',
  },
  colLetter: {
    position: 'absolute',
    left: '17.2cm',    // 0.8cm + 17.4cm (493.3pt = 17.4cm)
    fontSize: 10,
    width: '0.88cm',
    textAlign: 'center',
  },
  colResult: {
    position: 'absolute',
    left: '18.3cm',    // 0.8cm + 18.4cm (521.6pt = 18.4cm)
    fontSize: 10,
    width: '1.06cm',   // 30pt ≈ 1.06cm
    textAlign: 'center',
  },

  // ===== FOOTER =====
  footerContainer: {
    position: 'absolute',
    top: '22.65cm',
    left: '4.25cm',
  },

  footerRow: {
    flexDirection: 'row',
    height: '0.76cm',
  },

  footerCell_CGPA: {
    width: '2cm',
    textAlign: 'center',
    fontSize: 10,
  },
  footerCell: {
    width: '4cm',
    textAlign: 'center',
    fontSize: 10,
  },
  cgpa: {
    left: '0.48cm'
  },
  specialLegend: {
    fontSize: 9,
    left: '4.3cm',
    marginTop: '0.5cm'
  },

  endStatement: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: '0.8cm',
  },
  symbolDescription: {
    fontSize: 8,
    left: '3.6cm',
    textAlign: 'left',
    marginTop: '0.5cm',
  }
});

const StudentValues = ({
  student,
  isLastPage,
  continuedPageLength,
  continuedPage,
  hasContinuedPage,
  allSubjects,
  legend
}) => {

  // ===== SUMMARY CALCULATION =====
  const registered = student.footer?.registered || Array(8).fill('');
  const earned = student.footer?.earned || Array(8).fill('');
  const gradePoints = student.footer?.gradePoints || Array(8).fill('');
  const gpa = student.footer?.gpa || Array(8).fill('');
  const cumEarned = student.footer?.cumulative || Array(8).fill('');


  // ===== SPLIT SUBJECTS =====
  const additionalStart = student.subjects.findIndex(s => s.isAdditional);

  const regular =
    additionalStart === -1
      ? student.subjects
      : student.subjects.slice(0, additionalStart);

  const additional =
    additionalStart === -1
      ? []
      : student.subjects.slice(additionalStart);

  // ===== FOOTER RENDER =====
  const renderRow = (arr, isCgpa = false) =>
    arr.map((v, i) => (
      <Text key={i} style={isCgpa ? styles.footerCell_CGPA : styles.footerCell}>
        {v || ' '}
      </Text>
    ));

  return (
    <View style={styles.container}>

      <Text style={styles.folio}>{student.folio}</Text>

      <View style={styles.photoContainer}>
        {student.photo && <Image src={student.photo} style={styles.photo} />}
      </View>

      <Text style={styles.nameValue}>{student.name}</Text>

      <Text style={styles.regNo}>{student.regNo}</Text>
      <Text style={styles.dob}>{student.dob}</Text>
      <Text style={styles.gender}>{student.gender}</Text>

      <Text style={styles.pubDate}>{student.publicationDate}</Text>
      <Text style={styles.regulation}>{student.regulation}</Text>
      <Text style={styles.examMonth}>{student.examMonth}</Text>

      <Text style={styles.programValue}>{student.program}</Text>

      {/* ===== SUBJECT FLOW ===== */}
      <View style={styles.subjectContainer}>

        {/* REGULAR */}
        {regular.map((s, i) => (
          <View
            key={i}
            style={[
              styles.subjectRow,
              { height: s.title.length > 60 ? '1.1cm' : '0.6cm' }
            ]}
          >
            <Text style={styles.colSem}>{s.sem}</Text>
            <Text style={styles.colCode}>{s.code}</Text>
            <Text style={styles.colTitle} wrap={false}>{s.title}</Text>
            <Text style={styles.colGrading}>{s.gradingSystem}</Text>
            <Text style={styles.colCredits}>{s.credits}</Text>
            <Text style={styles.colGradePoint}>{s.gradePoint}</Text>
            <Text style={styles.colLetter}>{s.letterGrade}</Text>
            <Text style={styles.colResult}>{s.result}</Text>
          </View>
        ))}

        {/* ADDITIONAL */}
        {additional.length > 0 && (
          <>
            <Text style={styles.additionalHeading}>
              ADDITIONAL COURSES
            </Text>

            {additional.map((s, i) => (
              <View
                key={i}
                style={[
                  styles.subjectRow,
                  { height: s.title.length > 60 ? '1.1cm' : '0.6cm' }
                ]}
              >
                <Text style={styles.colSem}>{s.sem}</Text>
                <Text style={styles.colCode}>{s.code}</Text>
                <Text style={styles.colTitle}>{s.title}</Text>
                <Text style={styles.colCredits}>{s.credits}</Text>
                <Text style={styles.colGrading}>{s.gradingSystem}</Text>
                <Text style={styles.colGradePoint}>{s.gradePoint}</Text>
                <Text style={styles.colLetter}>{s.letterGrade}</Text>
                <Text style={styles.colResult}>{s.result}</Text>
              </View>
            ))}
          </>
        )}

        {/* CONTINUED */}
        {!isLastPage && (
          <Text style={styles.endStatement}>
            {`**Continued Sheet ${continuedPage}/${continuedPageLength}`}
          </Text>
        )}

        {/* LEGEND */}
        {isLastPage && legend && (
          <Text style={styles.specialLegend}>{legend}</Text>
        )}

        {isLastPage && (
          <Text style={styles.symbolDescription}>
            {`* - Considered for CGPA Calculation in the 8th Semester as per Regulations.\n
                & - Courses considered instead of the Professional / Open Elective Courses as per curriculum\n
                ^ - Courses not considered for CGPA Calculation`
            }
          </Text>
        )
        }

        {/* END */}
        {isLastPage && (
          <Text style={styles.endStatement}>
            {`*** End of Statement *** \n`}
            {hasContinuedPage ? `**Continuation Sheet..${continuedPage}/${continuedPageLength}` : ''}
          </Text>
        )}
      </View>

      {/* ===== FOOTER ===== */}
      {isLastPage && (
        <View style={styles.footerContainer}>
          <View style={styles.footerRow}>{renderRow(registered)}</View>
          <View style={styles.footerRow}>{renderRow(earned)}</View>
          <View style={styles.footerRow}>{renderRow(gradePoints)}</View>
          <View style={styles.footerRow}>{renderRow(gpa)}</View>
          <View style={styles.footerRow}>{renderRow(cumEarned, true)}</View>
          <View style={[styles.cgpa]}><Text>{cumEarned[4] * 10}</Text></View>
        </View>
      )}
    </View>
  );
};

export default StudentValues;