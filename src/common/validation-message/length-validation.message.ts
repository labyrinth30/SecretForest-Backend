import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  /**
   * ValidationArguments의 프로퍼티들
   *
   * 1) value: 현재 검사하고 있는 값(입력된 값)
   * 2) constraints: 파라미터에 입력된 제한사항들
   *    예) args.constraints[0] -> 1
   *    예) args.constraints[1] -> 20
   * 3) targetName: 현재 검사하고 있는 클래스의 이름(UsersModel)
   * 4) object: 현재 검사하고 있는 객체(UsersModel의 인스턴스)
   * 5) property: 현재 검사하고 있는 프로퍼티 이름(name)
   */
  if (args.constraints.length === 2) {
    return `${args.property}은 ${args.constraints[0]}자 이상 ${args.constraints[1]}자 이하여야 합니다.`;
  } else {
    return `${args.property}은 ${args.constraints[0]}자 이하여야 합니다.`;
  }
};
