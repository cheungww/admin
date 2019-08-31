import React from 'react';
import ReactDOM from 'react-dom';

import App from './App.js';
import memoryUtils from './utils/memoryUtils';
import storageUtils from './utils/storageUtils';

// 取出local中保存的 user数据，并存储到 memoryUtils；
const user = storageUtils.getUser();
memoryUtils.user = user;

ReactDOM.render(<App />, document.getElementById('root'));
