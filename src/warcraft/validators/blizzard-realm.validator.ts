import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
} from 'class-validator';


@ValidatorConstraint({ name: 'isInEnums' })
export class IsInEnumsConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [entities] = args.constraints;

    for (let i = 0; i < entities.length; i++)
      if (Object.values(entities[i]).includes(value))
        return true;

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return args.value + " is not an accepted value."
  }
}

export function IsInEnums(entities: any[], validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entities],
      validator: IsInEnumsConstraint,
    });
  };
}
