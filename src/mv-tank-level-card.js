import {
    LitElement,
    html,
    css,
} from "lit";


export class MvTankLevelCard extends LitElement {
    static get properties() {
        return {
            hass: {},
            config: {},
        };
    }

    render() {


        const entityId = this.config.entity;
        const state = this.hass.states[entityId];
        const stateStr = state ? Math.round(state.state) : "unavailable";


        const maxHeight = 200;
        const maxR = this.config.max;
        const minR = this.config.min;


        const percent = 1 - ((state.state - minR) / (maxR - minR));
        const percentStr = Math.round(percent * 100);
        const acidHeight = Math.round(percent * maxHeight);


        var rgbTxt = `var(--primary-color, white )`;
        var name = '';

        if(this.config.color)
        {
            var colorArray = this.config.color;
            rgbTxt = `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
        }

        if(this.config.name)
        {
            name = this.config.name
        }

        return html`
        <style>
            .battery {
                position: relative;
                width: 150px;;
                height: 200px;;
                border: 4px solid;
                border-color: var(--primary-text-color);
                border-radius: 25px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
            }

        </style>


        <ha-card>
        <div class="card-content">
            <div class="name">${name}</div>
        <div class="cell">

        <div id="battery" class="battery">
            <div class="acid-container">
            <div class="acid">
                <div id="level" class="fill" style="--acid-height: ${acidHeight}px; background: ${rgbTxt}; "></div>
            </div>
            </div>
        </div>

        <div class="percentage">
            <i id="icon" class="fas fa-plug"></i><span id="percentage">${percentStr}</span>%
            <span class="ohms">(${stateStr})</span>
        </div>
        
        </div>
        </div>
        </ha-card>
    `;
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error("You need to define entities");
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
    
            .cell {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            
            .percentage {
                font-size: 150%;
                margin-top: 15px;
                i {
                margin-right: 6px;
                }
            }

            .name {
                color: var(--secondary-text-color);
                margin-bottom: 20px;
                font-weight: 500;
                font-size: 16px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .ohms {
                color: var(--secondary-text-color);
                font-size: 14px;
            }
            
            .acid-container {
                overflow: hidden;
                height: calc(100% - 8px);
                border-bottom-right-radius: 18px;
                border-bottom-left-radius: 18px;
                margin: 4px;
            
                .acid {
                height: 200px;;
                display: flex;
                flex-direction: column;
                flex-flow: column-reverse;
            
                    .fill {
                        background: white;
                        height: var(--acid-height);
                        width: 100%;
                        flex-shrink: 0;
                        transition: height 2s ease-in-out;
                    }
                }
            }
        `;
    }
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns in masonry view
    getCardSize() {
        return 1;
    }

    // The rules for your card for sizing your card if the grid in section view
    getLayoutOptions() {
        return {
            grid_rows: 5,
            grid_columns: 2,
            grid_min_rows: 3,
            grid_max_rows: 5,
        };
    }

    static getConfigElement() {
        return document.createElement("mv-tank-level-card-editor");
      }
}
customElements.define("mv-tank-level-card", MvTankLevelCard);


export class MvTankLevelCardEditor extends LitElement {


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
                name: "min",
                required: true,
                selector: { number: { min: -1e32, max: 1e32, mode: "box", step: 1 } },
            },
            {
                name: "max",
                required: true,
                selector: { number: { min: -1e32, max: 1e32, mode: "box", step: 1 } },
            },
            {
              name: "entity",
              required: true,
              selector: { entity: { filter: [{ domain: ["input_number","sensor"] }] } },
            },
            { 
                name: "color", 
                selector: { 
                    color_rgb: {}
                }
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
  
  customElements.define("mv-tank-level-card-editor", MvTankLevelCardEditor);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "mv-tank-level-card",
    name: "Tank Card",
    preview: false, // Optional - defaults to false
    description: "A custom card made by me!", // Optional
    documentationURL:
      "https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card", // Adds a help link in the frontend card editor
  });