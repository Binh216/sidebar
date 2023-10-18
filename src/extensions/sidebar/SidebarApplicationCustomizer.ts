import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import styles from './AppCustomizer.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
 import { FontAwesomeIcon } from '@fortawesome/free-solid-svg-icons';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISidebarApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  
}



/** A Custom Action which can be run during execution of a Client Side Application */
export default class SidebarApplicationCustomizer
  extends BaseApplicationCustomizer<ISidebarApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  


  public onInit(): Promise<void> {
    

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    const navElement = document.getElementById('spLeftNav') as HTMLElement;
    navElement.setAttribute("width","18vw");
    navElement.innerHTML  = `
      <div class="${styles.menu}">
        <p class="${styles.title}">Cây thư mục</p>
        <ul>
          <li>
            <a href="#">
              <i class="fa-solid fa-house"></i>
              <span class="${styles.text}">Trang chủ</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fa-solid fa-house"></i>
              <span class="${styles.text}">Trang chủ</span>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fa-solid fa-house"></i>
              <span class="${styles.text}">Trang chủ</span>
            </a>
          </li>
        </ul>
      </div>
    `;

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
      let topString: string = this.properties.Top;
      if (!topString) {
        topString = "(Top property was not defined.)";
      }

      if (this._topPlaceholder.domElement) {
        this._topPlaceholder.domElement.innerHTML = `
        <div class="${styles.app}">
          <div class="${styles.top}">
            <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i> ${escape(
              topString
            )}
          </div>
        </div>
        <div class="${styles.modal}">
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
}

private _onDispose(): void {
  console.log('[HelloWorldApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
}
}
