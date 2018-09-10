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
                self.addCard(new Card(prompt("Enter the name of the card")));
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
    function Card(description){
        var self = this;
        this.id = randomString();
        this.description = description;
        this.element = generateTemplate('card-template', {description: this.description}, 'li');
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
  
    var card1TodoColumn = new Card('important');
    var card2TodoColumn = new Card('normal');
    var card3TodoColumn = new Card('later');

    todoColumn.addCard(card1TodoColumn);
    todoColumn.addCard(card2TodoColumn);
    todoColumn.addCard(card3TodoColumn);

    var card1WaitingColumn = new Card('tomorrow');
    var card2WaitingColumn= new Card('next week');
    var card3WaitingColumn = new Card('next month');

    waitingColumn.addCard(card1WaitingColumn);
    waitingColumn.addCard(card2WaitingColumn);
    waitingColumn.addCard(card3WaitingColumn);

    var card1DoingColumn = new Card('just started');
    var card2DoingColumn = new Card('in progress');
    var card3DoingColumn = new Card('almost done');

    doingColumn.addCard(card1DoingColumn);
    doingColumn.addCard(card2DoingColumn);
    doingColumn.addCard(card3DoingColumn);

    var card1DoneColumn = new Card('family');
    var card2DoneColumn = new Card('job');
    var card3DoneColumn = new Card('hobby');

    doneColumn.addCard(card1DoneColumn);
    doneColumn.addCard(card2DoneColumn);
    doneColumn.addCard(card3DoneColumn);

});