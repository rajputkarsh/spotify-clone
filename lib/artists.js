
export function concatenateArray(array, element){
    var elementArray = [];
  
    for (var i = 0; i < array.length; i++){
        elementArray.push(array[i][element]);
    }
  
    return elementArray.join(", ");
}