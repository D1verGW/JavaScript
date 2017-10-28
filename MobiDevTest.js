// произвольная сортировка массива
function compareRandom(a, b) {
  return Math.random() - 0.5;
}
// получение произвольного целого в пределах от min до max
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

// запрос к серверу, получение JSON-ответа
function getJSON(url){
  return fetch(url)
    .then(function(response) {
      var status = response.status;
      if (status == 200) {
        console.log(`Запрос ширины и высоты по ссылке ${url} успешен, код ответа: ${status}`);
      } else {
        return console.log(`Запрос ширины и высоты по ссылке ${url} произведен, но ответ не получен, код ответа: ${status}`);
      }
      return response.json();
    })
  .catch(function (){
    var error = "Запрос не был произведен, что-то пошло не так!";
    return error;
  }());
}

// отрисовка изображений
async function drawPoly (){
  var link = 'https://kde.link/test/';

  // запрос к серверу, ответ предполагает 2 значения:
  // ширину и высоту
  var url = link + 'get_field_size.php';
  var object = await getJSON (url);
  let width = object.width;
  let height = object.height;

  // задаем массив изображений, как сказано в задании,
  // т.е. создаем просто строковые ссылки
  let images = [];

  // изображений 10, нумерация от 0 до 9
  for (let i = 0; i < 10; i++){
    images[i] = link + i + ".png";
  }

  // получаем ссылку на элемент, в котором будет 
  // приложение, и очищаем его
  let elem = document.getElementById('app');
  elem.innerHTML = "";

  // устанавливаем ширину элемента, в котором будет
  // приложение, относительно полученной с сервера
  // ширины поля, высота - автоматическая, т.к. элемент
  // является "flex-box"-ом
  elem.style.width = width * 100 + "px";
  elem.style.height = "auto";

  // скорректируем кнопку
  document.getElementById('button').style.background = "";
  document.getElementById('button').style.width = width * 100 - 4 + "px";
  document.getElementById('button').value = "Restart game";

  // вспомогательная переменная - максимальное кол-во
  // изображений на поле
  let elemCount = width * height;
  window.appInfo = {};
  window.appInfo.elemCount = elemCount;

  // создадим и заполним массив пар иконок, 
  // учитывая максимальное кол-во иконок на поле 
  var imageIndexArr = []; 
  for (let i = 0; i < elemCount; i++){
    imageIndexArr.push(images[i%10]);
    imageIndexArr.push(images[i%10]);
  }

  // в задании указано, что максимальный размер
  // игрового поля - 8х8 = 64 элемента, если наш массив
  // вышел больше необходимого - обрезаем лишнее
  imageIndexArr = imageIndexArr.length >= 64 ? imageIndexArr.slice(0, 64) : imageIndexArr;

  // сохраним получившийся массив в массив виртуальных элементов,
  // установим обработчики событий
  var picarr = [];
  for (let i = 1; i <= elemCount; i++){
    // создаем новый виртуальный элемент "div"
    let pic = document.createElement('div');

    // устанавливаем его характеристики в виде css-класса
    // и информацию, которая понадобится 
    // для обработки клика на элементе
    pic.className = "pic";
    pic.appInfo = {};
    pic.appInfo.backgroundImage = "url(" + imageIndexArr.pop(0) + ")";

    // установим стартовый цвет элемента
    pic.backgroundColor = "gray";

    // добавим информацию, которая позволит
    // однозначно идентифицировать элемент
    // и его изображение
    pic.symbol = Symbol.for(pic.appInfo.backgroundImage);
    pic.appPicIndex = i;
    
    // добавим обработчик события на этот элемент
    pic.addEventListener("click", onClick, false);

    // поместим виртуальный элемент в хранилище
    picarr.push(pic);
  }

  // смешиваем элементы в хранилище, больше элементов - 
  // смешивание происходит больше раз
  for (let i = 0; i < randomInteger(1, elemCount); i++){
    picarr.sort(compareRandom);
  }

  // добавим в элемент "app" наш сгенерированный
  // и перемешанный массив
  for (let i = 0; i < picarr.length; i++){
    elem.appendChild(picarr[i]);
  }
}

// функция обработчика клика на элемент
function onClick(e) {
  // определим : элемент, на котором кликнули, индекс этого элемента
  //  значение символа от адреса, уникальное для каждого адреса
  var elem = e.srcElement;
  var index = elem.appPicIndex;
  var symbol = elem.symbol;

  // покажем элемент, на который кликнули
  elem.style.background = elem.appInfo.backgroundImage;

  if (!window.appMemory){
    // если в памяти программы нет предыдущих кликов определим в память программы текущий
    // записав : элемент, на который кликнули, его индекс, его идентефикатор по ссылке
    window.appMemory = {
      elem: elem,
      index: index,
      symbol: symbol
    };
  } else {
    // если в памяти программы есть предыдущий клик
    if (index != window.appMemory.index){
      // если элемент, на который кликнули - не тот же
      // на который кликнули в прошлый раз
      if (symbol == window.appMemory.symbol){
        // если элемент, на который кликнули содержит изображение, идентичное
        // изображению предыдущего элемента откроем элемент и предыдущий элемент
        // и оставим их открытыми
        show(window.appMemory, elem, 'ever');

      } else {
        // если элемент, на который кликнули не содержит изображение, идентичное
        // изображению предыдущего элемента откроем элемент и предыдущий элемент
        // и оставим их открытыми на 0.5 секунды
        show(window.appMemory, elem, 500);
      }
    } else {
      // если элемент, на который кликнули - тот же
      // на который кликнули в прошлый раз
      // скроем элемент и очистим память программы
      elem.style.background = "";
      delete window.appMemory;
    }
  }
}

// функция открытия изображения
function show(memoryObject, choisenElement, time){
  // меняем изображения элементов на сохраненные в информации об элементе
  memoryObject.elem.style.background = memoryObject.elem.appInfo.backgroundImage;
  choisenElement.style.background = choisenElement.appInfo.backgroundImage;

  if (time === 'ever'){
    // если нужно открыть изображения до перезапуска
    // удаляем обработчик событий с этих элементов
    memoryObject.elem.removeEventListener("click", onClick);
    choisenElement.removeEventListener("click", onClick);

    //если игра окончена - окрасим кнопку "рестарт игры" в зеленый
    window.appInfo.counter = window.appInfo.counter ? window.appInfo.counter + 2 : 2;
    if (window.appInfo.counter >= window.appInfo.elemCount){
      document.getElementById('button').style.background = "#a5d6a7";
    }

  } else {
    // если нужно открыть изображения на время
    // установим таймер на скрытие изображений
    setTimeout(function(){
      memoryObject.elem.style.background = "";
      choisenElement.style.background = "";
    }, time);
  }
  // очистим память программы
  delete window.appMemory;
}
