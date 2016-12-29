//By Rajeshwar Patlolla - rajeshwar.patlolla@gmail.com

// forked and rewrited by Denni Adam - dennila2@gmail.com
// https://github.com/dennila2

(function () {
  'use strict';

  angular.module('ionic-multi-date-picker')
    .directive('ionicMultiDatePicker', IonicMultiDatePicker);

  IonicMultiDatePicker.$inject = ['$ionicGesture', '$ionicModal', '$ionicPopup', '$timeout', 'IonicMultiDatePickerService'];

  function IonicMultiDatePicker($ionicGesture, $ionicModal, $ionicPopup, $timeout, IonicMultiDatePickerService) {
    return {
      restrict: 'AE',
      replace: false,
      /*template: function (elem, attrs) {
       console.log('elem');
       console.log(elem);
       if (attrs.calendar === 'true') {
       return '<div>date-picker</div><div>{{ inputObj.header }}</div>'
       }
       return '';
       },*/
      scope: {
        inputObj: "=inputObj"
      },
      link: function (scope, element, attrs) {
        // IDE definitions
        var ERRORS = {
          INPUT_PERIOD__SINGLE_NOT_PERIOD: {
            CODE: 'INPUT_PERIOD__SINGLE_NOT_PERIOD',
            EN: 'Date is not single',
            RU: 'Должно быть не больше одной даты'
          },
          INPUT_PERIOD__DATES_NOT_PERIOD: {
            CODE: 'INPUT_PERIOD__DATES_NOT_PERIOD',
            EN: 'Dates is not period',
            RU: 'Даты не являются периодом'
          },
          UNKNOWN_ERROR: {
            CODE: 'UNKNOWN_ERROR',
            EN: 'Unknown error',
            RU: 'Неизвестная ошибка'
          },
          ERROR_DELETING_UNKNOWN_ERROR: {
            CODE: 'ERROR_DELETING_UNKNOWN_ERROR',
            EN: 'Error deleting unknown error',
            RU: 'Ошибка удаления неизвестной ошибки'
          }
        };
        var SELECT_TYPE = {MULTI: 'MULTI', PERIOD: 'PERIOD', SINGLE: 'SINGLE'};
        var ACCESS_TYPE = {WRITE: 'WRITE', READ: 'READ'};
        var ERROR_LANGUAGE = {EN: 'EN', RU: 'RU'};
        var TEMPLATE_TYPE = {POPUP: 'POPUP', MODAL: 'MODAL'};
        var CONFLICT_S_D = {DISABLED: 'DISABLED', SELECTED: 'SELECTED'};
        var SELECT_BY_WEEK_MODE = {INVERSION: 'INVERSION', NORMAL: 'NORMAL'};

        function start() {
          initErrors();
          initView();
          initDates();
          initCalendarDates();
          initBtns();
          setViewMonth();
          refreshDateList();
        }

        initModal();

        var errors;

        function initErrors() {
          scope.errors = {len: 0};
          Object.defineProperty(scope.errors, "len", {enumerable: false});

          errors = (function () {

            return {
              add: function (code) {
                if (!scope.errors.hasOwnProperty(code) && ERRORS.hasOwnProperty(code)) {
                  console.debug('code+: ' + code);
                  var err = ERRORS[code];
                  scope.errors[code] = ERRORS[code];
                } else if (!scope.errors.hasOwnProperty(code) && !ERRORS.hasOwnProperty(code)) {
                  console.debug('code: ' + code);
                  err = ERRORS.UNKNOWN_ERROR;
                  scope.errors.UNKNOWN_ERROR = ERRORS.UNKNOWN_ERROR;
                } else {
                  // error already in array
                }
                this.length();
              },
              remove: function (code) {
                if (scope.errors.hasOwnProperty(code) && ERRORS.hasOwnProperty(code)) {
                  delete scope.errors[code];
                } else if (scope.errors.hasOwnProperty(code) && !ERRORS.hasOwnProperty(code)) {
                  scope.errors.ERROR_DELETING_UNKNOWN_ERROR = ERRORS.ERROR_DELETING_UNKNOWN_ERROR;
                }
                this.length();
              },

              length: function () {
                scope.errors.len = 0;
                for (var err in scope.errors) {
                  scope.errors.len++;
                }
              }
            }
          })();
        }

        function initView() {
          //Setting the title, today, close and set strings for the date picker
          scope.templateType = (scope.inputObj.templateType && TEMPLATE_TYPE.hasOwnProperty(scope.inputObj.templateType) > -1) ? (scope.inputObj.templateType) : TEMPLATE_TYPE.POPUP;


          scope.currentMonth = '';
          scope.currentYear = '';
          scope.monthYear = {
            select: new Date()
          };

          scope.header = (scope.inputObj.header && scope.inputObj.header.length > 0) ? scope.inputObj.header : '';
          if (scope.templateType === TEMPLATE_TYPE.MODAL && scope.header === '') scope.header = 'Datepicker';
          scope.headerClass = scope.inputObj.headerClass;

          scope.btnsIsNative = !!scope.inputObj.btnsIsNative;

          scope.btnOk = scope.inputObj.btnOk ? scope.inputObj.btnOk : 'Ok';
          scope.btnOkClass = scope.inputObj.btnOkClass ? scope.inputObj.btnOkClass : 'button-stable cal-button';

          scope.btnCancel = scope.inputObj.btnCancel ? scope.inputObj.btnCancel : 'Close';
          scope.btnCancelClass = scope.inputObj.btnCancelClass ? scope.inputObj.btnCancelClass : 'button-stable cal-button';

          scope.btnTodayShow = !!scope.inputObj.btnTodayShow;
          if (scope.btnTodayShow) {
            scope.btnToday = scope.inputObj.btnToday ? scope.inputObj.btnToday : 'Today';
            scope.btnTodayClass = scope.inputObj.btnTodayClass ? scope.inputObj.btnTodayClass : 'button-stable cal-button';
          }

          scope.btnClearShow = !!scope.inputObj.btnClearShow;
          if (scope.btnClearShow) {
            scope.btnClear = scope.inputObj.btnClear ? scope.inputObj.btnClear : 'Clear';
            scope.btnClearClass = scope.inputObj.btnClearClass ? scope.inputObj.btnClearClass : 'button-stable cal-button';
          }
          scope.selectType = (scope.inputObj.selectType && SELECT_TYPE.hasOwnProperty(scope.inputObj.selectType) > -1 ) ? scope.inputObj.selectType : SELECT_TYPE.MULTI;

          scope.tglSelectByWeekShow = scope.inputObj.tglSelectByWeekShow === true;
          scope.tglSelectByWeek = scope.inputObj.tglSelectByWeek ? scope.inputObj.tglSelectByWeek : 'Select by week';
          scope.selectByWeekMode = (scope.inputObj.selectByWeekMode && scope.inputObj.selectByWeekMode === SELECT_BY_WEEK_MODE.INVERSION) ? SELECT_BY_WEEK_MODE.INVERSION : SELECT_BY_WEEK_MODE.NORMAL;
          scope.selectByWeekMode = (scope.inputObj.selectByWeekMode && scope.inputObj.selectByWeekMode === SELECT_BY_WEEK_MODE.INVERSION) ? SELECT_BY_WEEK_MODE.INVERSION : SELECT_BY_WEEK_MODE.NORMAL;
          scope.selectByWeek = {is: !!(scope.inputObj.isSelectByWeek === true && scope.tglSelectByWeekShow === true)};
          scope.tglSelectByWeekClass = scope.inputObj.tglSelectByWeekClass ? scope.inputObj.tglSelectByWeekClass : 'toggle-energized';
          scope.titleSelectByWeekClass = scope.inputObj.titleSelectByWeekClass ? scope.inputObj.titleSelectByWeekClass : 'energized energized-border';

          scope.accessType = (scope.inputObj.accessType && ACCESS_TYPE.hasOwnProperty(scope.inputObj.accessType) > -1) ? scope.inputObj.accessType : ACCESS_TYPE.WRITE;
          scope.showErrors = (scope.inputObj.showErrors && scope.inputObj.showErrors !== true) ? false : true;
          scope.errorLanguage = (scope.inputObj.errorLanguage && ERROR_LANGUAGE.hasOwnProperty(scope.inputObj.errorLanguage)) ? scope.inputObj.errorLanguage : ERROR_LANGUAGE.EN;

          if (scope.inputObj.fromDate && Date.prototype.isPrototypeOf(scope.inputObj.fromDate)) {
            scope.fromYearMonth = scope.inputObj.fromDate.getFullYear() * 100 + scope.inputObj.fromDate.getMonth();
          } else {
            scope.fromYearMonth = undefined;
          }

          if (scope.inputObj.toDate && Date.prototype.isPrototypeOf(scope.inputObj.toDate)) {
            scope.toYearMonth = scope.inputObj.toDate.getFullYear() * 100 + scope.inputObj.toDate.getMonth();
          } else {
            scope.toYearMonth = undefined;
          }

          scope.conflictSD = (scope.inputObj.conflictSelectedDisabled && CONFLICT_S_D.hasOwnProperty(scope.inputObj.conflictSelectedDisabled)) ? scope.inputObj.conflictSelectedDisabled : CONFLICT_S_D.DISABLED;

          scope.closeOnSelect = !!scope.inputObj.closeOnSelect;

          scope.modalFooterClass = scope.inputObj.modalFooterClass ? scope.inputObj.modalFooterClass : 'bar-light';

          // Setting the months list. This is useful, if the component needs to use some other language.
          scope.monthsList = [];
          if (scope.inputObj.monthList && scope.inputObj.monthList.length === 12) {
            scope.monthsList = scope.inputObj.monthList;
          } else {
            scope.monthsList = IonicMultiDatePickerService.monthsList;
          }
          // weaklist
          if (scope.inputObj.weekDaysList && scope.inputObj.weekDaysList.length === 7) {
            scope.weekNames = scope.inputObj.weekDaysList;
          } else {
            scope.weekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
          }

          // Setting whether to show Monday as the first day of the week or not.
          scope.mondayFirst = !!scope.inputObj.mondayFirst;

          if (scope.mondayFirst === true) {
            var lastWeekDay = scope.weekNames.shift();
            scope.weekNames.push(lastWeekDay);
          }
        }

        function glueDate(date) {
          if (date instanceof Date) {
            return date.getFullYear() * 10000 + date.getMonth() * 100 + date.getDate();
          } else {
            return date.year * 10000 + date.month * 100 + date.date;
          }
        }

        function initDates() {

          // INPUT DATES:
          // work copy & cancel copy
          if (scope.inputObj.selectedDates && scope.inputObj.selectedDates.length > 0) {
            scope.selectedDates = angular.copy(scope.inputObj.selectedDates);
            scope.inputDates = angular.copy(scope.inputObj.selectedDates);
          } else {
            scope.selectedDates = [];
            scope.inputDates = [];
          }

          // disabled dates
          scope.disabledDates = [];
          if (scope.inputObj.disabledDates && scope.inputObj.disabledDates instanceof Array) {
            scope.disabledDates = scope.inputObj.disabledDates;
          }


          // calendars 0 - 7
          scope.calendar = [];
          scope.calendarNamesCount = 0;

          for (var i = 0; i < 8; i++) {
            scope.calendar[i] = {dates: []};
            var cn = 'calendar' + i;
            if (scope.inputObj[cn] && scope.inputObj[cn] instanceof Array) {

              scope.calendar[i].dates = scope.inputObj[cn];
/*
              for (var d = 0; d < scope.inputObj[cn].length; d++) {
                if (Date.prototype.isPrototypeOf()) {


                }
              }
*/


              scope.calendar[i].class = scope.inputObj[cn + 'Class'] && scope.inputObj[cn + 'Class'].length > 0 ? scope.inputObj[cn + 'Class'] : 'cal-color-' + i;
              scope.calendar[i].name = {
                isShow: scope.inputObj[cn + 'Name'] && scope.inputObj[cn + 'Name'].length > 0,
                class: scope[cn + 'Class'],
                title: scope.inputObj[cn + 'Name']
              };
              if (scope.calendar[i].name.isShow) scope.calendarNamesCount++;
            }
          }

          scope.onRelease();

          // methods:
          scope.selectedDates.findDate = function (year, month, date) {
            if (this.length > 0) {
              for (var i = 0; i < this.length; i++) {
                var d = this[i];
                if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === date) {
                  return {isPresent: true, i: i};
                }
              }
            }
            return {isPresent: false};
          };

          scope.selectedDates.addRemove = function (year, month, date, state) {
            var find = this.findDate(year, month, date);

            switch (scope.selectType) {
              case SELECT_TYPE.SINGLE:
                this.length = 0;
                if (find.isPresent) {
                  //scope.selectedDates.length = 0;
                } else {
                  this.push(new Date(year, month, date));
                }
                break;

              default:
                if (state === undefined) {
                  if (find.isPresent) {
                    this.splice(find.i, 1);
                  } else {
                    this.push(new Date(year, month, date));
                  }
                } else {
                  if (find.isPresent && !state) {
                    this.splice(find.i, 1);
                  } else if (!find.isPresent && state) {
                    this.push(new Date(year, month, date));
                  }
                }
            }
          };

          scope.selectedDates.clear = function () {
            this.length = 0;
          };

          scope.selectedDates.sortByDate = function (direction) {

            direction = (direction && direction === 'desc') ? -1 : 1;
            if (this.length > 0) {
              for (var i = 0; i < this.length; i++) {
                this[i].sortField = glueDate(this[i]);
              }
            }

            this.sort(function (a, b) {
              return (a.sortField - b.sortField) * direction;
            });
          };

          scope.selectedDates.checkDisabledConflicts = function () {
            var d = 0;
            var s = 0;
            var dis = scope.disabledDates;

            if (scope.conflictSD === CONFLICT_S_D.DISABLED) {

              while (d < dis.length) {
                s = 0;
                while (s < this.length) {
                  if (dis[d].sortField === this[s].sortField) {
                    this.splice(s, 1);
                  } else {
                    s++;
                  }
                }
                d++;
              }

            } else {

              while (s < this.length) {
                d = 0;
                while (d < dis.length) {
                  if (dis[d].sortField === this[s].sortField) {
                    dis.splice(d, 1);
                  } else {
                    d++;
                  }
                }
                s++;
              }
            }

          };

          scope.selectedDates.getNearestFutureMonth = function () {
            var today = new Date();
            var curYear = today.getFullYear();
            var curMonth = today.getMonth();

            this.sortByDate();

            if (this.length > 0) {
              for (var i = 0; i < this.length; i++) {
                var d = this[i];
                var dYear = d.getFullYear(), dMonth = d.getMonth();
                if ((dYear == curYear && dMonth >= curMonth) || dYear > curYear) {
                  return {year: dYear, month: dMonth}
                }
              }
              return {year: curYear, month: curMonth};
            } else {
              return {year: curYear, month: curMonth};
            }
          };

          scope.selectedDates.checkPeriod = function () {

            if (scope.selectType === SELECT_TYPE.SINGLE) {
              var isTruePeriod = this.length <= 1;
              if (isTruePeriod) {
                errors.remove(ERRORS.INPUT_PERIOD__SINGLE_NOT_PERIOD.CODE);
              } else {
                errors.add(ERRORS.INPUT_PERIOD__SINGLE_NOT_PERIOD.CODE);
              }
              return isTruePeriod;
            }

            if (scope.selectType === SELECT_TYPE.MULTI) {
              isTruePeriod = true;
              return isTruePeriod;
            }

            // 'period':
            if (this.length > 1) {

              this.sortByDate();

              for (var i = 0; i < this.length - 1; i++) {
                if (this[i + 1].sortField - this[i].sortField !== 1) {
                  var d1 = new Date(this[i].getFullYear(), this[i].getMonth(), this[i].getDate());
                  var d2 = new Date(this[i + 1].getFullYear(), this[i + 1].getMonth(), this[i + 1].getDate());
                  var diff = (d2.getTime() - d1.getTime()) / (24 * 60 * 60 * 1000);

                  if (diff != 1) {
                    isTruePeriod = false;
                    errors.add(ERRORS.INPUT_PERIOD__DATES_NOT_PERIOD.CODE);
                    return isTruePeriod;
                  }
                }
              }
            }

            isTruePeriod = true;
            errors.remove(ERRORS.INPUT_PERIOD__DATES_NOT_PERIOD.CODE);
            return isTruePeriod;
          };

          scope.selectedDates.checkClones = function () {

            scope.selectedDates.sortByDate.call(this);

            var i = 0;
            while (i < this.length - 1) {
              if (this[i].sortField === this[i + 1].sortField) {
                this.splice(i + 1, 1);
              } else {
                i++;
              }
            }
          };

          // checking input period
          scope.selectedDates.checkClones();
          scope.selectedDates.checkPeriod();

          scope.selectedDates.checkClones.call(scope.disabledDates);
          for (var c = 0; c < 8; c++) {
            scope.selectedDates.checkClones.call(scope.calendar[c].dates);
          }

          scope.selectedDates.checkDisabledConflicts();
        }

        function initCalendarDates() {


          // VIEWED DATES:
          scope.dayList = [];
          // methods:
          scope.dayList.zero = function () {
            this.length = 0;
          };

          scope.dayList.findDay = function (year, month, date) {
            for (var i = 0; i < this.length; i++) {
              if (this[i].year === year && this[i].month === month && this[i].date === date) {
                return i;
              }
            }
          };

          scope.dayList.repaint = function () {
            var viewMonthDates = [];
            scope.selectedDates.sortByDate();

            var firstDay = glueDate(this[0]);
            var lastDay = glueDate(this[this.length - 1]);

            var sd = scope.selectedDates;
            for (var i = 0; i < sd.length; i++) {
              if (sd[i].sortField >= firstDay && sd[i].sortField <= lastDay) {
                viewMonthDates.push(sd[i].sortField);
              } else if (sd[i].sortField > lastDay) {
                break;
              }
            }

            i = 0;
            while (i < this.length) {
              this[i].style.isSelected = viewMonthDates.indexOf(glueDate(this[i])) >= 0;
              i++;
            }
          };

          scope.dayList.repaintDay = function (year, month, date) {
            scope.dayList.repaint();
            var i = this.findDay(year, month, date);
            this[i].style.isSelected = !this[i].style.isSelected;
          };
        }

        function initBtns() {
          // BUTTONS:
          scope.btns = [];

          if (scope.btnClearShow && scope.accessType === ACCESS_TYPE.WRITE) {
            scope.btns.push({
              text: scope.btnClear,
              type: scope.btnClearClass,
              sType: 'clear',
              onClickModal: function () {
                btnClear();
              },
              onTap: function (e) {
                btnClear();
                if (scope.btnsIsNative) {
                  e.preventDefault();
                }
              }
            });
          }

          if (scope.btnTodayShow) {
            scope.btns.push({
              text: scope.btnToday,
              type: scope.btnTodayClass,
              sType: 'today',
              onClickModal: function () {
                btnToday();
              },
              onTap: function (e) {
                btnToday();
                if (scope.btnsIsNative) {
                  e.preventDefault();
                }
              }
            });
          }

          scope.btns.push({
            text: scope.btnCancel,
            type: scope.btnCancelClass,
            sType: 'cancel',
            onClickModal: function () {
              btnCancel();
              scope.closeModal();
            },
            onTap: function () {
              btnCancel();
              if (!scope.btnsIsNative) {
                scope.popup.close();
              }
            }
          });

          if (scope.accessType === ACCESS_TYPE.WRITE) {
            scope.btns.push({
              text: scope.btnOk,
              type: scope.btnOkClass,
              sType: 'ok',
              onClickModal: function () {
                btnOk();
                scope.closeModal();
              },
              onTap: function () {
                btnOk();
                if (!scope.btnsIsNative) {
                  scope.popup.close();
                }
              }
            });
          }

          if (scope.templateType === TEMPLATE_TYPE.MODAL) scope.btns.reverse()
        }

        function setViewMonth() {
          // select viewed month(current || nearest next)
          if (scope.inputObj.viewMonth && scope.inputObj.viewMonth.length > 0) {
            scope.viewYear = scope.inputObj.viewMonth[0].getFullYear();
            scope.viewMonth = scope.inputObj.viewMonth[0].getMonth();
          } else if (scope.selectedDates && scope.selectedDates.length > 0) {
            var date = scope.selectedDates.getNearestFutureMonth();
            scope.viewYear = date.year;
            scope.viewMonth = date.month;
          } else {
            scope.viewYear = new Date().getFullYear();
            scope.viewMonth = new Date().getMonth();
          }
        }

        function refreshDateList() {

          var today = new Date();
          var viewYear = scope.viewYear;
          var viewMonth = scope.viewMonth;
          var nowDay = today.getDate();
          var isCurMonthNow = (viewYear === today.getFullYear() && viewMonth === today.getMonth());

          var lastDay = new Date(viewYear, viewMonth + 1, 0).getDate();

          scope.dayList.zero();

          // current month
          for (var i = 1; i <= lastDay; i++) {
            var isViewMonth = true;

            var isToday = isCurMonthNow && nowDay === i;
            var isCalendar = [];
            for (var c = 0; c < 8; c++) {
              isCalendar[c] = scope.selectedDates.findDate.call(scope.calendar[c].dates, viewYear, viewMonth, i).isPresent;
            }

            var isDisabled = scope.selectedDates.findDate.call(scope.disabledDates, viewYear, viewMonth, i, true).isPresent;
            var isSelected = scope.selectedDates.findDate(viewYear, viewMonth, i).isPresent && !isDisabled;

            var iDate = new Date(viewYear, viewMonth, i);

            scope.dayList.push({
              year: viewYear,
              month: viewMonth,
              date: i,
              day: iDate.getDay(),
              style: {
                isSelected: isSelected,
                isToday: isToday,
                isDisabled: isDisabled,
                isCalendar0: isCalendar[0],
                isCalendar1: isCalendar[1],
                isCalendar2: isCalendar[2],
                isCalendar3: isCalendar[3],
                isCalendar4: isCalendar[4],
                isCalendar5: isCalendar[5],
                isCalendar6: isCalendar[6],
                isCalendar7: isCalendar[7],
                isViewMonth: isViewMonth
              }
            });
          }

          // set Monday as the first day of the week.
          var insertDays = scope.dayList[0].day - scope.mondayFirst;
          insertDays = (insertDays < 0) ? 6 : insertDays;
          lastDay = new Date(viewYear, viewMonth, 0).getDate();

          // end of preview month
          var date = monthShift(viewYear, viewMonth, '-');
          isViewMonth = false;
          isToday = false;


          for (var j = 0; j < insertDays; j++) {


            for (c = 0; c < 8; c++) {
              isCalendar[c] = scope.selectedDates.findDate.call(scope.calendar[c].dates, date.year, date.month, lastDay - j).isPresent;
            }

            isDisabled = scope.selectedDates.findDate.call(scope.disabledDates, date.year, date.month, lastDay - j).isPresent;
            isSelected = scope.selectedDates.findDate(date.year, date.month, lastDay - j).isPresent && !isDisabled;

            iDate = new Date(date.year, date.month, lastDay - j);

            scope.dayList.unshift({
              year: date.year,
              month: date.month,
              date: lastDay - j,
              day: iDate.getDay(),
              style: {
                isSelected: isSelected,
                isToday: isToday,
                isDisabled: isDisabled,
                isCalendar0: isCalendar[0],
                isCalendar1: isCalendar[1],
                isCalendar2: isCalendar[2],
                isCalendar3: isCalendar[3],
                isCalendar4: isCalendar[4],
                isCalendar5: isCalendar[5],
                isCalendar6: isCalendar[6],
                isCalendar7: isCalendar[7],
                isViewMonth: isViewMonth
              }
            });
          }

          scope.rows = [0, 7, 14, 21, 28];
          if (scope.dayList.length / 7 > 5) {
            scope.rows.push(35); // = [0, 7, 14, 21, 28, 35];
          }

          var daysLeft = 7 - scope.dayList.length % 7;
          // start of next month
          date = monthShift(scope.viewYear, scope.viewMonth, '+');
          for (i = 1; i <= daysLeft; i++) {
            for (c = 0; c < 8; c++) {
              isCalendar[c] = scope.selectedDates.findDate.call(scope.calendar[c].dates, date.year, date.month, i).isPresent;
            }

            isDisabled = scope.selectedDates.findDate.call(scope.disabledDates, date.year, date.month, i).isPresent;
            isSelected = scope.selectedDates.findDate(date.year, date.month, i).isPresent && !isDisabled;
            iDate = new Date(date.year, date.month, i);

            scope.dayList.push({
              year: date.year,
              month: date.month,
              date: i,
              day: iDate.getDay(),
              style: {
                isSelected: isSelected,
                isToday: isToday,
                isDisabled: isDisabled,
                isCalendar0: isCalendar[0],
                isCalendar1: isCalendar[1],
                isCalendar2: isCalendar[2],
                isCalendar3: isCalendar[3],
                isCalendar4: isCalendar[4],
                isCalendar5: isCalendar[5],
                isCalendar6: isCalendar[6],
                isCalendar7: isCalendar[7],
                isViewMonth: isViewMonth
              }
            });
          }

          scope.cols = [0, 1, 2, 3, 4, 5, 6];

        }

        scope.prevMonth = function () {
          var date = monthShift(scope.viewYear, scope.viewMonth, '-');
          if (scope.fromYearMonth === undefined || date.year * 100 + date.month >= scope.fromYearMonth) {
            scope.viewYear = date.year;
            scope.viewMonth = date.month;

            refreshDateList();
          }
        };

        scope.nextMonth = function () {
          var date = monthShift(scope.viewYear, scope.viewMonth, '+');
          if (scope.toYearMonth === undefined || date.year * 100 + date.month <= scope.toYearMonth) {
            scope.viewYear = date.year;
            scope.viewMonth = date.month;
            refreshDateList();
          }
        };

        scope.monthYearSelect = function () {
          var year = scope.monthYear.select.getFullYear();
          var month = scope.monthYear.select.getMonth();
          if ((scope.toYearMonth === undefined || year * 100 + month <= scope.toYearMonth) && (scope.fromYearMonth === undefined || year * 100 + month >= scope.fromYearMonth)) {

            scope.viewYear = year;
            scope.viewMonth = month;

            refreshDateList();
          } else {

          }
        };

        // date-cell ng-click:
        scope.onTap = function (date, row) {
          if (scope.accessType == ACCESS_TYPE.WRITE) {
            if (!scope.selectByWeek.is) {
              selectDay(date)
            } else {
              if (scope.selectByWeekMode === SELECT_BY_WEEK_MODE.NORMAL) {
                var state = !scope.selectedDates.findDate(date.year, date.month, date.date).isPresent;
              }
              for (var i = 0; i < 7; i++) {
                var d = scope.dayList[row + i];
                selectDay(d, state);
              }
            }

            if (scope.closeOnSelect) {
              btnOk();
              if (scope.templateType === TEMPLATE_TYPE.POPUP) {
                $timeout(scope.popup.close, 300);
              } else {
                $timeout(scope.closeModal, 300);
              }
            }
          }
        };

        scope.onHold = function (date) {
          scope.holded = {
            is: true,
            isSelected: date.style.isSelected,
            isDisabled: date.style.isDisabled,
            isToday: date.style.isToday,
            isCalendar0: date.style.isCalendar0,
            isCalendar1: date.style.isCalendar1,
            isCalendar2: date.style.isCalendar2,
            isCalendar3: date.style.isCalendar3,
            isCalendar4: date.style.isCalendar4,
            isCalendar5: date.style.isCalendar5,
            isCalendar6: date.style.isCalendar6,
            isCalendar7: date.style.isCalendar7,
            date: date.date
          };
        };

        scope.onRelease = function (date) {
          scope.holded = {
            is: false,
            date: 'date'
          };
        };

        function selectDay(date, state) {
          var isDisabled = scope.selectedDates.findDate.call(scope.disabledDates, date.year, date.month, date.date).isPresent;
          if (!isDisabled) {
            scope.selectedDates.addRemove(date.year, date.month, date.date, state);
            scope.dayList.repaint();
            scope.selectedDates.checkPeriod();

          }
        }

        function monthShift(year, month, direction) {
          switch (direction) {
            case '+':
              if (month === 11) {
                year++;
                month = 0;
              } else {
                month++;
              }
              break;

            case '-':
              if (month === 0) {
                year--;
                month = 11;
              } else {
                month--;
              }
              break;
          }

          return {year: year, month: month};
        }

        function btnOk() {
          scope.inputObj.callback(scope.selectedDates);
        }

        function btnCancel() {
          scope.inputObj.callback(scope.inputDates);
        }

        function btnClear() {
          scope.selectedDates.clear();
          scope.dayList.repaint();
          scope.selectedDates.checkPeriod();
        }

        function btnToday() {
          var d = new Date();

          scope.viewYear = d.getFullYear();
          scope.viewMonth = d.getMonth();

          refreshDateList();
        }

        function initModal() {
          // reference for the 'ionic-multi-date-picker' modal.
          $ionicModal.fromTemplateUrl('ionic-multi-date-picker-modal.html', {
            scope: scope,
            animation: 'slide-in-up'
          }).then(function (modal) {
            scope.modal = modal;
          });
          scope.openModal = function () {
            scope.modal.show();
          };
          scope.closeModal = function () {
            scope.modal.hide();
          };
        }

        //Called when the user clicks on the button to invoke the 'ionic-multi-date-picker'
        element.on("click", function () {
          //This code is added to set passed date from datepickerObject
          start();

          if (scope.templateType === TEMPLATE_TYPE.MODAL) {
            scope.openModal();
          } else {
            //Getting the reference for the 'ionic-multi-date-picker' popup.
            var buttons = scope.btns;
            if (!scope.btnsIsNative) {
              buttons = [];
            }
            scope.popup = $ionicPopup.show({
              templateUrl: 'ionic-multi-date-picker-popup.html',
              cssClass: 'picker-body',
              scope: scope,
              buttons: buttons
            });
          }
        });
      }
    };
  }

})();