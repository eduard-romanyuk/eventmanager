import {Injectable, Input} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Item} from '../model/item';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Event} from "../model/event";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {WishList} from "../model/wishlist";
import {AuthService} from "./auth.service";
import {User} from "../model/user";
import { JQueryStatic } from 'jquery';
import {ItemService} from "./item.service";
import {EventService} from "./event.service";
import {LikeService} from "./like.service";
declare var $:JQueryStatic;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable()
export class WishListService {

  headers: HttpHeaders;
  private base_url = '/wishlist';
  private subject=new Subject<Item>();
  private subItemArr = new Subject<Item[]>();
  private curentWishList: WishList = new WishList();
  private items: Item[] = [];



  constructor(private http: HttpClient, private auth: AuthService,
              private likeService: LikeService,
              private eventService: EventService) {
    this.auth.getUser().subscribe(
      (user: User) =>
    {
      this.getWishListByUser(user.id).subscribe(
        (wishList: WishList) =>
        {
          this.curentWishList = wishList

		    }
      );





    });
  }

  sendViewingItem(viewingItem: Item):void{
    this.subject.next(viewingItem);
  }

  hideViewingItem(){
    this.subject.next(new Item());
  }

  getViewingItem(): Observable<Item> {
    return this.subject.asObservable()
  }

  getItemsFromWishList( wishListId: number ) : Observable<Item[]> {


     this.http.get<Item[]>(this.base_url + "/" + wishListId).subscribe( (items : Item[]) => {
      this.items = items;
      this.subItemArr.next(this.items);
    });

	return this.subItemArr.asObservable();


  }

  addItemIntoArr(item: Item) : void {
    this.items.push(item);
    this.subItemArr.next(this.items);
  }

  deleteItemFromArr ( itemId : number ) : void {


    for (let item of this.items){
      if (item.id == itemId) {
        const index: number = this.items.indexOf(item);
        if (index !== -1) {
          this.items.splice(index, 1);
          this.subItemArr.next(this.items);

        }
      }
    }
  }

  changeItemFromArr (editItem: Item): void {
    for (let item of this.items){
      if (item.id == editItem.id) {
        item.name = editItem.name;
        item.priority = editItem.priority;
      }
    }
  }

  changeLikeFromArr (chanItem : Item) : void {
    for (let item of this.items){
      if (item.id == chanItem.id) {
        item.likes = chanItem.likes;
		item.hasLiked = chanItem.hasLiked
      }
    }
  }

  getWishListByUser ( userId: number) : Observable<WishList> {
    return this.http.get<WishList>(this.base_url + "/user/" + userId);
  }

  getCurrentWishListId(): number{
    return this.curentWishList.id;
  }

  getPopularItems (limit: number, offset: number): Observable<Item[]> {

    this.http.get<Item[]>(this.base_url + `/popular/items?limit=${limit}&offset=${offset}`).subscribe(
      (items : Item[]) => {
      this.items = items;
      this.subItemArr.next(this.items);
    });

    return this.subItemArr.asObservable();

  }

  getBookedItems ( userId: number): Observable<Item[]> {

	this.http.get<Item[]>(this.base_url + "/booking/" + userId).subscribe(
      (items : Item[]) => {
      this.items = items;
      this.subItemArr.next(this.items);
    });

    return this.subItemArr.asObservable();

  }

  getEventsBookedItems (eventId: number): Observable<Item[]> {
	this.http.get<Item[]>(this.base_url + "/booking/event/" + eventId).subscribe(
    (items: Item[]) => {
      this.items = items;


      this.subItemArr.next(this.items);
    });

    return this.subItemArr.asObservable();
  }
  
  
   getSuggestionItems (limit: number): Observable<Item[]> {

    this.http.get<Item[]>(this.base_url + `/items/suggestion?limit=${limit}`).subscribe(
      (items : Item[]) => {
      this.items = items;
      this.subItemArr.next(this.items);
    });

    return this.subItemArr.asObservable();

  }


}
