class MathMLEBNFParser {
  constructor(mathmlString) {
    this.mathmlString = mathmlString;
    this.index = 0;
  }
  peek() {
    return this.mathmlString[this.index];
  }
  peekAfter(offset) {
    return this.mathmlString[this.index + offset];
  }
  eat() {
    return this.mathmlString[this.index++];
  
  parseMathMLDocument() {
    const parsedElement = this.parseElement();
    return parsedElement;
  }
  parseElement() {
    // 여기에 들어갈 명령 묶음은 나중에 추가 예정
  }
  // 여기에 들어갈 명령함 명령은 나중에 추가 예정
}
