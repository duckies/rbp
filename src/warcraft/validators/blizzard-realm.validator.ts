import {
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
} from 'class-validator';

@ValidatorConstraint({ name: 'isInEnums' })
export class IsInEnumsConstraint implements ValidatorConstraintInterface {
  validate(value: object, args: ValidationArguments): boolean {
    const [entities] = args.constraints;

    for (let i = 0; i < entities.length; i++) if (Object.values(entities[i]).includes(value)) return true;

    return false;
  }

  static defaultMessage(args: ValidationArguments): string {
    return `${args.value} is not an accepted value.`;
  }
}

export function IsInEnums(entities: unknown[], validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entities],
      validator: IsInEnumsConstraint,
    });
  };
}
