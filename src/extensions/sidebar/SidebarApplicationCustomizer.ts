import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import styles from './AppCustomizer.module.scss';
import { SPComponentLoader } from '@microsoft/sp-loader';

import {
  SPHttpClient,
  SPHttpClientResponse 
} from '@microsoft/sp-http';

import * as $ from 'jquery';
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISidebarApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  
}

export interface IGetSpListItemsWebPartProps {
  description: string;
}
export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Id:string;
  Title: string;
  ParentWebUrl: string;
  ItemCount:number;
}



/** A Custom Action which can be run during execution of a Client Side Application */
export default class SidebarApplicationCustomizer
  extends BaseApplicationCustomizer<ISidebarApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  
  constructor() {
    super();
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
  }


  public onInit(): Promise<void> {
    
   
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    $('#modal').css('display','flex');
    const navElement = document.getElementById('spLeftNav') as HTMLElement;
    const siteHeader = document.getElementById('spSiteHeader') as HTMLElement;
    const appBar = document.getElementById('sp-appBar') as HTMLElement;
    appBar.setAttribute('style','display:none');
    siteHeader.setAttribute('style','display:none');
    navElement.setAttribute("style","width:18vw");
    const url = `/_api/Web/Lists?$filter=BaseTemplate eq 101`;
    this._getListData(url)
    .then((response) => {
      let items = `<div class="${styles.menu}">
                    <p class="${styles.title}">Quản lý tài liệu</p>
                    <ul>`;
      for (let index = 0; index < response.value.length; index++) {
        const lib = response.value[index];
        if (lib.Title != "Documents" && lib.Title != "Site Assets") {
          items += `
          <li>
            <a href="#">
              <i class="fa-solid fa-landmark"></i>
              <span>${lib.Title}</span>
              <i class="arrow fa-solid fa-angle-down"></i>
            </a>
            <ul class="${styles.sub_menu}">
              <li>
                <a href="#">
                  <i class="fa-solid fa-folder-open"></i>
                  <span>${lib.Title}</span>
                  <i class="arrow fa-solid fa-angle-down"></i>
                </a>
              </li>
            </ul>
          </li>
        `;
        }
        
      }

      items +=`</ul></div>`;
      navElement.innerHTML=items ;
      
    })
    .catch(err => console.log(err));

     $('#modal').css('display','none');
    return Promise.resolve();
  }

  
    
  private _renderPlaceHolders(): void {

    
  console.log("HelloWorldApplicationCustomizer._renderPlaceHolders()");
  console.log(
    "Available placeholders: ",
    this.context.placeholderProvider.placeholderNames
      .map(name => PlaceholderName[name])
      .join(", ")
  );

  // Handling the top placeholder
  if (!this._topPlaceholder) {
    this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
      PlaceholderName.Top,
      { onDispose: this._onDispose }
    );

    // The extension should not assume that the expected placeholder is available.
    if (!this._topPlaceholder) {
      console.error("The expected placeholder (Top) was not found.");
      return;
    }

    if (this.properties) {
     

      if (this._topPlaceholder.domElement) {
        this._topPlaceholder.domElement.innerHTML = `
        <div class="${styles.app}">
          <div class="${styles.top}">
            
          </div>
        </div>
        <div id="modal" class="${styles.modal}">
          <div class="${styles.modal_overlay}"></div>
          <div class="${styles.modal_body}">
            <div class="${styles.modal_inner}">
              <div class="${styles.load_wrapp}">
                  <div class="${styles.load}">
                      <div class="${styles.line}"></div>
                      <div class="${styles.line}"></div>
                      <div class="${styles.line}"></div>
                  </div>
                </div>
              </div>
          </div>
        </div>
        `;
      }
    }
  }

    $(document).on('click','li',function () {
      $(this).siblings().removeClass('active');
      $(this).toggleClass('active');
      $(this).find('ul').slideToggle();
    })
  
  } 

private _getListData(url : string) : Promise<any>{
   return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + url,SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
            return response.json().then((responseJSON) => {
              if (responseJSON !== null) {
                return responseJSON;
              }
            }).catch(err => console.log(err));
          
        }).catch(err => console.log(err));
  }

private _onDispose(): void {
  console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
}
}
