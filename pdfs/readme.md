# pdfs generate from html
## To do :
* check https://mrrio.github.io/jsPDF/ if the whole thing can be simplified, and how it would work split into multiple pages when content exceeds one
* check if this would be simper https://ekoopmans.github.io/html2pdf.js/ https://jsfiddle.net/eKoopmans/z1rupL4c/

  _CSS_
```css
#element-to-print {
  background-color: none;
  margin: 0 20px;
  width:920px;   /* adjust to fit all content, avoid line breaks orr add controlled breaks*/

}
td {
  
  height: 80px;
  font-size:.4em;
  padding:10px:
}
```
_javaScript_
```javascript
document.getElementById('generate').onclick = function () {
	// Your html2pdf code here.
	var element = document.getElementById('element-to-print');
	html2pdf(element);
};



```
_HTML_
```html
<button id="generate">Create PDF</button>
<button id="generateCanvas">Create Canvas</button>

<div id="element-to-print">
 <p>
 Element to print.
 </p> 

<table>
    <tr>
        <td>5333333</td>
        <td>Item 1 </td>
        <td>C16 -  Visit</td>
        <td>cr46d_question </td>
    </tr>
</table>

</div>

```
> use https://tableconvert.com/html-generator to make life easier
