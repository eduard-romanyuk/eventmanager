import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import { JQueryStatic } from 'jquery';

import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {ItemService} from '../../../../services/item.service';
import {Item} from '../../../../model/item';
declare var $:JQueryStatic;

  @Component({
    selector: 'app-create-item',
    templateUrl: './create-item.component.html',
    styleUrls: ['./create-item.component.css']
  })
  export class CreateItemComponent implements OnInit{
  form: FormGroup;
  item: Item = new Item();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private itemService: ItemService,
              private formBuilder: FormBuilder
  ) { }

  ngOnInit(){
    this.initForm();
  }

  initForm(){
    this.form = this.formBuilder.group({
      name: ['',
        [Validators.required,
        Validators.maxLength(45)]
      ],

      description: [''],

      priority: [ 1 , [Validators.required]],

      // images: [null]

      tags: this.formBuilder.array([this.createTag()])
      //TODO: item models

    });
  }


  createItem() {

    const arr: FormArray = <FormArray>this.form.get("tags");
    this.item.tags = [];
    for (let i = 0; i < arr.length-1; i++){
      this.item.tags.push(<String>arr.at(i).get("name").value);
    }

    console.log(this.item);
    this.itemService.createItem(
      this.item,

      () => {
        $('#addItem').modal('hide');
        this.form.reset();
        this.form.setControl('tags', new FormArray([this.createTag()]));
      }
    )
  }


  private createTag(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]]
    });
  }

  addTag(): void {
    (<FormArray>this.form.get("tags")).push(this.createTag());
  }

  removeTag(i: number): void {
    (<FormArray>this.form.get("tags")).removeAt(i);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];

    const result = control.invalid ;

    return result;
  }

  isTagControlInvalid(controlName: string): boolean {
    const arr: FormArray = <FormArray>this.form.controls["tags"];
    const control = arr.at(arr.length - 1);

    const result = control.invalid;

    return result;
  }


}