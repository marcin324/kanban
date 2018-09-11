'use strict';

document.addEventListener('DOMContentLoaded', function() {
    
    /* Funkcja, która generuje id składające się z dziesięciu przypadkowych znaków */
    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        for (var i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
    
    /* Funkcja generująca templatki */
    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || 'div');

        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);

        return element;
    }
  
    /* Klasa 'Column' - z niej tworzymy nowe kolumny Kanbana */
    function Column(name){
        var self = this;
        this.id = randomString();
        this.name = name;
        this.element = generateTemplate('column-template', {name: this.name, id: this.id});
        /* Podpięcie nasłuchiwacza, który pozwala po kliknięciu w element pozwala usunąć kolumnę lub dodać kartę */
        this.element.querySelector('.column').addEventListener('click', function(event){ 
            if(event.target.classList.contains('btn-delete')){
                self.removeColumn();
            }
            if(event.target.classList.contains('add-card')){
                

                /* Tworzenie modala */        
                var modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML =`
                Kategoria: <select id="modal-category">
                <option>urgent</option>
                <option>normal</option>
                <option>later</option>
                </select>
                <br>
                Opis: <textarea id="modal-desc"></textarea>
                <br>
                <button id="modal-add-button">Add</button>
                <button id="modal-cancel-button">Cancel</button>
                `;

                document.body.appendChild(modal);

                /* Nasłuchiwacz do buttona 'Cancel' */
                document.querySelector('#modal-cancel-button').addEventListener('click', function(){
                    modal.remove();
                })

                /* Nasłuchiwacz do buttona 'Add' */
                document.querySelector('#modal-add-button').addEventListener('click', function(){
                    var desc = document.querySelector('#modal-desc').value;
                    var category = document.querySelector('#modal-category').value;
                
                    self.addCard(new Card(desc, category));
                    modal.remove();
                })
            }
        });
    }
  
    /* Metody dla klasy 'Column' - dodawanie kart i usuwanie kolumn */
    Column.prototype = {
        addCard: function(card){
            this.element.querySelector('ul').appendChild(card.element);
        },
        removeColumn: function(){
            this.element.parentNode.removeChild(this.element);
        }
    }
  
    /* Klasa 'Card' */
    function Card(description, category){
        var self = this;
        this.id = randomString();
        this.description = description;
        this.category = category;
        this.element = generateTemplate('card-template', {description: this.description, category: this.category}, 'li');
        /* Przypięcie nasłuchiwacza do usuwania kart */
        this.element.querySelector('.card').addEventListener('click', function(event){
            event.stopPropagation();
            if(event.target.classList.contains('btn-delete')){
                self.removeCard();
            }
        });
    }
  
    /* Meoda dla klasy 'Card' - usuwanie kart */
    Card.prototype = {
        removeCard: function(){
            this.element.parentNode.removeChild(this.element);
        }
    }
  
    /* Tablica - obiekt stworzony metodą literału */  
    var board = {
        name: 'Kanban board',
        /* Metoda tworzenia nowej kolumny */
        addColumn: function(column){
            this.element.appendChild(column.element);
            initSortable(column.id);
        },
        /* Tu jest zapisany element, w który będą wstawiane nowe kolumny */
        element: document.querySelector('#board .column-container')
    };
  
    /* Funkcja do manipulowania kartami */
    function initSortable(id) {
        var el = document.getElementById(id);
        var sortable = Sortable.create(el, {
        group: 'kanban',
        sort: true
        });
    }
  
    /* Przypięcie do przycisku 'Add a column' nasłuchiwacza, który uruchamia prompt i dodaje nową kolumnę do tablicy */
    document.querySelector('#board .create-column').addEventListener('click', function(){
        var name = prompt('Enter a column name');
        var column = new Column(name);
        board.addColumn(column);
    })
  
  
    var todoColumn = new Column('To do');
    var waitingColumn = new Column('Waiting');
    var doingColumn = new Column('Doing');
    var doneColumn = new Column ('Done');
  
    board.addColumn(todoColumn);
    board.addColumn(waitingColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);
  
    var card1TodoColumn = new Card('Zacząć nowy moduł Bootcampa!', 'urgent');
    var card2TodoColumn = new Card('Skończyć kurs programowania Kodilli', 'normal');
    var card3TodoColumn = new Card('Podróż do Maroka', 'later');

    todoColumn.addCard(card1TodoColumn);
    todoColumn.addCard(card2TodoColumn);
    todoColumn.addCard(card3TodoColumn);

    var card1WaitingColumn= new Card('Zapłacić rachunki', 'normal');
    var card2WaitingColumn = new Card('Z psem do weterynarza!', 'later');
    var card3WaitingColumn = new Card('Wyrzucić choinkę :)', 'later');

    waitingColumn.addCard(card1WaitingColumn);
    waitingColumn.addCard(card2WaitingColumn);
    waitingColumn.addCard(card3WaitingColumn);

    var card1DoingColumn = new Card('Skończyć moduł 11, zaliczyć wszystkie zadania z modułu', 'urgent');
    var card2DoingColumn = new Card('Naprawić rower', 'normal');
    /*var card3DoingColumn = new Card('', 'later');*/

    doingColumn.addCard(card1DoingColumn);
    doingColumn.addCard(card2DoingColumn);
    /*doingColumn.addCard(card3DoingColumn);*/

    /*var card1DoneColumn = new Card('', 'urgent');*/
    var card2DoneColumn = new Card('Zrobić swój pierwszy Kanban', 'normal');
    /*var card3DoneColumn = new Card('', 'later');*/

    /*doneColumn.addCard(card1DoneColumn);*/
    doneColumn.addCard(card2DoneColumn);
    /*doneColumn.addCard(card3DoneColumn);*/

});