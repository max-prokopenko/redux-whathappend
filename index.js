const differ = require('deep-diff'); 
const logReport = [];

export function render(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
    case 'E':
      return [path.join('.'), lhs, '→', rhs];
    case 'N':
      return [path.join('.'), rhs];
    case 'D':
      return [path.join('.')];
    case 'A':
      return [`${path.join('.')}[${index}]`, item];
    default:
      return [];
  }
}

const dictionary = {
  E: {
    color: '#2196F3',
    text: 'CHANGED:',
  },
  N: {
    color: '#4CAF50',
    text: 'ADDED:',
  },
  D: {
    color: '#F44336',
    text: 'DELETED:',
  },
  A: {
    color: '#2196F3',
    text: 'ARRAY:',
  },
};

export function style(kind) {
  return `color: ${dictionary[kind].color}; font-weight: bold`;
}

const whatHappendMiddleware = store => next => (action) => {
  if((!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
    if (action.type === 'WHAT_HAPPEND_REPORT') {
        const data = new Blob([JSON.stringify(logReport)], { type: 'application/json' });
        const csvURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', 'report.json');
        tempLink.click();
    }
    const happends = {};
    const prev_state = store.getState();
    happends.action = action;
    next(action);
    const next_state = store.getState();
    const diff = differ(prev_state, next_state);
    if (diff) {
      diff.forEach((elem) => {
        const { kind } = elem;
        const output = render(elem);
        console.log(output);
        let change = "";
        for(let i = 1; i < output.length; i++) {
          change = change + JSON.stringify(output[i]);
        }
        if(kind == 'A') {
          change = JSON.stringify(output[1].rhs);
        }
        happends.diff = {
          type: dictionary[kind].text,
          changed: output[0],
          change: change
        }
        console.log(happends.diff);
      });
    } else {
      
    }
    logReport.push(happends);
  }
};

export default whatHappendMiddleware;
