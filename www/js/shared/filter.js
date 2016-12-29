//Filter epochToDate :
//Use for convert epoch date format to default date format.
//Example :
//<p>{{item.createdAt |epochToDate | date:"short"}}</p>
appControllers.filter('epochToDate', function ($filter) {
    return function (input) {
        return new Date(Date(input));
    };
});// End Filter epochToDate.

//Filter numberSuffix :
//Use for convert number to have suffix 1,000 to 1K.
//Example :
//{{item.likes.summary.total_count | numberSuffix}}
//
appControllers.filter('numberSuffix', function () {
    return function (input) {
        var exp;
        var suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

        if (window.isNaN(input)) {
            return 0;
        }

        if (input < 1000) {
            return input;
        }

        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (input / Math.pow(1000, exp)).toFixed(1) + suffixes[exp - 1];
    }
});// End Filter numberSuffix.

appControllers.filter('distance', function ($filter) {
   
    return function (input) {
            input=input/1000;

        return input;
    };
});// End Filter epochToDate.

appControllers.filter('newline', function ($filter) {
    return function(text) {
        if(text!=null)
        return text.replace(/・/g, '<br/>✹ ');
    else
         return  text;  
    }
});// End Filter epochToDate.

appControllers.filter('intersect', function(){
    
    return function(arr1, arr2){
        console.log(arr1, arr2);
       
        return arr1.filter(function(n) {
                   return arr2.indexOf(n) != -1
               });
    };
});

appControllers.filter('dateadding', [function() {
  return function(isoDateString, days) {

    var todayDate = new Date();    
    var ndate=new Date().setDate(todayDate.getDate()+days);

    return ndate;
  };
}]);