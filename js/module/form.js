window.form = {
    renderMap: {
        "BUTTON": "yxu-btn",
        "INPUT": "yxu-input"
    },
    render(option) {
        option = option || {}
        let el = option.el || 'form'
        let dom = document.querySelectorAll(el)
        for (let i = 0; i < dom.length; i++) {
            let tmpDom = dom[i]
            let nodeName = tmpDom.nodeName
            //暂定-如果dom为div,form则遍历容器内所有的表单元素
            if (nodeName === 'DIV' || nodeName === 'FORM') {
                this.renderTag(tmpDom, 'button', 'yxu-btn')
                this.renderTag(tmpDom, 'input', 'yxu-input')
                this.renderTag(tmpDom, 'select')
            } else {
                let className = this.renderMap[nodeName]
                this.renderDOM(tmpDom, className)
            }
        }
    },
    renderTag(dom, tag, className) {
        let tmpDom = dom.getElementsByTagName(tag)
        for (let i = 0; i < tmpDom.length; i++) {
            this.renderDOM(dom, className)
        }
    },
    renderDOM(dom, className) {
        let nodeName = dom.nodeName
        if (nodeName === 'BUTTON') {
            util.$(dom).addClass(className)
        } else if (nodeName === 'SELECT') {
            this.renderSelect(dom)
        } else if (nodeName === 'INPUT') {
            let type = dom.getAttribute("type").toUpperCase()
            if (type === 'TEXT') {
                util.$(dom).addClass(className)
            } else if (type === 'CHECKBOX') {
                this.renderCheckBox(dom)
            }
        }
    },
    renderCheckBox(dom) {
        //隐藏源dom
        dom.style.display = 'none'
        let title = dom.getAttribute('title') || ''
        let name = dom.getAttribute('name') || ''
        let id = dom.getAttribute('id') || `yxu-checkbox-id-${util.guid()}`
        dom.setAttribute('id', `yxu-checkbox-source-id-${id}`)
        let value = dom.value || ''
        let checked = dom.getAttribute('checked') || false
        let html = `<label id="${id}" class="yxu-checkbox-wrapper">
            <span yxu-value="${value}" yxu-name="${name}" yxu-checked="${checked ? 'checked' : ''}" class="yxu-checkbox ${checked ? 'yxu-checkbox-checked' : ''}">
                <span class="yxu-checkbox-inner"></span>
            </span>
            ${title}
        </label>`
        dom.insertAdjacentHTML('afterend', html)
        //lambda 会改变this指向,这里不能使用
        document.querySelector(`#${id}`).addEventListener('click', function () {
            let checkbox = this.querySelector('.yxu-checkbox')
            let checked = checkbox.getAttribute('yxu-checked')
            if (checked === '') {
                dom.value = value
                dom.setAttribute('checked', 'checked')
                checkbox.setAttribute('yxu-checked', 'checked')
                util.$(checkbox).addClass('yxu-checkbox-checked')
            } else {
                dom.value = ''
                dom.removeAttribute('checked')
                checkbox.setAttribute('yxu-checked', '')
                util.$(checkbox).removeClass('yxu-checkbox-checked')
            }
        })
    },
    renderSelect(dom) {
        util.log.debug('开始渲染Select')
        //隐藏源dom
        dom.style.display = 'none'
        let id = dom.getAttribute('id') || `yxu-select-id-${util.guid()}`
        dom.setAttribute('id', `yxu-checkbox-source-id-${id}`)
        let options = dom.querySelectorAll('option')
        let llHtml = ''
        for (let i = 0; i < options.length; i++) {
            llHtml += `<li class="yxu-select-item ${options[i].value === ''?'yxu-select-default':''}" yxu-value="${options[i].value}">${options[i].innerText}</li>`
        }
        let html = ` <div id="${id}" class="yxu-select" style="width: 200px">
        <div class="yxu-select-selection">
            <span class="yxu-select-placeholder">请选择</span>
            <i class="yxu-select-arrow yxu-icon iconfont yxu-icon-LC_icon_down_fill"></i>
        </div>
        <div class="yxu-select-dropdown">
            <ul class="yxu-select-dropdown-list">
              ${llHtml}
            </ul>
        </div>
    </div>`
        dom.insertAdjacentHTML('afterend', html)
        //lambda 会改变this指向,这里不能使用
        document.querySelector(`#${id}`).addEventListener('click', function () {
            let hasClass = util.$(this).hasClass('yxu-select-visible')
            if (hasClass) {
                util.$(this).removeClass('yxu-select-visible')
            } else {
                util.$(this).addClass('yxu-select-visible')
            }
        })
        document.querySelector(`#${id}`).querySelectorAll('.yxu-select-item').forEach(item => {
            item.addEventListener('click', function () {
                let text = this.innerText
                let value = this.getAttribute('yxu-value')
                let textDom = this.parentNode.parentNode.parentNode.querySelector('.yxu-select-placeholder')
                textDom.innerHTML = text
                if (value) {
                    util.$(textDom).addClass('yxu-select-active')
                } else {
                    util.$(textDom).removeClass('yxu-select-active')
                }
            })
        })
    },
    checkbox(id) {
        return {
            setChecked(checked) {
                let checkbox = document.querySelector(`#${id}`).querySelector('.yxu-checkbox')
                let oldDom = document.querySelector(`#yxu-checkbox-source-id-${id}`)
                if (checked) {
                    //TODO 需要给源dom打上标记，并处理源Dom,完善 内置$
                    oldDom.value = checkbox.getAttribute('yxu-value')
                    oldDom.setAttribute('checked', 'checked')
                    checkbox.setAttribute('yxu-checked', 'checked')
                    util.$(checkbox).addClass('yxu-checkbox-checked')
                } else {
                    oldDom.value = ''
                    oldDom.removeAttribute('checked')
                    checkbox.setAttribute('yxu-checked', '')
                    util.$(checkbox).removeClass('yxu-checkbox-checked')
                }
            },
            getChecked() {
                let checkbox = document.querySelector(`#${id}`).querySelector('.yxu-checkbox')
                return checkbox.getAttribute('yxu-checked') === 'checked'
            },
            getVal() {
                let checkbox = document.querySelector(`#${id}`).querySelector('.yxu-checkbox')
                if (checkbox.getAttribute('yxu-checked') === 'checked') {
                    return checkbox.getAttribute('yxu-value')
                } else {
                    return ''
                }
            },
            getNameVal(name, split) {
                split = split || ','
                let dom = document.querySelectorAll(`[yxu-name=${name}]`)
                let result = ''
                for (let i = 0; i < dom.length; i++) {
                    let tmpDom = dom[i]
                    if (tmpDom.getAttribute('yxu-checked') === 'checked') {
                        result += tmpDom.getAttribute('yxu-value') + split
                    }
                }
                return result.length > 0 ? result.substring(0, result.length - split.length) : result
            }
        }
    }
}