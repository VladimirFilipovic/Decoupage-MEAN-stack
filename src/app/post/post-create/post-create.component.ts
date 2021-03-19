import { Component, EventEmitter, Output, AfterViewInit, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../posts.service';
import {Subscription} from 'rxjs';
import { PostListComponent } from '../post-show/post-list.component';
import { post } from 'selenium-webdriver/http';
import { Button } from 'protractor';
import * as $ from 'jquery';
import { ViewChild, ElementRef} from '@angular/core';
import { mimeType } from "./type.validator";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  @ViewChild('closeAddExpenseModal' ,{static: false}) closeAddExpenseModal: ElementRef;
  @ViewChild('artistName' ,{static: false}) artistName: ElementRef;
  artist:string;
  imagePreview: string
  imageZa: File
  form: FormGroup;
 constructor(public postsService: PostService) {}

 //ovde gde je null moze initital value a to cemo setovati da bude kao title i content i slika
 ngOnInit() {

  this.form = new FormGroup({
    title: new FormControl(null, {
      validators: [Validators.required,Validators.minLength(5), Validators.pattern('^[a-zA-Z ]*$')]
    }),
    text: new FormControl(null, { validators: [Validators.required,Validators.minLength(5), Validators.pattern('^[a-zA-Z ]*$')] }),
    image: new FormControl(null, {validators: [Validators.required],asyncValidators:mimeType})
  });

}

 onAddPost() {
   if (this.form.invalid) {
     return;

   }
   this.postsService.addPost(this.form.value.title , this.form.value.text, this.imageZa);
   this.closeAddExpenseModal.nativeElement.click();
   this.form.reset();
   this.imagePreview = '';

 }

 onImagePicked(event: Event) {
   const file = (event.target as HTMLInputElement).files[0];
   this.form.patchValue({image: file});
   //ovo informise angular da je promenjena vrednosti i daje proveri
   this.form.get('image').updateValueAndValidity();
   const reader = new FileReader();
   //when hes done loading the image he will call funcition
   reader.onload = () => {
     this.imagePreview = reader.result.toString();
     this.imageZa= file;
   };
   reader.readAsDataURL(file);
 }

 setArtistName(artistName:string){
   this.artist=artistName;
 }

//menajnje vrednosti na sledeci nacin kad kliknes u okviru modala da ti prosleid lepo id kome priapda button
//i onda klikom za otvaranje modala proseldip rtu formu na kojoj je kliknuto tako ces i id i sve da znas i i setujes na vrednoisti tog leemanta

}
