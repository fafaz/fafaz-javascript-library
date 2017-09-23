# fafaz-Modal
fafaz-Modal is a lightweight modal plugin with no dependencies (5.4KB minified / 2.17KB gzipped)

Example Page: [https://fafaz.github.io/fafaz-modal/demo/demo.html](https://fafaz.github.io/fafaz-modal/demo/demo.html)


</br>

## Instructions

Install via add a css, javascript files from the [dist](dist) directory to your page.


<br/>

## Usage


##### HTML

```html
<head>
  ...
  <script src="Modal.js"></script>
  <link rel="stylesheet" href="Modal.css" />
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

##### Javascript

```javascript
var myModal = new fafaz.Modal('.modal-trigger', {
  ...options
});
```


<br/>

## Options
```javascript
{
  overlayColor: '',
  useContainerScroll: false,
  useContentCache: true,
  preventBackgroundScroll: true,
  useHeader: true,
  useFooter: true,
  footerFocusingColor: '',
  footerButtonName: ['cancel', 'apply'],
  footerApplyCallback: null,
  callback: null,
}
```


<br/>

## License

MIT
