const logReport = [];


const deepDiffMapper = function() {
  return {
      VALUE_CREATED: 'created',
      VALUE_UPDATED: 'updated',
      VALUE_DELETED: 'deleted',
      VALUE_UNCHANGED: 'unchanged',
      map: function(obj1, obj2) {
          if (this.isFunction(obj1) || this.isFunction(obj2)) {
              throw 'Invalid argument. Function given, object expected.';
          }
          if (this.isValue(obj1) || this.isValue(obj2)) {
              return {
                  type: this.compareValues(obj1, obj2),
                  data: (obj1 === undefined) ? obj2 : obj1
              };
          }

          var diff = {};
          for (var key in obj1) {
              if (this.isFunction(obj1[key])) {
                  continue;
              }

              var value2 = undefined;
              if ('undefined' != typeof(obj2[key])) {
                  value2 = obj2[key];
              }

              diff[key] = this.map(obj1[key], value2);
          }
          for (var key in obj2) {
              if (this.isFunction(obj2[key]) || ('undefined' != typeof(diff[key]))) {
                  continue;
              }

              diff[key] = this.map(undefined, obj2[key]);
          }

          return diff;

      },
      compareValues: function(value1, value2) {
          if (value1 === value2) {
              return this.VALUE_UNCHANGED;
          }
          if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
              return this.VALUE_UNCHANGED;
          }
          if ('undefined' == typeof(value1)) {
              return this.VALUE_CREATED;
          }
          if ('undefined' == typeof(value2)) {
              return this.VALUE_DELETED;
          }

          return this.VALUE_UPDATED;
      },
      isFunction: function(obj) {
          return {}.toString.apply(obj) === '[object Function]';
      },
      isArray: function(obj) {
          return {}.toString.apply(obj) === '[object Array]';
      },
      isDate: function(obj) {
          return {}.toString.apply(obj) === '[object Date]';
      },
      isObject: function(obj) {
          return {}.toString.apply(obj) === '[object Object]';
      },
      isValue: function(obj) {
          return !this.isObject(obj) && !this.isArray(obj);
      }
  }
}();

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
    happends.diff = deepDiffMapper.map(prev_state, next_state)
    logReport.push(happends);
  }
};

export default whatHappendMiddleware;
