exports.getData = function () {
    var today = new Date();

    //data 
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    //the let is useful to mantain the variable under the local scope 
    return today.toLocaleDateString("en-US", options);

}
exports.getDay = function () {
    var today = new Date();

    //data 
    var options = {
        weekday: "long",
    };
    //the let is useful to mantain the variable under the local scope 
    return today.toLocaleDateString("en-US", options);

}