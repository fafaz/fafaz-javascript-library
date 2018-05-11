# fafaz-Modal
fafaz-Modal is a lightweight modal plugin with no dependencies (8.4KB minified / 2.98KB gzipped)

Demo Page: [https://fafaz.github.io/fafaz-modal/demo/demo.html](https://fafaz.github.io/fafaz-modal/demo/demo.html)


</br><br/>

## Instructions 
> #### common

```html
<head>
    <link rel="stylesheet" type="text/css" href="Modal.min.css"  />
</head>

<body>
    <button
        class="modal-trigger"
        data-modal-id="test-modal"
        data-modal-title="this is test modal"
        data-modal-width="400"
    >click here</button>

    <div id="test-modal" hidden>Your Contents</div>
</body>
```

<br/>

>#### es5
>add a javascript file (Modal.min.js) from the [build](build) directory to your page.

```html
  <body>
    ...

    <script src="path/Modal.min.js"></script>
    <script>var myModal = new fafaz.Modal('.modal-trigger', { ...options });</script>
  </body>
```

<br/>

>#### es6
> npm install --save fafaz-modal


```javascript
import Modal from 'fafaz-modal';

const myModal = new Modal('.modal-trigger', { ...options });
```

<br/><br/>

## Options

```javascript
{
    border: undefined, // ex) '1px solid #1e1e1e'
    overlayColor: undefined, // ex) 'rgba(150,150,0, 0.5)'
    cloneNode: false,
    fullScreen: false,
    useHeader: false
}
```


<br/><br/>

## Events

```javascript
var myModal = new fafaz.Modal('.modal-trigger', { ...options });

myModal.on('afterGenerate', function(e) {
  // ~~~
  // you can select container element by using e.container
})

myModal.on('afterOpen', function(e) {
  // ~~~
  // you can select container element by using e.container
  // you can select trigger element by using e.trigger
})

myModal.on('afterClose', function(e) {
  // ~~~
})
```


<br/><br/>

## Dependencies

egjs/component [https://github.com/naver/egjs-component](https://github.com/naver/egjs-component)<br/>
delegate [https://github.com/zenorocha/delegate](https://github.com/zenorocha/delegate)



<br/><br/>

## License

MIT
