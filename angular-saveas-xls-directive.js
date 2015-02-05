(function () {
    angular.module('angular-saveas-xls-directive', [])
        .directive('saveasXls', [function () {
            /*
             * @TODO remove this classes and use an attribute xls-style on elements to define CSS
             * @TODO remove xls-remove classes and use an attr xls-remove to mark element
             *._xls-bordered         #define a 1px solid black border on the element by default use _xls-color if specified
             *._xls-text_color       #define text color
             *._xls-color__#000      #use whith _xls-color__#fff to define your color
             *._xls-text_bold'       #actually not defined
             *._xls-text_italic      #actually not defined
             *._xls-text_underline   #actually not defined
             *._xls-remove           #mark an element to be removed before generate xls file
             **/

            var hasColor = function (elm) {
                var classList = $(elm).attr('class').split(/\s+/);
                var color = '#000';
                $.each(classList, function (index, item) {
                    if (item.indexOf('_xls-color') > -1) {
                        var colorClass = item.split('__');
                        color = colorClass[1];
                    }
                });
                return color;
            };

            var findXlsClasses = function () {
                $('#xls-xls_container ._xls-bordered').each(function (index, elm) {
                    var color = hasColor(elm);
                    $(elm).css({
                        'border': '1px solid ' + color
                    });
                });

                $('#xls-xls_container ._xls-text_color').each(function (index, elm) {
                    var color = hasColor(elm);
                    $(elm).css({
                        'color': color
                    });
                });
            };

            // Replace each input text by his value
            var replaceInputTextByValue = function (markedClone) {
                markedClone.find("input[type=text]").each(function () {
                    $(this).replaceWith($(this).val());
                });
            }

            // Replace each input checkbox if is checked by 1
            // @TODO maybe it's possible to put in html a value to checkbox
            var replaceInputCheckBoxByValue = function (markedClone) {
                markedClone.find("input[type=checkbox]").each(function () {
                    if($(this).is(':checked')){
                        $(this).replaceWith('1');
                    }
                });
            }

            // Replace each textarea by his value
            // @TODO how to keep newline in textarea
            var replaceTextAreaByValue = function (markedClone) {
                markedClone.find("textarea").each(function () {
                    $(this).replaceWith($(this).val());
                });
            }

            var linkFn = function (scope, element, attr) {
                //When user click on export button
                angular.element(element).bind("click", function (e) {

                    // By default we replace input type text with value
                    scope.saveAsWithInputText   = true;
                    scope.saveAsWithCheckBox    = true;
                    scope.saveAsWithTextArea    = true;

                    var $markedForExport, markedClone, charset, fileName, htmlTable, markedContainer;


                    //Get table which has been marked for export
                    $markedForExport = $('#' + scope.targetElement);
                    markedClone = $markedForExport.clone();

                    //Wrap clone on div to be able to get the entire table for export
                    markedClone.wrap('<div id="xls-xls_container" />');
                    // if saveAsWhitInputText is true replace each input by value
                    if (scope.saveAsWithInputText == true) {
                        replaceInputTextByValue(markedClone);
                    }
                    // if saveAsWithCheckBox is true replace each input checkbox checked by 1
                    if (scope.saveAsWithCheckBox == true) {
                        replaceInputCheckBoxByValue(markedClone);
                    }
                    // if saveAsWithCheckBox is true replace each textarea by value
                    if (scope.saveAsWithTextArea == true) {
                        replaceTextAreaByValue(markedClone);
                    }

                    markedContainer = markedClone.parent();
                    //Hide container and append it on DOM to be able to walk in it
                    markedContainer.css({'display': 'none'});
                    $markedForExport.append(markedContainer);

                    findXlsClasses();

                    //remove from clone element which have been marked for
                    $('#xls-xls_container ._xls-remove').remove();

                    //get HTML
                    htmlTable = $('#xls-xls_container').html();

                    charset = scope.saveAsCharset ? scope.saveAsCharset : 'utf-8';
                    fileName = scope.saveAsName ? scope.saveAsName : 'export';

                    var BOM = "\uFEFF";
                    var blob = new Blob([BOM + htmlTable], {
                        type: "application/vnd.ms-excel;charset=" + charset
                    });
                    saveAs(blob, fileName + ".xls");

                    //remove xls container to not contaminate the DOM
                    $('#xls-xls_container').remove();


                });
            }
            return {
                restrict: 'AE',
                scope: {
                    'targetElement': "=",
                    'saveAsName': "=",
                    'saveAsCharset': "="
                },
                link: linkFn
            }
        }]);
})();
