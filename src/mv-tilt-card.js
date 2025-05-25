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


class MvTiltCard extends LitElement {
    
    static get properties() {
        return {
            hass: {},
            config: {},
        };
    }

    render() {
        

        const entityX = this.config.roll;
        const measuredXAngle = this.hass.states[entityX].state;

        //roll
        var xAngle = parseFloat(measuredXAngle);
        
        if(this.config.roll_compensation) {
            xAngle = parseFloat(measuredXAngle) + parseFloat(this.config.roll_compensation);
        }
        //const xAngleStr = xAngle ? xAngle.state : 'unavailable';
        const xAngleStr = Math.round(xAngle * 10)/ 10 *-1;

        const entityY = this.config.pitch;
        
        const measuredYAngle = this.hass.states[entityY].state;
        var yAngle = parseFloat(measuredYAngle);


        //pitch
        if(this.config.pitch_compensation) {
            yAngle = parseFloat(measuredYAngle) + parseFloat(this.config.pitch_compensation);
        }

        //const yAngleStr = yAngle ? yAngle.state : 'unavailable';
        const yAngleStr = Math.round(yAngle * 10)/10 *-1 

        const xRotate = (parseFloat(xAngleStr) * 3).toString();
        const yRotate = (parseFloat(yAngleStr) * 3).toString();
    
        return html`


        <ha-card header="${this.config.name}">
            <div class="card-content">
            <row style="display: flex;">
                <div style="flex: 50%;text-align: center;">
                <img src="/local/van-tilt-card/img/promaster_side.png" style="max-width: 100%;height: 100px;transform:rotate(${yRotate}deg);">
                <hr>
                <h1>${yAngleStr}°</h1>
                </div>
                <div style="flex: 50%;text-align: center;">
                <img src="/local/van-tilt-card/img/promaster_back.png" style="max-width: 100%;height: 100px;transform:rotate(${xRotate}deg);">
                <hr>
                <h1>${xAngleStr}°</h1>
                </div>
            </row>
            </div>
        </ha-card>
    `;
    }

    setConfig(config) {

        if (!config.roll) {
        throw new Error('You need to define a roll entity');
        }
        if (!config.pitch) {
        throw new Error('You need to define pitch entity');
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
        return document.createElement("mv-tilt-card-editor");
      }
}
customElements.define("mv-tilt-card", MvTiltCard);


window.customCards = window.customCards || [];
window.customCards.push({
  type: "mv-tilt-card",
  name: "Tilt Card",
  description: "A cool custom card",
});

export class MvTiltCardEditor extends LitElement {

    

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
              name: "pitch",
              required: true,
              selector: { entity: { filter: [{ domain: ["input_number","sensor"] }] } },
            },

            {
                name: "roll",
                required: true,
                selector: { entity: { filter: [{ domain: ["input_number","sensor"] }] } },
            },

            { 
                name: "pitch_compensation", 
                selector: { 
                    number: {step:"any"}
                },
            },

            { 
                name: "roll_compensation", 
                selector: { 
                    number: {step:"any"}
                },
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
  
  customElements.define("mv-tilt-card-editor", MvTiltCardEditor);
