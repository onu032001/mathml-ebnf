function htmlToText(htmlStr) {
  const temp = document.createElement('source-code');
  temp.innerHTML = htmlStr;
  return temp.innerText;
}
class MathMLEBNFParser {
  constructor(mathmlString) {
    this.mathmlString = mathmlString;
    this.index = 0;
  }
  peek() {
    return this.mathmlString[this.index];
  }
  consume(condition = x => true) {
    if (!condition(this.mathmlString[this.index])) {
      throw new Error('Invalid token');
    }
    return this.mathmlString[this.index++];
  }
  throwUp() {
    return this.mathmlString[this.index--];
  }
  checkSyntax() {
    if (this.index > this.mathmlString.length) {
      throw new Error('Invalid syntax');
    }
  }
  parseMathML() {
    const parsedElement = this.parseElement();
    return parsedElement;
  }
  parseElement() {
    const tag = this.parseStartTag();
    if (tag.type === 'selfClosingTag') {
      return tag;
    }
    const content = this.parseContent();
    this.parseEndTag(tag.tagName);
    return { type: 'tag', ...tag, content }
  }
  parseContent() {
    let content = [];
    while (this.mathmlString.slice(this.index, this.index + 2) !== '</') {
      if (this.peek() === '<') {
        content.push(this.parseElement());
      } else {
        content.push(this.parseText());
      }
    }
    return content;
  }
  parseText() {
    let contentResult = '';
    while (this.peek() !== '<') {
      contentResult += this.consume();
    }
    contentResult = htmlToText(contentResult);
    return { type: 'text', content: contentResult };
  }
  parseStartTag() {
    this.consume(char => char === '<');
    const tagName = this.parseName().tagName;
    let attrs = [];
    if (this.peek().trim() === '' && this.peek() !== '') {
      this.consume();
      while (this.peek() !== '/' && this.peek() !== '>') {
        attrs.push(this.parseAttribute());
        this.checkSyntax();
        if (this.peek().trim() === '' && this.peek() !== '') {
          this.consume();
        }
      }
    }
    if (this.peek() === '/') {
      this.consume();
      this.consume(char => char === '>');
      return { type: 'selfClosingTag', tagName, attrs };
    }
    this.consume(char => char === '>');
    return { tagName, attrs };
  }
  parseEndTag(tagName) {
    this.consume(char => char === '<');
    this.consume(char => char === '/');
    const tagDetect = this.parseName();
    if (tagName === tagDetect.tagName) {
      this.consume(char => char === '>');
    }
  }
  parseName() {
    let tagName = '';
    while (/[\w-]/.test(this.peek())) {
      tagName += this.consume();
    }
    return { tagName };
  }
  parseAttribute() {
    let attribute = '';
    let attrValue = '';
    while (this.peek() !== '=') {
      attribute += this.consume();
      this.checkSyntax();
    }
    this.consume();
    this.consume();
    while (this.peek() !== '"') {
      attrValue += this.consume();
      this.checkSyntax();
    }
    this.consume();
    attrValue = htmlToText(attrValue);
    return { attrName: attribute, attrValue }
  }
}