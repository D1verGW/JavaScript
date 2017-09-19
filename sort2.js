function InsertSort(mass) {
	var x = mass;
	for(let i=1;i<x.length;i++)     
	for(let j=i;j>0 && x[j-1]>x[j];j--) // пока j>0 и элемент j-1 > j, x-массив int
			[x[j-1],x[j]] = [x[j],x[j-1]];        // меняем местами элементы j и j-1
	return(x);
}

function ramc (arr,num) {
	var z = [];
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

function test(n, func, sort){
	console.log("-----------------");
	var retval = "Название скрипта: " + func.name + "\nКол-во итераций : " + n;
	console.log(retval);
	var arr = [];
	var random_arr = sort(arr,n);
	console.time("Время выполнения");
	var out_arr = func(random_arr);
	var time = console.timeEnd("Время выполнения");
	return "-----------------";
}

function bsomc (arr,num) {
	let z = [];
	for (var i = 0; i < num; i++) {
		z.push(i);
	}
	return z;
}

function somc (arr,num) {
	var z = [];
	for (var i = num; i > 0; i--) {
		z.push(i);
	}
	return z;
}

function partition(items, left, right) {
    var mid = items[Math.floor((right + left) / 2)];
    var i   = left;
    var j   = right;

    while (i <= j) {
        while (items[i] < mid) {
            i++;
        }
        while (items[j] > mid) {
            j--;
        }
        if (i <= j) {
			[items[i],items[j]]=[items[j],items[i]];
            i++;
            j--;
        }
    }
    return i;
}

function QuickSort(items, left = 0, right = items.length - 1) {
    var index;
    if (items.length > 1) {
        index = partition(items, left, right);
        if (left < index - 1) {
            QuickSort(items, left, index - 1);
        }
        if (index < right) {
            QuickSort(items, index, right);
        }
    }
    return items;
}
// Пока не работает, почему - хз
function SmartSort(items, left = 0, right = items.length - 1) {
    var index;
    if (items.length > 1) {
		let max = right;
		let min = left;
        index = Math.floor(Math.random() * (max - min + 1)) + min;
		console.log(index);
        if (left < index - 1) {
            SmartSort(items, left, index - 1);
        }
        if (index < right) {
            SmartSort(items, index, right);
        }
    }
    return items;
}

console.log(test(100000, QuickSort, ramc));
console.log(test(100000, SmartSort, ramc));

