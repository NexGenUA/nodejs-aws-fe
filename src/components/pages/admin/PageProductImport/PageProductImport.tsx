import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import API_PATHS from "constants/apiPaths";
import ProductsTable from "components/pages/admin/PageProductImport/components/ProductsTable";
import CSVFileImport from "components/pages/admin/PageProductImport/components/CSVFileImport";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import * as jwt from 'jsonwebtoken';

import styles from './PageProductImport.module.css';

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 3),
  },
}));

export default function PageProductImport() {
  const classes = useStyles();

  const query = new URLSearchParams(window.location.hash.replace(/(?:^#)/, '?'));

  const token = query.get('id_token');
  
  let localToken = localStorage.getItem('token');
  let message = 'Access denied, login first';
  localToken = token ? token : localToken;

  const resetToken = (errorMessage: string) => {
    message = `Access denied. ${errorMessage}`;
    localToken = null;
  };
  
  if (localToken) {
    localStorage.setItem('token', localToken);
    try {
      const isValidToken = Date.now() < (jwt.decode(localToken) as any).exp * 1000;
      if (!isValidToken) {
        resetToken('The token has expired');
      }
    } catch {
      resetToken('Token is invalid');
    }
  }

  if (!localToken) {
    return (
      <div className={styles.loginBlock}>
        <span className={styles.text}>{message}</span>
        <a href={API_PATHS.cognito} className={styles.link}>
          <Button size="small" color="primary" variant="contained">
            Login
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className={classes.content}>
      <Box display="flex" alignItems="center">
        <CSVFileImport url={`${API_PATHS.import}/import`} title="Import Products CSV"/>
        <Button size="small" color="primary" variant="contained" component={Link} to={'/admin/product-form/'}>
          create product
        </Button>
      </Box>
      <ProductsTable/>
    </div>
  );
}
