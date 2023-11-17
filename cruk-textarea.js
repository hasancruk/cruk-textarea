class Textarea extends HTMLElement {
  static tagName = "cruk-textarea";

  static css = `
    div {
      display: grid;
    }

    div::after {
      content: attr(data-replicated-value) " ";
      white-space: pre-wrap;
      visibility: hidden;
    }

    ::slotted(textarea) {
      resize: none;
      overflow: hidden;
    }

    ::slotted(textarea),
    div::after {
      padding: 0.5rem;
      font: inherit;

      grid-area: 1 / 1 / 2 / 2;
    }
  `;

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const template = document.createElement("template");

    const sheet = new CSSStyleSheet();
    sheet.replaceSync(Textarea.css);
    shadowRoot.adoptedStyleSheets = [sheet];
    template.innerHTML = `
      <div>
        <slot></slot> 
      </div>
    `;
    shadowRoot.appendChild(template.content.cloneNode(true));

    const div = shadowRoot.querySelector("div");
    const slot = shadowRoot.querySelector("slot");
    const textarea = slot.assignedElements()[0];
    const form = textarea.form;

    textarea.addEventListener("input", (e) => {
      div.dataset.replicatedValue = e.target.value;
    });

    form.addEventListener("reset", () => {
      div.dataset.replicatedValue = "";
    });
  }
}

if ("customElements" in window) {
  customElements.define(Textarea.tagName, Textarea);
}
