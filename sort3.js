// ----------------------------------------------
// Функция сортировки вставкой
// ----------------------------------------------
function InsertSort(mass) {
	var x = mass;
	for(let i=1;i<x.length;i++){
		for(let j=i;j>0 && x[j-1]>x[j];j--){ // пока j>0 и элемент j-1 > j, x-массив int
			[x[j-1],x[j]] = [x[j],x[j-1]];   // меняем местами элементы j и j-1
		}
	}     
	return(x);
}

// ----------------------------------------------
// Функция сортировки слиянияем
// ----------------------------------------------
function MergeSort(A) {
    function merge_sort(a,low,high) { 
    	if (low < high)
        { 
        	var mid = Math.floor((low+high)/2);
        	merge_sort(a, low, mid);
        	merge_sort(a, mid+1, high);
        	Merge(a, low, mid, high);
        }
    }
    var n = A.length;
    merge_sort(A, 0, n-1);
    return A;
}

// Служебная функция для сортировки слиянием
function Merge(a,low,mid,high) {
    var b = new Array(high+1-low), h, i, j = mid+1, k, h = low, i = 0;
    while (h <= mid && j <= high )
     { 
    	if (a[h] <= a[j]) { 
    		b[ i ]=a[h]; h++; 
    	} else { 
    		b[ i ]=a[j]; j++; 
    	}
    	i++;
     }
    if (h > mid){ 
    	for (k = j; k <= high; k++) { 
    		b[ i ]=a[k]; i++; } 
    	} else { 
    		for (k = h; k <= mid; k++) {  
    			b[ i ]=a[k]; i++; 
    		} 
    	}    
    for (k=0; k<=high-low; k++) { 
    	a[k+low]=b[k]
    };
    return a;
}

// ----------------------------------------------
// Функция быстрой сортировки
// ----------------------------------------------
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
// ----------------------------------------------
// Функция умной сортировки
// ----------------------------------------------
function SmartSort(items, left = 0, right = items.length - 1) {
    var index;
    if (items.length > 1) {
		let max = right;
		let min = left;
        index = partition(items, left, right, true);
        if (left < index - 1) {
            SmartSort(items, left, index - 1);
        }
        if (index < right) {
            SmartSort(items, index, right);
        }
    }
    return items;
}

// Служебная функция для квиксорта и смартсорта
function partition(items, left, right, smart = false) {
    var mid = items[Math.floor((right + left) / 2)];
    var i   = left;
    var j   = right;

    if (smart) {
    	mid = items[(Math.floor(Math.random() * (right - left + 1)) + left)];
    }

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

// ----------------------------------------------
// Служебные функции отладки и вывода результатов
// ----------------------------------------------

// случайное заполнение
function random (num) {
	let z = [];
	for (let i = 0; i < num; i++) {
		z.push(parseInt((Math.random()*1000).toFixed(1)));
	}
	return z;
}
// обратный сортированный массив
function back_sorted (num) {
	let z = [];
	for (let i = 0; i < num; i++) {
		z.push(i);
	}
	return z;
}
// сортированный массив
function sorted (num) {
	let z = [];
	for (let i = num; i > 0; i--) {
		z.push(i);
	}
	return z;
}

function arr_creater (count, arr_init) {
	var inited_arr = arr_init(count);
	var out_arr = {
		'count': count,
		'init': arr_init.name,
		'out_arr': inited_arr
	};
	return out_arr;
}
// вывод результатов
function test(sort_function, in_arr){
	var name = sort_function.name;
	var mass = in_arr.slice(0);
	// Date.now - кроссплатформенно
	// // var time_start = Date.now();
	// performance.now() - только некоторые браузеры

	var time_start = performance.now();
	var out_arr = sort_function(mass);
	var time_end = performance.now();
	
	
	// // var time_end = Date.now();
	var time = time_end - time_start;

	// performance use:
	time = time.toFixed(3);
	var retval = {
	"Время, мс": time,
	"Размер, n": mass.length,
	"Вход": in_arr.slice(0),
	"Выход": mass
	};
	return retval;
}

function table_test(count, massive_sort){
	var table;
	var cnt = count;
	var mass_obj = arr_creater(count, massive_sort);
	let array = mass_obj.out_arr;

	table = [test(QuickSort, array), test(SmartSort, array), test(MergeSort, array), test(InsertSort, array)];
	var retval = {
		"Кол-во элементов": cnt,
		"Нач. инициализация": massive_sort.name,
		"QuickSort": table[0],
		"SmartSort": table[1],
		"MergeSort": table[2],
		"InsertSort":table[3]
	};
	console.table(retval);
	return 0;
}
