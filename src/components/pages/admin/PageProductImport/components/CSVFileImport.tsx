import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import mime from 'mime-types';

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
      try {

        const response = await axios({
          method: 'GET',
          url,
          params: {
            name: encodeURIComponent(file.name)
          },
        })

        console.log(
          '%cFile to upload:',
          'color: white; background-color: #017d39; padding: 4px 7px; font-style: italic; border-radius: 5px',
          file.name
        );

        console.log(
          '%cUploading to:',
          'color: white; background-color: #017d39; padding: 4px 7px; font-style: italic; border-radius: 5px',
          response.data
        );

        const contentType = mime.lookup(file.name);

        const result = await axios(response.data, {
          method: 'PUT',
          data: file,
          headers: {
            'Content-Type': contentType
          }
        })
        console.log('Result: ', result)
        setFile('');
      } catch (err) {
        console.log(
          '%cError:',
          'color: white; background-color: #d33f49; padding: 4px 7px; font-style: italic; border-radius: 5px',
          err.data?.message);
      }
    }
  ;

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
