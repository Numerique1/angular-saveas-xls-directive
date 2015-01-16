# angular-saveas-xls-directive
AngularJS directive to download a table element as a xls file  using [FileSaver.js](https://github.com/eligrey/FileSaver.js/)

Actually work in progress

##TODO

Add option to customize css.

### Installation
1. Bower:
````
bower install angular-saveas-xls-directive
````
2. Add to app dependencies:
````js
var app = angular.module("app", ["angular-saveas-xls-directive"]);
````
### How to use
````js
<button save-as-xls save-as-charset="'utf-8'" save-as-name="'my-file-name'" target-element="'target-element'"></button>
<table id="target-element">
       <tr>
               <td class="xls-text_color _xls-color_#b52020">There is a red text</td>
               <td class="_xls-bordered _xls-color__pink">There is a cell with pink border</td>
       </tr>
</table>
````
### XLS style classes
  -'_xls-bordered' : define a 1px solid black border on the element
  -'_xls-text_color' : define text color
  -'xls-color_#SOMEHEXACOLOR' : the color of your element will be #SOMEHEXACOLOR
  -'_xls-remove' : the element will not be on the xls file
