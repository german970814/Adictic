import React from 'react';
import { store } from './Reducers';
import Navigation from '@Navigation';
import { Provider } from 'react-redux';

const App = () => <Provider store={store}>
  <Navigation />
</Provider>

export default App;
