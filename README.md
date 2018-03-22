# fafaz-Modal
fafaz-Modal is a lightweight modal plugin with no dependencies (8.4KB minified / 2.98KB gzipped)

Example Page: [https://fafaz.github.io/fafaz-modal/demo/demo.html](https://fafaz.github.io/fafaz-modal/demo/demo.html)


</br>

## Instructions

Install via add a css, javascript files from the [build](build) directory to your page.


<br/>

## Usage


#### HTML

```html
<head>
  ...
  <script src="Modal.min.js"></script>
  <link rel="stylesheet" href="Modal.min.css" />
</head>

<body>
  <button
    class="modal-trigger"
    data-modal-id="test-modal"
    data-modal-title="this is test modal"
    data-modal-width="400">click here</button>

  <div id="test-modal" hidden>Your Contents</div>
</body>
```


</br>

#### Javascript

```javascript
var myModal = new fafaz.Modal('.modal-trigger', {
  ...options
});
```


<br/>

## Options

```javascript
{
    borderColor: '#1e1e1e',
    overlayColor: undefined,
    cloneNode: false,
    fullScreen: false,
    useHeader: true
}
```


<br/>

## Events

```javascript
var myModal = new fafaz.Modal('.modal-trigger', {
    ...options
});

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


<br/>

## Dependencies

egjs/component [https://github.com/naver/egjs-component](https://github.com/naver/egjs-component)



<br/>

## License

MIT
