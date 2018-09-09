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
    var doingColumn = new Column('Doing');
    var doneColumn = new Column ('Done');
  
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);
  
    /*var card1 = new Card('New task');
    var card2 = new Card('Create kanban board');
  
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);*/
  
});