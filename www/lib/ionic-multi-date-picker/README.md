##Introduction:

This is an `ionic-multi-date-picker` bower component, which can be used in any Ionic framework's application. No additional plugins required for this component.

Forked from https://github.com/rajeshwarpatlolla/ionic-datepicker
and fully rewrited.

[Repo with simple ionic-application](https://github.com/DenniLa2/ionic-datepicker-sample-project)

[Home Ionic-multi-date-picker](https://github.com/DenniLa2/ionic-datepicker)

##Screenshots:

![ios popup](https://github.com/DenniLa2/ionic-datepicker/blob/master/images/imdp-android.jpg)
![ios popup dateselector](https://github.com/DenniLa2/ionic-datepicker/blob/master/images/imdp-calendarNames.jpg)

![android modal](https://github.com/DenniLa2/ionic-datepicker/blob/master/images/imdp-ios-2.jpg)
![android modal dateselector](https://github.com/DenniLa2/ionic-datepicker/blob/master/images/mdp-ios-name-convention.jpg)
![calendar-convention section and "select by week" mode](https://github.com/DenniLa2/ionic-datepicker/blob/master/images/mdp-ios-year-month-select.jpg)

##Video:
[YouTube](https://youtu.be/RxW628a9U-M)

[YouTube - select by week and calendar-convention section](https://youtu.be/Bg0YctJVCME)

##Prerequisites.

* node.js
* npm
* bower
* gulp

##How to use:

1) In your project repository install the ionic-datepicker using bower

`bower install ionic-multi-date-picker --save`

This will install the latest version released.

2) Give the path of  `ionic-multi-date-picker.bundle.min.js` in your `index.html` file.

````html
<!-- path to ionic/angularjs -->
<script src="lib/ionic-multi-date-picker/dist/ionic-multi-date-picker.bundle.min.js"></script>
````

3) In your application module inject the dependency `ionic-multi-date-picker`, in order to work with the ionic time picker
````javascript
angular.module('mainModuleName', ['ionic', 'ionic-multi-date-picker']){
//
}
````

4) Use the below format in your template's corresponding controller. All parameters are optional.

````javascript
    $scope.datepickerObject = {
      templateType: 'POPUP', // POPUP | MODAL
      header: "Select Dates",
      headerClass: "royal-bg light",
      btnsIsNative: false,
      btnOk: 'OK',
      btnOkClass: 'button-clear cal-green',
      btnCancel: 'CLOSE',
      btnCancelClass: 'button-clear button-dark',
      btnTodayShow: false,
      btnToday: 'TODAY',
      btnTodayClass: 'button-positive',
      btnClearShow: false,
      btnClear: 'CLEAR',
      btnClearClass: 'button-royal',
      selectType: 'PERIOD', // SINGLE | PERIOD | MULTI
      tglSelectByWeekShow: true, // true | false (default)
      tglSelectByWeek: 'Select by week',
      isSelectByWeek: true, // true (default) | false
      selectByWeekMode: 'NORMAL', // INVERSION (default), NORMAL
      tglSelectByWeekClass: 'toggle-positive', // true | false (default)
      titleSelectByWeekClass: 'positive positive-border', // true | false (default)
      accessType: 'WRITE', // READ | WRITE
      showErrors: true, // true (default), false
      errorLanguage: 'RU', // EN | RU
      fromDate: new Date(2015, 9),
      toDate: new Date(2016, 1),
      selectedDates: $scope.selectedDates,
      viewMonth: $scope.selectedDates, 
      disabledDates: disabledDates,
      calendar0: holidays,
      calendar0Class: '',
      calendar0Name: 'holidays',
      calendar1: holidays,
      calendar1Class: '',
      calendar1Name: 'my days',
      calendar2: calendar,
      calendar2Class: '',
      calendar2Name: 'other days',
      calendar3: calendar,
      calendar3Class: '',
      calendar3Name: 'red days',
      calendar4: calendar,
      calendar4Class: 'cal-color-black',
      calendar4Name: 'vacations',
      calendar5: calendar,
      calendar5Class: '',
      calendar5Name: 'etc days',
      calendar6: calendar,
      calendar6Class: '',
      calendar6Name: 'same days',
      calendar7: calendar,
      calendar7Class: '',
      calendar7Name: 'same days',
      conflictSelectedDisabled: 'DISABLED', // SELECTED | DISABLED
      closeOnSelect: false,
      mondayFirst: true,
      weekDaysList: weekDaysList,
      monthList: monthList,
      modalHeaderColor: 'bar-positive',
      modalFooterColor: 'bar-positive',
      callback: function (dates) {  
        retSelectedDates(dates);
      }
    };    
````

**$scope.datepickerObject** is the main object, that we need to pass to the directive. The properties of this object are as follows.

**1. templateType** - the type of dialog. Default is `MODAL`.

**2. header** 

**3. headerClass** - ionic css classes.

**4. modalFooterClass** - ionic css classes.

**5. btnsIsNative** - use ionic-popup-native buttons. Default: true.

**6. btnOk** - title on Ok button.

**7. btnOkClass** - ionic css classes.

**8. btnCancel** - title on Cancel button.

**9. btnCancelClass** - ionic css classes.

**10. btnTodayShow** - Default false.

**11. btnToday** - title.

**12. btnTodayClass** - ionic css classes.

**13. btnClearShow** - default false.

**14. btnClear** - title.

**15. btnClearClass** - ionic css classes.

**16. selectType** - SINGLE - one date per calendar, PERIOD  - continuous date period, MULTI - random dates. Default `MULTI`.

**17. tglSelectByWeekShow** - 'select by week' toggle, Default false.

**18. tglSelectByWeek** - title.

**19. isSelectByWeek** - start value, default true.

**20. selectByWeekMode** - INVERSION (default), NORMAL.

**21. tglSelectByWeekClass** - ionic css classes.

**22. titleSelectByWeekClass** - ionic css classes.

**23. accessType** - READ | WRITE. Default - `WRITE`.

**24. showErrors** - true (default), false.

**25. errorLanguage** - language of user errors. EN | RU. Default `EN`.

**26. fromDate:** new Date(2015, 9),

**27. toDate:** new Date(2016, 1),

**28. selectedDates** - array with javascript dates.

**29. viewMonth** - first viewed month. Default: current or nearest next month with date.

**30. disabledDates** - array with javascript dates of disabled dates.

**31. calendar0 - calendar7** - named arrays with javascript dates, where the number is only fixed position around date.

![cal0-cal7](https://github.com/DenniLa2/ionic-datepicker/blob/master/images/imdp-calendarNames.jpg)

**32. calendar0Class - calendar7Class** - classes to customise. Availables classes: cal-color-red, cal-color-yellow, cal-color-orange, cal-color-violet, cal-color-saha, cal-color-coral, cal-color-blue, cal-color-skyey, cal-color-green, cal-color-ggreen, cal-color-holiday, cal-color-black.

**33. holidaysName, calendar1Name - calendar7Name** - shown names of custom calendars in calendar-convention section. If all names are empty - calendar-convention section is hidden. 

**34. conflictSelectedDisabled** - if selecled dates and disabled dates have the same date - one of them will deleted. `SELECTED` - selected date will store, disabled - deleted. `DISABLED` - disabled date will store, selected - deleted. Default `DISABLED`. 

**35. closeOnSelect** - default false.

**36. mondayFirst** - default true,

**37. weekDaysList**

**38. monthList**

**39. callback**(Mandatory) - This the callback function, which will get array of the selected dates in to the controller. You can define this function as follows.
````javascript
    var retSelectedDates = function (dates) {
      $scope.selectedDates.length = 0;
      for (var i = 0; i < dates.length; i++) {
        $scope.selectedDates.push(angular.copy(dates[i]));
      }
    };
````


**1. ionic-multi-date-picker** is the directive, to which we can pass required vales.

**2. input-obj**(Mandatory) - This is an object. We have to pass an object as shown above.

##Versions:

0.1.0 - forked from https://github.com/rajeshwarpatlolla 

1.0.0 - fully rewrited.

1.1.0 - added: calendars 1-7 to popup.

1.2.0 - added: 'select by week' toggle.

1.2.1 - added: calendars 1-7 to modal, added modalFooterClass.

1.2.2 - 2 mode of "select by week": inverse and normal. 

1.2.3 - title of tglSelectByWeek.

1.2.4 - fix.

1.2.5 - added: 'fromDate' and 'toDate', holidaysClass, calendars names and calendar-convention section.

1.2.6 - stylized.

1.2.7 - added: on-hold - day details.

1.2.8 - fix css.

2.0.0 - refactoring. Holiday calendar renamed to calendar0.

##Contact:
gmail: dennila2@gmail.com

github: https://github.com/dennila2

Comment and Rate it : http://market.ionic.io/plugins/ionic-multi-date-picker