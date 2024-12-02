package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type todo struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

var list []todo

func main() {
	// Your code here
	fmt.Println("Starting server on http://localhost:8080")
	http.HandleFunc("/todosget", ToDoListHandler)
	http.HandleFunc("/addtodo", AddToDo)

	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("error")
	}
}

func ToDoListHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

	print(list)
	// Your code here
	json.NewEncoder(w).Encode(list)
}

func AddToDo(w http.ResponseWriter, r *http.Request) {
	var newItem todo
	w.Header().Set("Access-Control-Allow-Origin", "*") //allow all domains to access request

	json.NewDecoder(r.Body).Decode(&newItem) //decodes JSON file

	if newItem.Title == "" || newItem.Description == "" {
		w.WriteHeader(http.StatusBadRequest)
	}

	newItem.ID = newItem.Title + newItem.Description

	list = append(list, newItem)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(newItem)

}
