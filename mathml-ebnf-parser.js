class MathMLEBNFParser {
  constructor(mathmlString) {
    this.mathmlString = mathmlString;
    this.index = 0;
  }
  peek() {
    return this.mathmlString[this.index];
  }
  consume(condition = x => true) {
    if (!condition()) {
      throw new Error('유효하지 않은 토큰입니다. / Invalid token');
    }
    return this.mathmlString[this.index++];
  }
  throwUp() {
    return this.mathmlString[this.index--];
  }
  parseMathML() {
    const parsedElement = this.parseElement();
    return parsedElement;
  }
  parseElement() {
    const tag = this.parseStartTag();
    
  }
  parseStartTag() {
    this.consume(char => char === '<');
    const tagName = this.parseName();
    if (this.peek() === ' ') {

    }
  }
}
