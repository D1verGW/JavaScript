
function InsertSort(mass) {
	let x = mass;
	for(let i=1;i<x.length;i++)     
	for(let j=i;j>0 && x[j-1]>x[j];j--) // пока j>0 и элемент j-1 > j, x-массив int
			[x[j-1],x[j]] = [x[j],x[j-1]];        // меняем местами элементы j и j-1
	return(x);
}

function ramc (arr,num) {
	let z = [];
	for (var i = 0; i < num; i++) {
		z.push(parseInt((Math.random()*1000).toFixed(1)));
	}
	return z;
}

function Merge(a,low,mid,high)    //Вспомогательная функция.
{
    var b = new Array(high+1-low), h, i, j = mid+1, k, h = low, i = 0;
    while (h <= mid && j <= high )
     { if (a[h] <= a[j]){ b[ i ]=a[h]; h++; }
       else             { b[ i ]=a[j]; j++; }
       i++;
     }
    if (h > mid){ for (k = j; k <= high; k++){ b[ i ]=a[k]; i++; } }
    else        { for (k = h; k <= mid; k++){  b[ i ]=a[k]; i++; } }    
    for (k=0; k<=high-low; k++) a[k+low]=b[k];
    return a;
}

function MergeSort(A)      //Функция сортировки слиянияем.
{
    function merge_sort(a,low,high)
     { if (low < high)
        { var mid = Math.floor((low+high)/2);
          merge_sort(a, low, mid);
          merge_sort(a, mid+1, high);
          Merge(a, low, mid, high);
        }
     }
    var n = A.length;
    merge_sort(A, 0, n-1);
    return A;
}

function test(n, func){
	console.log("-----------------");
	var retval = "Название скрипта: " + func.name + "\nКол-во итераций : " + n;
	console.log(retval);
	var arr = [];
	var random_arr = ramc(arr,n);
	console.time("Время выполнения");
	var out_arr = func(random_arr);
	var time = console.timeEnd("Время выполнения");
	return "-----------------";
}


console.log(test(100, InsertSort));
console.log(test(10000, InsertSort));

console.log(test(100, MergeSort));
console.log(test(100000, MergeSort));