export function maybeDefine(name, clazz) {
    window.customElements.define(name, clazz);
}

class SomeStuff extends HTMLElement {

}

class SomeOtherStuff extends HTMLElement {

}

maybeDefine('some-stuff', SomeStuff);
maybeDefine('some-other-stuff', SomeOtherStuff);