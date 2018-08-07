# fafaz-Modal
fafaz-Modal is a lightweight modal plugin (5.17KB minified / 1.7KB gzipped)

Demo Page: [https://fafaz.github.io/fafaz-modal/demo/demo.html](https://fafaz.github.io/fafaz-modal/demo/demo.html)


</br><br/>

## Instructions 
#### common

```html
<button class="modal-trigger" data-modal-id="test-modal">
  Click
</button>

<div id="test-modal" hidden>
  ...Your Contents 
</div>
```

<br>

#### basic usage
```html
<head>
  <link rel="stylesheet" type="text/css" href="path/Modal.min.css"  />
</head>

<body>
  .
  .
  .

  <script src="path/Modal.min.js"></script>
  <script>
    var myModal = new fafaz.Modal.default('.modal-trigger', { ... options });
  </script>
</body>
```

<br/>

#### package manager + babel compiler 
`npm install --save fafaz-modal` **or** `yarn add fafaz-modal`


```javascript
import Modal from 'fafaz-modal';
import 'fafaz-modal/build/Modal.min.css';

const myModal = new Modal('.modal-trigger', { ... options });
```

<br/><br/>

## Options

```javascript
{
    overlayStyle: undefined, // ex) 'background-color: rgba(50,50,50,0.5);'
    layerStyle: undefined, // ex) 'border: 1px solid #000;'
    cloneNode: false, 
    fullScreen: false
}
```


<br/><br/>

## Methods

```javascript
var myModal = new fafaz.Modal.default('.modal-trigger');

// modal open
myModal.open();

// modal close
myMOdal.close(); 

// calculate the height of the modal, and if the height exceeds the window height, reposition.
myModal.positioning(); 
```

<br/><br/>


## Events

```javascript
var myModal = new fafaz.Modal.default('.modal-trigger');

myModal.on('afterGenerate', function(e) {
  // you can select container element by using e.modal
})

myModal.on('afterOpen', function(e) {
  // you can select container element by using e.modal
  // you can select trigger element by using e.trigger
})

myModal.on('afterClose', function(e) {
  // you can select container element by using e.modal
})
```


<br/><br/>

## Dependencies

delegate [https://github.com/zenorocha/delegate](https://github.com/zenorocha/delegate)



<br/><br/>

## Compatibility

IE10+ (this library uses css flexbox)



<br/><br/>

## License

MIT
