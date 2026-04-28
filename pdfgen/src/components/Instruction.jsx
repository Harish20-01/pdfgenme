import React from 'react';
import '../style/instruction.css';
import sample from '../../assets/SampleImage.png';

export default function InstructionScreen({ onContinue }) {
  return (
    <div className="container">
      <div className="wrapper">

        {/* Header */}
        <div className="header">
          <h1>Student Grade Statement Generator</h1>
          <p>Follow the instructions carefully before proceeding</p>
        </div>

        {/* Instructions */}
        <div className="card">
          <h2> Instructions</h2>

          <ul>
            <li><b>Step 1:</b> Upload the Photo Folder</li>
            <li>Photo name must exactly match the <b>Roll Number</b></li>

            <li>
              Example Folder Structure:
              <div className="folder-structure">
                <p>CSE (Folder_Name)</p>
                <p>└── 20252221001.jpg</p>
                <p>└── 20252221002.jpg</p>
                <p>└── 20262221003.jpg</p>
              </div>
            </li>

            <li><b>Step 2:</b> Upload the Excel File</li>

            <li>Each student must start with a <b>valid Roll Number (numeric only)</b></li>
            <li>Student details must be in a single row (first row of each student block)</li>
            <li>Subjects must immediately follow the student row</li>

            <li>Semester must be numeric (<b>1–8</b>)</li>

            <li>Use <b>ADDITIONAL</b> row to separate additional courses</li>

            <li>Grades like <b>Ex*</b>, <b>Gd*</b>, are auto-detected and shown in legend</li>

            <li>
              Footer must contain <b>5 rows</b> in this exact order:
              <ul>
                <li>Credits Registered</li>
                <li>Credits Earned</li>
                <li>Grade Points Earned</li>
                <li>GPA</li>
                <li>Cumulative</li>
              </ul>
            </li>

            <li>The first 4 row should have values across <b>4 columns (Sem 1–4)</b></li>

            <li>If a value is not available, leave it <b>empty</b></li>

            <li>
              In the <b>Cumulative row</b>:
              <ul>
                <li>First column → Total Credits Earned</li>
                <li>Fifth column → CGPA</li>
              </ul>
            </li>

            <li><b>Date Formats Supported:</b></li>
            <li>DOB → <b>DD-MM-YYYY</b> (e.g., 20-03-2005)</li>
            <li>Publication Date → <b>Month-YYYY</b> (e.g., April-2025)</li>
            <li>Exam Month → <b>Month-YYYY</b> (e.g., May-2025)</li>

            <li>Ensure Excel cells are formatted as <b>Text or Date</b> (avoid numeric date values like 45717)</li>
            <li>
              <b>⚠️ Performance Limits (Important):</b>
              <ul>
                <li>Maximum <b>200 students</b> per upload (recommended)</li>
                <li>Maximum <b>300 photos</b> per upload</li>
                <li>Each photo size should be <b>&lt; 300 KB</b> for smooth processing</li>
                <li>Large data may cause <b>slow performance or browser crash</b></li>
                <li>For bulk data, split into multiple uploads</li>
              </ul>
            </li>

            <li>
              ⚠️ <b>Important:</b> Do not change column order or structure — it will cause alignment issues in PDF
            </li>

            <li>
              <div className="sample-image">
                <h4>Sample Layout:</h4>
                <img src={sample} alt="Sample Excel Format" />
              </div>
            </li>

            <li><b>Step 3:</b> Preview and Generate PDF</li>
          </ul>
        </div>

        {/* Sample Excel Table */}
        <div className="card">
          <h2>📊 Sample Excel Format</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>RollNo</th>
                  <th>Name</th>
                  <th>RegNo</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>PubDate</th>
                  <th>Regulation</th>
                  <th>Program</th>
                  <th>ExamMonth</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>61772221001</td>
                  <td>Jenny</td>
                  <td>61772221001</td>
                  <td>2000-01-01</td>
                  <td>female</td>
                  <td>2024-05-01</td>
                  <td>2022</td>
                  <td>M.E</td>
                  <td>Apr-2024</td>
                </tr>

                <tr className="sub-row">
                  <td>1</td>
                  <td>22CS101</td>
                  <td>Programming in C</td>
                  <td>3</td>
                  <td>RG</td>
                  <td>8</td>
                  <td>A</td>
                  <td>PASS</td>
                  <td>Ex*</td>
                </tr>
                <tr className="sub-row">
                  <td>REGISTERED</td>
                  <td>22</td>
                  <td>21</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                </tr>
                <tr className="sub-row">
                  <td>Earned</td>
                  <td>22</td>
                  <td>21</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                </tr>
                <tr className="sub-row">
                  <td>GRADEPTS</td>
                  <td>12</td>
                  <td>10</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                </tr>
                <tr className="sub-row">
                  <td>GPA</td>
                  <td>5.5</td>
                  <td>6.6</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                </tr>
                <tr className="sub-row">
                  <td>CUMMULATIVE</td>
                  <td>43</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                  <td>7.9</td>
                  <td> </td>
                  <td> </td>
                  <td> </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Continue Button */}
        <div className="button-container">
          <button className="continue-btn" onClick={onContinue}>
            Continue →
          </button>
        </div>

      </div>
    </div>
  );
}