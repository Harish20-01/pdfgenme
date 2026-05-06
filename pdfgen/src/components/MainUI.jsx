import React, { useState, useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import StatementPDF from './StatementPDF';
import { parseStudentExcel } from '../utils/excelParser';

// 🔹 Custom hook for PDF preview
const usePDFPreview = (document, deps) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let currentUrl;

    const generatePDF = async () => {
      if (!document) return;

      try {
        const blob = await pdf(document).toBlob();
        currentUrl = URL.createObjectURL(blob);
        setUrl(currentUrl);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    };

    generatePDF();

    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, deps);

  return url;
};

export default function App( {setShowMain}) {
  const [students, setStudents] = useState(null);
  const [photoMap, setPhotoMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 📸 Handle folder upload
  const handleFolderUpload = (e) => {
    const files = Array.from(e.target.files);
    const map = {};

    files.forEach(file => {
      const roll = file.name.split('.')[0].trim().toLowerCase();
      map[roll] = URL.createObjectURL(file);
    });

    setPhotoMap(map);
    console.log("Photo map created:", map);
  };

  // 📄 Handle Excel upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const parsedStudents = await parseStudentExcel(file, photoMap);
      setStudents(parsedStudents);
      console.log('Parsed students:', parsedStudents);
    } catch (err) {
      setError('Error parsing file: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📄 PDF preview
  const pdfUrl = usePDFPreview(
    students ? <StatementPDF students={students} /> : null,
    [students]
  );

  return (
    <div>
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* 🔹 Sidebar */}
      <div style={{ 
        width: '300px', 
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #ddd',
        overflowY: 'auto'
      }}>
        <button onClick={()=>setShowMain(false)} style={{background:'blue',color:'white'}}>Back to Instruction</button>
        <h2 style={{ marginTop: 0 }}>Student Grade Statement Generator</h2>

        {/* 📸 Upload Photo Folder */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Upload Photo Folder:
          </label>
          <input
            type="file"
            webkitdirectory="true"
            multiple
            onChange={handleFolderUpload}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Folder must contain images named like <b>61772221001.jpg</b>
          </div>
        </div>

        {/* 📄 Upload Excel */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Upload Excel File:
          </label>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            onChange={handleFileUpload}
            disabled={Object.keys(photoMap).length === 0}
          />
          {Object.keys(photoMap).length === 0 && (
            <div style={{ fontSize: '12px', color: '#c62828', marginTop: '5px' }}>
              ⚠ Upload photo folder first
            </div>
          )}
        </div>

        {/* 🔄 Loading */}
        {loading && (
          <div style={{ padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
            Loading...
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            color: '#c62828',
            borderRadius: '4px',
            border: '1px solid #ef9a9a'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* ✅ Success */}
        {students && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#e8f5e8',
            borderRadius: '4px',
            border: '1px solid #a5d6a7'
          }}>
            <strong>✅ File loaded successfully!</strong>

            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <div>📊 Total Students: <strong>{students.length}</strong></div>
              <div>📸 Photos Loaded: <strong>{Object.keys(photoMap).length}</strong></div>

              <div style={{ marginTop: '8px', maxHeight: '300px', overflowY: 'auto' }}>
                {students.map((student, index) => (
                  <div key={index} style={{ 
                    padding: '8px', 
                    marginBottom: '5px', 
                    backgroundColor: '#f9f9f9',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '12px'
                  }}>
                    <div>
                      <strong>#{student.rollNumber}</strong> - {student.name}
                    </div>
                    <div style={{ color: '#666' }}>
                      Subjects: {student.subjects.length}
                    </div>
                    <div style={{ color: student.photo ? 'green' : 'red' }}>
                      {student.photo ? '✅ Photo linked' : '❌ No photo'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔹 PDF Preview */}
      <div style={{ 
        flex: 1, 
        backgroundColor: '#fafafa', 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        {pdfUrl ? (
          <iframe 
            src={pdfUrl} 
            style={{ 
              width: '70vw', 
              height: '100%', 
              border: 'none',
              backgroundColor: 'white'
            }}
            title="PDF Preview"
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: '#999',
            fontSize: '16px'
          }}>
            {loading 
              ? '🔄 Generating PDF...' 
              : '📁 Upload photo folder and Excel to preview'}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}

