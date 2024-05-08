import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip', 'doc', 'docx', 'odt', 'ods', 'odp', 'docx'];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        setError(`File extension '.${fileExtension}' is not allowed.`);
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        setError('');
        const response = await axios.post('http://ecs-task-alb-1605833900.us-east-1.elb.amazonaws.com/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (response.status === 200) {
          alert('File uploaded successfully');
        } else {
          setError(`Error: ${response.data.error}`);
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(`Error: ${err.response.data.error}`);
        } else {
          setError('Unexpected error occurred while uploading the file');
        }
      }
    } else {
      setError('Please select a file');
    }
  };  

  return (
    <div>
      <h2>Upload File to S3</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;