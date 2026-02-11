class MathMLEBNFParser {
  constructor(mathmlString) {
    this.mathmlString = mathmlString;
    this.index = 0;
  }
  /**
   * 수식 요소 표기법 사용 문서의 문자열의 특정 글자를 읽는 명령
   * @returns {String} 문자열의 특정 글자
   */
  peek() {
    return this.mathmlString[this.index];
  }
  peekAfter(offset) {
    return this.mathmlString[this.index + offset];
  }
  eat() {
    return this.mathmlString[this.index++];
  }
  /**
   * 수식 요소 표기법 사용 문서의 문자열을 확장형 베커스-누어 형식으로 문자열 처리한 자바스크립트 객체를 보내는 명령함 명령
   * @returns {Object} 요소를 자바스크립트 객체로 문자열 처리한 것
   */
  parseMathMLDocument() {
    const parsedElement = this.parseElement();
    return parsedElement;
  }
  /**
   * 명령
   */
  parseElement() {
    // 여기에 들어갈 명령 묶음은 나중에 추가 예정
  }
  // 여기에 들어갈 명령함 명령은 나중에 추가 예정
}
