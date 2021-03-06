import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['list', 'item', 'template', 'message']
  static values = {
    replaceKey: String,
    max: Number,
    min: Number,
  }

  initialize() {
    this.element.nestedForm = this
  }

  connect() {
    this.replaceKey = this.replaceKeyValue || 'NEW_RECORD'
  }

  get activeItems() {
    return this.itemTargets.filter(div => !div.classList.contains('destroying'))
  }

  findTemplate(name) {
    return name
      ? this.templateTargets.find(element => element.dataset.templateName == name)
      : this.templateTarget
  }

  addAssociation(event) {
    if (this.hasMaxValue && this.activeItems.length >= this.maxValue) {
      setMessage('alert', `Maximum allowed: ${this.maxValue}`)
      return false
    }

    const template =
      typeof event === 'undefined' ? this.templateTarget : this.findTemplate(event.target.value)

    const tempId = Date.now() * Math.floor(Math.random() * 100)
    const content = template.innerHTML.replace(new RegExp(this.replaceKey, 'g'), tempId)
    this.listTarget.insertAdjacentHTML('beforeend', content)

    const newElement = this.listTarget.lastElementChild

    newElement.dataset.tempId = tempId

    if (this.listTarget.sortableController) this.listTarget.sortableController.update()

    return newElement
  }

  removeAssociation(event) {
    const wrapper = event.target.closest("[data-nested-form-target='item']")

    // New records are simply removed from the page
    if (wrapper.dataset.newRecord == 'true') {
      wrapper.remove()

      // Existing records are hidden and flagged for deletion
    } else {
      wrapper.querySelector("input[name*='_destroy']").value = 1
      wrapper.classList.add('hidden', 'destroying')
    }
  }

  setMessage(type, message) {
    console.log(message)
  }
}
