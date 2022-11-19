import {
	ArgumentMetadata,
	HttpException,
	HttpStatus,
	PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
	async transform(
		value: unknown,
		metadata: ArgumentMetadata,
	): Promise<unknown> {
		const object = plainToClass(metadata.metatype, value);
		const errors = await validate(object);

		if (errors.length === 0) {
			return value;
		}

		throw new HttpException(
			{ errors: this.formatError(errors) },
			HttpStatus.UNPROCESSABLE_ENTITY,
		);
	}

	formatError(errors: ValidationError[]): unknown {
		return errors.reduce((acc, err) => {
			acc[err.property] = Object.values(err.constraints);
			return acc;
		}, {});
	}
}
