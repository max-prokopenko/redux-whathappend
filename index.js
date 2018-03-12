const logReport = [];
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
    happends.prev_state = store.getState();
    happends.action = action;
    next(action);
    happends.next_state = store.getState();
    logReport.push(happends);
  }
};

export default whatHappendMiddleware;
