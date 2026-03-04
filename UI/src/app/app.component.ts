import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  readonly APIUrl = "http://localhost:5038/api/books/";

  constructor(private http: HttpClient) {}

  books: any[] = [];

  formData: any = {
    id: 0,
    title: '',
    desc: '',
    price: '',
    author: '',
    genre: ''
  };

  isEditing = false;

  ngOnInit() {
    this.refreshBooks();
  }

  refreshBooks() {
    this.http.get(this.APIUrl + 'GetBooks').subscribe((data: any) => {
      this.books = data;
    });
  }

  // ADD BOOK
  addBook() {

    const formData = new FormData();
    formData.append("title", this.formData.title);
    formData.append("description", this.formData.desc);
    formData.append("price", this.formData.price);
    formData.append("author", this.formData.author);
    formData.append("genre", this.formData.genre);

    this.http.post(this.APIUrl + 'AddBook', formData).subscribe(() => {
      alert("Book Added Successfully!");
      this.refreshBooks();
      this.resetForm();
    });
  }

  // DELETE BOOK
  deleteBook(id: any) {
    this.http.delete(this.APIUrl + 'DeleteBook?id=' + id).subscribe(() => {
      alert("Book Deleted!");
      this.refreshBooks();
    });
  }

  // EDIT BOOK
  editBook(book: any) {
    this.formData = { ...book };
    this.isEditing = true;
  }

  // UPDATE BOOK
  updateBook() {

    const formData = new FormData();
    formData.append("id", this.formData.id);
    formData.append("title", this.formData.title);
    formData.append("description", this.formData.desc);
    formData.append("price", this.formData.price);
    formData.append("author", this.formData.author);
    formData.append("genre", this.formData.genre);

    this.http.put(this.APIUrl + 'UpdateBook', formData).subscribe(() => {
      alert("Book Updated Successfully!");
      this.refreshBooks();
      this.resetForm();
    });
  }

  resetForm() {
    this.formData = {
      id: 0,
      title: '',
      desc: '',
      price: '',
      author: '',
      genre: ''
    };
    this.isEditing = false;
  }
}