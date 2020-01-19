import React from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history'
import { ThemeProvider } from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core/styles';
import client from '../graphql/apollo-client';
import scTheme from '../theme/sc';
import muiTheme from '../theme/mui';
import GlobalDataProvider from '../global-data-provider';

const history = createBrowserHistory();

const App = ({ component: Component }) => (
  <ThemeProvider theme={scTheme}>
    <Router history={history}>
      <ApolloProvider client={client}>
        <MuiThemeProvider theme={muiTheme}>
          <GlobalDataProvider>
            <Component />
          </GlobalDataProvider>
        </MuiThemeProvider>
      </ApolloProvider>
    </Router>
  </ThemeProvider>
);

App.propTypes = {
  component: PropTypes.func.isRequired,
};

export default App;
