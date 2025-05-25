import {
    LitElement,
    html,
    css,
} from "lit";

function loadCSS(url) {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
}


const bleDevices = {};

class MvBlescannerCard extends LitElement {
    
    static get properties() {
        return {
            hass: {},
            config: {},
        };
    }

    render() {
        

        const entity = this.config.ble_device;
        const deviceJson = this.hass.states[entity].state.toString();

        const obj = JSON.parse(deviceJson);


        bleDevices[obj.address] = obj
        //console.log(bleDevices);

        const itemTemplates = [];
        for (let i in bleDevices) {

            itemTemplates.push(html`<li>${bleDevices[i].address} ( ${bleDevices[i].name} )</li>`);
            //text += "<li>" + bleDevices[i].address + " (" + bleDevices[i].name + ")</li>";
        }
    
        return html`


        <ha-card header="${this.config.name}">
            <div class="card-content" style="-moz-user-select: text;
                                            -khtml-user-select: text;
                                            -webkit-user-select: text;
                                            -ms-user-select: text;
                                            user-select: text;">
                
                <ul>
                    ${itemTemplates}
                </ul>
            </div>
        </ha-card>
    `;
    }

    setConfig(config) {

        if (!config.ble_device) {
        throw new Error('You need to define a BLE scanner entity');
        }
        this.config = config;
    }

    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    getCardSize() {
        return this.config.entities.length + 1;
    }

    _toggle(state) {
        this.hass.callService("homeassistant", "toggle", {
            entity_id: state.entity_id,
        });
    }

    static get styles() {


        return css`
    
           
        `;
    }
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns in masonry view
    getCardSize() {
        return 3;
    }



    static getConfigElement() {
        return document.createElement("mv-blescanner-card-editor");
      }
}
customElements.define("mv-blescanner-card", MvBlescannerCard);


window.customCards = window.customCards || [];
window.customCards.push({
  type: "mv-blescanner-card",
  name: "BLE scanner Card",
  description: "Lists Ble Devices",
});

export class MvBlescannerCardEditor extends LitElement {

    

    static get properties() {
        return {
          hass: {},
          _config: {},
        };
    }
    
    setConfig(config) {
      this._config = config;
      
      //this.loadCardHelpers();
    }
  
    configChanged(newConfig) {
      const event = new Event("config-changed", {
        bubbles: true,
        composed: true,
      });
      event.detail = { config: newConfig.detail.value };
      this.dispatchEvent(event);

    }

    
    render() {

        if (!this.hass || !this._config) {
            return html``;
        }

        const schema =  [
            { 
                name: "name", 
                selector: { 
                    text: {}
                },
            },

            {
              name: "ble_device",
              required: true,
              selector: { entity: { filter: [{ domain: ["input_number","sensor"] }] } },
            },


        ];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        @value-changed=${this.configChanged}
      ></ha-form>
    `;

    }
  }
  
  customElements.define("mv-blescanner-card-editor", MvBlescannerCardEditor);
