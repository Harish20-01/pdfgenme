import * as XLSX from 'xlsx';

export const parseStudentExcel = async (file, photoMap = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        // console.log('Raw rows:', rows.slice(0, 5)); // Debug first 5 rows

        const students = [];
        let currentStudent = null;
        let isAdditionalSection = false;
        let hasAmbersent=false,hasAsterik =false,hasXor=false;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];

          // Skip completely empty rows
          if (!row || row.length === 0 || row.every(cell => cell === '' || cell === null || cell === undefined)) {
            continue;
          }

          // Get first cell value and clean it
          const firstCell = row[0]?.toString().trim() || '';

          // Debug log for first few rows
          if (i < 10) {
            // console.log(`Row ${i}:`, firstCell);
          }

          // Check if this is a student header row (has roll number of atleast 8 didgit number.)
          if (firstCell && /^\d{8,}$/.test(firstCell)) {
            // Save previous student if exists
            if (currentStudent && currentStudent.subjects.length > 0) {
              students.push(currentStudent);
            }

            // Format dates properly
            const formatDate = (value) => {
              if (!value) return '';
              // If it's already a string (like "April-2025")
              if (typeof value === 'string') {
                return value;
              }
              // If it's Excel number (serial date)
              if (typeof value === 'number') {
                const excelEpoch = new Date(1899, 11, 30); // Excel base date
                const date = new Date(excelEpoch.getTime() + value * 86400000);

                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                return `${day}-${month}-${year}`;
              }
              return '';
            };

            const formatMonthYear = (value) => {
              if (!value) return '';

              if (typeof value === 'string') return value;

              if (typeof value === 'number') {
                const excelEpoch = new Date(1899, 11, 30);
                const date = new Date(excelEpoch.getTime() + value * 86400000);

                const month = date.toLocaleString('en-US', { month: 'short' });
                const year = date.getFullYear();

                return `${month}-${year}`;
              }
              return '';
            };

            // Start new student
            currentStudent = {
              rollNumber: firstCell,
              name: row[1]?.toString().trim() || '',
              regNo: row[2]?.toString().trim() || '',
              dob: formatDate(row[3]),
              gender: row[4]?.toString().trim() || '',
              publicationDate: formatMonthYear(row[5]),
              regulation: row[6]?.toString().trim() || '',
              program: row[7]?.toString().trim() || '',
              examMonth: formatMonthYear(row[8]),
              folio: row[9]?.toString().trim() || '',
              photo: photoMap[firstCell?.toString().trim().toLowerCase()] || '', // ✅ ADDED
              subjects: [],
              semesterSummary: {
                registered: ['19', '', '', '', '', '', '', ''],
                earned: ['19', '', '', '', '', '', '', ''],
                gradePoints: ['53', '', '', '', '', '', '', ''],
                gpa: ['7.37', '', '', '', '', '', '', ''],
                cumEarned: ['19', '', '', '', '', '', '', ''],
                cgpa: '7.37',
                marksPercent: '76.80'
              }
            };
            isAdditionalSection = false;
            hasAsterik =false;
            hasAmbersent =false;
            hasXor =false;
            // console.log('New student created:', currentStudent.name);
            //console.log("cheking date", row[5]?.toString().trim() || '')
          }
          // Check for ADDITIONAL marker row
          else if (currentStudent && firstCell.toUpperCase() === 'ADDITIONAL'||firstCell.toLowerCase().includes('additional')) {
            isAdditionalSection = true;
            if(firstCell.includes('*'))
            currentStudent.hasAsterik=true;
            else if(firstCell.includes('&'))
            currentStudent.hasAmbersent=true;
            else if(firstCell.includes('^'))
            currentStudent.hasXor=true;
            continue;
          }
          // Check if this is a subject row (has semester number in first column)
          else if (currentStudent && firstCell && !isNaN(Number(firstCell)) && row[1] && row[2]) {
            // Check if this is an additional course
            const isAdditional = isAdditionalSection ||
              (row[8] && row[8].toString().trim().toUpperCase() === 'ADDITIONAL') ||
              (row[9] && row[9].toString().trim().toUpperCase() === 'ADDITIONAL');

            // Extract grade note (if any and not 'ADDITIONAL')
            let gradeNote = '';
            if (row[8] && row[8].toString().trim() !== '' && row[8].toString().trim().toUpperCase() !== 'ADDITIONAL') {
              gradeNote = row[8].toString().trim();
            } else if (row[9] && row[9].toString().trim() !== '' && row[9].toString().trim().toUpperCase() !== 'ADDITIONAL') {
              gradeNote = row[9].toString().trim();
            }

            currentStudent.subjects.push({
              sem: firstCell,
              code: row[1]?.toString().trim() || '',
              title: row[2]?.toString().trim() || '',
              credits: row[3] !== '' ? parseFloat(row[3]).toFixed(1) : '',
              gradingSystem: row[4]?.toString().trim() || 'RG',
              gradePoint: row[5]?.toString().trim() || '',
              letterGrade: row[6]?.toString().trim() || '',
              result: row[7]?.toString().trim() || '',
              gradeNote: gradeNote,
              isAdditional: isAdditional,
            });
          }
          else if (currentStudent && firstCell) {

            const label = firstCell.toString().trim().toUpperCase();
            const values = row.slice(1, 9).map(v => v?.toString().trim() || '');

            if (!currentStudent.footer) {
              currentStudent.footer = {
                registered: [],
                earned: [],
                gradePoints: [],
                gpa: [],
                cumulative: []
              };
            }

            switch (label) {
              case 'REGISTERED':
                currentStudent.footer.registered = values;
                break;

              case 'EARNED':
                currentStudent.footer.earned = values;
                break;

              case 'GRADEPTS':
              case 'GRADEPOINTS':
                currentStudent.footer.gradePoints = values;
                break;

              case 'GPA':
                currentStudent.footer.gpa = row.slice(1, 9).map(v => v?parseFloat(v).toFixed(2):'');
                break;

              case 'CUMULATIVE':
              case 'CUM':
                currentStudent.footer.cumulative = values;
                break;

              default:
                break;
            }
          }
        }

        // Add the last student
        if (currentStudent && currentStudent.subjects.length > 0) {
          students.push(currentStudent);
        }

        /*  console.log('Final parsed students:', students.map(s => ({ 
           name: s.name, 
           rollNumber: s.rollNumber,
           totalSubjects: s.subjects.length,
           regularSubjects: s.subjects.filter(subj => !subj.isAdditional).length,
           additionalSubjects: s.subjects.filter(subj => subj.isAdditional).length
         }))); */

        if (students.length === 0) {
          // console.error('No students found! Check the data format.');
          // console.log('First few rows:', rows.slice(0, 10));
        }

        resolve(students);
      } catch (error) {
        console.error('Parser error:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};