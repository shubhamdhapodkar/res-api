import { Component } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'angular-api';

  menuList: any = [];
  selectedIndex: any = '';
  menuForm: FormGroup;
  selectedId: any;

  modalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private http:HttpClient
  ) {
    this.menuForm = this.formBuilder.group({
      menuName: [''],
      menuPrice: [''],
      menuQuantity: [''],
      menuType: [''],
      menuCategory: [''],
    });
  }

  ngOnInit(): void {

    this.getAllMenu();
  }
  getAllMenu(){
    this.http.get('https://api-server-y9bh.onrender.com/api/menu/getAllMenus').subscribe(
      (Response:any)=>{
        console.log('Response',Response.data);
        this.menuList=Response.data;
      },
      (Error)=>{
        console.log('Error',Error)
      }
    )
  }

  openAddModal(add: TemplateRef<any>) {
    this.modalRef = this.modalService.show(add);
  }

  openEditModel(template: TemplateRef<any>, editData: any, i: any,_id:any) {
    this.selectedIndex = i;
    this.selectedId=_id;
    this.modalRef = this.modalService.show(template);
    this.menuForm.patchValue({
      menuName: editData.menuName,
      menuPrice: editData.menuPrice,
      menuQuantity: editData.menuQuantity,
      menuType: editData.menuType,
      menuCategory: editData.menuCategory,
    });
  }

  submit() {
    // this.menuList.push(this.menuForm.value);
    this.http.post('https://api-server-y9bh.onrender.com/api/menu/createMenu',this.menuForm.value).subscribe(
      (Response)=>{
        console.log('Response',Response);
        this.getAllMenu();
      },
      (Error)=>{
        console.log('Error',Error)
      }
    )
    this.modalRef?.hide();
    this.clear();
  }
  update() {
    this.http.put('https://api-server-y9bh.onrender.com/api/menu/updateMenu/'+this.selectedId,this.menuForm.value).subscribe(
    (Response)=>{
      console.log('Response',Response);
      this.getAllMenu();
    },
    (Error)=>{
      console.log('Error',Error)
    }
  )
    //this.menuList[this.selectedIndex] = this.menuForm.value;
    this.modalRef?.hide();
    this.clear();
  }
  delete(i: any,_id:any) {
   // this.menuList.splice(i, 1);
   this.http.delete('https://api-server-y9bh.onrender.com/api/menu/deleteMenu/'+_id).subscribe(
    (Response)=>{
      console.log('Response',Response);
      this.getAllMenu();
    },
    (Error)=>{
      console.log('Error',Error)
    }
  )
  }
  clear() {
    this.menuForm.reset();
  }
}
